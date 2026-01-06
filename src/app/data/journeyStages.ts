export interface JourneyStage {
  id: number;
  name: string;
  country: string;
  distance: number; // Distance cumulative en km
  elevation: number;
  elevationGain: number;
  elevationLoss: number;// Altitude en mètres
  terrain: string;
  startCity: string;
  endCity: string;
  ferry: boolean;
  estimatedStartDate: string;
  estimatedEndDate: string;
}

export const journeyStages = [
  { id: 1,  name: "Tarifa - Malaga", country: "Espagne", distance: 276, elevation: 3824, elevationGain: 3824, elevationLoss: 3823, terrain: "Route",  startCity: "Tarifa", endCity: "Malaga", ferry: false, estimatedStartDate: "05/04/2026", estimatedEndDate: "09/04/2026"},
  { id: 2,  name: "Malaga - Almeria", country: "Espagne", distance: 245, elevation: 2512, elevationGain: 2512, elevationLoss: 2290, terrain: "Route",  startCity: "Malaga", endCity: "Almeria", ferry: false, estimatedStartDate: "09/04/2026", estimatedEndDate: "12/04/2026"},
  { id: 3,  name: "Almeria - Alcaraz", country: "Espagne", distance: 346, elevation: 7632, elevationGain: 7632, elevationLoss: 6934, terrain: "Gravel", startCity: "Almeria", endCity: "Alcaraz", ferry: false, estimatedStartDate: "12/04/2026", estimatedEndDate: "17/04/2026"},
  { id: 4,  name: "Alcaraz - Albacete", country: "Espagne", distance: 146, elevation: 2359, elevationGain: 2359, elevationLoss: 2603, terrain: "Route",  startCity: "Alcaraz", endCity: "Albacete", ferry: false, estimatedStartDate: "17/04/2026", estimatedEndDate: "19/04/2026"},
  { id: 5,  name: "Albacete - Zaragoza", country: "Espagne", distance: 606, elevation: 6377, elevationGain: 6377, elevationLoss: 6673, terrain: "Route",  startCity: "Albacete", endCity: "Zaragoza", ferry: false, estimatedStartDate: "19/04/2026", estimatedEndDate: "28/04/2026"},
  { id: 6,  name: "Zaragoza - Sena", country: "Espagne", distance: 97,  elevation: 1190, elevationGain: 1190, elevationLoss: 1013, terrain: "Gravel", startCity: "Zaragoza", endCity: "Sena", ferry: false, estimatedStartDate: "28/04/2026", estimatedEndDate: "30/04/2026" },
  { id: 7,  name: "Sena - Lleida", country: "Espagne", distance: 94,  elevation: 506,  elevationGain: 506,  elevationLoss: 919,  terrain: "Route",  startCity: "Sena", endCity: "Lleida", ferry: false, estimatedStartDate: "30/04/2026", estimatedEndDate: "01/05/2026"},
  { id: 8,  name: "Lleida - Barcelona", country: "Espagne", distance: 205, elevation: 2331, elevationGain: 2331, elevationLoss: 2475, terrain: "Route",  startCity: "Lleida", endCity: "Barcelona", ferry: false, estimatedStartDate: "01/05/2026", estimatedEndDate: "04/05/2026" },
  { id: 9,  name: "Barcelona - Le perthus", country: "Espagne", distance: 258, elevation: 1452, elevationGain: 1452, elevationLoss: 1134, terrain: "Route",  startCity: "Barcelona", endCity: "Le perthus", ferry: false, estimatedStartDate: "04/05/2026", estimatedEndDate: "08/05/2026"},

  { id: 10, name: "Le perthus - Avignon", country: "France", distance: 398, elevation: 592,  elevationGain: 592,  elevationLoss: 886,  terrain: "Route", startCity: "Le perthus", endCity: "Avignon", ferry: false, estimatedStartDate: "08/05/2026", estimatedEndDate: "14/05/2026"},
  { id: 11, name: "Avignon - Lyon", country: "France", distance: 291, elevation: 361,  elevationGain: 361,  elevationLoss: 222,  terrain: "Route", startCity: "Avignon", endCity: "Lyon", ferry: false, estimatedStartDate: "14/05/2026", estimatedEndDate: "18/05/2026"},
  { id: 12, name: "Lyon - Annecy", country: "France", distance: 222, elevation: 2140, elevationGain: 2140, elevationLoss: 1858, terrain: "Route", startCity: "Lyon", endCity: "Annecy", ferry: false, estimatedStartDate: "18/05/2026", estimatedEndDate: "21/05/2026" },
  { id: 13, name: "Annecy - Saint Julien en Genevois", country: "France", distance: 35, elevation: 720, elevationGain: 720, elevationLoss: 743, terrain: "Route", startCity: "Annecy", endCity: "Saint Julien en Genevois", ferry: false, estimatedStartDate: "21/05/2026", estimatedEndDate: "22/05/2026"},

  { id: 14, name: "Saint Julien en Genevois - Duillier", country: "Suisse", distance: 41, elevation: 315, elevationGain: 315, elevationLoss: 273, terrain: "Route", startCity: "Saint Julien en Genevois", endCity: "Duillier", ferry: false, estimatedStartDate: "22/05/2026", estimatedEndDate: "22/05/2026"},
  { id: 15, name: "Duillier - Creux", country: "Suisse", distance: 66, elevation: 1648, elevationGain: 1648, elevationLoss: 1237, terrain: "Gravel", startCity: "Duillier", endCity: "Creux", ferry: false, estimatedStartDate: "22/05/2026", estimatedEndDate: "23/05/2026"},

  { id: 16, name: "Creux - Montbéliard", country: "France", distance: 165, elevation: 3314, elevationGain: 3314, elevationLoss: 3675, terrain: "Gravel", startCity: "Creux", endCity: "Montbéliard", ferry: false, estimatedStartDate: "23/05/2026", estimatedEndDate: "26/05/2026" },
  { id: 17, name: "Montbéliard - Rhinau", country: "France", distance: 217, elevation: 690, elevationGain: 690, elevationLoss: 1037, terrain: "Route", startCity: "Montbéliard", endCity: "Rhinau", ferry: true,  estimatedStartDate: "26/05/2026", estimatedEndDate: "29/05/2026"},

  { id: 18, name: "Rhinau - Halsach im kinzigtal", country: "Allemagne", distance: 41, elevation: 350, elevationGain: 350, elevationLoss: 295, terrain: "Route", startCity: "Rhinau", endCity: "Halsach im kinzigtal", ferry: false, estimatedStartDate: "29/05/2026", estimatedEndDate: "30/05/2026" },
  { id: 19, name: "Halsach im kinzigtal - Neuenburg", country: "Allemagne", distance: 153, elevation: 3591, elevationGain: 3591, elevationLoss: 3308, terrain: "Gravel", startCity: "Halsach im kinzigtal", endCity: "Neuenburg", ferry: false, estimatedStartDate: "30/05/2026", estimatedEndDate: "01/06/2026"},
  { id: 20, name: "Neuenburg - Beuren", country: "Allemagne", distance: 92, elevation: 1054, elevationGain: 1054, elevationLoss: 1101, terrain: "Route", startCity: "Neuenburg", endCity: "Beuren", ferry: false, estimatedStartDate: "01/06/2026", estimatedEndDate: "02/06/2026"},
  { id: 21, name: "Beuren - Dresden", country: "Allemagne (Tchéquie)", distance: 679, elevation: 10147, elevationGain: 10147, elevationLoss: 10476, terrain: "Gravel", startCity: "Beuren", endCity: "Dresden", ferry: false, estimatedStartDate: "02/06/2026", estimatedEndDate: "12/06/2026" },
  { id: 22, name: "Dresden - Berlin", country: "Allemagne", distance: 343, elevation: 620, elevationGain: 620, elevationLoss: 712, terrain: "Route", startCity: "Dresden", endCity: "Berlin", ferry: false, estimatedStartDate: "12/06/2026", estimatedEndDate: "17/06/2026"},
  { id: 23, name: "Berlin - Rostock", country: "Allemagne", distance: 392, elevation: 693, elevationGain: 693, elevationLoss: 725, terrain: "Route", startCity: "Berlin", endCity: "Rostock", ferry: true,  estimatedStartDate: "17/06/2026", estimatedEndDate: "23/06/2026"},

  { id: 24, name: "Nykobing Falster - Helsingborg", country: "Danemark", distance: 306, elevation: 662, elevationGain: 662, elevationLoss: 665, terrain: "Route", startCity: "Nykobing Falster", endCity: "Helsingborg", ferry: true, estimatedStartDate: "23/06/2026", estimatedEndDate: "27/06/2026" },

  // Etape 25 regroupée (2 lignes) : 27/06 -> 07/07
  { id: 25, name: "Helsingborg - Halden", country: "Suede", distance: 637, elevation: 3019, elevationGain: 3019, elevationLoss: 3037, terrain: "Route", startCity: "Helsingborg", endCity: "Halden", ferry: false, estimatedStartDate: "27/06/2026", estimatedEndDate: "07/07/2026"},

  // Etape 26 regroupée (2 lignes) : 07/07 -> 11/07
  { id: 26, name: "Halden - Kragero", country: "Norvege", distance: 285, elevation: 2663, elevationGain: 2663, elevationLoss: 2654, terrain: "Route", startCity: "Halden", endCity: "Kragero", ferry: true, estimatedStartDate: "07/07/2026", estimatedEndDate: "11/07/2026" },

  { id: 27, name: "Stabbestad - Oysang", country: "Norvege", distance: 20, elevation: 225, elevationGain: 225, elevationLoss: 223, terrain: "Route", startCity: "Stabbestad", endCity: "Oysang", ferry: true, estimatedStartDate: "11/07/2026", estimatedEndDate: "11/07/2026"},

  // Etape 28 regroupée (4 lignes) : 11/07 -> 24/07
  { id: 28, name: "Risor - Buovag", country: "Norvege", distance: 875, elevation: 10904, elevationGain: 10904, elevationLoss: 10905, terrain: "Route", startCity: "Risor", endCity: "Buovag", ferry: true, estimatedStartDate: "11/07/2026", estimatedEndDate: "24/07/2026"},

  { id: 29, name: "Langevag - Sandvikvag", country: "Norvege", distance: 75, elevation: 1031, elevationGain: 1031, elevationLoss: 1030, terrain: "Route", startCity: "Langevag", endCity: "Sandvikvag", ferry: true, estimatedStartDate: "24/07/2026", estimatedEndDate: "25/07/2026"},

  // Etape 30 regroupée (6 lignes) : 25/07 -> 01/08
  { id: 30, name: "Halhjem - Koparneset", country: "Norvege", distance: 472, elevation: 7281, elevationGain: 7281, elevationLoss: 7281, terrain: "Route", startCity: "Halhjem", endCity: "Koparneset", ferry: true, estimatedStartDate: "25/07/2026", estimatedEndDate: "01/08/2026"},

  { id: 31, name: "Arvika - Hareid", country: "Norvege", distance: 44, elevation: 748, elevationGain: 748, elevationLoss: 749, terrain: "Route", startCity: "Arvika", endCity: "Hareid", ferry: true, estimatedStartDate: "01/08/2026", estimatedEndDate: "02/08/2026"},
  { id: 32, name: "Sulesund - Trondheim", country: "Norvege", distance: 577, elevation: 3489, elevationGain: 3489, elevationLoss: 3490, terrain: "Route", startCity: "Sulesund", endCity: "Trondheim", ferry: true, estimatedStartDate: "02/08/2026", estimatedEndDate: "10/08/2026"},

  // Etape 33 regroupée (8 lignes) : 10/08 -> 19/08
  { id: 33, name: "Vanvikan - Vassdalsvik", country: "Norvege", distance: 610, elevation: 7951, elevationGain: 7951, elevationLoss: 7956, terrain: "Route", startCity: "Vanvikan", endCity: "Vassdalsvik", ferry: true, estimatedStartDate: "10/08/2026", estimatedEndDate: "19/08/2026" },

  // Etape 34 regroupée (5 lignes) : 19/08 -> 29/08
  { id: 34, name: "Ornes - Breivikeidet", country: "Norvege", distance: 660, elevation: 7972, elevationGain: 7972, elevationLoss: 7974, terrain: "Route", startCity: "Ornes", endCity: "Breivikeidet", ferry: true, estimatedStartDate: "19/08/2026", estimatedEndDate: "29/08/2026"},

  { id: 35, name: "Svensby - Lyngseidet", country: "Norvege", distance: 22, elevation: 119, elevationGain: 119, elevationLoss: 119, terrain: "Route", startCity: "Svensby", endCity: "Lyngseidet", ferry: true, estimatedStartDate: "29/08/2026", estimatedEndDate: "29/08/2026"},
  { id: 36, name: "Olderdalen - Nordkapp", country: "Norvege", distance: 458, elevation: 6051, elevationGain: 6051, elevationLoss: 5748, terrain: "Route", startCity: "Olderdalen", endCity: "Nordkapp", ferry: false, estimatedStartDate: "29/08/2026", estimatedEndDate: "05/09/2026"}
];
