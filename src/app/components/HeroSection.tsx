import { ArrowRight, Compass, List, Map, TrendingUp } from 'lucide-react';
import { Button } from './ui/button';
import { RouteMap } from './RouteMap';

interface HeroSectionProps {
  onDiscoverRoute: () => void;
  onDiscoverTimeline?: () => void;
  onDiscoverMap?: () => void;
  onDiscoverElevationTimeline?: () => void;
}

export function HeroSection({ onDiscoverRoute, onDiscoverTimeline, onDiscoverMap, onDiscoverElevationTimeline }: HeroSectionProps) {
  return (
    <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden px-4 py-12 md:py-16 bg-gradient-to-br from-background via-muted/30 to-accent/10">
      
      <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Contenu textuel */}
        <div className="space-y-6 text-center md:text-left">
          {/* Badge adventure */}
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full border border-accent/30">
            <Compass className="w-4 h-4" />
            <span className="text-sm">Aventure Épique</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
            De Gibraltar au Cap Nord
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
            Suivez notre voyage à vélo de 6 mois à travers l'Europe, 
            de la pointe sud de l'Espagne jusqu'aux confins de la Norvège. 
            Une aventure de 6 000 kilomètres au cœur de la nature.
          </p>
          
          {/* Stats style jeu vidéo */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto md:mx-0">
            <div className="bg-card border border-border rounded-lg p-3 text-center shadow-sm">
              <div className="text-2xl font-bold text-primary">6</div>
              <div className="text-xs text-muted-foreground">Mois</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-3 text-center shadow-sm">
              <div className="text-2xl font-bold text-primary">6</div>
              <div className="text-xs text-muted-foreground">Pays</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-3 text-center shadow-sm">
              <div className="text-2xl font-bold text-primary">6 780</div>
              <div className="text-xs text-muted-foreground">km</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-3 text-center shadow-sm">
              <div className="text-2xl font-bold text-primary">48 450</div>
              <div className="text-xs text-muted-foreground">m D+</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center md:justify-start">
            <Button
              onClick={onDiscoverRoute}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg group w-full sm:w-auto"
            >
              Découvrir le tracé
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            {onDiscoverTimeline && (
              <Button
                onClick={onDiscoverTimeline}
                size="lg"
                variant="outline"
                className="shadow-lg group w-full sm:w-auto"
              >
                Voir la chronologie
                <List className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
            
            {onDiscoverMap && (
              <Button
                onClick={onDiscoverMap}
                size="lg"
                variant="outline"
                className="shadow-lg group w-full sm:w-auto"
              >
                Voir la carte
                <Map className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
            
            {onDiscoverElevationTimeline && (
              <Button
                onClick={onDiscoverElevationTimeline}
                size="lg"
                variant="outline"
                className="shadow-lg group w-full sm:w-auto"
              >
                Profil d'élévation
                <TrendingUp className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
        </div>
        
        {/* Image à droite */}
        <div className="relative hidden md:block">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-card border-2 border-border p-4 h-[400px]">
            <div className="h-full flex items-center justify-center overflow-hidden">
              <RouteMap />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}