"use client"

import type React from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"
import { useEffect, useMemo, useState } from "react"

interface PhotoGalleryProps {
    onBack: () => void
}

type GalleryItem = {
    id: string
    src: string
    alt: string
    location?: string
    createdAt: string
}

export function PhotoGallery({ onBack }: PhotoGalleryProps) {
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchEnd, setTouchEnd] = useState<number | null>(null)

    const [photos, setPhotos] = useState<GalleryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string>("")

    const fetchPhotos = async () => {
        try {
            setError("")
            setLoading(true)
            const r = await fetch("/api/gallery/list", { cache: "no-store" })
            if (!r.ok) throw new Error(`Failed to load gallery (${r.status})`)
            const data = (await r.json()) as GalleryItem[]
            setPhotos(Array.isArray(data) ? data : [])
        } catch (e: any) {
            setError(String(e?.message ?? e))
            setPhotos([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPhotos()
    }, [])

    // Si la liste change et que l'index sélectionné n'existe plus
    useEffect(() => {
        if (selectedPhotoIndex === null) return
        if (selectedPhotoIndex > photos.length - 1) setSelectedPhotoIndex(null)
    }, [photos, selectedPhotoIndex])

    const goToPrevious = () => {
        if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
            setSelectedPhotoIndex(selectedPhotoIndex - 1)
        }
    }

    const goToNext = () => {
        if (selectedPhotoIndex !== null && selectedPhotoIndex < photos.length - 1) {
            setSelectedPhotoIndex(selectedPhotoIndex + 1)
        }
    }

    const closeLightbox = () => setSelectedPhotoIndex(null)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedPhotoIndex === null) return
            if (e.key === "Escape") closeLightbox()
            if (e.key === "ArrowLeft") goToPrevious()
            if (e.key === "ArrowRight") goToNext()
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [selectedPhotoIndex, photos.length])

    const minSwipeDistance = 50

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null)
        setTouchStart(e.targetTouches[0].clientX)
    }

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const onTouchEnd = () => {
        if (touchStart === null || touchEnd === null) return
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance
        if (isLeftSwipe) goToNext()
        if (isRightSwipe) goToPrevious()
    }

    const hasPhotos = photos.length > 0

    // Pour éviter les undefined quand pas de photos
    const selectedPhoto = useMemo(() => {
        if (selectedPhotoIndex === null) return null
        return photos[selectedPhotoIndex] ?? null
    }, [photos, selectedPhotoIndex])

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

                    {/* petit bouton refresh (optionnel) */}
                    <Button variant="outline" size="sm" onClick={fetchPhotos} disabled={loading}>
                        Actualiser
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {error ? (
                    <div className="rounded-xl border border-border bg-card p-6">
                        <div className="font-semibold text-foreground mb-2">Impossible de charger la galerie</div>
                        <div className="text-sm text-muted-foreground mb-4">{error}</div>
                        <Button onClick={fetchPhotos}>Réessayer</Button>
                    </div>
                ) : loading ? (
                    <div className="text-sm text-muted-foreground">Chargement de la galerie…</div>
                ) : !hasPhotos ? (
                    <div className="rounded-xl border border-border bg-card p-6">
                        <div className="font-semibold text-foreground mb-2">Aucune photo pour le moment</div>
                        <div className="text-sm text-muted-foreground">
                            Uploade une photo depuis ta page admin et elle apparaîtra ici automatiquement.
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {photos.map((photo, index) => (
                            <div
                                key={photo.id}
                                onClick={() => setSelectedPhotoIndex(index)}
                                className="group relative overflow-hidden rounded-xl border-2 border-border bg-card shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                            >
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img
                                        src={photo.src || "/placeholder.svg"}
                                        alt={photo.alt}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <p className="text-white font-semibold text-lg">{photo.location ?? "—"}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {selectedPhotoIndex !== null && selectedPhoto && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={closeLightbox}>
                    {/* Close */}
                    <Button
                        onClick={closeLightbox}
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 z-[110] text-white hover:bg-white/20"
                    >
                        <X className="w-6 h-6" />
                    </Button>

                    {/* Prev */}
                    {selectedPhotoIndex > 0 && (
                        <Button
                            onClick={(e) => {
                                e.stopPropagation()
                                goToPrevious()
                            }}
                            variant="ghost"
                            size="icon"
                            className="absolute left-4 z-[110] text-white hover:bg-white/20 hidden sm:flex"
                        >
                            <ChevronLeft className="w-8 h-8" />
                        </Button>
                    )}

                    {/* Next */}
                    {selectedPhotoIndex < photos.length - 1 && (
                        <Button
                            onClick={(e) => {
                                e.stopPropagation()
                                goToNext()
                            }}
                            variant="ghost"
                            size="icon"
                            className="absolute right-4 z-[110] text-white hover:bg-white/20 hidden sm:flex"
                        >
                            <ChevronRight className="w-8 h-8" />
                        </Button>
                    )}

                    {/* Image container + swipe */}
                    <div
                        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <img
                            src={selectedPhoto.src || "/placeholder.svg"}
                            alt={selectedPhoto.alt}
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                        />

                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                            <p className="text-white text-xl font-semibold">{selectedPhoto.location ?? "—"}</p>
                            <p className="text-white/80 text-sm mt-1">
                                {selectedPhotoIndex + 1} / {photos.length}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
