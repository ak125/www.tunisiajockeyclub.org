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
    { title: "Mentions Légales | Tunisia Jockey Club" },
    { 
      name: "description", 
      content: "Mentions légales, conditions d'utilisation et politique de confidentialité du Tunisia Jockey Club." 
    },
    { property: "og:title", content: "Mentions Légales | Tunisia Jockey Club" },
    { property: "og:description", content: "Informations légales et conditions d'utilisation du site Tunisia Jockey Club" },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "/images/og/tjc-mentions-1280x640.jpg" },
    { property: "og:image:width", content: "1280" },
    { property: "og:image:height", content: "640" },
  ];
};

function MentionsHeader() {
  return (
    <Header>
      <div className="flex items-center">
        <Logo size="default" className="mr-3" />
        <div>
          <h1 className="text-lg font-bold text-slate-900">Tunisia Jockey Club</h1>
          <p className="text-sm text-slate-600">Mentions Légales</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <SystemStatus />
      </div>
    </Header>
  );
}

export default function MentionsLegalesPage() {
  return (
    <main style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <MentionsHeader />
      
      {/* Hero Section */}
      <Section background="default" className="bg-slate-800 text-white">
        <Container className="text-center">
          <HeroTitle className="text-white mb-4">
            Mentions Légales
          </HeroTitle>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Informations légales, conditions d'utilisation et protection des données
          </p>
        </Container>
      </Section>

      <Section background="default">
        <Container>
          <div className="max-w-4xl mx-auto">
            
            {/* Éditeur du Site */}
            <Card className="mb-8">
              <SectionTitle>Éditeur du Site</SectionTitle>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Identification</h4>
                  <div className="space-y-2 text-slate-700">
                    <p><span className="font-medium">Raison sociale :</span> Tunisia Jockey Club</p>
                    <p><span className="font-medium">Statut juridique :</span> Association d'utilité publique</p>
                    <p><span className="font-medium">Date de création :</span> 1888</p>
                    <p><span className="font-medium">Registre :</span> 1888/001/TJC</p>
                    <p><span className="font-medium">IFHA Member ID :</span> TUN001</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Contact</h4>
                  <div className="space-y-2 text-slate-700">
                    <p><span className="font-medium">Adresse :</span><br />
                    Avenue Habib Bourguiba<br />
                    2010 La Manouba, Tunisie</p>
                    <p><span className="font-medium">Téléphone :</span> +216 71 601 234</p>
                    <p><span className="font-medium">Email :</span> info@tunisia-jockey-club.org</p>
                    <p><span className="font-medium">Site web :</span> www.tunisia-jockey-club.org</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Hébergement */}
            <Card className="mb-8">
              <SectionTitle>Hébergement</SectionTitle>
              
              <div className="bg-slate-50 p-6 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-3">Prestataire Technique</h4>
                <div className="space-y-2 text-slate-700">
                  <p><span className="font-medium">Infrastructure Cloud :</span> Supabase Inc.</p>
                  <p><span className="font-medium">CDN & Cache :</span> Vercel Inc.</p>
                  <p><span className="font-medium">Sécurité :</span> Certificats SSL/TLS Let's Encrypt</p>
                  <p><span className="font-medium">Localisation :</span> Serveurs européens (GDPR compliant)</p>
                </div>
              </div>
            </Card>

            {/* Propriété Intellectuelle */}
            <Card className="mb-8">
              <SectionTitle>Propriété Intellectuelle</SectionTitle>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Droits d'Auteur</h4>
                  <p className="text-slate-700 leading-relaxed">
                    L'ensemble du contenu de ce site (textes, images, logos, bases de données, 
                    système de rating IFHA, etc.) est protégé par le droit d'auteur et appartient 
                    exclusivement au Tunisia Jockey Club ou à ses partenaires licenciés.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Marques et Logos</h4>
                  <ul className="space-y-2 text-slate-700">
                    <li>• "Tunisia Jockey Club" est une marque déposée</li>
                    <li>• Le logo TJC est protégé par le droit des marques</li>
                    <li>• Les certifications IFHA sont utilisées sous licence officielle</li>
                    <li>• Toute reproduction non autorisée est interdite</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Utilisation Autorisée</h4>
                  <p className="text-slate-700 leading-relaxed">
                    L'utilisation du site est autorisée pour un usage personnel et non commercial. 
                    Toute reproduction, distribution ou modification du contenu nécessite 
                    l'autorisation écrite préalable du Tunisia Jockey Club.
                  </p>
                </div>
              </div>
            </Card>

            {/* Protection des Données */}
            <Card className="mb-8 bg-blue-50 border-blue-200">
              <SectionTitle className="text-blue-900">Protection des Données (RGPD)</SectionTitle>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-blue-900 mb-3">Responsable de Traitement</h4>
                  <p className="text-blue-800 leading-relaxed">
                    Le Tunisia Jockey Club, en qualité de responsable de traitement, s'engage 
                    à protéger vos données personnelles conformément au RGPD et à la loi tunisienne 
                    sur la protection des données personnelles (Loi n° 2004-63).
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-900 mb-3">Données Collectées</h4>
                  <ul className="space-y-2 text-blue-800">
                    <li>• Données de navigation (cookies techniques)</li>
                    <li>• Informations de contact (formulaires)</li>
                    <li>• Données d'authentification (comptes membres)</li>
                    <li>• Analytics anonymisées (performance du site)</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-blue-900 mb-3">Vos Droits</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <ul className="space-y-2 text-blue-800 text-sm">
                        <li>• Droit d'accès à vos données</li>
                        <li>• Droit de rectification</li>
                        <li>• Droit à l'effacement</li>
                        <li>• Droit à la portabilité</li>
                      </ul>
                    </div>
                    <div>
                      <ul className="space-y-2 text-blue-800 text-sm">
                        <li>• Droit d'opposition</li>
                        <li>• Droit de limitation</li>
                        <li>• Droit de retrait du consentement</li>
                        <li>• Droit de réclamation (INPDP)</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h5 className="font-medium text-blue-900 mb-2">Contact DPO</h5>
                  <p className="text-blue-800 text-sm">
                    Email : dpo@tunisia-jockey-club.org<br />
                    Courrier : Tunisia Jockey Club - DPO, Avenue Habib Bourguiba, 2010 La Manouba
                  </p>
                </div>
              </div>
            </Card>

            {/* Cookies */}
            <Card className="mb-8">
              <SectionTitle>Politique de Cookies</SectionTitle>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Cookies Techniques (Obligatoires)</h4>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <ul className="space-y-2 text-slate-700 text-sm">
                      <li>• <span className="font-medium">Session utilisateur :</span> Authentification et sécurité</li>
                      <li>• <span className="font-medium">Préférences :</span> Langue et paramètres d'affichage</li>
                      <li>• <span className="font-medium">Sécurité :</span> Protection CSRF et validation</li>
                      <li>• <span className="font-medium">Durée :</span> Session ou 30 jours maximum</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Analytics (Optionnels)</h4>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <p className="text-slate-700 text-sm mb-2">
                      Cookies d'analyse anonymisée pour améliorer l'expérience utilisateur.
                    </p>
                    <p className="text-xs text-slate-600">
                      Vous pouvez désactiver ces cookies dans vos préférences de navigation.
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Conditions d'Utilisation */}
            <Card className="mb-8 bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200">
              <SectionTitle>Conditions d'Utilisation</SectionTitle>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Acceptation des Conditions</h4>
                  <p className="text-slate-700 leading-relaxed">
                    L'utilisation de ce site implique l'acceptation pleine et entière des présentes 
                    conditions générales d'utilisation. Si vous n'acceptez pas ces conditions, 
                    veuillez ne pas utiliser ce site.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Limitation de Responsabilité</h4>
                  <p className="text-slate-700 leading-relaxed">
                    Le Tunisia Jockey Club met tout en œuvre pour fournir des informations précises. 
                    Cependant, il ne peut garantir l'exactitude, la complétude ou l'actualité des 
                    informations diffusées sur le site.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Liens Externes</h4>
                  <p className="text-slate-700 leading-relaxed">
                    Les liens vers des sites externes sont fournis à titre informatif. 
                    Le Tunisia Jockey Club n'exerce aucun contrôle sur ces sites et 
                    décline toute responsabilité quant à leur contenu.
                  </p>
                </div>
              </div>
            </Card>

            {/* Contact Légal */}
            <Card className="bg-brand-50 border-brand-200">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-brand-900 mb-4">
                  Questions Légales ?
                </h3>
                <p className="text-brand-700 mb-6">
                  Pour toute question concernant ces mentions légales ou l'utilisation 
                  de vos données personnelles, contactez notre service juridique.
                </p>
                <div className="space-y-2 text-brand-800">
                  <p><span className="font-medium">Email :</span> legal@tunisia-jockey-club.org</p>
                  <p><span className="font-medium">Téléphone :</span> +216 71 601 234</p>
                </div>
              </div>
            </Card>

            {/* Dernière Mise à Jour */}
            <div className="text-center text-sm text-slate-500 mt-8 py-4 border-t border-slate-200">
              <p>Dernière mise à jour : Janvier 2024</p>
            </div>

          </div>
        </Container>
      </Section>
      
      <Footer />
    </main>
  );
}
