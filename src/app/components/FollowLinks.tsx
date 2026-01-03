import { Instagram, ExternalLink, MapPin } from 'lucide-react';
import { Card } from './ui/card';

const followLinks = [
  {
    name: 'Polarsteps',
    description: 'Suivez notre itinéraire en temps réel',
    icon: MapPin,
    url: 'https://www.polarsteps.com',
    color: 'from-primary to-accent',
  },
  {
    name: 'Strava',
    description: 'Nos activités et performances',
    icon: ExternalLink,
    url: 'https://www.strava.com',
    color: 'from-secondary to-primary',
  },
  {
    name: 'Instagram',
    description: 'Photos et moments du voyage',
    icon: Instagram,
    url: 'https://www.instagram.com',
    color: 'from-accent to-secondary',
  },
];

export function FollowLinks() {
  return (
    <section className="py-20 px-4 bg-accent/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Suivez l'aventure
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Restez connectés et vivez notre périple à travers nos différentes plateformes
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {followLinks.map((link) => {
            const Icon = link.icon;
            return (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="p-6 h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/30 bg-card">
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Icon avec gradient */}
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${link.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {link.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {link.description}
                      </p>
                    </div>
                    
                    {/* Badge "Visiter" style jeu vidéo */}
                    <div className="mt-auto pt-4">
                      <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <span>Visiter</span>
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Card>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}