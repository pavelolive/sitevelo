import { MapPin, Flag } from "lucide-react";
import mapImage from './../../assets/5f6ce42b8aa7b51c91104c655149b601ecb88cc3.png';

export function RouteMap() {
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Carte de l'Europe style minimaliste */}
      <svg
        viewBox="0 0 600 800"
        className="w-full h-auto drop-shadow-lg rounded-2xl overflow-hidden"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Fond - beige/crème pour s'harmoniser avec la carte */}
        <rect width="600" height="800" fill="#e8e5db" rx="24" />
        
        {/* Image vectorielle de l'Europe en fond - ajustée pour aligner Gibraltar et Cap Nord */}
        <image
          href={mapImage}
          x="0"
          y="0"
          width="600"
          height="800"
          opacity="1"
          preserveAspectRatio="xMidYMid slice"
        />
        
        {/* Tracé du voyage Gibraltar → Cap Nord */}
        <defs>
          {/* Gradient vert pour le tracé - cohérent avec la DA du site */}
          <linearGradient id="routeGradient" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" style={{stopColor: '#4a6741', stopOpacity: 1}} />
            <stop offset="50%" style={{stopColor: '#5d7c52', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: '#73956a', stopOpacity: 1}} />
          </linearGradient>
          
          {/* Effet glow pour le tracé */}
          <filter id="glowRoute">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Ligne du tracé principal */}
        <path
          d="M 75 670 
             L 85 665
             L 100 655
             L 120 640
             L 145 620
             L 170 600
             L 190 580
             L 205 565
             L 220 540
             L 235 515
             L 255 495
             L 275 480
             L 290 470
             L 300 450
             L 305 420
             L 310 390
             L 312 360
             L 314 330
             L 316 300
             L 318 270
             L 320 240
             L 325 210
             L 332 180
             L 342 150
             L 354 120
             L 367 90
             L 375 70
             L 381 45"
          fill="none"
          stroke="url(#routeGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glowRoute)"
        />
        
        {/* Points de passage intermédiaires - vert */}
        <g>
          {/* Lyon */}
          <circle cx="190" cy="580" r="5" fill="#4a6741" opacity="0.9" />
          
          {/* Strasbourg */}
          <circle cx="220" cy="540" r="5" fill="#5d7c52" opacity="0.9" />
          
          {/* Berlin */}
          <circle cx="290" cy="470" r="5" fill="#5d7c52" opacity="0.9" />
          
          {/* Danemark */}
          <circle cx="305" cy="420" r="5" fill="#73956a" opacity="0.9" />
          
          {/* Côte ouest Norvège - Sud */}
          <circle cx="310" cy="360" r="5" fill="#73956a" opacity="0.9" />
          
          {/* Côte ouest Norvège - Milieu */}
          <circle cx="318" cy="270" r="5" fill="#73956a" opacity="0.9" />
          
          {/* Côte ouest Norvège - Nord */}
          <circle cx="342" cy="150" r="5" fill="#73956a" opacity="0.9" />
        </g>
        
        {/* Point de départ - Gibraltar (vert foncé) */}
        <g>
          <circle cx="75" cy="670" r="14" fill="#4a6741" opacity="0.2" />
          <circle cx="75" cy="670" r="10" fill="#4a6741" />
          <circle cx="75" cy="670" r="5" fill="#ffffff" />
        </g>
        
        {/* Point d'arrivée - Cap Nord (vert clair) */}
        <g>
          <circle cx="381" cy="45" r="14" fill="#73956a" opacity="0.2" />
          <circle cx="381" cy="45" r="10" fill="#73956a" />
          <circle cx="381" cy="45" r="5" fill="#ffffff" />
        </g>
        
        {/* Labels des pays (optionnel, discret) */}
        <g fill="#8b7355" opacity="0.4" fontSize="10" fontFamily="sans-serif">
          <text x="100" y="655" textAnchor="middle">Espagne</text>
          <text x="180" y="595" textAnchor="middle">Lyon</text>
          <text x="235" y="530" textAnchor="middle">Strasbourg</text>
          <text x="290" y="485" textAnchor="middle">Berlin</text>
          <text x="315" y="435" textAnchor="middle">Danemark</text>
          <text x="325" y="320" textAnchor="middle">Norvège</text>
        </g>
      </svg>

      {/* Légende Gibraltar - style sobre */}
      <div className="absolute bottom-[15%] left-[5%] bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary/30 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#4a6741]"></div>
          <span className="text-sm text-foreground font-medium">
            Gibraltar
          </span>
        </div>
      </div>

      {/* Légende Cap Nord - style sobre */}
      <div className="absolute top-[3%] right-[28%] bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg border border-primary/20 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#73956a]"></div>
          <span className="text-sm text-foreground font-medium">
            Cap Nord
          </span>
        </div>
      </div>
    </div>
  );
}