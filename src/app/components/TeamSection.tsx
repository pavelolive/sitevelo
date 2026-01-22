import { Award, Bike } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

const teamMembers = [
  {
    name: 'La team 🚴🏻',
    role: 'Aussi appelés les Gravel Packers',
    bio: "Tous les deux piqués par le voyage à vélo après notre première aventure en bikepacking reliant Paris à Londres. S'en sont suivis trois autres voyages en commun à notre actif dont le dernier en 2025 : Paris ➡️ Amsterdam. ",
    image: '/photo_fefe_oliv.jpeg',
  },
  {
    name: 'Félix (aka Féfé)',
    role: 'Le photographe de la bande 📸',
    bio: "Ce voyage est pour moi l'occasion de marquer une transition vers une nouvelle vie qui m'attend à mon retour : photographe professionnel, accompagnateur en montagne, moniteur de canyoning, un peu de tout ça ? Qui sait, peut-être que ce voyage me mettra les idées plus au clair 🧐",
    image: '/photo_felix.jpeg',
  },
  {
    name: 'Olivier',
    role: 'Le mécano 🔧',
    bio: 'Après plusieurs voyages à vélo, l’envie de partir plus loin s’est imposée. Cette aventure est l’occasion de découvrir de nouveaux paysages, de prendre le temps du voyage et de privilégier une manière de se déplacer la plus respectueuse possible.',
    image: '/olivier.jpg',
    badges: ['Cycliste', 'Caméraman'],
  },
];

export function TeamSection() {
  return (
    <section className="py-20 px-4 bg-primary-foreground">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full border border-accent/30">
            <Bike className="w-4 h-4" />
            <span className="text-sm">Les Cyclistes</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Qui sommes-nous ?
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <Card 
              key={member.name} 
              className="overflow-hidden border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-xl group"
            >
              {/* Image */}
              <div className="relative h-80 overflow-hidden">
                {/* Background + gradient (derrière) */}
                <div className="absolute inset-0 z-0">
                  <img
                      src="https://images.unsplash.com/photo-1600426103380-558979d1198e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                      alt="Cycling background"
                      className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background/95"></div>
                </div>

                {/* Photo du membre (devant) */}
                <img
                    src={member.image}
                    alt={member.name}
                    className="relative z-10 w-full h-full object-cover"
                />
              </div>


              {/* Contenu */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">
                      {member.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {member.role}
                    </p>
                  </div>
                </div>
                
                <p className="text-muted-foreground leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}