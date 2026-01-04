import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { MapPin, Navigation, ExternalLink } from "lucide-react"
import { useEffect, useRef, useState } from "react"
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
  const [selectedStage, setSelectedStage] = useState(journeyStages[5]) // Paris par défaut
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const [latest, setLatest] = useState<LatestActivityResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const scrollAmount = (container.scrollWidth - container.clientWidth) / 2
      container.scrollLeft = scrollAmount
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

  // Mock (si tu en as besoin ici aussi)
  const mockLiveData = {
    progress: { stagesCompleted: 6 },
    position: { lat: 48.8566, lon: 2.3522, location: "Paris, France" },
  }

  return (
      <div className="w-full space-y-6">
        {/* Étapes */}
        <Card className="p-4 bg-muted/30">
          <h3 className="text-lg font-bold text-foreground mb-4">Étapes du voyage</h3>

          <div
              ref={scrollContainerRef}
              className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-primary scrollbar-track-muted"
              style={{ scrollbarWidth: "thin" }}
          >
            {journeyStages.map((stage) => (
                <button
                    key={stage.id}
                    onClick={() => setSelectedStage(stage)}
                    className={`flex-shrink-0 snap-start w-48 p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                        selectedStage.id === stage.id
                            ? "bg-primary text-primary-foreground border-primary shadow-lg"
                            : "bg-card border-border hover:border-primary/50"
                    }`}
                >
                  <div className="text-left space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant={selectedStage.id === stage.id ? "secondary" : "outline"} className="text-xs">
                        Étape {stage.id}
                      </Badge>
                      {stage.id <= mockLiveData.progress.stagesCompleted && <span className="text-xs">✓</span>}
                    </div>
                    <h4 className="font-bold text-sm">{stage.name}</h4>
                    <p className="text-xs opacity-80">{stage.country}</p>
                    <div className="text-xs opacity-70">{stage.distance} km</div>
                  </div>
                </button>
            ))}
          </div>
        </Card>

        {/* Détails étape sélectionnée */}
        {selectedStage && (
            <Card className="p-6 bg-accent/10 border-2 border-accent/30">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{selectedStage.name}</h2>
                  <p className="text-muted-foreground">
                    {selectedStage.country} • {selectedStage.date}
                  </p>
                </div>
                <Badge className="text-lg px-3 py-1">{selectedStage.distance} km</Badge>
              </div>

              <p className="text-foreground mb-4">{selectedStage.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-card p-3 rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground">Dénivelé positif</div>
                  <div className="text-lg font-bold text-foreground">{selectedStage.elevation} m</div>
                </div>
                <div className="bg-card p-3 rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground">Terrain</div>
                  <div className="text-lg font-bold text-foreground">{selectedStage.terrain}</div>
                </div>
                <div className="bg-card p-3 rounded-lg border border-border">
                  <div className="text-xs text-muted-foreground">Distance</div>
                  <div className="text-lg font-bold text-foreground">{selectedStage.distance} km</div>
                </div>
              </div>
            </Card>
        )}

        {/* uMap (juste après les infos) */}
        <Card className="p-6 border-2 border-primary/20">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Tracé GPX</h3>
                <p className="text-sm text-muted-foreground">{mockLiveData.position.location}</p>
              </div>
            </div>

            <Badge variant="outline" className="gap-1">
              <Navigation className="w-3 h-3" />
              {mockLiveData.position.lat.toFixed(4)}°N, {mockLiveData.position.lon.toFixed(4)}°E
            </Badge>
          </div>

          <div className="bg-muted/30 rounded-lg overflow-hidden border-2 border-border">
            <iframe
                style={{ width: "100%", height: "500px", border: 0 }}
                allowFullScreen
                allow="geolocation"
                src="//umap.openstreetmap.fr/fr/map/test-kapp_1337944?scaleControl=false&miniMap=false&scrollWheelZoom=false&zoomControl=true&editMode=disabled&moreControl=true&searchControl=null&tilelayersControl=null&embedControl=null&datalayersControl=true&onLoadPanel=none&captionBar=false&captionMenus=true"
            />
            <div className="p-3 bg-card border-t border-border">
              <a
                  href="//umap.openstreetmap.fr/fr/map/test-kapp_1337944?scaleControl=false&miniMap=false&scrollWheelZoom=true&zoomControl=true&editMode=disabled&moreControl=true&searchControl=null&tilelayersControl=null&embedControl=null&datalayersControl=true&onLoadPanel=none&captionBar=false&captionMenus=true"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Voir en plein écran
              </a>
            </div>
          </div>
        </Card>
      </div>
  )
}
