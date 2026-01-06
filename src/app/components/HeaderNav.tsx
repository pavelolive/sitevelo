"use client"

import { Compass, Camera, Radio, ArrowRight, Home } from "lucide-react"
import { Button } from "./ui/button"

type ActivePage = "home" | "route" | "gallery" | "tracking"

interface HeaderNavProps {
    activePage: ActivePage
    onGoHome: () => void
    onDiscoverRoute: () => void
    onShowPhotoGallery?: () => void
    onShowLiveTracking?: () => void
}

export function HeaderNav({
                              activePage,
                              onGoHome,
                              onDiscoverRoute,
                              onShowPhotoGallery,
                              onShowLiveTracking,
                          }: HeaderNavProps) {
    return (
        <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
                {/* Home */}
                <div className="flex items-center gap-2 min-w-0">
                    <Button
                        onClick={onGoHome}
                        size="icon"
                        variant={activePage === "home" ? "default" : "outline"}
                        className={activePage === "home" ? "shadow-sm" : "shrink-0"}
                        aria-label="Retour à l’accueil"
                    >
                        <Home className="w-4 h-4" />
                    </Button>

                    <div className="flex items-center gap-2 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
                            <Compass className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                            <div className="font-semibold leading-tight truncate">Tarifa → Cap Nord</div>
                            <div className="text-xs text-muted-foreground truncate">Voyage à vélo</div>
                        </div>
                    </div>
                </div>

                {/* Boutons */}
                <nav className="flex items-center gap-2 overflow-x-auto">
                    <Button
                        onClick={onDiscoverRoute}
                        size="sm"
                        variant={activePage === "route" ? "default" : "outline"}
                        className={activePage === "route" ? "shadow-sm whitespace-nowrap" : "bg-transparent shadow-sm whitespace-nowrap"}
                    >
                        Découvrir le tracé
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>

                    {onShowPhotoGallery && (
                        <Button
                            onClick={onShowPhotoGallery}
                            size="sm"
                            variant={activePage === "gallery" ? "default" : "outline"}
                            className={activePage === "gallery" ? "shadow-sm whitespace-nowrap" : "bg-transparent shadow-sm whitespace-nowrap"}
                        >
                            Galerie photos
                            <Camera className="w-4 h-4 ml-2" />
                        </Button>
                    )}

                    {onShowLiveTracking && (
                        <Button
                            onClick={onShowLiveTracking}
                            size="sm"
                            variant={activePage === "tracking" ? "default" : "outline"}
                            className={activePage === "tracking" ? "shadow-sm whitespace-nowrap" : "bg-transparent shadow-sm whitespace-nowrap"}
                        >
                            Suivi GPS
                            <Radio className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </nav>
            </div>
        </header>
    )
}
