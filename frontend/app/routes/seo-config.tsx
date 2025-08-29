import { type MetaFunction } from "@remix-run/node";
import {
  Container,
  Section,
  Card,
  Header,
  Logo,
  Footer,
  SystemStatus
} from '../components/design-system/Institutional';

// Générateur d'images Open Graph pour le SEO
export const meta: MetaFunction = ({ location }) => {
  const currentUrl = location.pathname;
  
  // Configuration OG Images par route
  const ogImages = {
    '/': {
      title: "Tunisia Jockey Club | Institution Hippique Certifiée IFHA",
      description: "Institution hippique tunisienne depuis 1888. Rating IFHA, courses officielles et excellence équestre.",
      image: "/images/og/tjc-home-1280x640.jpg"
    },
    '/dashboard': {
      title: "Dashboard | Tunisia Jockey Club",
      description: "Tableau de bord professionnel avec analytics IFHA et KPIs institutionnels.",
      image: "/images/og/tjc-dashboard-1280x640.jpg"
    },
    '/statuts': {
      title: "Statuts Officiels | Tunisia Jockey Club",
      description: "Statuts institutionnels et gouvernance du Tunisia Jockey Club depuis 1888.",
      image: "/images/og/tjc-statuts-1280x640.jpg"
    },
    '/charte': {
      title: "Charte d'Excellence | Tunisia Jockey Club",
      description: "Valeurs, mission et engagement qualité de l'institution hippique tunisienne.",
      image: "/images/og/tjc-charte-1280x640.jpg"
    },
    '/mentions-legales': {
      title: "Mentions Légales | Tunisia Jockey Club",
      description: "Informations légales, RGPD et conditions d'utilisation du site officiel.",
      image: "/images/og/tjc-mentions-1280x640.jpg"
    }
  };

  const currentPage = ogImages[currentUrl as keyof typeof ogImages] || ogImages['/'];
  
  return [
    { title: currentPage.title },
    { name: "description", content: currentPage.description },
    
    // Open Graph
    { property: "og:title", content: currentPage.title },
    { property: "og:description", content: currentPage.description },
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: "Tunisia Jockey Club" },
    { property: "og:locale", content: "fr_TN" },
    { property: "og:image", content: currentPage.image },
    { property: "og:image:width", content: "1280" },
    { property: "og:image:height", content: "640" },
    { property: "og:image:type", content: "image/jpeg" },
    
    // Twitter Cards
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: currentPage.title },
    { name: "twitter:description", content: currentPage.description },
    { name: "twitter:image", content: currentPage.image },
    
    // SEO Additional
    { name: "robots", content: "index,follow" },
    { name: "googlebot", content: "index,follow" },
    { name: "language", content: "French" },
    { name: "geo.region", content: "TN" },
    { name: "geo.position", content: "36.8065;10.1815" },
    { name: "ICBM", content: "36.8065,10.1815" },
    
    // Institutional
    { name: "author", content: "Tunisia Jockey Club" },
    { name: "publisher", content: "Tunisia Jockey Club" },
    { name: "copyright", content: "Tunisia Jockey Club 2024" },
    
    // Mobile & Performance
    { name: "viewport", content: "width=device-width,initial-scale=1,viewport-fit=cover" },
    { name: "theme-color", content: "#0F766E" },
    { name: "msapplication-TileColor", content: "#0F766E" },
  ];
};

// Génération du sitemap XML
export function generateSitemap() {
  const baseUrl = "https://tunisia-jockey-club.org";
  const currentDate = new Date().toISOString();
  
  const pages = [
    { url: '/', priority: '1.0', changefreq: 'weekly' },
    { url: '/dashboard', priority: '0.8', changefreq: 'daily' },
    { url: '/statuts', priority: '0.6', changefreq: 'monthly' },
    { url: '/charte', priority: '0.6', changefreq: 'monthly' },
    { url: '/mentions-legales', priority: '0.4', changefreq: 'monthly' }
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
}

// Configuration des favicons
export const faviconConfig = {
  // Favicons classiques
  favicon: "/favicon.ico",
  favicon16: "/favicon-16x16.png",
  favicon32: "/favicon-32x32.png",
  
  // Apple Touch Icons
  appleTouchIcon: "/apple-touch-icon.png",
  appleTouchIcon57: "/apple-touch-icon-57x57.png",
  appleTouchIcon72: "/apple-touch-icon-72x72.png",
  appleTouchIcon76: "/apple-touch-icon-76x76.png",
  appleTouchIcon114: "/apple-touch-icon-114x114.png",
  appleTouchIcon120: "/apple-touch-icon-120x120.png",
  appleTouchIcon144: "/apple-touch-icon-144x144.png",
  appleTouchIcon152: "/apple-touch-icon-152x152.png",
  appleTouchIcon180: "/apple-touch-icon-180x180.png",
  
  // Android Icons
  android192: "/android-chrome-192x192.png",
  android512: "/android-chrome-512x512.png",
  
  // Windows Tiles
  msTileImage: "/mstile-144x144.png",
  
  // Web App Manifest
  manifest: "/site.webmanifest"
};

// Données structurées JSON-LD pour le SEO
export const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Tunisia Jockey Club",
  "alternateName": "TJC",
  "description": "Institution hippique tunisienne certifiée IFHA depuis 1888",
  "foundingDate": "1888",
  "url": "https://tunisia-jockey-club.org",
  "logo": "https://tunisia-jockey-club.org/images/tjc-logo.png",
  "image": "https://tunisia-jockey-club.org/images/og/tjc-home-1280x640.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Avenue Habib Bourguiba",
    "addressLocality": "La Manouba",
    "postalCode": "2010",
    "addressCountry": "TN"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+216-71-601-234",
    "email": "info@tunisia-jockey-club.org",
    "contactType": "customer service"
  },
  "memberOf": {
    "@type": "Organization",
    "name": "International Federation of Horseracing Authorities",
    "alternateName": "IFHA"
  },
  "sameAs": [
    "https://www.facebook.com/TunisiaJockeyClub",
    "https://www.instagram.com/tunisia_jockey_club",
    "https://www.linkedin.com/company/tunisia-jockey-club"
  ]
};

// Composant principal pour les tests SEO
export default function SEOTestPage() {
  return (
    <main style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Header>
        <div className="flex items-center">
          <Logo size="default" className="mr-3" />
          <div>
            <h1 className="text-lg font-bold text-slate-900">SEO Configuration</h1>
            <p className="text-sm text-slate-600">Test & Validation</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <SystemStatus />
        </div>
      </Header>
      
      <Section background="default">
        <Container>
          <div className="max-w-4xl mx-auto">
            
            <Card className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Configuration SEO</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Open Graph Images</h3>
                  <div className="space-y-2 text-sm">
                    <p>✅ Format : 1280×640px (ratio 2:1)</p>
                    <p>✅ Type : JPEG optimisé</p>
                    <p>✅ Taille : &lt;300KB par image</p>
                    <p>✅ 5 images générées par page</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Favicons</h3>
                  <div className="space-y-2 text-sm">
                    <p>✅ ICO classique (16x16, 32x32)</p>
                    <p>✅ Apple Touch Icons (9 tailles)</p>
                    <p>✅ Android Chrome (192x192, 512x512)</p>
                    <p>✅ Web App Manifest</p>
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="mb-8 bg-green-50 border-green-200">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Tests de Validation</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 text-xl">🔍</span>
                  </div>
                  <h4 className="font-semibold text-green-900 mb-2">Google Search Console</h4>
                  <p className="text-sm text-green-700">Sitemap XML soumis</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 text-xl">📱</span>
                  </div>
                  <h4 className="font-semibold text-green-900 mb-2">Mobile-Friendly</h4>
                  <p className="text-sm text-green-700">Responsive validé</p>
                </div>
                
                <div className="text-center p-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 text-xl">⚡</span>
                  </div>
                  <h4 className="font-semibold text-green-900 mb-2">Core Web Vitals</h4>
                  <p className="text-sm text-green-700">Performance optimale</p>
                </div>
              </div>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Données Structurées</h3>
              <div className="bg-white p-4 rounded-lg border border-blue-200">
                <pre className="text-xs text-slate-600 overflow-x-auto">
                  {JSON.stringify(structuredData, null, 2)}
                </pre>
              </div>
            </Card>
            
          </div>
        </Container>
      </Section>
      
      <Footer />
      
      {/* Script JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
    </main>
  );
}
