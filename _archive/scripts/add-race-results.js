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

async function addRaceResults() {
  console.log('🏁 Ajout de résultats de courses...\n');

  try {
    // 1. Récupérer les courses, chevaux et jockeys
    const races = await supabaseRequest('races?select=*');
    const horses = await supabaseRequest('horses?select=*');
    const jockeys = await supabaseRequest('jockeys?select=*');
    const raceEntries = await supabaseRequest('race_entries?select=*');

    console.log(`Données disponibles: ${races.length} courses, ${horses.length} chevaux, ${jockeys.length} jockeys, ${raceEntries.length} inscriptions`);

    // 2. Marquer certaines courses comme terminées
    const coursesToComplete = races.slice(0, 2); // Les 2 premières courses
    
    for (const race of coursesToComplete) {
      console.log(`\n🏁 Traitement de la course: ${race.name}`);
      
      // Marquer la course comme terminée
      await supabaseRequest(`races?id=eq.${race.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'finished' })
      });
      console.log(`  ✅ Statut mis à jour: finished`);
      
      // Récupérer les inscriptions pour cette course
      const courseEntries = raceEntries.filter(entry => entry.race_id === race.id);
      console.log(`  📋 ${courseEntries.length} inscriptions trouvées`);

      // Créer des résultats aléatoires mais réalistes
      if (courseEntries.length > 0) {
        const raceResults = courseEntries.map((entry, index) => ({
          race_id: race.id,
          horse_id: entry.horse_id,
          jockey_id: entry.jockey_id,
          position: index + 1,
          time_seconds: (95 + Math.random() * 15).toFixed(2), // Temps entre 95 et 110 secondes
          lengths_behind: index === 0 ? 0 : ((index * 0.5) + (Math.random() * 1.5)).toFixed(2),
          starting_price: (2 + Math.random() * 8).toFixed(2), // Cotes entre 2 et 10
          comments: index === 0 ? 'Excellente performance, victoire méritée' :
                   index === 1 ? 'Belle deuxième place, très prometteur' :
                   index === 2 ? 'Bonne troisième place' :
                   'Cours régulier'
        }));

        // Insérer les résultats
        await supabaseRequest('race_results', {
          method: 'POST',
          body: JSON.stringify(raceResults)
        });
        
        console.log(`  🏆 ${raceResults.length} résultats ajoutés`);
        raceResults.slice(0, 3).forEach((result, idx) => {
          const horseName = horses.find(h => h.id === result.horse_id)?.name || 'Inconnu';
          console.log(`    ${idx + 1}er: ${horseName} (${result.time_seconds}s)`);
        });
      }
    }

    // 3. Ajouter quelques inscriptions aux courses à venir
    const upcomingRaces = races.filter(r => r.status === 'scheduled');
    console.log(`\n📅 Ajout d'inscriptions aux ${upcomingRaces.length} courses à venir...`);

    for (const race of upcomingRaces.slice(0, 2)) {
      // Vérifier s'il y a déjà des inscriptions
      const existingEntries = raceEntries.filter(entry => entry.race_id === race.id);
      
      if (existingEntries.length < 3) {
        // Ajouter quelques inscriptions supplémentaires
        const availableHorses = horses.filter(horse => 
          !existingEntries.some(entry => entry.horse_id === horse.id)
        ).slice(0, 3);

        const newEntries = availableHorses.map((horse, index) => ({
          race_id: race.id,
          horse_id: horse.id,
          jockey_id: jockeys[index % jockeys.length]?.id,
          cloth_number: existingEntries.length + index + 1,
          draw_position: existingEntries.length + index + 1,
          weight_carried_kg: (54 + Math.random() * 4).toFixed(1),
          odds: (2 + Math.random() * 6).toFixed(2)
        }));

        if (newEntries.length > 0) {
          await supabaseRequest('race_entries', {
            method: 'POST',
            body: JSON.stringify(newEntries)
          });
          console.log(`  📋 ${newEntries.length} nouvelles inscriptions ajoutées à ${race.name}`);
        }
      }
    }

    console.log('\n🎉 Mise à jour des résultats terminée !');
    return true;

  } catch (error) {
    console.error('\n❌ Erreur:', error.message);
    return false;
  }
}

// Exécuter l'ajout de résultats
addRaceResults()
  .then((success) => {
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });
