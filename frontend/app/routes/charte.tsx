import { type MetaFunction } from "@remix-run/node";
import {
  Container,
  Section,
  HeroTitle,
  SectionTitle,
  Card,
  Header,
  Logo,
  Footer,
  SystemStatus
} from '../components/design-system/Institutional';

export const meta: MetaFunction = () => {
  return [
    { title: "Charte d'Excellence | Tunisia Jockey Club" },
    { 
      name: "description", 
      content: "Charte d'excellence et code d'éthique du Tunisia Jockey Club. Valeurs, engagement qualité et standards professionnels." 
    },
    { property: "og:title", content: "Charte d'Excellence | Tunisia Jockey Club" },
    { property: "og:description", content: "Charte d'excellence et valeurs institutionnelles du Tunisia Jockey Club" },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "/images/og/tjc-charte-1280x640.jpg" },
    { property: "og:image:width", content: "1280" },
    { property: "og:image:height", content: "640" },
  ];
};

function CharteHeader() {
  return (
    <Header>
      <div className="flex items-center">
        <Logo size="default" className="mr-3" />
        <div>
          <h1 className="text-lg font-bold text-slate-900">Tunisia Jockey Club</h1>
          <p className="text-sm text-slate-600">Charte d'Excellence</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <SystemStatus />
      </div>
    </Header>
  );
}

export default function ChartePage() {
  return (
    <main style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <CharteHeader />
      
      {/* Hero Section */}
      <Section background="brand" className="text-white">
        <Container className="text-center">
          <HeroTitle className="text-white mb-4">
            Charte d'Excellence
          </HeroTitle>
          <p className="text-xl text-brand-100 max-w-3xl mx-auto">
            Nos valeurs, notre engagement envers l'excellence hippique et 
            l'intégrité sportive depuis plus d'un siècle
          </p>
        </Container>
      </Section>

      <Section background="default">
        <Container>
          <div className="max-w-4xl mx-auto">
            
            {/* Vision & Mission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="text-center bg-brand-50 border-brand-200">
                <div className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold text-brand-800 mb-3">Notre Vision</h3>
                <p className="text-brand-700 leading-relaxed">
                  Être l'institution hippique de référence en Afrique du Nord, 
                  reconnue internationalement pour son excellence et son innovation.
                </p>
              </Card>
              
              <Card className="text-center bg-accent-50 border-accent-200">
                <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold text-accent-800 mb-3">Notre Mission</h3>
                <p className="text-accent-700 leading-relaxed">
                  Promouvoir, organiser et développer les sports hippiques tunisiens 
                  selon les plus hauts standards internationaux.
                </p>
              </Card>
            </div>

            {/* Valeurs Fondamentales */}
            <Card className="mb-8">
              <SectionTitle>Valeurs Fondamentales</SectionTitle>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-emerald-600 text-xl">🏆</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Excellence</h4>
                  <p className="text-sm text-slate-600">
                    Recherche constante de la perfection dans tous nos services et activités
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 text-xl">🤝</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Intégrité</h4>
                  <p className="text-sm text-slate-600">
                    Transparence, honnêteté et équité dans toutes nos décisions
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 text-xl">🌟</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Innovation</h4>
                  <p className="text-sm text-slate-600">
                    Adoption des technologies avancées et des meilleures pratiques
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-yellow-600 text-xl">🐎</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Bien-être Animal</h4>
                  <p className="text-sm text-slate-600">
                    Protection et soins optimaux pour tous les chevaux participants
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-red-600 text-xl">🏛️</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Patrimoine</h4>
                  <p className="text-sm text-slate-600">
                    Préservation et transmission de l'héritage hippique tunisien
                  </p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-teal-600 text-xl">🌍</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 mb-2">Ouverture</h4>
                  <p className="text-sm text-slate-600">
                    Coopération internationale et échange de savoir-faire
                  </p>
                </div>
              </div>
            </Card>

            {/* Engagement Qualité */}
            <Card className="mb-8">
              <SectionTitle>Engagement Qualité</SectionTitle>
              
              <div className="space-y-6">
                <div className="bg-slate-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Standards IFHA</h4>
                  <p className="text-slate-700 leading-relaxed">
                    Nous respectons intégralement les standards de l'International Federation of Horseracing Authorities, 
                    garantissant la reconnaissance internationale de nos ratings et certifications.
                  </p>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Amélioration Continue</h4>
                  <p className="text-slate-700 leading-relaxed">
                    Processus d'évaluation permanente de nos services, avec mise à jour régulière de nos procédures 
                    et formations continues de notre personnel.
                  </p>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-slate-900 mb-3">Satisfaction Client</h4>
                  <p className="text-slate-700 leading-relaxed">
                    Écoute attentive des besoins de nos membres et partenaires, avec enquêtes de satisfaction 
                    et dispositifs d'amélioration basés sur leurs retours.
                  </p>
                </div>
              </div>
            </Card>

            {/* Code d'Éthique */}
            <Card className="mb-8 bg-gradient-to-br from-brand-50 to-accent-50 border-none">
              <SectionTitle className="text-center text-slate-900">Code d'Éthique Professionnelle</SectionTitle>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-4 flex items-center">
                    <span className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center text-white text-sm mr-2">1</span>
                    Fair-Play Sportif
                  </h4>
                  <ul className="space-y-2 text-slate-700 text-sm">
                    <li>• Respect des règles de compétition</li>
                    <li>• Lutte contre le dopage</li>
                    <li>• Égalité de traitement des participants</li>
                    <li>• Transparence des décisions arbitrales</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-4 flex items-center">
                    <span className="w-6 h-6 bg-accent-500 rounded-full flex items-center justify-center text-white text-sm mr-2">2</span>
                    Responsabilité Sociale
                  </h4>
                  <ul className="space-y-2 text-slate-700 text-sm">
                    <li>• Protection de l'environnement</li>
                    <li>• Développement local</li>
                    <li>• Formation de la jeunesse</li>
                    <li>• Accessibilité pour tous</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-white rounded-lg border border-slate-200">
                <h4 className="font-semibold text-slate-900 mb-3 text-center">Serment Institutionnel</h4>
                <blockquote className="text-slate-700 italic text-center leading-relaxed">
                  "En tant que membre du Tunisia Jockey Club, je m'engage à respecter les valeurs d'excellence, 
                  d'intégrité et de fair-play qui fondent notre institution depuis 1888, et à contribuer au 
                  rayonnement des sports hippiques tunisiens sur la scène internationale."
                </blockquote>
              </div>
            </Card>

          </div>
        </Container>
      </Section>
      
      <Footer />
    </main>
  );
}
