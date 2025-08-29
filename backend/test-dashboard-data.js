#!/usr/bin/env node

const fetch = require('node-fetch');

// Configuration Supabase
const SUPABASE_URL = "https://hssigihofbbdehqrnnoz.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzc2lnaWhvZmJiZGVocXJubm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTU1OTM0OSwiZXhwIjoyMDcxMTM1MzQ5fQ.LJXci09iPB2JrHMMQlCorfDdRnJhMQCfhVNU01YD7o4";

async function supabaseRequest(endpoint, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  
  const response = await fetch(url, {
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'count=exact',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return null;
}

async function testDashboardData() {
  console.log('🔍 Test des données pour le dashboard...\n');

  try {
    // Test 1: Compter les utilisateurs
    console.log('📊 Statistiques générales:');
    const usersResponse = await supabaseRequest('users?select=*');
    console.log(`  👥 Utilisateurs: ${usersResponse?.length || 0}`);

    // Test 2: Compter les courses
    const racesResponse = await supabaseRequest('races?select=*');
    console.log(`  🏁 Courses: ${racesResponse?.length || 0}`);

    // Test 3: Compter les chevaux
    const horsesResponse = await supabaseRequest('horses?select=*');
    console.log(`  🐎 Chevaux: ${horsesResponse?.length || 0}`);

    // Test 4: Compter les jockeys
    const jockeysResponse = await supabaseRequest('jockeys?select=*');
    console.log(`  👤 Jockeys: ${jockeysResponse?.length || 0}`);

    // Test 5: Courses récentes avec détails
    console.log('\n📅 Courses récentes:');
    const recentRaces = await supabaseRequest('races?select=name,race_date,status,racecourses(name)&order=race_date.desc&limit=3');
    recentRaces?.forEach((race, index) => {
      console.log(`  ${index + 1}. ${race.name} - ${race.race_date} (${race.status})`);
      console.log(`     📍 ${race.racecourses?.name || 'Lieu inconnu'}`);
    });

    // Test 6: Top chevaux avec performances
    console.log('\n🏆 Top chevaux:');
    const horses = await supabaseRequest('horses?select=name,race_results(position)&limit=5');
    horses?.forEach((horse, index) => {
      const victories = horse.race_results?.filter(r => r.position === 1).length || 0;
      const totalRaces = horse.race_results?.length || 0;
      const winRate = totalRaces > 0 ? ((victories / totalRaces) * 100).toFixed(1) : '0';
      console.log(`  ${index + 1}. ${horse.name}: ${victories}/${totalRaces} victoires (${winRate}%)`);
    });

    // Test 7: Hippodromes
    console.log('\n🏇 Hippodromes:');
    const racecourses = await supabaseRequest('racecourses?select=name,location');
    racecourses?.forEach((rc, index) => {
      console.log(`  ${index + 1}. ${rc.name} - ${rc.location || 'Lieu non spécifié'}`);
    });

    console.log('\n✅ Tests réussis ! Les données sont disponibles pour le dashboard.');
    return true;

  } catch (error) {
    console.error('\n❌ Erreur durant les tests:', error.message);
    return false;
  }
}

// Exécuter les tests
testDashboardData()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });
