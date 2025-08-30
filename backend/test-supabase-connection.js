const { PrismaClient } = require('@prisma/client');

// Test de connexion Supabase avec différentes configurations
async function testSupabaseConnection() {
  console.log('🚀 Test de connexion Supabase...\n');

  // Configuration 1: URL avec pooler
  const configs = [
    {
      name: 'Pooler SSL avec pgbouncer',
      url: 'postgresql://postgres:5nf2R7LzTmUkHAw4@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1'
    },
    {
      name: 'Connexion directe avec SSL',
      url: 'postgresql://postgres:5nf2R7LzTmUkHAw4@db.hssigihofbbdehqrnnoz.supabase.co:5432/postgres?sslmode=require'
    },
    {
      name: 'Pooler sans pgbouncer',
      url: 'postgresql://postgres:5nf2R7LzTmUkHAw4@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?sslmode=require'
    },
    {
      name: 'Format avec nom d\'utilisateur complet',
      url: 'postgresql://postgres.hssigihofbbdehqrnnoz:5nf2R7LzTmUkHAw4@aws-0-eu-west-1.pooler.supabase.com:6543/postgres'
    }
  ];

  for (const config of configs) {
    console.log(`🔍 Test: ${config.name}`);
    
    const prisma = new PrismaClient({
      datasources: {
        db: { url: config.url }
      },
      log: ['error']
    });

    try {
      await prisma.$connect();
      console.log('  ✅ Connexion réussie!');
      
      // Test simple de requête
      const result = await prisma.$queryRaw`SELECT NOW() as current_time`;
      console.log(`  📅 Heure serveur: ${result[0].current_time}`);
      
      // Test de comptage des tables existantes
      try {
        const userCount = await prisma.user.count();
        console.log(`  👥 Utilisateurs dans la base: ${userCount}`);
      } catch (e) {
        console.log('  ⚠️ Table User n\'existe pas encore');
      }
      
      await prisma.$disconnect();
      console.log(`  🎉 Configuration fonctionnelle trouvée!\n`);
      return config;
      
    } catch (error) {
      console.log(`  ❌ Échec: ${error.message}`);
      await prisma.$disconnect().catch(() => {});
    }
    console.log();
  }
  
  return null;
}

// Test de l'API REST Supabase (fallback)
async function testSupabaseAPI() {
  console.log('🌐 Test API REST Supabase...');
  
  const SUPABASE_URL = 'https://hssigihofbbdehqrnnoz.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzc2lnaWhvZmJiZGVocXJubm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTkzNDksImV4cCI6MjA3MTEzNTM0OX0.fkeE84xM2u7iZ69YxMtgH7TH0xbYvc9i2-2tDMq5CQQ';
  
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      console.log('✅ API REST Supabase accessible');
      return true;
    } else {
      console.log(`❌ API REST échoue: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Erreur API REST: ${error.message}`);
    return false;
  }
}

// Exécution des tests
async function runAllTests() {
  console.log('🔬 Diagnostic complet de connexion Supabase\n');
  
  // Test 1: API REST
  const apiWorks = await testSupabaseAPI();
  console.log();
  
  // Test 2: Connexions PostgreSQL
  const workingConfig = await testSupabaseConnection();
  
  // Résumé
  console.log('📊 RÉSUMÉ DES TESTS:');
  console.log('='.repeat(50));
  console.log(`🌐 API REST Supabase: ${apiWorks ? '✅ FONCTIONNE' : '❌ NE FONCTIONNE PAS'}`);
  console.log(`🐘 PostgreSQL Direct: ${workingConfig ? '✅ FONCTIONNE' : '❌ NE FONCTIONNE PAS'}`);
  
  if (workingConfig) {
    console.log(`\n💡 CONFIGURATION RECOMMANDÉE:`);
    console.log(`DATABASE_URL="${workingConfig.url}"`);
    console.log(`\n📝 À ajouter dans backend/.env:`);
    console.log(`DATABASE_URL="${workingConfig.url}"`);
    console.log(`DIRECT_URL="${workingConfig.url}"`);
  } else {
    console.log(`\n🔄 SOLUTION DE FALLBACK:`);
    console.log(`Utiliser l'API REST Supabase avec createClient()`);
  }
}

runAllTests().catch(console.error);
