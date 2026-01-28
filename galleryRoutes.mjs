import express from "express"
import multer from "multer"
import path from "path"
import fs from "fs/promises"
import crypto from "crypto"

const router = express.Router()

const GALLERY_DIR = "/mnt/media/photovelo"
const IMAGES_DIR = path.join(GALLERY_DIR, "images")
const MANIFEST = path.join(GALLERY_DIR, "gallery.json")

async function ensureStorageReady() {
  await fs.mkdir(IMAGES_DIR, { recursive: true })
  try {
    await fs.access(MANIFEST)
  } catch {
    await fs.writeFile(MANIFEST, "[]", "utf-8")
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, IMAGES_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const safeExt = [".jpg", ".jpeg", ".png", ".webp"].includes(ext) ? ext : ".jpg"
    cb(null, crypto.randomBytes(16).toString("hex") + safeExt)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)
    cb(ok ? null : new Error("Invalid file type"), ok)
  },
})

async function readManifest() {
  await ensureStorageReady()
  const raw = await fs.readFile(MANIFEST, "utf-8")
  return JSON.parse(raw)
}

async function writeManifest(list) {
  await fs.writeFile(MANIFEST, JSON.stringify(list, null, 2), "utf-8")
}

// GET /api/gallery/list
router.get("/list", async (_req, res) => {
  try {
    await ensureStorageReady()

    const files = await fs.readdir(IMAGES_DIR)

    const images = files
        .filter(name =>
            [".jpg", ".jpeg", ".png", ".webp"].includes(
                path.extname(name).toLowerCase()
            )
        )
        .map(name => ({
          src: `/gallery/images/${name}`,
        }))

    res.json(images)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

// POST /api/gallery/upload
router.post("/upload", upload.single("photo"), async (req, res) => {
  try {
    const file = req.file
    if (!file) return res.status(400).json({ error: "No file" })

    const { location = "", alt = "" } = req.body

    const list = await readManifest()
    const item = {
      id: crypto.randomUUID(),
      src: `/gallery/images/${file.filename}`,
      alt: alt || file.originalname,
      location,
      createdAt: new Date().toISOString(),
    }

    list.unshift(item)
    await writeManifest(list)

    res.json({ ok: true, item })
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

export default router
