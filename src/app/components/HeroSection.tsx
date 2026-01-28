"use client"

import { ArrowRight, Compass, Camera, Radio } from "lucide-react"
import { Button } from "./ui/button"

interface HeroSectionProps {
  onDiscoverRoute: () => void
  onShowPhotoGallery?: () => void
  onShowLiveTracking?: () => void
}

export function HeroSection({ onDiscoverRoute, onShowPhotoGallery, onShowLiveTracking }: HeroSectionProps) {
  return (
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden px-4 pb-12 md:pb-16 bg-primary-foreground from-background via-muted/30 to-accent/10">
        {/* Map en arrière-plan uniquement en mobile */}
        <img
            src="/map-trace.svg"
            alt=""
            aria-hidden="true"
            className="
    md:hidden
    absolute top-0 left-0 w-full h-[50%] object-cover object-[0%_center] opacity-50
    pointer-events-none
  "
        />

        {/* Map à droite uniquement en desktop (comme actuellement) */}
        <img
            src="/map-trace.svg"
            alt="Image d'accueil"
            className="
    hidden md:block
    absolute top-0 right-0 h-full
    object-cover
    pointer-events-none
  "
        />
        <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Contenu textuel */}
          <div className="space-y-6 pt-12 md:pt-16 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
              The Edges of Europe project
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              6 mois pour traverser l’Europe continentale à vélo depuis Tarifa en Espagne, son point le plus au sud,
              jusqu’à son point le plus au nord en Norvège, Nordkapp.
              Une aventure de plus de 10 000km à travers ses plus belles routes et chemins gravel.
            </p>

            {/* Stats style jeu vidéo */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto md:mx-0">
              <div className="bg-card border border-border rounded-lg p-3 text-center shadow-sm">
                <div className="text-2xl font-bold text-primary">6</div>
                <div className="text-xs text-muted-foreground">Mois</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-3 text-center shadow-sm">
                <div className="text-2xl font-bold text-primary">8</div>
                <div className="text-xs text-muted-foreground">Pays</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-3 text-center shadow-sm">
                <div className="text-2xl font-bold text-primary">10 449</div>
                <div className="text-xs text-muted-foreground">km</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-3 text-center shadow-sm">
                <div className="text-2xl font-bold text-primary">106 533</div>
                <div className="text-xs text-muted-foreground">m D+</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center md:justify-start">
              <Button
                  onClick={onDiscoverRoute}
                  size="lg"
                  variant="outline"
                  className="shadow-lg group w-full sm:w-auto bg-transparent cursor-pointer"
              >
                Découvrir le tracé
                <ArrowRight className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
              </Button>

              {onShowLiveTracking && (
                  <Button
                      onClick={onShowLiveTracking}
                      size="lg"
                      variant="outline"
                      className="shadow-lg group w-full sm:w-auto bg-transparent cursor-pointer"
                  >
                    Suivi GPS en Direct
                    <Radio className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                  </Button>
              )}

              {onShowPhotoGallery && (
                  <Button
                      onClick={onShowPhotoGallery}
                      size="lg"
                      variant="outline"
                      className="shadow-lg group w-full sm:w-auto bg-transparent cursor-pointer"
                  >
                    Galerie photos
                    <Camera className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
                  </Button>
              )}
            </div>
          </div>

          {/* Image à droite */}

        </div>
      </section>
  )
}
