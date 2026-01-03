export interface JourneyStage {
  id: number;
  name: string;
  country: string;
  distance: number; // Distance cumulative en km
  elevation: number; // Altitude en mètres
  date: string;
  description: string;
  highlights: string[];
  temperature?: string;
  terrain?: string;
}

export const journeyStages: JourneyStage[] = [
  {
    id: 1,
    name: "Gibraltar",
    country: "Gibraltar",
    distance: 0,
    elevation: 5,
    date: "1er Avril 2025",
    description: "Départ de notre aventure depuis le rocher de Gibraltar, à la pointe sud de l'Europe.",
    highlights: [
      "Vue sur le détroit de Gibraltar",
      "Dernière vue sur l'Afrique",
      "Début de l'aventure européenne"
    ],
    temperature: "18°C",
    terrain: "Côtier"
  },
  {
    id: 2,
    name: "Séville",
    country: "Espagne",
    distance: 280,
    elevation: 12,
    date: "5 Avril 2025",
    description: "Traversée des plaines andalouses jusqu'à la magnifique Séville.",
    highlights: [
      "La Giralda et la cathédrale",
      "Quartier de Triana",
      "Tapas et flamenco"
    ],
    temperature: "22°C",
    terrain: "Plat"
  },
  {
    id: 3,
    name: "Madrid",
    country: "Espagne",
    distance: 780,
    elevation: 667,
    date: "18 Avril 2025",
    description: "Montée progressive vers la capitale espagnole sur le plateau castillan.",
    highlights: [
      "Musée du Prado",
      "Plaza Mayor",
      "Gastronomie madrilène"
    ],
    temperature: "16°C",
    terrain: "Plateau"
  },
  {
    id: 4,
    name: "Pyrénées",
    country: "France",
    distance: 1350,
    elevation: 1850,
    date: "5 Mai 2025",
    description: "Premier grand défi : la traversée des Pyrénées par les cols mythiques.",
    highlights: [
      "Col du Tourmalet",
      "Paysages montagneux",
      "Première neige"
    ],
    temperature: "8°C",
    terrain: "Montagne"
  },
  {
    id: 5,
    name: "Bordeaux",
    country: "France",
    distance: 1680,
    elevation: 8,
    date: "12 Mai 2025",
    description: "Descente vers l'Atlantique et les vignobles bordelais.",
    highlights: [
      "Miroir d'eau",
      "Dégustation de vins",
      "Architecture classique"
    ],
    temperature: "19°C",
    terrain: "Plat"
  },
  {
    id: 6,
    name: "Paris",
    country: "France",
    distance: 2250,
    elevation: 35,
    date: "28 Mai 2025",
    description: "Remontée vers la capitale française le long de la Loire.",
    highlights: [
      "Tour Eiffel",
      "Châteaux de la Loire",
      "Seine à vélo"
    ],
    temperature: "20°C",
    terrain: "Vallonné"
  },
  {
    id: 7,
    name: "Bruxelles",
    country: "Belgique",
    distance: 2570,
    elevation: 58,
    date: "3 Juin 2025",
    description: "Direction le nord vers la capitale belge.",
    highlights: [
      "Grand-Place",
      "Atomium",
      "Bières et chocolats"
    ],
    temperature: "17°C",
    terrain: "Plat"
  },
  {
    id: 8,
    name: "Amsterdam",
    country: "Pays-Bas",
    distance: 2750,
    elevation: -2,
    date: "7 Juin 2025",
    description: "Les terres sous le niveau de la mer et les canaux hollandais.",
    highlights: [
      "Canaux historiques",
      "Musée Van Gogh",
      "Tulipes et moulins"
    ],
    temperature: "18°C",
    terrain: "Plat"
  },
  {
    id: 9,
    name: "Hambourg",
    country: "Allemagne",
    distance: 3180,
    elevation: 6,
    date: "14 Juin 2025",
    description: "Entrée en Allemagne par la côte de la mer du Nord.",
    highlights: [
      "Port historique",
      "Speicherstadt",
      "Architecture hanséatique"
    ],
    temperature: "16°C",
    terrain: "Plat"
  },
  {
    id: 10,
    name: "Copenhague",
    country: "Danemark",
    distance: 3540,
    elevation: 10,
    date: "21 Juin 2025",
    description: "Passage au Danemark, pays du vélo par excellence.",
    highlights: [
      "Nyhavn",
      "Infrastructure cyclable parfaite",
      "Design scandinave"
    ],
    temperature: "19°C",
    terrain: "Plat"
  },
  {
    id: 11,
    name: "Göteborg",
    country: "Suède",
    distance: 3870,
    elevation: 12,
    date: "27 Juin 2025",
    description: "Entrée en Suède par la côte ouest.",
    highlights: [
      "Archipel suédois",
      "Fruits de mer",
      "Première nuit blanche"
    ],
    temperature: "17°C",
    terrain: "Côtier"
  },
  {
    id: 12,
    name: "Oslo",
    country: "Norvège",
    distance: 4320,
    elevation: 23,
    date: "5 Juillet 2025",
    description: "Capitale norvégienne au fond du fjord d'Oslo.",
    highlights: [
      "Musée des navires vikings",
      "Opéra moderne",
      "Début des fjords"
    ],
    temperature: "20°C",
    terrain: "Vallonné"
  },
  {
    id: 13,
    name: "Trondheim",
    country: "Norvège",
    distance: 4980,
    elevation: 8,
    date: "18 Juillet 2025",
    description: "Remontée vers le nord de la Norvège.",
    highlights: [
      "Cathédrale de Nidaros",
      "Maisons colorées",
      "Cercle polaire proche"
    ],
    temperature: "16°C",
    terrain: "Côtier"
  },
  {
    id: 14,
    name: "Cercle Polaire",
    country: "Norvège",
    distance: 5480,
    elevation: 120,
    date: "28 Juillet 2025",
    description: "Franchissement du cercle polaire arctique !",
    highlights: [
      "Monument du cercle polaire",
      "Soleil de minuit",
      "Paysages arctiques"
    ],
    temperature: "12°C",
    terrain: "Montagneux"
  },
  {
    id: 15,
    name: "Tromsø",
    country: "Norvège",
    distance: 5980,
    elevation: 15,
    date: "8 Août 2025",
    description: "La Paris du Nord, au cœur de l'Arctique.",
    highlights: [
      "Aurores boréales potentielles",
      "Cathédrale arctique",
      "Nature sauvage"
    ],
    temperature: "11°C",
    terrain: "Fjords"
  },
  {
    id: 16,
    name: "Nordkapp",
    country: "Norvège",
    distance: 6780,
    elevation: 307,
    date: "1er Septembre 2025",
    description: "Arrivée finale au Cap Nord, point culminant de notre aventure !",
    highlights: [
      "Falaise de 307m",
      "Monument du globe",
      "Fin de l'aventure européenne"
    ],
    temperature: "8°C",
    terrain: "Montagne côtière"
  }
];
