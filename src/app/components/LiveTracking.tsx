"use client"

import { ArrowLeft, MapPin, Navigation, Zap, TrendingUp, Info, ExternalLink } from "lucide-react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Badge } from "./ui/badge"
import { journeyStages } from "../data/journeyStages"
import { useState, useRef, useEffect } from "react"

interface LiveTrackingProps {
    onBack: () => void
}

type LatestActivityResponse = {
    ok: boolean;
    activity: null | {
        name: string;
        distance_km: number;
        elevation_gain_m: number;
        moving_time_s: number;
        avg_speed_kmh: number;
        start_date: string;
    };
    error?: string;
};

function formatDuration(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}min` : `${m}min`;
}

export function LiveTracking({ onBack }: LiveTrackingProps) {
    const [selectedStage, setSelectedStage] = useState(journeyStages[5]) // Default to Paris
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const [latest, setLatest] = useState<LatestActivityResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const r = await fetch("/api/strava/latest", { cache: "no-store" });
                const data = (await r.json()) as LatestActivityResponse;
                setLatest(data);
            } catch (e) {
                setLatest({ ok: false, activity: null, error: String(e) });
            } finally {
                setLoading(false);
            }
        })();
    }, []);
    // Mock live data
    const mockLiveData = {
        position: {
            lat: 48.8566,
            lon: 2.3522,
            location: "Paris, France",
            lastUpdate: "30 Déc 2025 14:23",
        },
        currentDay: {
            distance: 87.3,
            duration: "5h 42min",
            avgSpeed: 15.3,
            elevationGain: 420,
            elevationLoss: 380,
        },
        stats: {
            totalDistance: 2145,
            avgSpeed: 16.8,
            elevationGain: 18500,
            totalTime: "128h 15min",
        },
        progress: {
            percentage: 28,
            daysElapsed: 42,
            daysRemaining: 108,
            stagesCompleted: 6,
            totalStages: 16,
        },
    }

    // Auto-scroll to center on mount
    useEffect(() => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current
            const scrollAmount = (container.scrollWidth - container.clientWidth) / 2
            container.scrollLeft = scrollAmount
        }
    }, [])

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4 mb-4">
                        <Button onClick={onBack} variant="ghost" size="sm" className="gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Retour
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-foreground">Suivie GPS en Direct</h1>
                            <p className="text-sm text-muted-foreground">
                                Données en temps réel • Mis à jour il y a {mockLiveData.position.lastUpdate}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-green-500/10 px-3 py-1.5 rounded-full border border-green-500/20">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-green-700">En direct</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">

                {/* Position actuelle */}
                <Card className="p-6 border-2 border-primary/20">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-bold text-foreground">Position Actuelle</h3>
                                <p className="text-sm text-muted-foreground">{mockLiveData.position.location}</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="gap-1">
                            <Navigation className="w-3 h-3" />
                            {mockLiveData.position.lat.toFixed(4)}°N, {mockLiveData.position.lon.toFixed(4)}°E
                        </Badge>
                    </div>

                    {/* Carte */}
                    <div className="bg-muted/30 rounded-lg overflow-hidden border-2 border-border">
                        <iframe
                            style={{ width: "100%", height: "300px", border: 0 }}
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

                {/* Statistiques du jour */}
                <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-4 h-4 text-muted-foreground" />
                        <h3 className="font-bold text-foreground">Statistiques du Jour</h3>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Distance</div>
                            <div className="text-2xl font-bold text-foreground">{loading ? "…" : latest?.activity ? `${latest.activity.distance_km} km` : "—"}</div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Vitesse</div>
                            <div className="text-2xl font-bold text-foreground">{loading ? "…" : latest?.activity ? `${latest.activity.avg_speed_kmh} km/h` : "—"}</div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Dénivelé</div>
                            <div className="text-2xl font-bold text-foreground">{loading ? "…" : latest?.activity ? `${latest.activity.elevation_gain_m} m` : "—"}</div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Temps</div>
                            <div className="text-2xl font-bold text-foreground">{loading ? "…" : latest?.activity ? formatDuration(latest.activity.moving_time_s) : "—"}</div>
                        </div>
                    </div>
                </Card>

                {/* Statistiques totales */}
                <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-foreground">Statistiques Totales du Voyage</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-muted-foreground">Progression totale</span>
                                <span className="font-bold text-primary">{mockLiveData.progress.percentage}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-primary to-primary/70 h-full rounded-full transition-all"
                                    style={{ width: `${mockLiveData.progress.percentage}%` }}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
                            <div>
                                <div className="text-sm text-muted-foreground">Étapes complétées</div>
                                <div className="text-xl font-bold text-foreground">
                                    {mockLiveData.progress.stagesCompleted} / {mockLiveData.progress.totalStages}
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground">Distance totale</div>
                                <div className="text-xl font-bold text-foreground">{mockLiveData.stats.totalDistance} km</div>
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground">Vitesse moyenne</div>
                                <div className="text-xl font-bold text-foreground">{mockLiveData.stats.avgSpeed} km/h</div>
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground">Dénivelé cumulé</div>
                                <div className="text-xl font-bold text-foreground">{mockLiveData.stats.elevationGain} m</div>
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground">Jours écoulés</div>
                                <div className="text-xl font-bold text-foreground">{mockLiveData.progress.daysElapsed}</div>
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground">Jours restants</div>
                                <div className="text-xl font-bold text-foreground">{mockLiveData.progress.daysRemaining}</div>
                            </div>

                            <div>
                                <div className="text-sm text-muted-foreground">Temps total</div>
                                <div className="text-xl font-bold text-foreground">{mockLiveData.stats.totalTime}</div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Note */}
                <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="flex gap-3">
                        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Mode simulation</p>
                            <p className="text-blue-700">
                                Ces données sont simulées à titre de démonstration. Configurez l'intégration API ou Widget pour afficher
                                les vraies données GPS.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
}
