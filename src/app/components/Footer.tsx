import { Instagram, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo / Titre */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6" />
              <h3 className="text-xl font-bold">Gibraltar → Cap Nord</h3>
            </div>
            <p className="text-sm text-primary-foreground/80">
              Un voyage à vélo de 6 mois à travers l'Europe
            </p>
          </div>
          
          {/* Liens rapides */}
          <div>
            <h4 className="font-bold mb-4">Suivez-nous</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.polarsteps.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Polarsteps
                </a>
              </li>
              <li>
                <a
                  href="https://www.strava.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Strava
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <a
              href="mailto:contact@adventure.com"
              className="inline-flex items-center gap-2 text-sm text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <Mail className="w-4 h-4" />
              contact@adventure.com
            </a>
          </div>
        </div>
        
        {/* Bottom bar */}
        <div className="pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/80">
            <p>© 2024 Gibraltar → Cap Nord. Tous droits réservés.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary-foreground transition-colors">
                Mentions légales
              </a>
              <span>•</span>
              <a href="#" className="hover:text-primary-foreground transition-colors">
                Politique de confidentialité
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
