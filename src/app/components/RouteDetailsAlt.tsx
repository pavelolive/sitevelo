import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Mountain,
  TrendingUp,
  TrendingDown,
  MapPin,
  Flag,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface RouteDetailsAltProps {
  onBack: () => void;
}

interface Stage {
  id: number;
  name: string;
  country: string;
  startDate: string;
  endDate: string;
  duration: string;
  distance: number;
  elevationGain: number;
  elevationLoss: number;
  description: string;
  highlights: string[];
  type: 'start' | 'stage' | 'end';
}

const stages: Stage[] = [
  {
    id: 1,
    name: 'Gibraltar - Séville',
    country: 'Espagne',
    startDate: '1 Mai 2025',
    endDate: '7 Mai 2025',
    duration: '7 jours',
    distance: 280,
    elevationGain: 1850,
    elevationLoss: 1920,
    description: 'Départ officiel du voyage au point le plus méridional de l\'Europe continentale',
    highlights: ['Rocher de Gibraltar', 'Costa del Sol', 'Ronda'],
    type: 'start',
  },
  {
    id: 2,
    name: 'Séville - Lisbonne',
    country: 'Portugal',
    startDate: '8 Mai 2025',
    endDate: '15 Mai 2025',
    duration: '8 jours',
    distance: 420,
    elevationGain: 2100,
    elevationLoss: 2050,
    description: 'Traversée vers le Portugal à travers les paysages de l\'Alentejo',
    highlights: ['Parc naturel de Doñana', 'Évora', 'Côte atlantique'],
    type: 'stage',
  },
  {
    id: 3,
    name: 'Lisbonne - Porto',
    country: 'Portugal',
    startDate: '16 Mai 2025',
    endDate: '23 Mai 2025',
    duration: '8 jours',
    distance: 350,
    elevationGain: 2400,
    elevationLoss: 2350,
    description: 'Remontée de la côte portugaise vers le nord',
    highlights: ['Óbidos', 'Nazaré', 'Coimbra'],
    type: 'stage',
  },
  {
    id: 4,
    name: 'Porto - Saint-Jacques-de-Compostelle',
    country: 'Espagne',
    startDate: '24 Mai 2025',
    endDate: '2 Juin 2025',
    duration: '10 jours',
    distance: 280,
    elevationGain: 3200,
    elevationLoss: 3100,
    description: 'Suivre une partie du Camino portugais',
    highlights: ['Vallée du Douro', 'Vigo', 'Santiago'],
    type: 'stage',
  },
  {
    id: 5,
    name: 'Saint-Jacques - Bordeaux',
    country: 'France',
    startDate: '3 Juin 2025',
    endDate: '14 Juin 2025',
    duration: '12 jours',
    distance: 520,
    elevationGain: 2800,
    elevationLoss: 2900,
    description: 'Entrée en France par les Pyrénées basques',
    highlights: ['Pays Basque', 'Landes', 'Bassin d\'Arcachon'],
    type: 'stage',
  },
  {
    id: 6,
    name: 'Bordeaux - Paris',
    country: 'France',
    startDate: '15 Juin 2025',
    endDate: '28 Juin 2025',
    duration: '14 jours',
    distance: 620,
    elevationGain: 3100,
    elevationLoss: 3000,
    description: 'Traversée du centre de la France par la vallée de la Loire',
    highlights: ['Châteaux de la Loire', 'Vallée de la Loire', 'Versailles'],
    type: 'stage',
  },
  {
    id: 7,
    name: 'Paris - Strasbourg',
    country: 'France',
    startDate: '29 Juin 2025',
    endDate: '10 Juillet 2025',
    duration: '12 jours',
    distance: 480,
    elevationGain: 2600,
    elevationLoss: 2400,
    description: 'Cap vers l\'Est à travers la Champagne',
    highlights: ['Reims', 'Verdun', 'Vosges'],
    type: 'stage',
  },
  {
    id: 8,
    name: 'Strasbourg - Cologne',
    country: 'Allemagne',
    startDate: '11 Juillet 2025',
    endDate: '20 Juillet 2025',
    duration: '10 jours',
    distance: 420,
    elevationGain: 2100,
    elevationLoss: 2300,
    description: 'Entrée en Allemagne le long du Rhin',
    highlights: ['Vallée du Rhin', 'Forêt-Noire', 'Heidelberg'],
    type: 'stage',
  },
  {
    id: 9,
    name: 'Cologne - Amsterdam',
    country: 'Pays-Bas',
    startDate: '21 Juillet 2025',
    endDate: '28 Juillet 2025',
    duration: '8 jours',
    distance: 280,
    elevationGain: 800,
    elevationLoss: 900,
    description: 'Descente vers les plats pays',
    highlights: ['Düsseldorf', 'Utrecht', 'Canaux hollandais'],
    type: 'stage',
  },
  {
    id: 10,
    name: 'Amsterdam - Hambourg',
    country: 'Allemagne',
    startDate: '29 Juillet 2025',
    endDate: '7 Août 2025',
    duration: '10 jours',
    distance: 450,
    elevationGain: 1200,
    elevationLoss: 1150,
    description: 'Traversée de l\'Allemagne du Nord',
    highlights: ['Brême', 'Lübeck', 'Mer du Nord'],
    type: 'stage',
  },
  {
    id: 11,
    name: 'Hambourg - Copenhague',
    country: 'Danemark',
    startDate: '8 Août 2025',
    endDate: '16 Août 2025',
    duration: '9 jours',
    distance: 380,
    elevationGain: 950,
    elevationLoss: 980,
    description: 'Premier pays scandinave',
    highlights: ['Lübeck', 'Ferry Puttgarden-Rødby', 'Øresund'],
    type: 'stage',
  },
  {
    id: 12,
    name: 'Copenhague - Göteborg',
    country: 'Suède',
    startDate: '17 Août 2025',
    endDate: '24 Août 2025',
    duration: '8 jours',
    distance: 320,
    elevationGain: 1400,
    elevationLoss: 1350,
    description: 'Entrée en Suède par la côte ouest',
    highlights: ['Malmö', 'Helsingborg', 'Côte suédoise'],
    type: 'stage',
  },
  {
    id: 13,
    name: 'Göteborg - Stockholm',
    country: 'Suède',
    startDate: '25 Août 2025',
    endDate: '5 Septembre 2025',
    duration: '12 jours',
    distance: 520,
    elevationGain: 2800,
    elevationLoss: 2750,
    description: 'Traversée de la Suède centrale',
    highlights: ['Lac Vänern', 'Lac Vättern', 'Archipel de Stockholm'],
    type: 'stage',
  },
  {
    id: 14,
    name: 'Stockholm - Trondheim',
    country: 'Norvège',
    startDate: '6 Septembre 2025',
    endDate: '23 Septembre 2025',
    duration: '18 jours',
    distance: 780,
    elevationGain: 5200,
    elevationLoss: 5100,
    description: 'Entrée en Norvège par les montagnes centrales',
    highlights: ['Forêts suédoises', 'Frontière norvégienne', 'Fjords'],
    type: 'stage',
  },
  {
    id: 15,
    name: 'Trondheim - Cercle Arctique',
    country: 'Norvège',
    startDate: '24 Septembre 2025',
    endDate: '5 Octobre 2025',
    duration: '12 jours',
    distance: 520,
    elevationGain: 4100,
    elevationLoss: 4000,
    description: 'Franchissement du cercle polaire arctique',
    highlights: ['Mo i Rana', 'Polarsirkelen', 'Soleil de minuit'],
    type: 'stage',
  },
  {
    id: 16,
    name: 'Cercle Arctique - Cap Nord',
    country: 'Norvège',
    startDate: '6 Octobre 2025',
    endDate: '20 Octobre 2025',
    duration: '15 jours',
    distance: 650,
    elevationGain: 5800,
    elevationLoss: 5750,
    description: 'Dernière étape vers le point le plus septentrional d\'Europe',
    highlights: ['Narvik', 'Tromsø', 'Nordkapp'],
    type: 'end',
  },
];

export function RouteDetailsAlt({ onBack }: RouteDetailsAltProps) {
  const [expandedStages, setExpandedStages] = useState<number[]>([]);

  const toggleStage = (stageId: number) => {
    if (expandedStages.includes(stageId)) {
      setExpandedStages(expandedStages.filter(id => id !== stageId));
    } else {
      setExpandedStages([...expandedStages, stageId]);
    }
  };

  // Fonction pour déterminer le statut d'une étape
  const getStageStatus = (stage: Stage): 'completed' | 'current' | 'upcoming' => {
    const today = new Date();
    const startDate = new Date(stage.startDate);
    const endDate = new Date(stage.endDate);
    
    if (today > endDate) {
      return 'completed';
    } else if (today >= startDate && today <= endDate) {
      return 'current';
    } else {
      return 'upcoming';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Timeline du Voyage</h1>
          <div className="w-20" /> {/* Spacer pour centrer le titre */}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* En-tête */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl font-bold text-foreground">Les 16 étapes du voyage</h2>
          <p className="text-xl font-semibold text-primary">
            6 mois • 6 pays • 6 780 km • 48 450 m D+
          </p>
          <p className="text-muted-foreground">
            De Gibraltar au Cap Nord, suivez notre progression étape par étape
          </p>
        </div>

        {/* Timeline verticale */}
        <div className="relative">
          {/* Ligne verticale centrale */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary"></div>

          {/* Étapes */}
          <div className="space-y-8">
            {stages.map((stage, index) => {
              const isExpanded = expandedStages.includes(stage.id);
              const status = getStageStatus(stage);
              const isLeft = index % 2 === 0;

              return (
                <div
                  key={stage.id}
                  className={`relative flex items-center ${
                    isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-row`}
                >
                  {/* Point sur la timeline */}
                  <div className="absolute left-8 md:left-1/2 -ml-3 md:-ml-4 z-10">
                    <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-4 border-background flex items-center justify-center ${
                      stage.type === 'start' ? 'bg-green-600' :
                      stage.type === 'end' ? 'bg-amber-600' :
                      status === 'completed' ? 'bg-primary' :
                      status === 'current' ? 'bg-primary animate-pulse' :
                      'bg-muted'
                    }`}>
                      {stage.type === 'start' ? (
                        <Flag className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      ) : stage.type === 'end' ? (
                        <Flag className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      ) : null}
                    </div>
                  </div>

                  {/* Carte de l'étape */}
                  <div className={`w-full md:w-[calc(50%-3rem)] ml-20 md:ml-0 ${
                    isLeft ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'
                  }`}>
                    <Card 
                      className={`p-4 md:p-6 cursor-pointer transition-all hover:shadow-lg ${
                        status === 'current' ? 'border-primary border-2' : 'border-border'
                      }`}
                      onClick={() => toggleStage(stage.id)}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              variant={stage.type === 'start' || stage.type === 'end' ? 'default' : 'outline'}
                              className={stage.type === 'start' || stage.type === 'end' ? 'bg-primary' : ''}
                            >
                              {stage.country}
                            </Badge>
                            {status === 'current' && (
                              <Badge className="bg-green-600">En cours</Badge>
                            )}
                          </div>
                          <h3 className="font-bold text-foreground text-lg">{stage.name}</h3>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        )}
                      </div>

                      {/* Infos rapides */}
                      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{stage.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{stage.distance} km</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-muted-foreground text-sm mb-3">{stage.description}</p>

                      {/* Détails expandables */}
                      {isExpanded && (
                        <div className="pt-3 border-t border-border space-y-3">
                          {/* Dates */}
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-primary" />
                            <span className="text-foreground">
                              {stage.startDate} - {stage.endDate}
                            </span>
                          </div>

                          {/* Dénivelés */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2 text-sm">
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <span className="text-foreground">D+ {stage.elevationGain}m</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <TrendingDown className="w-4 h-4 text-red-600" />
                              <span className="text-foreground">D- {stage.elevationLoss}m</span>
                            </div>
                          </div>

                          {/* Points d'intérêt */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Mountain className="w-4 h-4 text-primary" />
                              <span className="text-sm font-medium text-foreground">Points d'intérêt</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {stage.highlights.map((highlight, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">
                                  {highlight}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
