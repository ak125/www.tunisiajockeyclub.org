#!/usr/bin/env node

const fetch = require('node-fetch');
const programmeData = require('./backend/analyze-benguerdane-data.js');

// Configuration Supabase
const SUPABASE_URL = "https://hssigihofbbdehqrnnoz.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzc2lnaWhvZmJiZGVocXJubm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTU1OTM0OSwiZXhwIjoyMDcxMTM1MzQ5fQ.LJXci09iPB2JrHMMQlCorfDdRnJhMQCfhVNU01YD7o4";

async function supabaseRequest(endpoint, options = {}) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  
  try {
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
      console.warn(`⚠️  ${endpoint}: HTTP ${response.status}`);
      return null;
    }

    return await response.json();
  } catch (error) {
    console.warn(`❌ ${endpoint}: ${error.message}`);
    return null;
  }
}

async function completeEcosystem() {
  console.log('🔧 CONSOLIDATION COMPLÈTE DU SYSTÈME');
  console.log('='.repeat(50));

  try {
    // 1. Récupérer les entités existantes
    console.log('\n📋 Récupération des données existantes...');
    const races = await supabaseRequest('races?race_date=eq.2025-08-02');
    const horses = await supabaseRequest('horses');
    const jockeys = await supabaseRequest('jockeys');
    const trainers = await supabaseRequest('trainers');
    const owners = await supabaseRequest('owners');

    console.log(`✅ ${races?.length || 0} courses trouvées`);
    console.log(`✅ ${horses?.length || 0} chevaux`);
    console.log(`✅ ${jockeys?.length || 0} jockeys`);
    console.log(`✅ ${trainers?.length || 0} entraîneurs`);
    console.log(`✅ ${owners?.length || 0} propriétaires`);

    if (!races || races.length === 0) {
      console.log('❌ Aucune course trouvée pour le 2 août 2025');
      return;
    }

    // 2. Créer des inscriptions réalistes
    console.log('\n📝 Génération d\'inscriptions réalistes...');
    
    const horsesMap = new Map();
    const jockeysMap = new Map();
    const trainersMap = new Map();
    const ownersMap = new Map();

    if (horses) horses.forEach(h => horsesMap.set(h.name, h));
    if (jockeys) jockeys.forEach(j => jockeysMap.set(j.name, j));
    if (trainers) trainers.forEach(t => trainersMap.set(t.name, t));
    if (owners) owners.forEach(o => ownersMap.set(o.stable_name, o));

    let totalInscriptions = 0;

    // Données d'inscription par course du programme réel
    const inscriptionsData = [
      {
        raceNumber: 1,
        participants: [
          { cheval: 'RIGEB', jockey: 'M. Jallagi', poids: 55 },
          { cheval: 'RAMZ EL FAKHIR', jockey: 'K. Jouini', poids: 55 },
          { cheval: 'ZAHOUEL', jockey: 'A. Mahjoub', poids: 55 },
          { cheval: 'RIM ESSOUHEIL', jockey: 'H. Mabrouk', poids: 55 },
          { cheval: 'REHAB AL BADR', jockey: 'A. Ayed', poids: 55 }
        ]
      },
      {
        raceNumber: 2,
        participants: [
          { cheval: 'RAHIB ALBADEIA', jockey: 'S. Khalouati', poids: 55 },
          { cheval: 'RAMZ AL HOSN', jockey: 'M. Jouini', poids: 55 },
          { cheval: 'SAHOUH', jockey: 'A. Mabrouk', poids: 55 },
          { cheval: 'RAGOAN', jockey: 'H. Mabrouk', poids: 55 }
        ]
      }
    ];

    for (const inscriptionData of inscriptionsData) {
      const race = races.find(r => r.race_number === inscriptionData.raceNumber);
      if (!race) continue;

      console.log(`\n🏁 Course ${inscriptionData.raceNumber}: ${race.name}`);

      for (let i = 0; i < inscriptionData.participants.length; i++) {
        const p = inscriptionData.participants[i];
        const horse = horsesMap.get(p.cheval);
        const jockey = jockeysMap.get(p.jockey);

        if (horse && jockey) {
          try {
            const entryData = {
              race_id: race.id,
              horse_id: horse.id,
              jockey_id: jockey.id,
              trainer_id: horse.trainer_id,
              owner_id: horse.owner_id,
              cloth_number: i + 1,
              draw_position: i + 1,
              weight_carried_kg: p.poids,
              odds: 2.0 + Math.random() * 6.0
            };

            const result = await supabaseRequest('race_entries', {
              method: 'POST',
              body: JSON.stringify(entryData)
            });

            if (result) {
              console.log(`   ✅ ${i + 1}. ${p.cheval} (${p.jockey})`);
              totalInscriptions++;
            } else {
              console.log(`   ↪ ${i + 1}. ${p.cheval} (déjà inscrit ou erreur)`);
            }
          } catch (error) {
            console.log(`   ⚠️  ${p.cheval} - erreur`);
          }
        }
      }
    }

    // 3. Générer des résultats simulés réalistes
    console.log('\n🏆 Génération de résultats simulés...');
    
    const resultatsSimules = [
      {
        raceNumber: 1,
        resultats: [
          { position: 1, cheval: 'RIGEB', jockey: 'M. Jallagi', temps: 85.2 },
          { position: 2, cheval: 'ZAHOUEL', jockey: 'A. Mahjoub', temps: 85.8 },
          { position: 3, cheval: 'RIM ESSOUHEIL', jockey: 'H. Mabrouk', temps: 86.1 }
        ]
      },
      {
        raceNumber: 2,
        resultats: [
          { position: 1, cheval: 'RAHIB ALBADEIA', jockey: 'S. Khalouati', temps: 102.5 },
          { position: 2, cheval: 'RAMZ AL HOSN', jockey: 'M. Jouini', temps: 103.1 },
          { position: 3, cheval: 'SAHOUH', jockey: 'A. Mabrouk', temps: 103.7 }
        ]
      }
    ];

    for (const courseResult of resultatsSimules) {
      const race = races.find(r => r.race_number === courseResult.raceNumber);
      if (!race) continue;

      console.log(`\n🥇 Résultats Course ${courseResult.raceNumber}:`);

      for (const resultat of courseResult.resultats) {
        const horse = horsesMap.get(resultat.cheval);
        const jockey = jockeysMap.get(resultat.jockey);

        if (horse && jockey) {
          try {
            const resultData = {
              race_id: race.id,
              horse_id: horse.id,
              jockey_id: jockey.id,
              position: resultat.position,
              time_seconds: resultat.temps,
              starting_price: 2.0 + Math.random() * 8.0,
              lengths_behind: resultat.position === 1 ? 0 : (resultat.position - 1) * 1.5
            };

            const result = await supabaseRequest('race_results', {
              method: 'POST',
              body: JSON.stringify(resultData)
            });

            if (result) {
              console.log(`   ${resultat.position}. ${resultat.cheval} - ${resultat.temps}s`);
            }
          } catch (error) {
            console.log(`   ⚠️  ${resultat.cheval} - erreur résultat`);
          }
        }
      }
    }

    console.log('\n='.repeat(50));
    console.log('🎉 CONSOLIDATION TERMINÉE !');
    console.log(`📊 ${totalInscriptions} inscriptions créées`);
    console.log('🏆 Résultats simulés ajoutés');
    console.log('✅ Système Tunisia Jockey Club COMPLET');
    console.log('🌐 Dashboard : http://localhost:3000/dashboard');

  } catch (error) {
    console.error('❌ Erreur durante consolidation:', error.message);
  }
}

// Exécution
completeEcosystem();
