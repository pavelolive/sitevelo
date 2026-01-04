"use client"

import type React from "react"

import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"
import { useState, useEffect } from "react"

interface PhotoGalleryProps {
    onBack: () => void
}

export function PhotoGallery({ onBack }: PhotoGalleryProps) {
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null)
    const [touchStart, setTouchStart] = useState<number | null>(null)
    const [touchEnd, setTouchEnd] = useState<number | null>(null)

    const photos = [
        { id: 1, src: "/cycling-in-gibraltar-mountains.jpg", alt: "Gibraltar", location: "Gibraltar" },
        { id: 2, src: "/cycling-through-seville-streets.jpg", alt: "Séville", location: "Séville, Espagne" },
        { id: 3, src: "/cycling-in-madrid-plaza.jpg", alt: "Madrid", location: "Madrid, Espagne" },
        { id: 4, src: "/cycling-in-pyrenees-mountains.jpg", alt: "Pyrénées", location: "Pyrénées, France" },
        { id: 5, src: "/cycling-through-bordeaux-vineyards.jpg", alt: "Bordeaux", location: "Bordeaux, France" },
        { id: 6, src: "/cycling-near-eiffel-tower-paris.jpg", alt: "Paris", location: "Paris, France" },
        { id: 7, src: "/cycling-in-brussels-grand-place.jpg", alt: "Bruxelles", location: "Bruxelles, Belgique" },
        { id: 8, src: "/cycling-through-amsterdam-canals.jpg", alt: "Amsterdam", location: "Amsterdam, Pays-Bas" },
        { id: 9, src: "/cycling-hamburg-harbor.jpg", alt: "Hambourg", location: "Hambourg, Allemagne" },
        { id: 10, src: "/cycling-copenhagen-nyhavn.jpg", alt: "Copenhague", location: "Copenhague, Danemark" },
        { id: 11, src: "/cycling-swedish-archipelago.jpg", alt: "Göteborg", location: "Göteborg, Suède" },
        { id: 12, src: "/cycling-oslo-fjords.jpg", alt: "Oslo", location: "Oslo, Norvège" },
    ]

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

    const closeLightbox = () => {
        setSelectedPhotoIndex(null)
    }

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedPhotoIndex === null) return

            if (e.key === "Escape") closeLightbox()
            if (e.key === "ArrowLeft") goToPrevious()
            if (e.key === "ArrowRight") goToNext()
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [selectedPhotoIndex])

    const minSwipeDistance = 50

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null)
        setTouchStart(e.targetTouches[0].clientX)
    }

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return

        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance

        if (isLeftSwipe) goToNext()
        if (isRightSwipe) goToPrevious()
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
                    <Button onClick={onBack} variant="ghost" size="sm" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Retour
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Galerie Photos</h1>
                        <p className="text-sm text-muted-foreground">Nos plus beaux souvenirs de voyage</p>
                    </div>
                </div>
            </div>

            {/* Gallery Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8">
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
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <p className="text-white font-semibold text-lg">{photo.location}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedPhotoIndex !== null && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center" onClick={closeLightbox}>
                    {/* Close button */}
                    <Button
                        onClick={closeLightbox}
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 z-[110] text-white hover:bg-white/20"
                    >
                        <X className="w-6 h-6" />
                    </Button>

                    {/* Previous button */}
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

                    {/* Next button */}
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

                    {/* Image container with swipe support */}
                    <div
                        className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <img
                            src={photos[selectedPhotoIndex].src || "/placeholder.svg"}
                            alt={photos[selectedPhotoIndex].alt}
                            className="max-w-full max-h-[90vh] object-contain rounded-lg"
                        />

                        {/* Image info */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                            <p className="text-white text-xl font-semibold">{photos[selectedPhotoIndex].location}</p>
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
