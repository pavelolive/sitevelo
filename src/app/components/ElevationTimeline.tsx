import { useState } from 'react';
import { MapPin, Mountain, Calendar, Thermometer, Layers } from 'lucide-react';
import { journeyStages, type JourneyStage } from '../data/journeyStages';

export function ElevationTimeline() {
  const [selectedStage, setSelectedStage] = useState<JourneyStage | null>(journeyStages[0]);

  // Dimensions du graphique
  const width = 1200;
  const height = 300;
  const padding = { top: 40, right: 40, bottom: 60, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Échelles
  const maxDistance = Math.max(...journeyStages.map(s => s.distance));
  const maxElevation = Math.max(...journeyStages.map(s => s.elevation));
  const minElevation = Math.min(...journeyStages.map(s => s.elevation));

  const scaleX = (distance: number) => (distance / maxDistance) * chartWidth;
  const scaleY = (elevation: number) => 
    chartHeight - ((elevation - minElevation) / (maxElevation - minElevation)) * chartHeight;

  // Créer le chemin SVG pour le profil d'élévation
  const elevationPath = journeyStages.reduce((path, stage, index) => {
    const x = scaleX(stage.distance);
    const y = scaleY(stage.elevation);
    
    if (index === 0) {
      return `M ${x} ${y}`;
    }
    return `${path} L ${x} ${y}`;
  }, '');

  // Créer le chemin de remplissage (aire sous la courbe)
  const fillPath = `${elevationPath} L ${scaleX(maxDistance)} ${chartHeight} L 0 ${chartHeight} Z`;

  return (
    <div className="w-full bg-background py-16 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Titre */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full border border-accent/30">
            <Mountain className="w-4 h-4" />
            <span className="text-sm">Profil d'élévation</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Le tracé en détail
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Cliquez sur un point pour découvrir les détails de chaque étape
          </p>
        </div>

        {/* Timeline avec profil d'élévation */}
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-lg overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto"
            style={{ minWidth: '800px' }}
          >
            {/* Grille horizontale */}
            {[0, 500, 1000, 1500, 2000].map((elevation) => {
              const y = scaleY(elevation);
              return (
                <g key={elevation}>
                  <line
                    x1={padding.left}
                    y1={padding.top + y}
                    x2={padding.left + chartWidth}
                    y2={padding.top + y}
                    stroke="hsl(var(--border))"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    opacity="0.3"
                  />
                  <text
                    x={padding.left - 10}
                    y={padding.top + y + 4}
                    textAnchor="end"
                    fill="hsl(var(--muted-foreground))"
                    fontSize="11"
                  >
                    {elevation}m
                  </text>
                </g>
              );
            })}

            {/* Aire sous la courbe (gradient) */}
            <defs>
              <linearGradient id="elevationGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            <g transform={`translate(${padding.left}, ${padding.top})`}>
              {/* Remplissage */}
              <path
                d={fillPath}
                fill="url(#elevationGradient)"
              />

              {/* Ligne du profil */}
              <path
                d={elevationPath}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Points interactifs pour chaque étape */}
              {journeyStages.map((stage) => {
                const x = scaleX(stage.distance);
                const y = scaleY(stage.elevation);
                const isSelected = selectedStage?.id === stage.id;

                return (
                  <g
                    key={stage.id}
                    transform={`translate(${x}, ${y})`}
                    onClick={() => setSelectedStage(stage)}
                    className="cursor-pointer transition-all duration-200"
                    style={{ transform: isSelected ? 'scale(1.2)' : 'scale(1)' }}
                  >
                    {/* Cercle extérieur (halo) */}
                    <circle
                      r={isSelected ? 12 : 8}
                      fill="hsl(var(--background))"
                      stroke="hsl(var(--primary))"
                      strokeWidth={isSelected ? 3 : 2}
                      className="transition-all duration-200"
                    />
                    
                    {/* Cercle intérieur */}
                    <circle
                      r={isSelected ? 6 : 4}
                      fill="hsl(var(--primary))"
                      className="transition-all duration-200"
                    />

                    {/* Label du nom au-dessus si sélectionné ou étape importante */}
                    {(isSelected || stage.id % 3 === 1) && (
                      <text
                        y={-20}
                        textAnchor="middle"
                        fill="hsl(var(--foreground))"
                        fontSize={isSelected ? "13" : "11"}
                        fontWeight={isSelected ? "600" : "500"}
                        className="pointer-events-none"
                      >
                        {stage.name}
                      </text>
                    )}

                    {/* Distance en km en dessous */}
                    {(isSelected || stage.id % 4 === 1) && (
                      <text
                        y={25}
                        textAnchor="middle"
                        fill="hsl(var(--muted-foreground))"
                        fontSize="10"
                        className="pointer-events-none"
                      >
                        {stage.distance} km
                      </text>
                    )}
                  </g>
                );
              })}
            </g>

            {/* Axe X */}
            <line
              x1={padding.left}
              y1={padding.top + chartHeight}
              x2={padding.left + chartWidth}
              y2={padding.top + chartHeight}
              stroke="hsl(var(--border))"
              strokeWidth="2"
            />

            {/* Axe Y */}
            <line
              x1={padding.left}
              y1={padding.top}
              x2={padding.left}
              y2={padding.top + chartHeight}
              stroke="hsl(var(--border))"
              strokeWidth="2"
            />

            {/* Label de l'axe X */}
            <text
              x={padding.left + chartWidth / 2}
              y={height - 10}
              textAnchor="middle"
              fill="hsl(var(--muted-foreground))"
              fontSize="12"
              fontWeight="500"
            >
              Distance (km)
            </text>

            {/* Label de l'axe Y */}
            <text
              x={20}
              y={padding.top + chartHeight / 2}
              textAnchor="middle"
              fill="hsl(var(--muted-foreground))"
              fontSize="12"
              fontWeight="500"
              transform={`rotate(-90, 20, ${padding.top + chartHeight / 2})`}
            >
              Altitude (m)
            </text>
          </svg>
        </div>

        {/* Détails de l'étape sélectionnée */}
        {selectedStage && (
          <div className="bg-gradient-to-br from-accent/10 via-muted/30 to-primary/5 border border-border rounded-2xl p-6 md:p-8 shadow-lg">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Informations principales */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {selectedStage.name}
                    </h3>
                    <p className="text-muted-foreground">{selectedStage.country}</p>
                  </div>
                </div>

                <p className="text-foreground leading-relaxed">
                  {selectedStage.description}
                </p>

                {/* Stats en grille */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-card border border-border rounded-lg p-3">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs">Date</span>
                    </div>
                    <p className="font-semibold text-foreground">{selectedStage.date}</p>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-3">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Mountain className="w-4 h-4" />
                      <span className="text-xs">Altitude</span>
                    </div>
                    <p className="font-semibold text-foreground">{selectedStage.elevation} m</p>
                  </div>

                  {selectedStage.temperature && (
                    <div className="bg-card border border-border rounded-lg p-3">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Thermometer className="w-4 h-4" />
                        <span className="text-xs">Température</span>
                      </div>
                      <p className="font-semibold text-foreground">{selectedStage.temperature}</p>
                    </div>
                  )}

                  {selectedStage.terrain && (
                    <div className="bg-card border border-border rounded-lg p-3">
                      <div className="flex items-center gap-2 text-muted-foreground mb-1">
                        <Layers className="w-4 h-4" />
                        <span className="text-xs">Terrain</span>
                      </div>
                      <p className="font-semibold text-foreground">{selectedStage.terrain}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Points forts */}
              <div className="space-y-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <div className="w-1 h-6 bg-accent rounded-full"></div>
                  Points forts
                </h4>
                <ul className="space-y-3">
                  {selectedStage.highlights.map((highlight, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 bg-card/50 border border-border/50 rounded-lg p-3"
                    >
                      <div className="bg-accent/20 text-accent-foreground rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold">{index + 1}</span>
                      </div>
                      <span className="text-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>

                {/* Progression */}
                <div className="bg-card border border-border rounded-lg p-4 mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Progression du voyage</span>
                    <span className="text-sm font-semibold text-primary">
                      {((selectedStage.distance / 6780) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-all duration-500"
                      style={{ width: `${(selectedStage.distance / 6780) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {selectedStage.distance} km parcourus sur 6 780 km
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Légende */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-4 h-1 bg-primary rounded"></div>
            <span>Profil d'élévation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-primary bg-background"></div>
            <span>Étape du voyage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary"></div>
            <span>Étape sélectionnée</span>
          </div>
        </div>
      </div>
    </div>
  );
}