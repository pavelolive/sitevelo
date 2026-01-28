"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "./ui/button"

import { RowsPhotoAlbum } from "react-photo-album"
import "react-photo-album/rows.css"

import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

interface PhotoGalleryProps {
    onBack: () => void
}

type GalleryItem = {
    id: string
    src: string              // original (lightbox)
    thumbSrc?: string        // miniature (grille)
    alt: string
    width: number
    height: number
    location?: string
    createdAt: string
}

async function fetchPhotos(): Promise<GalleryItem[]> {
    const r = await fetch("/api/gallery/list", {
        // pour une galerie ça vaut le coup de laisser le cache bosser
        cache: "force-cache",
    })
    if (!r.ok) throw new Error(`Failed to load gallery (${r.status})`)
    const data = (await r.json()) as GalleryItem[]
    return Array.isArray(data) ? data : []
}

export function PhotoGallery({ onBack }: PhotoGalleryProps) {
    const [photos, setPhotos] = useState<GalleryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>("")
    const [index, setIndex] = useState(-1)

    const load = useCallback(async () => {
        try {
            setError("")
            setLoading(true)
            const items = await fetchPhotos()
            setPhotos(items)
        } catch (e: any) {
            setError(String(e?.message ?? e))
            setPhotos([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        load()
    }, [load])

    const hasPhotos = photos.length > 0

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

                    {/* si tu veux remettre un bouton back */}
                    {/* <Button variant="secondary" onClick={onBack}>Retour</Button> */}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {error ? (
                    <div className="rounded-xl border border-border bg-card p-6">
                        <div className="font-semibold text-foreground mb-2">Impossible de charger la galerie</div>
                        <div className="text-sm text-muted-foreground mb-4">{error}</div>
                        <Button onClick={load}>Réessayer</Button>
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
                            rowConstraints={{ maxPhotos: 3 }}
                            onClick={({ index }) => setIndex(index)}
                            renderPhoto={({ photo, imageProps }) => (
                                <img
                                    {...imageProps}
                                    // grille => miniatures
                                    src={(photo as GalleryItem).thumbSrc ?? photo.src}
                                    alt={(photo as GalleryItem).alt ?? ""}
                                    loading="lazy"
                                    decoding="async"
                                    style={{ ...imageProps.style }}
                                />
                            )}
                        />

                        <Lightbox
                            // lightbox => originaux
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
