import express from "express"
import path from "path"
import fs from "fs/promises"
import sharp from "sharp"

const router = express.Router()

const GALLERY_DIR = "/mnt/media/photovelo"
const IMAGES_DIR = path.join(GALLERY_DIR, "images")
const THUMBS_DIR = path.join(GALLERY_DIR, "thumbs")

const ALLOWED_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"])

async function ensureThumb(originalPath, originalName) {
  await fs.mkdir(THUMBS_DIR, { recursive: true })

  const base = path.basename(originalName, path.extname(originalName))
  const thumbName = `${base}.webp`
  const thumbPath = path.join(THUMBS_DIR, thumbName)

  try {
    await fs.access(thumbPath)
    return { thumbName, thumbPath }
  } catch {
    // Génère une miniature légère pour la grille
    await sharp(originalPath)
        .resize({ width: 900, withoutEnlargement: true })
        .webp({ quality: 72 })
        .toFile(thumbPath)

    return { thumbName, thumbPath }
  }
}

// GET /api/gallery/list
router.get("/list", async (_req, res) => {
  try {
    const files = await fs.readdir(IMAGES_DIR)

    const images = await Promise.all(
        files
            .filter((name) => ALLOWED_EXT.has(path.extname(name).toLowerCase()))
            .map(async (name) => {
              const fullPath = path.join(IMAGES_DIR, name)

              // Dimensions sans télécharger côté client
              let width = 1
              let height = 1
              try {
                const meta = await sharp(fullPath).metadata()
                if (meta.width) width = meta.width
                if (meta.height) height = meta.height
              } catch {
                // on garde 1x1 si une image est cassée
              }

              // Date (mtime) pour info/tri éventuel
              let createdAt = ""
              try {
                const st = await fs.stat(fullPath)
                createdAt = st.mtime.toISOString()
              } catch {}

              // Miniature
              const { thumbName } = await ensureThumb(fullPath, name)

              return {
                id: name,
                src: `/gallery/images/${name}`,          // original
                thumbSrc: `/gallery/thumbs/${thumbName}`, // thumb
                alt: name,
                width,
                height,
                createdAt,
              }
            })
    )

    // Cache (utile si tu as un reverse proxy)
    res.set("Cache-Control", "public, max-age=3600, s-maxage=3600")
    res.json(images)
  } catch (e) {
    res.status(500).json({ error: String(e) })
  }
})

export default router
