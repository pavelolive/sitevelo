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
    name: 'Thomas Leroy',
    role: 'Photographe & Voyageur',
    bio: 'Photographe de nature et passionné de bikepacking, Thomas immortalise chaque instant de ce périple. Son œil artistique transforme notre voyage en une galerie d\'émotions.',
    image: 'https://images.unsplash.com/photo-1623604944442-e11589f39746?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjBjeWNsaW5nJTIwYWR2ZW50dXJlJTIwbmF0dXJlfGVufDF8fHx8MTc2NzEwNTgzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    badges: ['Artiste', 'Nomade'],
    stats: {
      experience: '8 ans',
      trips: '12+',
    },
  },
];

export function TeamSection() {
  return (
    <section className="py-20 px-4 bg-muted/60">
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
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{
                    filter: 'contrast(0.85) saturate(0.8) brightness(1.05) sepia(0.15)',
                  }}
                />
                <div className="absolute inset-0">
                  <img
                    src="https://images.unsplash.com/photo-1600426103380-558979d1198e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWNsaW5nJTIwbmF0dXJlJTIwbGFuZHNjYXBlfGVufDF8fHx8MTc2NzEwNTgwMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                    alt="Cycling background"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/85 to-background/95"></div>
                </div>
                
                {/* Badges sur l'image */}
                <div className="absolute top-4 right-4 flex flex-wrap gap-2 justify-end">
                  {member.badges.map((badge) => (
                    <Badge
                      key={badge}
                      className="bg-primary/90 text-primary-foreground backdrop-blur-sm shadow-lg border border-white/20"
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
                
                {/* Stats overlay style jeu vidéo */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center">
                    <div className="text-xs text-muted-foreground">Expérience</div>
                    <div className="font-bold text-primary">{member.stats.experience}</div>
                  </div>
                  <div className="flex-1 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center">
                    <div className="text-xs text-muted-foreground">Voyages</div>
                    <div className="font-bold text-primary">{member.stats.trips}</div>
                  </div>
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
                  <Award className="w-6 h-6 text-accent" />
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