/**
 * 🎨 Composants Design System Tunisia Jockey Club
 * Composants institutionnels réutilisables
 */

import { Link } from '@remix-run/react';
import { type ComponentProps, type ReactNode } from 'react';

/* === CONTENEUR PRINCIPAL === */
export function Container({ 
  children, 
  className = '',
  ...props 
}: { children: ReactNode; className?: string } & ComponentProps<'div'>) {
  return (
    <div 
      className={`container-main ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/* === SECTION AVEC ESPACEMENT INSTITUTIONNEL === */
export function Section({ 
  children, 
  className = '',
  background = 'default',
  ...props 
}: {
  children: ReactNode;
  className?: string;
  background?: 'default' | 'alternate' | 'brand' | 'accent';
} & ComponentProps<'section'>) {
  const bgClasses = {
    default: 'bg-slate-50',
    alternate: 'bg-white',
    brand: 'bg-brand-500',
    accent: 'bg-accent-500'
  };

  return (
    <section 
      className={`section-spacing ${bgClasses[background]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}

/* === TITRES INSTITUTIONNELS === */
export function HeroTitle({ 
  children, 
  className = '',
  ...props 
}: { children: ReactNode; className?: string } & ComponentProps<'h1'>) {
  return (
    <h1 
      className={`text-hero text-slate-900 ${className}`}
      {...props}
    >
      {children}
    </h1>
  );
}

export function SectionTitle({ 
  children, 
  className = '',
  ...props 
}: { children: ReactNode; className?: string } & ComponentProps<'h2'>) {
  return (
    <h2 
      className={`text-section text-slate-900 mb-6 ${className}`}
      {...props}
    >
      {children}
    </h2>
  );
}

export function Subtitle({ 
  children, 
  className = '',
  ...props 
}: { children: ReactNode; className?: string } & ComponentProps<'h3'>) {
  return (
    <h3 
      className={`text-subtitle text-slate-800 ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
}

/* === BOUTONS INSTITUTIONNELS === */
export function ButtonPrimary({ 
  children, 
  className = '',
  ...props 
}: { children: ReactNode; className?: string } & ComponentProps<'button'>) {
  return (
    <button 
      className={`btn-primary focus-ring ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonSecondary({ 
  children, 
  className = '',
  ...props 
}: { children: ReactNode; className?: string } & ComponentProps<'button'>) {
  return (
    <button 
      className={`btn-secondary focus-ring ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonAccent({ 
  children, 
  className = '',
  ...props 
}: { children: ReactNode; className?: string } & ComponentProps<'button'>) {
  return (
    <button 
      className={`btn-accent focus-ring ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/* === LIENS INSTITUTIONNELS === */
export function LinkPrimary({ 
  children, 
  to, 
  className = '',
  ...props 
}: { 
  children: ReactNode; 
  to: string; 
  className?: string;
} & ComponentProps<typeof Link>) {
  return (
    <Link 
      to={to}
      className={`btn-primary inline-block focus-ring text-center ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}

export function LinkSecondary({ 
  children, 
  to, 
  className = '',
  ...props 
}: { 
  children: ReactNode; 
  to: string; 
  className?: string;
} & ComponentProps<typeof Link>) {
  return (
    <Link 
      to={to}
      className={`btn-secondary inline-block focus-ring text-center ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}

/* === CARTES INSTITUTIONNELLES === */
export function Card({ 
  children, 
  className = '',
  hover = true,
  ...props 
}: { 
  children: ReactNode; 
  className?: string;
  hover?: boolean;
} & ComponentProps<'div'>) {
  const hoverClass = hover ? 'card-primary' : 'bg-white border border-slate-200 rounded-xl p-8';
  
  return (
    <div 
      className={`${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

/* === BARRE DE STATISTIQUES === */
export function StatBand({ 
  stats,
  className = '' 
}: { 
  stats: Array<{ number: string | number; label: string; }>;
  className?: string;
}) {
  return (
    <div className={`stat-band ${className}`}>
      {stats.map((stat, index) => (
        <div key={index} className="stat-item">
          <div className="stat-number">
            {typeof stat.number === 'number' ? stat.number.toLocaleString('fr-FR') : stat.number}
          </div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

/* === GRILLE DE CARTES === */
export function CardGrid({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <div className={`grid-cards ${className}`}>
      {children}
    </div>
  );
}

/* === HEADER STICKY INSTITUTIONNEL === */
export function Header({ 
  children, 
  className = '' 
}: { 
  children: ReactNode; 
  className?: string;
}) {
  return (
    <header 
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 ${className}`}
    >
      <Container>
        <div className="flex items-center justify-between py-4">
          {children}
        </div>
      </Container>
    </header>
  );
}

/* === LOGO INSTITUTIONNEL === */
export function Logo({ 
  size = 'default',
  className = '' 
}: { 
  size?: 'small' | 'default' | 'large';
  className?: string;
}) {
  const sizes = {
    small: 'w-8 h-8 text-lg',
    default: 'w-12 h-12 text-xl',
    large: 'w-16 h-16 text-2xl'
  };

  return (
    <div 
      className={`${sizes[size]} bg-brand-500 text-white rounded-full flex items-center justify-center font-bold ${className}`}
      role="img"
      aria-label="Logo Tunisia Jockey Club"
    >
      TJC
    </div>
  );
}

/* === CTA BAND (PLEIN ÉCRAN) === */
export function CTABand({ 
  title,
  description,
  primaryAction,
  secondaryAction,
  className = '' 
}: {
  title: string;
  description: string;
  primaryAction: { label: string; href: string; };
  secondaryAction?: { label: string; href: string; };
  className?: string;
}) {
  return (
    <Section background="brand" className={`text-white ${className}`}>
      <Container>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-section mb-4 text-white">
            {title}
          </h2>
          <p className="text-xl mb-8 text-brand-100">
            {description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={primaryAction.href}
              className="btn-accent inline-block focus-ring text-center"
            >
              {primaryAction.label}
            </Link>
            
            {secondaryAction && (
              <Link
                to={secondaryAction.href}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-brand-500 transition-all duration-300 focus-ring"
              >
                {secondaryAction.label}
              </Link>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}

/* === FOOTER STRUCTURÉ === */
export function Footer({ className = '' }: { className?: string }) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={`bg-slate-900 text-white py-12 ${className}`}>
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Logo & Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Logo size="default" className="mr-3" />
              <span className="text-xl font-bold">Tunisia Jockey Club</span>
            </div>
            <p className="text-slate-300 mb-4">
              Centre d'excellence hippique tunisien depuis 1888. 
              Système IFHA de rating international certifié.
            </p>
          </div>

          {/* Liens Légaux */}
          <div>
            <h4 className="font-semibold mb-4">Documentation</h4>
            <ul className="space-y-2">
              <li><Link to="/statuts" className="text-slate-300 hover:text-white transition-colors">Statuts</Link></li>
              <li><Link to="/charte" className="text-slate-300 hover:text-white transition-colors">Charte</Link></li>
              <li><Link to="/reglement" className="text-slate-300 hover:text-white transition-colors">Règlement</Link></li>
            </ul>
          </div>

          {/* Mentions */}
          <div>
            <h4 className="font-semibold mb-4">Informations</h4>
            <ul className="space-y-2">
              <li><Link to="/mentions-legales" className="text-slate-300 hover:text-white transition-colors">Mentions légales</Link></li>
              <li><Link to="/confidentialite" className="text-slate-300 hover:text-white transition-colors">Confidentialité</Link></li>
              <li><Link to="/contact" className="text-slate-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8 text-center text-slate-400">
          <p>&copy; {currentYear} Tunisia Jockey Club. Tous droits réservés.</p>
        </div>
      </Container>
    </footer>
  );
}

/* === STATUT SYSTÈME === */
export function SystemStatus({ 
  isOnline = true, 
  className = '' 
}: { 
  isOnline?: boolean; 
  className?: string;
}) {
  return (
    <div className={`flex items-center text-sm ${className}`}>
      <div 
        className={`w-2 h-2 rounded-full mr-2 ${
          isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
        }`}
      />
      <span className={isOnline ? 'text-emerald-600' : 'text-red-600'}>
        {isOnline ? 'Système opérationnel' : 'Maintenance en cours'}
      </span>
    </div>
  );
}
