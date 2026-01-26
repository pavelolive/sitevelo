"use client"

import { ArrowLeft, MapPin, Navigation, Zap, TrendingUp, Info, ExternalLink } from "lucide-react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { journeyStages } from "../data/journeyStages"
import { useState, useRef, useEffect } from "react"

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Polyline, useMap } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";

interface LiveTrackingProps {
    onBack: () => void
}

type LatestActivityResponse = {
    ok: boolean;
    activity: null | {
        name: string;
        distance_km: number;
        elevation_gain_m: number;
        moving_time_s: number;
        avg_speed_kmh: number;
        start_date: string;
    };
    error?: string;
};

type TotalActivityResponse = {
    ok: boolean;
    activity: null | {
        name: string;
        distance_km: number;
        elevation_gain_m: number;
        moving_time_s: number;
        avg_speed_kmh: number;
    };
    error?: string;
};

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length) {
      map.fitBounds(positions);
    }
  }, [positions, map]);
  return null;
}

export function GPXMap({ gpxUrl }: { gpxUrl: string }) {
  const [positions, setPositions] = useState<[number, number][]>([]);

  useEffect(() => {
    fetch(gpxUrl)
      .then((res) => res.text())
      .then((gpxText) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(gpxText, "application/xml");
        const trkpts = Array.from(xml.getElementsByTagName("trkpt"));

        const coords: [number, number][] = trkpts.map((pt) => [
          parseFloat(pt.getAttribute("lat")!),
          parseFloat(pt.getAttribute("lon")!),
        ]);

        setPositions(coords);
      })
      .catch(console.error);
  }, [gpxUrl]);

  if (!positions.length) return <p>Chargement de la trace…</p>;

  return (
    <MapContainer
      style={{ width: "100%", height: "400px", borderRadius: "12px" }}
      center={positions[0]}
      zoom={10}
      scrollWheelZoom
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap"
      />
      <Marker position={positions[0]}>
        <Popup>Départ (Tarifa)</Popup>
      </Marker>
      <Polyline positions={positions} pathOptions={{ color: "#e53935", weight: 3 }} />
      <FitBounds positions={positions} />
    </MapContainer>
  );
}

function formatDuration(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

export function LiveTracking({ onBack }: LiveTrackingProps) {
    const [selectedStage, setSelectedStage] = useState(journeyStages[5]) // Default to Paris
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [latest, setLatest] = useState<LatestActivityResponse | null>(null);
    const [total, setTotal] = useState<TotalActivityResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const r = await fetch("/api/strava/latest", { cache: "no-store" });
                const data = (await r.json()) as LatestActivityResponse;
                setLatest(data);
            } catch (e) {
                setLatest({ ok: false, activity: null, error: String(e) });
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const r = await fetch("/api/strava/total", { cache: "no-store" });
                const data = (await r.json()) as TotalActivityResponse;
                setTotal(data);
            } catch (e) {
                setTotal({ ok: false, activity: null, error: String(e) });
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // Dynamically set totalStages based on journeyStages length
    const totalStages = journeyStages.length;

    // Define start and end dates for the journey
    const startDate = new Date("2026-04-05"); // Example start date
    const endDate = new Date("2026-09-05"); // Example end date

    // Calculate daysElapsed and percentage dynamically
    const today = new Date();
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    // Ensure daysElapsed does not go negative if the journey hasn't started yet
    const daysElapsed = Math.max(0, Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const percentage = Math.min(100, Math.max(0, Math.round((daysElapsed / totalDays) * 100)));

    // Update liveData to use adjusted daysElapsed and percentage
    const liveData = {
        progress: {
            percentage: percentage, // Use adjusted percentage
            daysElapsed: daysElapsed, // Use adjusted daysElapsed
            daysRemaining: totalDays - daysElapsed,
            stagesCompleted: 0,
            totalStages: totalStages,
        },
    }

    // Auto-scroll to center on mount
    useEffect(() => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current
            const scrollAmount = (container.scrollWidth - container.clientWidth) / 2
            container.scrollLeft = scrollAmount
        }
    }, [])

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
            <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-foreground">Suivi GPS en Direct</h1>
                        </div>
                        <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-green-700">En direct</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

                {/* Position actuelle */}
                {/* 🔽 Polarsteps embed */}
                <div className="mb-16">
                    <div className="relative w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-xl border border-border bg-black">
                        <GPXMap gpxUrl="/api/strava/merged" />
                    </div>
                </div>

                {/* Statistiques du jour */}
                <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-4 h-4 text-muted-foreground" />
                        <h3 className="font-bold text-foreground">Statistiques du Jour</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Distance</div>
                            <div className="text-2xl font-bold text-foreground">{loading ? "…" : latest?.activity ? `${latest.activity.distance_km} km` : "—"}</div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Vitesse</div>
                            <div className="text-2xl font-bold text-foreground">{loading ? "…" : latest?.activity ? `${latest.activity.avg_speed_kmh} km/h` : "—"}</div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Dénivelé</div>
                            <div className="text-2xl font-bold text-foreground">{loading ? "…" : latest?.activity ? `${latest.activity.elevation_gain_m} m` : "—"}</div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Temps</div>
                            <div className="text-2xl font-bold text-foreground">{loading ? "…" : latest?.activity ? formatDuration(latest.activity.moving_time_s) : "—"}</div>
                        </div>
                    </div>
                </Card>

                {/* Statistiques totales */}
                <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-foreground">Statistiques Totales du Voyage</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-muted-foreground">Progression totale</span>
                                <span className="font-bold text-primary">{liveData.progress.percentage}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-primary to-primary/70 h-full rounded-full transition-all"
                                    style={{ width: `${liveData.progress.percentage}%` }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                            <div>
                                <div className="text-sm text-muted-foreground">Étapes complétées</div>
                                <div className="text-xl font-bold text-foreground">
                                    {liveData.progress.stagesCompleted} / {liveData.progress.totalStages}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground">Distance totale</div>
                                <div className="text-xl font-bold text-foreground">{loading ? "…" : total?.activity ? `${total.activity.distance_km} km` : "—"}</div>
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground">Vitesse moyenne</div>
                                <div className="text-xl font-bold text-foreground">{loading ? "…" : total?.activity ? `${total.activity.avg_speed_kmh} km/h` : "—"}</div>
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground">Dénivelé cumulé</div>
                                <div className="text-xl font-bold text-foreground">{loading ? "…" : total?.activity ? `${total.activity.elevation_gain_m} m` : "—"}</div>
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground">Jours écoulés</div>
                                <div className="text-xl font-bold text-foreground">{liveData.progress.daysElapsed}</div>
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground">Jours restants</div>
                                <div className="text-xl font-bold text-foreground">{liveData.progress.daysRemaining}</div>
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground">Temps total</div>
                                <div className="text-xl font-bold text-foreground">{loading ? "…" : total?.activity ? formatDuration(total.activity.moving_time_s) : "—"}</div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
