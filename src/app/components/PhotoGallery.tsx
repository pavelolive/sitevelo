"use client"

import { useEffect, useLayoutEffect, useMemo, useState } from "react"
import { Button } from "./ui/button"

import { RowsPhotoAlbum } from "react-photo-album";
import "react-photo-album/rows.css";

import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface PhotoGalleryProps {
    onBack: () => void
}

type GalleryItem = {
    id: string
    src: string
    alt: string
    width: number
    height: number
    location?: string
    createdAt: string
}

async function fetchPhotosWithSize(): Promise<GalleryItem[]> {
    const r = await fetch("/api/gallery/list", { cache: "no-store" })
    if (!r.ok) throw new Error(`Failed to load gallery (${r.status})`)
    const data = (await r.json()) as GalleryItem[]
    if (!Array.isArray(data)) return []

    // Précharge toutes les images pour obtenir largeur/hauteur
    const photosWithSize: GalleryItem[] = await Promise.all(
        data.map((p) =>
            new Promise<GalleryItem>((resolve) => {
                if (!p.src) return resolve({ ...p, width: 1, height: 1 })

                const img = new Image()
                img.onload = () => {
                    resolve({ ...p, width: img.naturalWidth, height: img.naturalHeight })
                }
                img.onerror = () => resolve({ ...p, width: 1, height: 1 })
                img.src = p.src
            })
        )
    )

    return photosWithSize
}

export function PhotoGallery({ onBack }: PhotoGalleryProps) {
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
    const [photos, setPhotos] = useState<GalleryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>("")

    useEffect(() => {
        const load = async () => {
            try {
                setError("")
                setLoading(true)
                const photosWithSize = await fetchPhotosWithSize()
                setPhotos(photosWithSize)
            } catch (e: any) {
                setError(String(e?.message ?? e))
                setPhotos([])
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [])

    const hasPhotos = photos.length > 0

    // ✅ au lieu de useRef, on garde le node dans un state
    const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null)
    const [containerWidth, setContainerWidth] = useState(0)

    // ✅ callback ref : quand le div apparaît (après loading), on le reçoit ici
    const containerRef = (node: HTMLDivElement | null) => {
        setContainerEl(node)
    }

    // ✅ l’observer se branche quand containerEl existe
    useLayoutEffect(() => {
        if (!containerEl) return

        const measure = () => {
            const w = Math.floor(containerEl.getBoundingClientRect().width)
            setContainerWidth(w)
        }

        measure()

        const ro = new ResizeObserver(measure)
        ro.observe(containerEl)

        return () => ro.disconnect()
    }, [containerEl])

    const [index, setIndex] = useState(-1);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Galerie Photos</h1>
                        <p className="text-sm text-muted-foreground">
                            {loading ? "Chargement…" : error ? "Erreur de chargement" : `${photos.length} photo(s)`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {error ? (
                    <div className="rounded-xl border border-border bg-card p-6">
                        <div className="font-semibold text-foreground mb-2">Impossible de charger la galerie</div>
                        <div className="text-sm text-muted-foreground mb-4">{error}</div>
                        <Button onClick={fetchPhotosWithSize}>Réessayer</Button>
                    </div>
                ) : loading ? (
                    <div className="text-sm text-muted-foreground">Chargement de la galerie…</div>
                ) : !hasPhotos ? (
                    <div className="rounded-xl border border-border bg-card p-6">
                        <div className="font-semibold text-foreground mb-2">Aucune photo pour le moment</div>
                    </div>
                ) : (
                    <>
                    <RowsPhotoAlbum 
                        photos={photos} 
                        padding={0}
                        spacing={2}
                        targetRowHeight={320}
                        rowConstraints={{maxPhotos: 3}}
                        onClick={({ index }) => setIndex(index)}
                    />

                    <Lightbox
                        slides={photos}
                        open={index >= 0}
                        index={index}
                        close={() => setIndex(-1)}
                    />
                    </>
                )}
            </div>
        </div>
    )
}
