import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, Link } from '@remix-run/react';
import { Trophy, TrendingUp, Calculator, Award, BarChart3 } from 'lucide-react';

// Import du nouveau design system
import {
  Container,
  Section,
  HeroTitle,
  SectionTitle,
  LinkPrimary,
  LinkSecondary,
  Card,
  StatBand,
  CardGrid,
  Header,
  Logo,
  CTABand,
  Footer,
  SystemStatus
} from '../components/design-system/Institutional';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return json({
    user: null,
    stats: {
      totalRaces: 124,
      activeHorses: 89,
      registeredJockeys: 32,
      upcomingEvents: 8
    },
    timestamp: new Date().toISOString(),
  });
};

// Header institutionnel avec nouveau design
function InstitutionalHeader() {
  return (
    <Header>
      <div className="flex items-center">
        <Logo size="default" className="mr-3" />
        <div>
          <h1 className="text-lg font-bold text-slate-900">Tunisia Jockey Club</h1>
          <p className="text-sm text-slate-600">Centre d'Excellence Hippique</p>
        </div>
      </div>
      
      <nav className="hidden md:flex items-center space-x-6">
        <Link to="/rating" className="text-slate-700 hover:text-brand-600 transition-colors font-medium">
          Rating IFHA
        </Link>
        <Link to="/dashboard" className="text-slate-700 hover:text-brand-600 transition-colors font-medium">
          Dashboard
        </Link>
        <Link to="/statistics" className="text-slate-700 hover:text-brand-600 transition-colors font-medium">
          Statistiques
        </Link>
        <LinkPrimary to="/rating/calculateur" className="ml-4">
          Adhérer
        </LinkPrimary>
      </nav>

      <div className="md:hidden">
        <SystemStatus />
      </div>
    </Header>
  );
}

// Section héros avec nouveau design institutionnel
function HeroSection() {
  return (
    <Section background="brand" className="text-white relative overflow-hidden">
      {/* Pattern de fond subtil */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-white/10"></div>
      </div>
      
      <Container className="relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <img
              src="/api/placeholder/120/120"
              alt="Emblème Tunisia Jockey Club - Institution hippique tunisienne fondée en 1888"
              className="w-30 h-30 rounded-full border-4 border-white/30 mr-6"
              loading="eager"
              decoding="async"
            />
            <div className="text-left">
              <HeroTitle className="text-white mb-2">
                Tunisia Jockey Club
              </HeroTitle>
              <p className="text-xl text-brand-100 font-medium">
                Centre d'Excellence Hippique depuis 1888
              </p>
            </div>
          </div>
          
          <p className="text-xl text-brand-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Institution hippique de référence avec système IFHA certifié pour 
            le rating international des performances équestres tunisiennes
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LinkPrimary 
              to="/rating/calculateur" 
              className="bg-accent-500 hover:bg-accent-600 border-0"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Calculateur IFHA
            </LinkPrimary>
            
            <LinkSecondary 
              to="/dashboard"
              className="border-2 border-white text-white hover:bg-white hover:text-brand-500"
            >
              <TrendingUp className="w-5 h-5 mr-2" />
              Dashboard Complet
            </LinkSecondary>
          </div>
        </div>
      </Container>
    </Section>
  );
}

// Barre de statistiques avec nouveau design
function StatsSection({ stats }: { stats: any }) {
  const statistiques = [
    { number: stats.totalRaces, label: 'Courses Organisées' },
    { number: stats.activeHorses, label: 'Chevaux Actifs' },
    { number: stats.registeredJockeys, label: 'Jockeys Licenciés' }
  ];

  return (
    <Section background="alternate">
      <Container>
        <StatBand stats={statistiques} />
      </Container>
    </Section>
  );
}

// Section des services institutionnels
function ServicesSection() {
  const services = [
    {
      icon: Trophy,
      title: 'Rating IFHA International',
      description: 'Système certifié de calcul des performances selon les standards internationaux de la Fédération Hippique.',
      link: '/rating',
      color: 'text-brand-600'
    },
    {
      icon: BarChart3,
      title: 'Analytics Avancées',
      description: 'Tableau de bord professionnel avec analyses statistiques des performances hippiques et tendances.',
      link: '/dashboard',
      color: 'text-stable-blue-600'
    },
    {
      icon: Award,
      title: 'Certification Officielle',
      description: 'Délivrance de certifications officielles et gestion des licences pour jockeys et propriétaires.',
      link: '/certifications',
      color: 'text-racing-gold-600'
    }
  ];

  return (
    <Section background="default">
      <Container>
        <div className="text-center mb-12">
          <SectionTitle>Services Institutionnels</SectionTitle>
          <p className="text-body max-w-2xl mx-auto">
            Découvrez nos services professionnels dédiés à l'excellence 
            de l'industrie hippique tunisienne
          </p>
        </div>

        <CardGrid>
          {services.map((service, index) => (
            <Card key={index} className="text-center group">
              <div className="mb-6">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className={`w-8 h-8 ${service.color}`} />
                </div>
                <h3 className="text-subtitle mb-3">{service.title}</h3>
                <p className="text-body mb-6">{service.description}</p>
              </div>
              
              <LinkSecondary to={service.link}>
                Découvrir
              </LinkSecondary>
            </Card>
          ))}
        </CardGrid>
      </Container>
    </Section>
  );
}

// Section des commissions
function CommissionsSection() {
  const commissions = [
    {
      title: 'Commission Technique',
      description: 'Supervision des courses et validation des performances selon les normes IFHA.',
      members: '8 experts'
    },
    {
      title: 'Commission Disciplinaire', 
      description: 'Application du règlement et gestion des litiges dans le respect de l\'éthique sportive.',
      members: '5 membres'
    },
    {
      title: 'Commission Médicale',
      description: 'Contrôle vétérinaire et suivi médical des chevaux participants aux compétitions.',
      members: '6 vétérinaires'
    }
  ];

  return (
    <Section background="alternate">
      <Container>
        <div className="text-center mb-12">
          <SectionTitle>Organisation Institutionnelle</SectionTitle>
          <p className="text-body max-w-2xl mx-auto">
            Structure organisationnelle garantissant transparence et excellence 
            dans la gestion des activités hippiques
          </p>
        </div>

        <CardGrid>
          {commissions.map((commission, index) => (
            <Card key={index}>
              <h3 className="text-subtitle mb-3 text-brand-600">
                {commission.title}
              </h3>
              <p className="text-body mb-4">
                {commission.description}
              </p>
              <div className="text-sm text-slate-600 font-medium">
                {commission.members}
              </div>
            </Card>
          ))}
        </CardGrid>
      </Container>
    </Section>
  );
}

// Composant principal
export default function NewHomePage() {
  const { stats } = useLoaderData<typeof loader>();

  return (
    <main className="animate-fade-in-up" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <InstitutionalHeader />
      <HeroSection />
      <StatsSection stats={stats} />
      <ServicesSection />
      <CommissionsSection />
      
      <CTABand
        title="Rejoignez l'Excellence Hippique Tunisienne"
        description="Bénéficiez des services professionnels du Tunisia Jockey Club et de notre système IFHA certifié pour optimiser vos performances équestres."
        primaryAction={{
          label: "Devenir Membre",
          href: "/adhesion"
        }}
        secondaryAction={{
          label: "Découvrir nos Services",
          href: "/services"
        }}
      />
      
      <Footer />
      
      {/* Statut système en position fixe */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg px-3 py-2 shadow-lg">
          <SystemStatus isOnline={true} />
        </div>
      </div>
    </main>
  );
}
