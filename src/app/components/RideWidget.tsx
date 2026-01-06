import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { MapPin, Navigation, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { journeyStages } from "../data/journeyStages"

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

export function RideWidget() {
  const [selectedStage, setSelectedStage] = useState(journeyStages[0])
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Record<number, HTMLButtonElement | null>>({})


  const [latest, setLatest] = useState<LatestActivityResponse | null>(null)
  const [loading, setLoading] = useState(true)

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateScrollButtons = () => {
    const el = scrollContainerRef.current
    if (!el) return
    // petite marge pour éviter les flottants
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

  const centerStageCard = (stageId: number, behavior: ScrollBehavior = "smooth") => {
    const container = scrollContainerRef.current
    const card = cardRefs.current[stageId]
    if (!container || !card) return

    const containerRect = container.getBoundingClientRect()
    const cardRect = card.getBoundingClientRect()

    // card center relative to container scroll
    const cardCenter = (cardRect.left - containerRect.left) + cardRect.width / 2
    const targetScrollLeft = container.scrollLeft + cardCenter - container.clientWidth / 2

    container.scrollTo({ left: targetScrollLeft, behavior })
  }

  const parseFRDate = (s: string) => {
    // "23/06/2026"
    const [dd, mm, yyyy] = s.split("/").map(Number)
    return new Date(yyyy, (mm ?? 1) - 1, dd ?? 1, 12, 0, 0, 0) // midi = évite les soucis de timezone
  }

  const findStageForDate = (d: Date) => {
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0)

    const first = journeyStages[0]
    const last = journeyStages[journeyStages.length - 1]
    const firstStart = parseFRDate(first.estimatedStartDate)
    const lastEnd = parseFRDate(last.estimatedEndDate)

    if (day < firstStart) return { kind: "before" as const }
    if (day > lastEnd) return { kind: "after" as const }

    const match = journeyStages.find((s) => {
      const start = parseFRDate(s.estimatedStartDate)
      const end = parseFRDate(s.estimatedEndDate)
      return day >= start && day <= end
    })

    return match ? { kind: "match" as const, stageId: match.id } : { kind: "before" as const }
  }



  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return

    // Centrer à peu près au démarrage (comme ton code)
    // Au démarrage : centre sur l’étape correspondant à la date du jour
    const res = findStageForDate(new Date())

// attend une frame pour que les refs soient bien en place
    requestAnimationFrame(() => {
      if (res.kind === "match") {
        centerStageCard(res.stageId, "auto")
        setSelectedStage(journeyStages.find(s => s.id === res.stageId) ?? journeyStages[0])
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

  return (
      <div className="w-full space-y-6">
        {/* Étapes */}
        <Card className="p-4 bg-muted/30">
          <div className="flex items-center justify-between mb-4 gap-3">
            <h3 className="text-lg font-bold text-foreground">Étapes du voyage</h3>

            {/* Flèches */}
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
              className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-primary scrollbar-track-muted"
              style={{ scrollbarWidth: "thin" }}
          >
            {journeyStages.map((stage) => {
              const isSelected = selectedStage.id === stage.id

              // Tolère les anciens champs si jamais tout n’est pas encore partout
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
                      onClick={() => setSelectedStage(stage)}
                      className={[
                        "flex-shrink-0 snap-start rounded-xl border-2 transition-all hover:scale-[1.02] text-left",
                        "w-72 p-5", // ✅ vignette plus grande
                        isSelected
                            ? "bg-primary text-primary-foreground border-primary shadow-lg"
                            : "bg-card border-border hover:border-primary/50",
                      ].join(" ")}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge variant={isSelected ? "secondary" : "outline"} className="text-xs">
                          Étape {stage.id}
                        </Badge>
                      </div>

                      {/* Villes */}
                      <div>
                        <div className="text-sm font-bold leading-snug">
                          {startCity} → {endCity}
                        </div>
                        <div className="text-xs opacity-80">{stage.country}</div>
                      </div>

                      {/* Infos clés */}
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

                      {/* (Optionnel) petit tag ferry */}
                      {(stage as any).ferry ? (
                          <Badge variant={isSelected ? "secondary" : "outline"} className="text-xs w-fit">
                            Ferry
                          </Badge>
                      ) : null}
                    </div>
                  </button>
              )
            })}
          </div>
        </Card>


        {/* uMap */}
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
          </div>

          <div className="bg-muted/30 rounded-lg overflow-hidden border-2 border-border">
            <iframe
                style={{ width: "100%", height: "700px", border: 0 }}
                allowFullScreen
                allow="geolocation"
                src="//umap.openstreetmap.fr/en/map/tarifa-nordkapp_1339935?scaleControl=false&miniMap=false&scrollWheelZoom=false&zoomControl=true&editMode=disabled&moreControl=true&searchControl=null&tilelayersControl=null&embedControl=null&datalayersControl=true&onLoadPanel=none&captionBar=false&captionMenus=true"
            />

            <a
                href="//umap.openstreetmap.fr/en/map/tarifa-nordkapp_1339935?scaleControl=false&miniMap=false&scrollWheelZoom=true&zoomControl=true&editMode=disabled&moreControl=true&searchControl=null&tilelayersControl=null&embedControl=null&datalayersControl=true&onLoadPanel=none&captionBar=false&captionMenus=true"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Voir en plein écran
              </a>
          </div>
        </Card>
      </div>
  )
}
