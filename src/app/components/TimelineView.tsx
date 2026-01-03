import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { ElevationTimeline } from './ElevationTimeline';

interface TimelineViewProps {
  onBack: () => void;
}

export function TimelineView({ onBack }: TimelineViewProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header avec bouton retour */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button
            onClick={onBack}
            variant="ghost"
            className="group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour à l'accueil
          </Button>
        </div>
      </div>

      {/* Contenu de la timeline */}
      <ElevationTimeline />
    </div>
  );
}
