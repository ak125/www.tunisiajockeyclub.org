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
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return null;
}

async function addRaceEntries() {
  console.log('📋 Ajout d\'inscriptions aux courses...\n');

  try {
    // Récupérer les données nécessaires
    const races = await supabaseRequest('races?select=*');
    const horses = await supabaseRequest('horses?select=*');
    const jockeys = await supabaseRequest('jockeys?select=*');
    const owners = await supabaseRequest('owners?select=*');
    const trainers = await supabaseRequest('trainers?select=*');

    console.log(`Données disponibles:`);
    console.log(`  🏁 ${races.length} courses`);
    console.log(`  🐎 ${horses.length} chevaux`);
    console.log(`  👤 ${jockeys.length} jockeys`);
    console.log(`  🏰 ${owners.length} propriétaires`);
    console.log(`  🎓 ${trainers.length} entraîneurs\n`);

    // Créer des inscriptions pour chaque course
    for (const race of races) {
      console.log(`🏁 Course: ${race.name} (${race.race_date})`);
      
      // Sélectionner 3-4 chevaux de manière aléatoire
      const selectedHorses = horses
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(4, horses.length));

      const raceEntries = selectedHorses.map((horse, index) => {
        const jockey = jockeys[index % jockeys.length];
        const owner = owners[index % owners.length];
        const trainer = trainers[index % trainers.length];

        return {
          race_id: race.id,
          horse_id: horse.id,
          jockey_id: jockey.id,
          trainer_id: trainer.id,
          owner_id: owner.id,
          cloth_number: index + 1,
          draw_position: index + 1,
          weight_carried_kg: (54 + Math.random() * 4).toFixed(1), // Entre 54 et 58kg
          odds: (2 + Math.random() * 8).toFixed(2) // Entre 2.00 et 10.00
        };
      });

      // Insérer les inscriptions
      const insertedEntries = await supabaseRequest('race_entries', {
        method: 'POST',
        body: JSON.stringify(raceEntries)
      });

      console.log(`  ✅ ${insertedEntries.length} inscriptions créées:`);
      insertedEntries.forEach((entry, idx) => {
        const horse = horses.find(h => h.id === entry.horse_id);
        const jockey = jockeys.find(j => j.id === entry.jockey_id);
        console.log(`    ${idx + 1}. ${horse?.name} avec ${jockey?.user_id || 'Jockey'} (Cote: ${entry.odds})`);
      });
      console.log('');
    }

    console.log('🎉 Toutes les inscriptions ont été créées !');
    return true;

  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    return false;
  }
}

// Exécuter l'ajout d'inscriptions
addRaceEntries()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });
