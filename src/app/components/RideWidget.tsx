"use client"

import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { MapPin, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { journeyStages } from "../data/journeyStages"

// Leaflet / React-Leaflet
import { MapContainer, TileLayer, useMap } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Plugin GPX (Leaflet)
import "leaflet-gpx"

type LatestActivityResponse = {
  ok: boolean
  activity: null | {
    name: string
    distance_km: number
    elevation_gain_m: number
    moving_time_s: number
    avg_speed_kmh: number
    start_date: string
  }
  error?: string
}

type StageStatus = "completed" | "current" | "upcoming"

/**
 * Composant interne: charge un GPX dans Leaflet et fit bounds.
 * Le plugin leaflet-gpx ajoute L.GPX.
 */
function GPXLayer({ gpxUrl }: { gpxUrl: string }) {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    // Supprime tout ancien GPX
    map.eachLayer((layer: any) => {
      if (layer instanceof L.GPX) map.removeLayer(layer)
    })

    const gpx = new L.GPX(gpxUrl, {
      async: true,
      polyline_options: { opacity: 0.9, weight: 4 },
      markers: { startIcon: null, endIcon: null },
      gpx_options: { parseElements: ["track", "route"] },
    })

    gpx.on("loaded", (e: any) => {
      const bounds = e.target.getBounds()
      if (bounds && bounds.isValid()) map.fitBounds(bounds, { padding: [20, 20] })
    })

    gpx.addTo(map)

    return () => {
      map.removeLayer(gpx)
    }
  }, [map, gpxUrl])

  return null
}

export function RideWidget() {
  const [selectedStage, setSelectedStage] = useState<typeof journeyStages[0] | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Record<number, HTMLButtonElement | null>>({})

  const [latest, setLatest] = useState<LatestActivityResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // évite de rendre la map avant le client (utile si ton app fait du SSR)
  const [isClient, setIsClient] = useState(false)
  useEffect(() => setIsClient(true), [])

  const updateScrollButtons = () => {
    const el = scrollContainerRef.current
    if (!el) return
    const epsilon = 2
    setCanScrollLeft(el.scrollLeft > epsilon)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - epsilon)
  }

  const scrollByCards = (dir: "left" | "right") => {
    const el = scrollContainerRef.current
    if (!el) return
    const amount = Math.max(320, Math.floor(el.clientWidth * 0.8))
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" })
  }

  const centerStageCard = (
    stageId: number,
    behavior: ScrollBehavior = "smooth"
  ) => {
    const container = scrollContainerRef.current
    const card = cardRefs.current[stageId]
    if (!container || !card) return

    const containerRect = container.getBoundingClientRect()
    const cardRect = card.getBoundingClientRect()

    // largeur carte + gap (gap-4 = 16px)
    const cardWidth = cardRect.width
    const gap = 16

    // on veut que la carte apparaisse en 2e position
    const offsetFromLeft = cardWidth + gap

    const cardLeftInContainer =
      cardRect.left - containerRect.left + container.scrollLeft

    const targetScrollLeft = cardLeftInContainer - offsetFromLeft

    container.scrollTo({
      left: Math.max(0, targetScrollLeft),
      behavior,
    })
  }


  const parseFRDate = (s: string) => {
    const [dd, mm, yyyy] = s.split("/").map(Number)
    return new Date(yyyy, (mm ?? 1) - 1, dd ?? 1, 12, 0, 0, 0)
  }

  const findStageForDate = (date: Date) => {
    for (const stage of journeyStages) {
      const status = getStageStatusByDate(stage, date)
      if (status === "current") {
        return { kind: "match" as const, stageId: stage.id }
      }
    }

    const firstStage = journeyStages[0]
    const lastStage = journeyStages[journeyStages.length - 1]

    const firstStart = parseFRDate(firstStage.estimatedStartDate)
    const lastEnd = parseFRDate(lastStage.estimatedEndDate)

    if (date < firstStart) return { kind: "before" as const }
    if (date > lastEnd) return { kind: "after" as const }

    return { kind: "before" as const }
  }

  const getStageStatusByDate = (
    stage: (typeof journeyStages)[number],
    today: Date
  ) : StageStatus => {
    const day = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      12,
      0,
      0,
      0
    )

    const start = parseFRDate(stage.estimatedStartDate)
    const end = parseFRDate(stage.estimatedEndDate)

    if (day > end) return "completed"
    if (day > start && day <= end) return "current"
    return "upcoming"
  }

  const getStageEmoji = (status: "completed" | "current" | "upcoming") => {
    switch (status) {
      case "completed":
        return "✅"
      case "current":
        return "⏳"
      case "upcoming":
        return "🔜"
    }
  }

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return

    const res = findStageForDate(new Date())

    requestAnimationFrame(() => {
      if (res.kind === "match") {
        centerStageCard(res.stageId, "auto")
        setSelectedStage(journeyStages.find((s) => s.id === res.stageId) ?? journeyStages[0])
      } else if (res.kind === "before") {
        el.scrollLeft = 0
      } else {
        el.scrollLeft = el.scrollWidth
      }
      updateScrollButtons()
    })

    updateScrollButtons()

    const onScroll = () => updateScrollButtons()
    el.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", updateScrollButtons)

    return () => {
      el.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", updateScrollButtons)
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        const r = await fetch("/api/strava/latest", { cache: "no-store" })
        const data = (await r.json()) as LatestActivityResponse
        setLatest(data)
      } catch (e) {
        setLatest({ ok: false, activity: null, error: String(e) })
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // ✅ Mets ici le chemin vers ton fichier GPX dans /public
  const gpxUrl = "/gpx/tarifa-nordkapp.gpx"

  // Centre initial (sera overridé par fitBounds quand le GPX est chargé)
  const initialCenter: [number, number] = [46.5, 2.5]
  const initialZoom = 5

  return (
      <div className="w-full space-y-6">
        {/* Étapes */}
        <Card className="p-4 bg-muted/30 bg-card">
          <div className="flex items-center justify-between mb-4 gap-3">
            <h3 className="text-lg font-bold text-foreground">Étapes du voyage</h3>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-emerald-600">✅</span>
                <span>Terminée</span>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-emerald-600">⏳</span>
                <span>En cours</span>
              </div>

              <div className="flex items-center gap-1">
                <span className="text-emerald-600">🔜</span>
                <span>À venir</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => scrollByCards("left")}
                  disabled={!canScrollLeft}
                  aria-label="Scroller à gauche"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={() => scrollByCards("right")}
                  disabled={!canScrollRight}
                  aria-label="Scroller à droite"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div
              ref={scrollContainerRef}
              className="flex gap-4 overflow-x-auto pb-3 pt-3 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-primary scrollbar-track-muted"
              style={{ scrollbarWidth: "thin" }}
          >
            {journeyStages.map((stage) => {
              const status = getStageStatusByDate(stage, new Date())
              const stageEmoji = getStageEmoji(status)

              const isCompleted = status === "completed"
              const isCurrent = status === "current"
              const isSelected = selectedStage?.id === stage.id
              
              const startCity = (stage as any).startCity ?? stage.name?.split(" - ")?.[0] ?? ""
              const endCity = (stage as any).endCity ?? stage.name?.split(" - ")?.[1] ?? ""
              const dPlus = (stage as any).elevationGain ?? stage.elevation ?? 0
              const startDate = (stage as any).estimatedStartDate ?? stage.date ?? ""
              const endDate = (stage as any).estimatedEndDate ?? ""

              return (
                  <button
                      ref={(node) => {
                        cardRefs.current[stage.id] = node
                      }}
                      key={stage.id}
                      onClick={() => { setSelectedStage(stage); centerStageCard(stage.id) }}
                      className={[
                        "flex-shrink-0 snap-start rounded-xl border-2 transition-all hover:scale-[1.02] text-left",
                        "w-72 p-5",
                        isCompleted
                          ? "bg-muted/40 border-border text-muted-foreground opacity-80"
                          : isCurrent 
                          ? "bg-primary text-primary-foreground border-primary shadow-lg"
                          : "bg-card border-border hover:border-primary/50",
                      ].join(" ")}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={isCompleted ? "secondary" : isCurrent ? "secondary" : "outline"}
                          className="text-xs"
                        >
                          Étape {stage.id}
                        </Badge>

                        <span
                          className="text-lg"
                          title={
                            status === "completed"
                              ? "Étape terminée"
                              : status === "current"
                              ? "Étape en cours"
                              : "Étape à venir"
                          }
                        >
                          {stageEmoji}
                        </span>
                      </div>

                      <div>
                        <div className="text-sm font-bold leading-snug">
                          {startCity} → {endCity}
                        </div>
                        <div className="text-xs opacity-80">{stage.country}</div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-md border border-border/60 p-2">
                          <div className="opacity-70">Distance</div>
                          <div className="font-semibold">{stage.distance} km</div>
                        </div>
                        <div className="rounded-md border border-border/60 p-2">
                          <div className="opacity-70">D+</div>
                          <div className="font-semibold">{dPlus} m</div>
                        </div>
                        <div className="rounded-md border border-border/60 p-2">
                          <div className="opacity-70">Terrain</div>
                          <div className="font-semibold">{stage.terrain}</div>
                        </div>
                        <div className="rounded-md border border-border/60 p-2">
                          <div className="opacity-70">Dates</div>
                          <div className="font-semibold">
                            {startDate}
                            {endDate ? ` → ${endDate}` : ""}
                          </div>
                        </div>
                      </div>

                      {(stage as any).ferry ? (
                          <Badge variant={isCurrent ? "secondary" : "outline"} className="text-xs w-fit">
                            Ferry
                          </Badge>
                      ) : null}
                    </div>
                  </button>
              )
            })}
          </div>
        </Card>

        {/* Map GPX (Leaflet) */}
        <Card className="p-6 border-2 border-primary/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Tracé GPX</h3>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!selectedStage}
                onClick={() => setSelectedStage(null)}
              >
                Voir le tracé complet
              </Button>

              <a
                  href={gpxUrl}
                  download
                  className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                  title="Télécharger le fichier GPX"
              >
                <ExternalLink className="w-4 h-4" />
                Télécharger GPX
              </a>
            </div>
          </div>

          <div className="bg-muted/30 rounded-lg overflow-hidden border-2 border-border">
            {/* Important : height fix */}
            <div style={{ width: "100%", height: "700px" }}>
              {isClient ? (
                  <MapContainer
                      center={initialCenter}
                      zoom={initialZoom}
                      scrollWheelZoom={true}
                      style={{ width: "100%", height: "100%" }}
                  >
                    <TileLayer
                        attribution='&copy; OpenStreetMap contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    <GPXLayer gpxUrl={selectedStage?.gpxUrl || "/gpx/tarifa-nordkapp.gpx"} />
                  </MapContainer>
              ) : null}
            </div>
          </div>
        </Card>
      </div>
  )
}
