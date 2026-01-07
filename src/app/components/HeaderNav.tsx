"use client"

import { Compass, Camera, Radio, ArrowRight, Home, Shield } from "lucide-react"
import { Button } from "./ui/button"

type ActivePage = "home" | "route" | "gallery" | "tracking" | "admin"

interface HeaderNavProps {
    activePage: ActivePage
    onGoHome: () => void
    onDiscoverRoute: () => void
    onShowPhotoGallery?: () => void
    onShowLiveTracking?: () => void
    onShowAdminUpload?: () => void
}

export function HeaderNav({
                              activePage,
                              onGoHome,
                              onDiscoverRoute,
                              onShowPhotoGallery,
                              onShowLiveTracking,
                              onShowAdminUpload,
                          }: HeaderNavProps) {
    const baseBtn =
        "shadow-sm whitespace-nowrap flex items-center gap-2"

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
                        <div className="min-w-0">
                            <div className="font-semibold leading-tight truncate">Tarifa → Cap Nord</div>
                            <div className="text-xs text-muted-foreground truncate">Voyage à vélo</div>
                        </div>
                    </div>
                </div>

                {/* Boutons */}
                <nav className="flex items-center gap-2">
                    {/* Route */}
                    <Button
                        onClick={onDiscoverRoute}
                        size="sm"
                        variant={activePage === "route" ? "default" : "outline"}
                        className={baseBtn}
                        aria-label="Découvrir le tracé"
                    >
                        <ArrowRight className="w-4 h-4" />
                        <span className="hidden sm:inline">Découvrir le tracé</span>
                    </Button>

                    {/* Tracking */}
                    {onShowLiveTracking && (
                        <Button
                            onClick={onShowLiveTracking}
                            size="sm"
                            variant={activePage === "tracking" ? "default" : "outline"}
                            className={baseBtn}
                            aria-label="Suivi GPS"
                        >
                            <Radio className="w-4 h-4" />
                            <span className="hidden sm:inline">Suivi GPS</span>
                        </Button>
                    )}

                    {/* Galerie */}
                    {onShowPhotoGallery && (
                        <Button
                            onClick={onShowPhotoGallery}
                            size="sm"
                            variant={activePage === "gallery" ? "default" : "outline"}
                            className={baseBtn}
                            aria-label="Galerie photos"
                        >
                            <Camera className="w-4 h-4" />
                            <span className="hidden sm:inline">Galerie</span>
                        </Button>
                    )}

                    {/* Admin */}
                    {onShowAdminUpload && (
                        <Button
                            onClick={onShowAdminUpload}
                            size="sm"
                            variant={activePage === "admin" ? "default" : "outline"}
                            className={baseBtn}
                            aria-label="Admin photos"
                        >
                            <Shield className="w-4 h-4" />
                            <span className="hidden sm:inline">Admin</span>
                        </Button>
                    )}
                </nav>
            </div>
        </header>
    )
}
