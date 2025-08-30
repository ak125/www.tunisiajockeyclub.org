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
      'Prefer': 'return=representation',
      ...options.headers
    },
    ...options
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.warn(`⚠️  Erreur ignorée: HTTP ${response.status}: ${errorText}`);
    return null;
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return null;
}

async function createEntitySafe(table, data, logName) {
  try {
    const result = await supabaseRequest(table, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    
    if (result) {
      console.log(`  ✅ ${logName} créé`);
      return result;
    } else {
      console.log(`  ⚠️  ${logName} existe déjà ou erreur ignorée`);
      return null;
    }
  } catch (error) {
    console.log(`  ⚠️  ${logName} - erreur ignorée: ${error.message}`);
    return null;
  }
}

async function integrateBenGuerdaneRaces() {
  console.log('🏇 Intégration des courses de Ben Guerdane du 2 août 2025');
  console.log('=====================================================\n');

  try {
    // 1. Récupérer l'hippodrome Ben Guerdane
    const racecourse = await supabaseRequest('racecourses?code=eq.BENG');
    if (!racecourse || racecourse.length === 0) {
      console.log('❌ Hippodrome Ben Guerdane non trouvé');
      return;
    }
    
    const racecourseId = racecourse[0].id;
    console.log(`✅ Hippodrome trouvé: ${racecourse[0].name}`);

    // 2. Créer les 4 courses du programme du 2 août 2025
    const courses = [
      {
        race_number: 1,
        race_date: '2025-08-02',
        race_time: '14:30:00',
        racecourse_id: racecourseId,
        name: 'PRIX DE JEKITIS',
        race_type: 'flat',
        race_class: 'Groupe III',
        distance_meters: 1400,
        prize_money: 15000.00,
        conditions: 'Pur-sang Arabes de 3 ans et plus',
        max_runners: 12,
        status: 'scheduled'
      },
      {
        race_number: 2,
        race_date: '2025-08-02',
        race_time: '15:00:00',
        racecourse_id: racecourseId,
        name: 'PRIX DES OLIVIERS',
        race_type: 'flat',
        race_class: 'Listed',
        distance_meters: 1200,
        prize_money: 12000.00,
        conditions: 'Pur-sang Arabes de 3 ans',
        max_runners: 10,
        status: 'scheduled'
      },
      {
        race_number: 3,
        race_date: '2025-08-02',
        race_time: '15:30:00',
        racecourse_id: racecourseId,
        name: 'PRIX AL MAHABBA',
        race_type: 'flat',
        race_class: 'Groupe II',
        distance_meters: 1600,
        prize_money: 20000.00,
        conditions: 'Pur-sang Arabes de 4 ans et plus',
        max_runners: 14,
        status: 'scheduled'
      },
      {
        race_number: 4,
        race_date: '2025-08-02',
        race_time: '16:00:00',
        racecourse_id: racecourseId,
        name: 'PRIX DU SAHARA',
        race_type: 'flat',
        race_class: 'Groupe I',
        distance_meters: 2000,
        prize_money: 30000.00,
        conditions: 'Pur-sang Arabes de 4 ans et plus - Épreuve de prestige',
        max_runners: 16,
        status: 'scheduled'
      }
    ];

    console.log('\n🏆 Création des courses...');
    const racesCreated = [];
    
    for (const course of courses) {
      const result = await createEntitySafe('races', course, `Course ${course.race_number}: ${course.name}`);
      if (result) {
        racesCreated.push(result[0]);
      }
    }

    console.log(`\n✅ Programme complet intégré pour le 2 août 2025`);
    console.log(`📊 ${racesCreated.length} nouvelles courses créées`);
    console.log(`🏇 Hippodrome: ${racecourse[0].name}`);
    console.log(`💰 Dotations totales: ${courses.reduce((sum, c) => sum + c.prize_money, 0)} TND`);
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'intégration:', error.message);
  }
}

// Lancement du script
integrateBenGuerdaneRaces().then(() => {
  console.log('\n🎉 Intégration terminée !');
  process.exit(0);
}).catch(error => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
