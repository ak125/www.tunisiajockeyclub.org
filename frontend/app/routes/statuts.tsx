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
    { title: "Statuts | Tunisia Jockey Club - Institution Hippique Officielle" },
    { 
      name: "description", 
      content: "Statuts officiels du Tunisia Jockey Club, institution hippique tunisienne fondée en 1888. Gouvernance, missions et réglementation." 
    },
    { property: "og:title", content: "Statuts | Tunisia Jockey Club" },
    { property: "og:description", content: "Statuts officiels du Tunisia Jockey Club, institution hippique de référence" },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "/images/og/tjc-statuts-1280x640.jpg" },
    { property: "og:image:width", content: "1280" },
    { property: "og:image:height", content: "640" },
    { property: "og:url", content: "https://tunisiajockeyclub.tn/statuts" },
  ];
};

function StatutsHeader() {
  return (
    <Header>
      <div className="flex items-center">
        <Logo size="default" className="mr-3" />
        <div>
          <h1 className="text-lg font-bold text-slate-900">Tunisia Jockey Club</h1>
          <p className="text-sm text-slate-600">Statuts Officiels</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <SystemStatus />
      </div>
    </Header>
  );
}

function StatutsHero() {
  return (
    <Section background="brand" className="text-white">
      <Container className="text-center">
        <HeroTitle className="text-white mb-4">
          Statuts Institutionnels
        </HeroTitle>
        <p className="text-xl text-brand-100 max-w-3xl mx-auto">
          Document fondateur du Tunisia Jockey Club, institution hippique tunisienne 
          de référence depuis 1888, certifiée IFHA
        </p>
      </Container>
    </Section>
  );
}

export default function StatutsPage() {
  return (
    <main style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <StatutsHeader />
      <StatutsHero />
      
      <Section background="default">
        <Container>
          <div className="max-w-4xl mx-auto">
            
            {/* Article 1 - Dénomination */}
            <Card className="mb-8">
              <SectionTitle>Article 1 - Dénomination et Siège</SectionTitle>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  Il est constitué entre les adhérents aux présents statuts une association régie par la loi du 1er juillet 1901 
                  et le décret du 16 août 1901, ayant pour titre :
                </p>
                <p className="font-semibold text-brand-600 text-lg">
                  "Tunisia Jockey Club"
                </p>
                <p className="text-slate-700 leading-relaxed mt-4">
                  Le siège social est fixé à Tunis, République Tunisienne. Il pourra être transféré par simple décision 
                  du conseil d'administration.
                </p>
              </div>
            </Card>

            {/* Article 2 - Objet */}
            <Card className="mb-8">
              <SectionTitle>Article 2 - Objet et Missions</SectionTitle>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  Le Tunisia Jockey Club a pour objet :
                </p>
                <ul className="space-y-3 text-slate-700">
                  <li className="flex items-start">
                    <span className="text-brand-600 font-bold mr-3">•</span>
                    L'organisation, la supervision et la promotion des sports hippiques en Tunisie
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-600 font-bold mr-3">•</span>
                    L'application et le maintien des standards internationaux IFHA (International Federation of Horseracing Authorities)
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-600 font-bold mr-3">•</span>
                    La délivrance des licences aux jockeys, entraîneurs et propriétaires
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-600 font-bold mr-3">•</span>
                    La gestion du système de rating officiel des performances équestres
                  </li>
                  <li className="flex items-start">
                    <span className="text-brand-600 font-bold mr-3">•</span>
                    La préservation et le développement de l'excellence hippique tunisienne
                  </li>
                </ul>
              </div>
            </Card>

            {/* Article 3 - Durée */}
            <Card className="mb-8">
              <SectionTitle>Article 3 - Durée</SectionTitle>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed">
                  La durée de l'association est illimitée, sauf dissolution prononcée par l'assemblée générale extraordinaire.
                </p>
              </div>
            </Card>

            {/* Article 4 - Composition */}
            <Card className="mb-8">
              <SectionTitle>Article 4 - Composition et Admission</SectionTitle>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  L'association se compose de :
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-brand-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-brand-700 mb-2">Membres d'Honneur</h4>
                    <p className="text-sm text-brand-600">
                      Personnalités ayant rendu des services éminents aux sports hippiques
                    </p>
                  </div>
                  
                  <div className="bg-stable-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-stable-blue-700 mb-2">Membres Actifs</h4>
                    <p className="text-sm text-stable-blue-600">
                      Propriétaires, éleveurs et professionnels du secteur hippique
                    </p>
                  </div>
                  
                  <div className="bg-racing-gold-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-racing-gold-700 mb-2">Membres Associés</h4>
                    <p className="text-sm text-racing-gold-600">
                      Amateurs et supporters des sports hippiques
                    </p>
                  </div>
                </div>
                
                <p className="text-slate-700 leading-relaxed mt-4">
                  L'admission est prononcée par le conseil d'administration après examen du dossier de candidature 
                  et vérification du respect des standards d'éthique sportive.
                </p>
              </div>
            </Card>

            {/* Article 5 - Gouvernance */}
            <Card className="mb-8">
              <SectionTitle>Article 5 - Gouvernance Institutionnelle</SectionTitle>
              <div className="prose prose-slate max-w-none">
                
                <div className="bg-slate-50 p-6 rounded-lg mb-6">
                  <h4 className="text-lg font-semibold text-slate-900 mb-4">Conseil d'Administration</h4>
                  <ul className="space-y-2 text-slate-700">
                    <li>• Composé de 12 membres élus pour 3 ans</li>
                    <li>• Présidence assurée par élection au scrutin secret</li>
                    <li>• Réunions trimestrielles obligatoires</li>
                    <li>• Pouvoirs de supervision et de contrôle</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border border-slate-200 rounded-lg">
                    <div className="text-2xl font-bold text-brand-600">3</div>
                    <div className="text-sm text-slate-600">Commissions</div>
                    <div className="text-xs text-slate-500 mt-1">Technique, Disciplinaire, Médicale</div>
                  </div>
                  
                  <div className="text-center p-4 border border-slate-200 rounded-lg">
                    <div className="text-2xl font-bold text-accent-600">12</div>
                    <div className="text-sm text-slate-600">Administrateurs</div>
                    <div className="text-xs text-slate-500 mt-1">Élus par l'assemblée générale</div>
                  </div>
                  
                  <div className="text-center p-4 border border-slate-200 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600">1888</div>
                    <div className="text-sm text-slate-600">Fondation</div>
                    <div className="text-xs text-slate-500 mt-1">Plus d'un siècle d'excellence</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Certification IFHA */}
            <Card className="mb-8 bg-brand-50 border-brand-200">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-brand-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold text-lg">IFHA</span>
                </div>
                <div>
                  <SectionTitle className="text-brand-800 mb-1">Certification Internationale</SectionTitle>
                  <p className="text-brand-600">International Federation of Horseracing Authorities</p>
                </div>
              </div>
              
              <div className="prose prose-slate max-w-none">
                <p className="text-brand-700 leading-relaxed">
                  Le Tunisia Jockey Club est membre certifié de l'IFHA depuis 1995, garantissant le respect 
                  des standards internationaux les plus stricts en matière de :
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <ul className="space-y-2 text-brand-700">
                    <li>• Système de rating officiel</li>
                    <li>• Contrôles anti-dopage</li>
                    <li>• Intégrité des compétitions</li>
                  </ul>
                  <ul className="space-y-2 text-brand-700">
                    <li>• Formation des officiels</li>
                    <li>• Bien-être animal</li>
                    <li>• Transparence financière</li>
                  </ul>
                </div>
              </div>
            </Card>

          </div>
        </Container>
      </Section>
      
      <Footer />
    </main>
  );
}
