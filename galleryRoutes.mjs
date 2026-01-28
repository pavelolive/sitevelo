import express from "express"
import path from "path"
import fs from "fs/promises"

const router = express.Router()

const GALLERY_DIR = "/mnt/media/photovelo"
const IMAGES_DIR = path.join(GALLERY_DIR, "images")

// GET /api/gallery/list
router.get("/list", async (_req, res) => {
  try {

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

export default router
