import express from "express";
import galleryRoutes from "./routes/galleryRoutes.mjs";
import fs from "fs";
import path from "path";
import cron from "node-cron";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/gallery", galleryRoutes);

const {
    STRAVA_CLIENT_ID,
    STRAVA_CLIENT_SECRET,
    STRAVA_REFRESH_TOKEN,
    PORT = "3001",
} = process.env;

/* ==============================
   Dossiers & constantes
================================ */

const GPX_DIR = path.resolve("gpx_files");
const CACHE_DIR = path.resolve("cache");

if (!fs.existsSync(GPX_DIR)) fs.mkdirSync(GPX_DIR, { recursive: true });
if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });

const LATEST_JSON = path.join(CACHE_DIR, "latest.json");
const TOTAL_JSON = path.join(CACHE_DIR, "total.json");

const EMPTY_GPX = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Strava Merge"></gpx>`;

if (!STRAVA_CLIENT_ID || !STRAVA_CLIENT_SECRET || !STRAVA_REFRESH_TOKEN) {
    console.error("Missing env vars");
    process.exit(1);
}

/* ==============================
   Helpers cache
================================ */

function writeJsonAtomic(filePath, data) {
    const tmp = `${filePath}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf-8");
    fs.renameSync(tmp, filePath);
}

function readJsonSafe(filePath) {
    if (!fs.existsSync(filePath)) return null;
    try {
        return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch {
        return null;
    }
}

/* ==============================
   Strava helpers
================================ */

async function refreshAccessToken() {
    const res = await fetch("https://www.strava.com/oauth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: STRAVA_CLIENT_ID,
            client_secret: STRAVA_CLIENT_SECRET,
            grant_type: "refresh_token",
            refresh_token: STRAVA_REFRESH_TOKEN,
        }),
    });

    if (!res.ok) {
        throw new Error(`Token refresh failed (${res.status})`);
    }

    return res.json();
}

function normalizeActivities(activities) {
    if (!activities.length) {
        return {
            id: -1,
            name: "",
            start_date: "",
            distance_km: 0,
            moving_time_s: 0,
            elevation_gain_m: 0,
            avg_speed_kmh: 0,
            type: "",
        };
    }

    const distance = activities.reduce((s, a) => s + a.distance, 0);
    const movingTime = activities.reduce((s, a) => s + a.moving_time, 0);
    const elevation = activities.reduce(
        (s, a) => s + Math.round(a.total_elevation_gain ?? 0),
        0
    );

    return {
        id: activities[0].id,
        name: activities[0].name,
        start_date: activities[0].start_date,
        distance_km: +(distance / 1000).toFixed(1),
        moving_time_s: movingTime,
        elevation_gain_m: elevation,
        avg_speed_kmh: +((distance / movingTime) * 3.6).toFixed(1),
        type: activities[0].type,
    };
}

async function getTodayActivities(accessToken) {
    const now = new Date();
    //const start = new Date(2025, 5, 1, 0, 1);
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 1);
    const after = Math.floor(start.getTime() / 1000);

    const res = await fetch(
        `https://www.strava.com/api/v3/athlete/activities?after=${after}&before=${after + 86400}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    if (!res.ok) throw new Error("Activities fetch failed");

    const acts = await res.json();
    return acts.filter(a => ["Ride", "GravelRide"].includes(a.sport_type));
}

async function getActivitiesSinceBeginning(accessToken) {
    const start = new Date(2026, 3, 5);
    const end = new Date(2026, 8, 20);

    if (new Date() < start) return [];

    const after = Math.floor(start.getTime() / 1000);
    const before = Math.floor(end.getTime() / 1000);

    let page = 1;
    const perPage = 200;
    const all = [];

    while (true) {
        const res = await fetch(
            `https://www.strava.com/api/v3/athlete/activities?after=${after}&before=${before}&page=${page}&per_page=${perPage}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        if (!res.ok) throw new Error("Activities pagination failed");

        const acts = await res.json();
        if (!acts.length) break;

        all.push(...acts.filter(a => ["Ride", "GravelRide"].includes(a.sport_type)));
        if (acts.length < perPage) break;
        page++;
    }

    return all;
}

async function getActivityStreams(id, token) {
    const res = await fetch(
        `https://www.strava.com/api/v3/activities/${id}/streams?keys=[latlng,time,altitude]&key_by_type=true`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) throw new Error("Streams error");
    return res.json();
}

function streamsToGPX(activity, streams) {
    const { latlng, altitude, time } = streams;
    const start = new Date(activity.start_date);

    const trkpts = latlng.data.map(([lat, lon], i) => `
    <trkpt lat="${lat}" lon="${lon}">
      ${altitude?.data?.[i] ? `<ele>${altitude.data[i]}</ele>` : ""}
      <time>${new Date(start.getTime() + time.data[i] * 1000).toISOString()}</time>
    </trkpt>
  `).join("");

    return `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Strava API">
<trk><trkseg>${trkpts}</trkseg></trk>
</gpx>`;
}

function mergeGPXTraces() {
    const out = path.join(GPX_DIR, "merged.gpx");
    const files = fs.readdirSync(GPX_DIR).filter(f => f.endsWith(".gpx") && f !== "merged.gpx");

    if (!files.length) {
        fs.writeFileSync(out, EMPTY_GPX);
        return;
    }

    const pts = files.flatMap(f =>
        fs.readFileSync(path.join(GPX_DIR, f), "utf8").match(/<trkpt[\s\S]*?<\/trkpt>/g) || []
    );

    fs.writeFileSync(
        out,
        `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Strava Merge">
<trk><trkseg>${pts.join("\n")}</trkseg></trk>
</gpx>`
    );
}

/* ==============================
   Refresh global (1x / jour)
================================ */

async function refreshAllStravaData() {
    const { access_token } = await refreshAccessToken();

    const todayActs = await getTodayActivities(access_token);
    for (const a of todayActs) {
        const streams = await getActivityStreams(a.id, access_token);
        if (!streams.latlng) continue;
        fs.writeFileSync(path.join(GPX_DIR, `${a.id}.gpx`), streamsToGPX(a, streams));
    }

    mergeGPXTraces();

    writeJsonAtomic(LATEST_JSON, {
        ok: true,
        generated_at: new Date().toISOString(),
        activity: normalizeActivities(todayActs),
    });

    const totalActs = await getActivitiesSinceBeginning(access_token);

    writeJsonAtomic(TOTAL_JSON, {
        ok: true,
        generated_at: new Date().toISOString(),
        activity: normalizeActivities(totalActs),
    });
}

/* ==============================
   Cron + boot
================================ */

cron.schedule("5 0 * * *", refreshAllStravaData, { timezone: "Europe/Paris" });

(async () => {
    if (!readJsonSafe(LATEST_JSON) || !readJsonSafe(TOTAL_JSON)) {
        console.log("[boot] Cache missing → generating");
        await refreshAllStravaData();
    }
})();

/* ==============================
   Routes
================================ */

app.get("/api/strava/latest", (_req, res) => {
    const data = readJsonSafe(LATEST_JSON);
    if (!data) return res.status(503).json({ ok: false });
    res.json(data);
});

app.get("/api/strava/total", (_req, res) => {
    const data = readJsonSafe(TOTAL_JSON);
    if (!data) return res.status(503).json({ ok: false });
    res.json(data);
});

app.get("/api/strava/merged", (_req, res) => {
    const p = path.join(GPX_DIR, "merged.gpx");
    res.setHeader("Content-Type", "application/gpx+xml");
    res.send(fs.existsSync(p) ? fs.readFileSync(p) : EMPTY_GPX);
});

app.post("/api/strava/refresh", async (_req, res) => {
    try {
        await refreshAllStravaData();
        res.json({ ok: true });
    } catch (e) {
        res.status(500).json({ ok: false, error: e.message });
    }
});

app.get("/health", (_req, res) => res.json({ ok: true }));

app.listen(Number(PORT), "0.0.0.0", () =>
    console.log(`🚴 Strava cache API on http://0.0.0.0:${PORT}`)
);
