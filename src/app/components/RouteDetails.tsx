import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { RideWidget } from './RideWidget';
import {
  ArrowLeft,
  Calendar,
  TrendingUp,
  MapPin,
  Users,
  Search,
  Info,
  Activity,
  CheckCircle2,
  Circle,
  PlayCircle,
  X,
} from 'lucide-react';

interface RouteDetailsProps {
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
    elevationGain: 1100,
    elevationLoss: 1150,
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
    elevationGain: 2300,
    elevationLoss: 2250,
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
    elevationGain: 3500,
    elevationLoss: 3450,
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
    elevationGain: 4200,
    elevationLoss: 4100,
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
    elevationGain: 2900,
    elevationLoss: 3000,
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
    elevationGain: 2400,
    elevationLoss: 2300,
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
    elevationGain: 4800,
    elevationLoss: 4600,
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
    elevationGain: 2700,
    elevationLoss: 2900,
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
    elevationGain: 850,
    elevationLoss: 950,
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
    elevationGain: 1350,
    elevationLoss: 1250,
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
    elevationGain: 1900,
    elevationLoss: 1980,
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
    elevationGain: 2560,
    elevationLoss: 2510,
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
    elevationGain: 4680,
    elevationLoss: 4630,
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
    elevationGain: 10920,
    elevationLoss: 10800,
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
    elevationGain: 7280,
    elevationLoss: 7180,
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
    elevationGain: 9100,
    elevationLoss: 9050,
    description: 'Dernière étape vers le point le plus septentrional d\'Europe',
    highlights: ['Narvik', 'Tromsø', 'Nordkapp'],
    type: 'end',
  },
];

const countries = [...new Set(stages.map(s => s.country))];

export function RouteDetails({ onBack }: RouteDetailsProps) {
  const [viewMode, setViewMode] = useState<'period' | 'all'>('all');
  const [searchStartDate, setSearchStartDate] = useState('');
  const [filterCountry, setFilterCountry] = useState<string>('');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [activeFilterCountry, setActiveFilterCountry] = useState<string>('all');
  const [activeFilterDifficulty, setActiveFilterDifficulty] = useState<string>('all');
  const [activeFilterStatus, setActiveFilterStatus] = useState<string>('all');

  // Calculer le niveau de difficulté pour une étape
  const getStageDifficulty = (stage: Stage): 'Facile' | 'Modéré' | 'Difficile' | 'Extrême' => {
    const difficultyScore = (stage.elevationGain / stage.distance) * 100;
    if (difficultyScore < 5) return 'Facile';
    if (difficultyScore < 8) return 'Modéré';
    if (difficultyScore < 12) return 'Difficile';
    return 'Extrême';
  };

  // Déterminer le statut d'une étape (passée, en cours, à venir)
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

  // Filtrer les étapes selon le mode
  const getDisplayedStages = () => {
    if (viewMode === 'period' && searchStartDate) {
      // Filtrer par date
      const searchDate = new Date(searchStartDate);
      return stages.filter(stage => {
        const stageStart = new Date(stage.startDate);
        const stageEnd = new Date(stage.endDate);
        return searchDate >= stageStart && searchDate <= stageEnd;
      });
    } else if (viewMode === 'all' && isSearchActive) {
      // Filtrer par pays et difficulté (seulement si recherche active)
      return stages.filter(stage => {
        const matchesCountry = activeFilterCountry === 'all' || stage.country === activeFilterCountry;
        const matchesDifficulty = activeFilterDifficulty === 'all' || getStageDifficulty(stage) === activeFilterDifficulty;
        const matchesStatus = activeFilterStatus === 'all' || getStageStatus(stage) === activeFilterStatus;
        return matchesCountry && matchesDifficulty && matchesStatus;
      });
    }
    return [];
  };

  const displayedStages = getDisplayedStages();

  const handleSearch = () => {
    // Appliquer les filtres sélectionnés
    setActiveFilterCountry(filterCountry || 'all');
    setActiveFilterDifficulty(filterDifficulty || 'all');
    setActiveFilterStatus(filterStatus || 'all');
    setIsSearchActive(true);
  };

  const resetFilters = () => {
    setSearchStartDate('');
    setFilterCountry('');
    setFilterDifficulty('');
    setFilterStatus('');
    setActiveFilterCountry('all');
    setActiveFilterDifficulty('all');
    setActiveFilterStatus('all');
    setIsSearchActive(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onBack}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Découvrir le tracé</h1>
          <div className="w-20" /> {/* Spacer pour centrer le titre */}
        </div>
      </div>



      {/* Section 2 : Widget GPS et statistiques */}
      <div className="bg-muted">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Widget GPS */}
          <div className="w-full">
            <RideWidget />
          </div>
        </div>
      </div>
    </div>
  );
}