import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import mapImage from './../../assets/5f6ce42b8aa7b51c91104c655149b601ecb88cc3.png';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Mountain,
  TrendingUp,
  TrendingDown,
  MapPin,
  Flag,
  Users,
  Search,
  Info,
  X,
} from 'lucide-react';

interface RouteDetailsV3Props {
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

const countries = [...new Set(stages.map(s => s.country))];

export function RouteDetailsV3({ onBack }: RouteDetailsV3Props) {
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [cartouchePosition, setCartouchePosition] = useState<{ x: number; y: number } | null>(null);
  const [searchMode, setSearchMode] = useState<'period' | 'country'>('period');
  const [searchStartDate, setSearchStartDate] = useState('');
  const [searchDuration, setSearchDuration] = useState('');
  const [searchCountry, setSearchCountry] = useState('');
  const [searchResults, setSearchResults] = useState<Stage[]>([]);

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

  const handleStageClick = (stageId: number, x: number, y: number) => {
    if (selectedStage === stageId) {
      setSelectedStage(null);
      setCartouchePosition(null);
    } else {
      setSelectedStage(stageId);
      setCartouchePosition({ x, y });
    }
  };

  const handleSearch = () => {
    if (searchMode === 'country' && searchCountry) {
      const results = stages.filter(s => s.country === searchCountry);
      setSearchResults(results);
    } else {
      // Simple simulation pour la recherche par période
      setSearchResults(stages.slice(0, 3));
    }
  };

  const resetSearch = () => {
    setSearchStartDate('');
    setSearchDuration('');
    setSearchCountry('');
    setSearchResults([]);
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
          <h1 className="text-2xl font-bold text-foreground">Carte Interactive</h1>
          <div className="w-20" /> {/* Spacer pour centrer le titre */}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Module de recherche Airbnb-style */}
        <Card className="mb-16 p-6 shadow-xl border-2 border-primary/20">
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
                <Users className="w-6 h-6 text-primary" />
                Suivre notre aventure
              </h2>
              <p className="text-muted-foreground">
                Envie de suivre notre progression ? Sélectionnez une période ou un pays pour découvrir les étapes de notre voyage
              </p>
            </div>

            {/* Toggle mode de recherche */}
            <div className="flex justify-center">
              <Tabs value={searchMode} onValueChange={(v) => setSearchMode(v as 'period' | 'country')} className="w-auto">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="period" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    Par période
                  </TabsTrigger>
                  <TabsTrigger value="country" className="gap-2">
                    <MapPin className="w-4 h-4" />
                    Par pays
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Formulaire de recherche */}
            <div className="bg-muted/30 rounded-lg p-6">
              {searchMode === 'period' ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Date de début</label>
                    <Input
                      type="date"
                      value={searchStartDate}
                      onChange={(e) => setSearchStartDate(e.target.value)}
                      className="bg-background"
                      min="2025-05-01"
                      max="2025-10-20"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleSearch}
                      className="w-full bg-primary hover:bg-primary/90 gap-2"
                    >
                      <Search className="w-4 h-4" />
                      Rechercher
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Pays</label>
                    <Select value={searchCountry} onValueChange={setSearchCountry}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Choisir un pays" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      onClick={handleSearch}
                      className="w-full bg-primary hover:bg-primary/90 gap-2"
                    >
                      <Search className="w-4 h-4" />
                      Voir les périodes
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Résultats de recherche */}
            {searchResults.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">
                    {searchResults.length} étape{searchResults.length > 1 ? 's' : ''} disponible{searchResults.length > 1 ? 's' : ''}
                  </h3>
                  <Button variant="ghost" size="sm" onClick={resetSearch}>
                    Réinitialiser
                  </Button>
                </div>
                
                {/* Disclaimer sur les dates */}
                <Alert className="bg-amber-50 border-amber-200">
                  <Info className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    Les dates indiquées sont prévisionnelles et peuvent évoluer selon les aléas du voyage (météo, fatigue, opportunités de rencontres, etc.)
                  </AlertDescription>
                </Alert>
                
                <div className="grid md:grid-cols-3 gap-4">
                  {searchResults.map(stage => (
                    <Card key={stage.id} className="p-4 hover:shadow-lg transition-shadow border-primary/20">
                      <div className="space-y-3">
                        <div>
                          <Badge variant="outline" className="mb-2">{stage.country}</Badge>
                          <h4 className="font-semibold text-foreground">{stage.name}</h4>
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {stage.startDate} - {stage.endDate}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {stage.duration}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Timeline verticale */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">Les 16 étapes du voyage</h2>
            <p className="text-xl font-semibold text-primary">
              6 mois • 6 pays • 6 780 km • 48 450 m D+
            </p>
            <p className="text-sm text-muted-foreground/70 italic">
              Cliquez sur un point pour voir les détails de l'étape
            </p>
          </div>

          {/* Layout carte + détails */}
          <div className="relative h-[calc(100vh-16rem)]">
            {/* Carte interactive */}
            <div className="w-full h-full flex items-center justify-center">
              <svg
                viewBox="0 0 800 600"
                className="max-w-full max-h-full drop-shadow-lg rounded-2xl"
                xmlns="http://www.w3.org/2000/svg"
                style={{ height: '100%', width: 'auto' }}
              >
                {/* Fond */}
                <rect width="800" height="600" fill="#e8e5db" rx="24" />
                
                {/* Image de l'Europe en fond - rognée pour plus de largeur */}
                <image
                  href={mapImage}
                  x="-50"
                  y="-50"
                  width="900"
                  height="700"
                  opacity="1"
                  preserveAspectRatio="xMidYMid slice"
                />
                
                {/* Définitions pour les styles */}
                <defs>
                  <linearGradient id="routeGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" style={{stopColor: '#4a6741', stopOpacity: 0.8}} />
                    <stop offset="50%" style={{stopColor: '#5d7c52', stopOpacity: 0.8}} />
                    <stop offset="100%" style={{stopColor: '#73956a', stopOpacity: 0.8}} />
                  </linearGradient>
                  
                  <linearGradient id="routeGradientHighlight" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" style={{stopColor: '#4a6741', stopOpacity: 1}} />
                    <stop offset="50%" style={{stopColor: '#5d7c52', stopOpacity: 1}} />
                    <stop offset="100%" style={{stopColor: '#73956a', stopOpacity: 1}} />
                  </linearGradient>
                  
                  <filter id="glowRoute">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Tracé complet du voyage divisé en segments selon le statut */}
                {(() => {
                  const pathCoordinates = [
                    { x: 40, y: 560 },    // 1: Gibraltar - bas gauche
                    { x: 80, y: 520 },    // 2: Séville-Lisbonne
                    { x: 70, y: 480 },    // 3: Lisbonne-Porto
                    { x: 90, y: 440 },    // 4: Porto-Santiago
                    { x: 140, y: 400 },   // 5: Santiago-Bordeaux
                    { x: 200, y: 340 },   // 6: Bordeaux-Paris
                    { x: 240, y: 300 },   // 7: Paris (Lyon)
                    { x: 300, y: 280 },   // 8: Strasbourg
                    { x: 330, y: 240 },   // 9: Cologne-Amsterdam
                    { x: 360, y: 200 },   // 10: Amsterdam-Hambourg
                    { x: 380, y: 160 },   // 11: Hambourg-Copenhague
                    { x: 390, y: 130 },   // 12: Copenhague-Göteborg
                    { x: 400, y: 100 },   // 13: Göteborg-Stockholm
                    { x: 405, y: 80 },    // 14: Stockholm-Trondheim
                    { x: 410, y: 70 },    // 15: Trondheim-Cercle Arctique
                    { x: 420, y: 60 },    // 16: Cercle Arctique-Cap Nord
                  ];
                  
                  return stages.map((stage, index) => {
                    const start = pathCoordinates[index];
                    const end = pathCoordinates[index + 1];
                    
                    if (!end) return null;
                    
                    const status = getStageStatus(stage);
                    
                    // Styles selon le statut
                    let strokeColor, strokeWidth, strokeDasharray, opacity;
                    if (status === 'completed') {
                      strokeColor = '#4a6741'; // Vert foncé
                      strokeWidth = '5';
                      strokeDasharray = 'none';
                      opacity = '1';
                    } else if (status === 'current') {
                      strokeColor = '#73956a'; // Vert vif
                      strokeWidth = '6';
                      strokeDasharray = 'none';
                      opacity = '1';
                    } else { // upcoming
                      strokeColor = '#9ca3af'; // Gris
                      strokeWidth = '3';
                      strokeDasharray = '8,4';
                      opacity = '0.5';
                    }
                    
                    return (
                      <line
                        key={`segment-${index}`}
                        x1={start.x}
                        y1={start.y}
                        x2={end.x}
                        y2={end.y}
                        stroke={strokeColor}
                        strokeWidth={strokeWidth}
                        strokeDasharray={strokeDasharray}
                        strokeLinecap="round"
                        opacity={opacity}
                        className={status === 'current' ? 'animate-pulse' : ''}
                      />
                    );
                  });
                })()}
                
                {/* Points cliquables pour chaque étape */}
                {[
                  { id: 1, x: 40, y: 560, type: 'start' },
                  { id: 2, x: 80, y: 520, type: 'stage' },
                  { id: 3, x: 70, y: 480, type: 'stage' },
                  { id: 4, x: 90, y: 440, type: 'stage' },
                  { id: 5, x: 140, y: 400, type: 'stage' },
                  { id: 6, x: 200, y: 340, type: 'stage' },
                  { id: 7, x: 240, y: 300, type: 'stage' },
                  { id: 8, x: 300, y: 280, type: 'stage' },
                  { id: 9, x: 330, y: 240, type: 'stage' },
                  { id: 10, x: 360, y: 200, type: 'stage' },
                  { id: 11, x: 380, y: 160, type: 'stage' },
                  { id: 12, x: 390, y: 130, type: 'stage' },
                  { id: 13, x: 400, y: 100, type: 'stage' },
                  { id: 14, x: 405, y: 80, type: 'stage' },
                  { id: 15, x: 410, y: 70, type: 'stage' },
                  { id: 16, x: 420, y: 60, type: 'end' },
                ].map((point) => {
                  const isSelected = selectedStage === point.id;
                  const isInSearchResults = searchResults.some(stage => stage.id === point.id);
                  const color = point.type === 'start' ? '#4a6741' : point.type === 'end' ? '#73956a' : '#5d7c52';
                  const highlightColor = '#f59e0b'; // Couleur ambre pour les résultats de recherche
                  
                  return (
                    <g key={point.id} onClick={() => handleStageClick(point.id, point.x, point.y)} className="cursor-pointer">
                      {/* Cercle extérieur animé si dans les résultats de recherche */}
                      {isInSearchResults && !isSelected && (
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="18"
                          fill={highlightColor}
                          opacity="0.4"
                          className="animate-pulse"
                        />
                      )}
                      
                      {/* Cercle extérieur animé si sélectionné */}
                      {isSelected && (
                        <circle
                          cx={point.x}
                          cy={point.y}
                          r="16"
                          fill={color}
                          opacity="0.3"
                          className="animate-pulse"
                        />
                      )}
                      
                      {/* Point principal */}
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r={isSelected ? "12" : isInSearchResults ? "10" : "8"}
                        fill={isInSearchResults && !isSelected ? highlightColor : color}
                        stroke="white"
                        strokeWidth={isInSearchResults ? "3" : "2"}
                        className={`transition-all duration-300 hover:scale-125 ${isInSearchResults ? 'animate-pulse' : ''}`}
                      />
                      
                      {/* Numéro de l'étape */}
                      {point.type === 'stage' && (
                        <text
                          x={point.x}
                          y={point.y}
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill="white"
                          fontSize={isInSearchResults ? "9" : "8"}
                          fontWeight="bold"
                        >
                          {point.id}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Panneau de détails en superposition - minimaliste */}
            {selectedStage && cartouchePosition && (() => {
              const stage = stages[selectedStage - 1];
              
              // Calculer la position du cartouche en fonction du clic
              // Convertir les coordonnées SVG (0-600, 0-800) en pourcentages
              const xPercent = (cartouchePosition.x / 600) * 100;
              const yPercent = (cartouchePosition.y / 800) * 100;
              
              // Déterminer si le cartouche doit être à gauche ou à droite
              const isRightSide = xPercent > 50;
              const isBottomHalf = yPercent > 50;
              
              // Calculer les positions
              const leftPosition = isRightSide ? 'auto' : `calc(${xPercent}% + 2rem)`;
              const rightPosition = isRightSide ? `calc(${100 - xPercent}% + 2rem)` : 'auto';
              const topPosition = isBottomHalf ? 'auto' : `calc(${yPercent}% + 2rem)`;
              const bottomPosition = isBottomHalf ? `calc(${100 - yPercent}% + 2rem)` : 'auto';
              
              return (
                <div 
                  className="absolute w-72 md:w-80 max-w-[calc(100%-4rem)] transition-all duration-300"
                  style={{
                    left: leftPosition,
                    right: rightPosition,
                    top: topPosition,
                    bottom: bottomPosition,
                  }}
                >
                  <Card className="backdrop-blur-xl bg-background/95 border-2 border-primary/30 shadow-2xl">
                    {/* Header compact */}
                    <div className="p-4 pb-3 border-b border-border/50">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <Badge variant="outline" className="mb-1.5">{stage.country}</Badge>
                          <h3 className="font-bold text-foreground leading-tight">
                            {stage.name}
                          </h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedStage(null)}
                          className="shrink-0 h-7 w-7 p-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Contenu compact */}
                    <div className="p-4 space-y-3">
                      {/* Stats en ligne compacte */}
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="bg-muted/50 rounded p-2">
                          <div className="font-bold text-primary text-sm">{stage.distance}</div>
                          <div className="text-[10px] text-muted-foreground">km</div>
                        </div>
                        <div className="bg-muted/50 rounded p-2">
                          <div className="font-bold text-foreground text-sm">{stage.duration}</div>
                          <div className="text-[10px] text-muted-foreground">durée</div>
                        </div>
                        <div className="bg-green-500/10 rounded p-2 border border-green-500/20">
                          <div className="font-bold text-green-700 text-sm">{(stage.elevationGain / 1000).toFixed(1)}k</div>
                          <div className="text-[10px] text-muted-foreground">D+</div>
                        </div>
                        <div className="bg-red-500/10 rounded p-2 border border-red-500/20">
                          <div className="font-bold text-red-700 text-sm">{(stage.elevationLoss / 1000).toFixed(1)}k</div>
                          <div className="text-[10px] text-muted-foreground">D-</div>
                        </div>
                      </div>

                      {/* Période compacte */}
                      <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{stage.startDate} - {stage.endDate}</span>
                      </div>

                      {/* Points d'intérêt compacts */}
                      <div className="flex flex-wrap gap-1.5">
                        {stage.highlights.slice(0, 3).map((highlight) => (
                          <Badge key={highlight} variant="secondary" className="text-xs px-2 py-0.5">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
