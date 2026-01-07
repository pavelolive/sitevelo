import { Award, Bike } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

const teamMembers = [
  {
    name: 'Alex Martin',
    role: 'Cycliste passionné',
    bio: 'Amoureux des grands espaces et des défis sportifs, Alex rêvait depuis toujours de traverser l\'Europe à vélo. Cette aventure est l\'accomplissement d\'un rêve de longue date.',
    image: 'https://images.unsplash.com/photo-1635702961362-bbc21a0f81a6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWxlJTIwY3ljbGlzdCUyMHBvcnRyYWl0JTIwb3V0ZG9vcnxlbnwxfHx8fDE3NjcxMDU4Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    badges: ['Explorateur', 'Aventurier'],
    stats: {
      experience: '10 ans',
      trips: '15+',
    },
  },
  {
    name: 'Olivier Quintard',
    role: 'Cycliste passionné',
    bio: 'Après plusieurs voyages à vélo, l’envie de partir plus loin s’est imposée. Cette aventure est l’occasion de découvrir de nouveaux paysages, de prendre le temps du voyage et de privilégier une manière de se déplacer la plus respectueuse possible.',
    image: 'https://lh3.googleusercontent.com/pw/AP1GczNoePBW4vtotEbijWPu_-Et7T4W44zgzU-njKlMey6vvjgkionfUMOkI3vv3S6nPOgO2zJxUSvav71teqc43u1ojbUzYf_OMQBYSjToLXqZolVv2s5_Mrb0yn8cBU1RdBgJ_LGvlvM0QY3GggEDnGgcpg=w735-h1307-s-no?authuser=0',
    badges: ['Cycliste', 'Caméraman'],
    stats: {
      experience: '33 ans',
      trips: '4',
    },
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
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Deux passionnés d'aventure et de grands espaces unis par une même soif de découverte
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
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
                    className="relative z-10 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{
                      filter: "contrast(0.85) saturate(0.8) brightness(1.05) sepia(0.15)",
                    }}
                />

                {/* Badges */}
                <div className="absolute top-4 right-4 z-20 flex flex-wrap gap-2 justify-end">
                  {member.badges.map((badge) => (
                      <Badge
                          key={badge}
                          className="bg-socials text-primary-foreground backdrop-blur-sm shadow-lg border border-white/20"
                      >
                        {badge}
                      </Badge>
                  ))}
                </div>

                {/* Stats */}
                <div className="absolute bottom-4 left-4 right-4 z-20 flex gap-2">
                  ...
                </div>
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