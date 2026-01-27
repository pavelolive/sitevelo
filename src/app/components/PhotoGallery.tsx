"use client"

import { useEffect, useLayoutEffect, useMemo, useState } from "react"
import type { TouchEvent as RTouchEvent } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"

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

type GalleryItemWithRatio = GalleryItem & {
    ratio: number // width / height
}

function usePhotoRatios(photos: GalleryItem[]) {
    const [items, setItems] = useState<GalleryItemWithRatio[]>([])

    useEffect(() => {
        let cancelled = false

        async function load() {
            const results = await Promise.all(
                photos.map(
                    (p, idx) =>
                        new Promise<GalleryItemWithRatio>((resolve) => {
                            const fallback: GalleryItemWithRatio = { ...p, ratio: 1, originalIndex: idx }
                            if (!p.src) return resolve(fallback)

                            const img = new Image()
                            img.onload = () => {
                                const w = img.naturalWidth || 1
                                const h = img.naturalHeight || 1
                                resolve({ ...p, ratio: w / h, originalIndex: idx })
                            }
                            img.onerror = () => resolve(fallback)
                            img.src = p.src
                        })
                )
            )

            if (!cancelled) setItems(results)
        }

        load()
        return () => {
            cancelled = true
        }
    }, [photos])

    return items
}

type LaidOutItem = GalleryItemWithRatio & {
    w: number
    h: number
}

type GalleryItemWithRatio = GalleryItem & {
    ratio: number
    originalIndex: number
}

type LaidOutItem = GalleryItemWithRatio & {
    w: number
    h: number
}

function buildJustifiedRows(params: {
    items: GalleryItemWithRatio[]
    containerWidth: number
    targetRowHeight: number
    gap: number
    minRowHeight?: number
    maxRowHeight?: number
    justifyLastRow?: boolean
}) {
    const {
        items,
        containerWidth,
        targetRowHeight,
        gap,
        minRowHeight = Math.round(targetRowHeight * 0.75),
        maxRowHeight = Math.round(targetRowHeight * 1.35),
        justifyLastRow = false,
    } = params

    const rows: LaidOutItem[][] = []
    let current: GalleryItemWithRatio[] = []
    let sumRatios = 0

    const flushRow = (row: GalleryItemWithRatio[], forceJustify: boolean, ratiosSum: number) => {
        if (row.length === 0) return

        const gapsTotal = gap * (row.length - 1)
        const available = Math.max(1, containerWidth - gapsTotal)

        let h = available / Math.max(0.0001, ratiosSum)

        if (!forceJustify) {
            // dernière ligne: garde la hauteur cible sans étirer
            h = targetRowHeight
        }

        h = Math.max(minRowHeight, Math.min(maxRowHeight, h))

        const laid: LaidOutItem[] = row.map((it) => ({
            ...it,
            h,
            w: Math.round(it.ratio * h),
        }))

        rows.push(laid)
    }

    for (const it of items) {
        current.push(it)
        sumRatios += it.ratio

        const gapsTotal = gap * (current.length - 1)
        const expectedWidth = sumRatios * targetRowHeight + gapsTotal

        if (expectedWidth >= containerWidth && current.length > 1) {
            flushRow(current, true, sumRatios)
            current = []
            sumRatios = 0
        }
    }

    if (current.length) {
        flushRow(current, justifyLastRow, sumRatios)
    }

    return rows
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

    const hasPhotos = photos.length > 0
    const itemsWithRatio = usePhotoRatios(photos)

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

    const rows = useMemo(() => {
        if (!containerWidth) return []
        return buildJustifiedRows({
            items: itemsWithRatio,
            containerWidth,
            targetRowHeight: 260,
            gap: 8,
            justifyLastRow: false,
        })
    }, [itemsWithRatio, containerWidth])

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

    const onTouchStart = (e: RTouchEvent<HTMLDivElement>) => {
        setTouchEnd(null)
        setTouchStart(e.targetTouches[0].clientX)
    }

    const onTouchMove = (e: RTouchEvent<HTMLDivElement>) => {
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
                    <div ref={containerRef} className="w-full">
                        <div className="flex flex-col gap-2">
                            {rows.map((row, rowIdx) => (
                                <div key={rowIdx} className="flex gap-2">
                                    {row.map((photo) => (
                                        <button
                                            key={photo.id}
                                            type="button"
                                            onClick={() => setSelectedPhotoIndex(photo.originalIndex)}
                                            className="group relative overflow-hidden rounded-none shrink-0"
                                            style={{ width: photo.w, height: photo.h }}
                                            aria-label={photo.alt}
                                        >
                                            <img
                                                src={photo.src || "/placeholder.svg"}
                                                alt={photo.alt}
                                                loading="lazy"
                                                className="h-full w-full object-cover transition-all duration-300 group-hover:brightness-50"
                                            />
                                        </button>
                                    ))}
                                </div>
                            ))}
                        </div>
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
                        className="relative flex flex-col items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    >
                        <img
                            src={selectedPhoto.src || "/placeholder.svg"}
                            alt={selectedPhoto.alt}
                            className="max-w-full max-h-[90vh] object-contain"
                        />
                        <div className="mt-4 text-center">
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
