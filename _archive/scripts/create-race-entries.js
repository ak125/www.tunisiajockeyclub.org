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

async function createRaceEntries() {
  console.log('📝 CRÉATION DES INSCRIPTIONS POUR BEN GUERDANE');
  console.log('='.repeat(60));

  try {
    // Récupérer toutes les courses de Ben Guerdane du 2 août 2025
    const races = await supabaseRequest('races?race_date=eq.2025-08-02&select=*,racecourses(name)');
    console.log(`✅ ${races.length} courses trouvées pour le 2 août 2025`);

    // Récupérer tous les chevaux de Ben Guerdane
    const horses = await supabaseRequest('horses?registration_number=like.BENG-%');
    const horsesMap = new Map();
    horses.forEach(h => horsesMap.set(h.name, h));
    console.log(`✅ ${horses.length} chevaux Ben Guerdane trouvés`);

    // Récupérer tous les jockeys de Ben Guerdane
    const jockeys = await supabaseRequest('jockeys?license_number=like.BENG-LJK-%');
    const jockeysMap = new Map();
    jockeys.forEach(j => jockeysMap.set(j.name, j));
    console.log(`✅ ${jockeys.length} jockeys Ben Guerdane trouvés`);

    // Récupérer tous les entraîneurs de Ben Guerdane
    const trainers = await supabaseRequest('trainers?license_number=like.BENG-LIC-%');
    const trainersMap = new Map();
    trainers.forEach(t => trainersMap.set(t.name, t));
    console.log(`✅ ${trainers.length} entraîneurs Ben Guerdane trouvés`);

    // Récupérer tous les propriétaires de Ben Guerdane
    const owners = await supabaseRequest('owners?registration_number=like.BENG-STA-%');
    const ownersMap = new Map();
    owners.forEach(o => ownersMap.set(o.stable_name?.replace('Écurie ', ''), o));
    console.log(`✅ ${owners.length} propriétaires Ben Guerdane trouvés`);

    // Données des participants par course
    const courseParticipants = {
      1: [ // Prix DE JEKITIS
        { cheval: 'RIGEB', jockey: 'M. Jallagi', poids: 55, proprietaire: 'Salim', entraineur: 'Sadoq Triki' },
        { cheval: 'RAMZ EL FAKHIR', jockey: 'K. Jouini', poids: 55, proprietaire: 'Naceur', entraineur: 'M\'ghorghor' },
        { cheval: 'ZAHOUEL', jockey: 'A. Mahjoub', poids: 55, proprietaire: 'Jouini', entraineur: 'Sadoq Triki' },
        { cheval: 'RIM ESSOUHEIL', jockey: 'H. Mabrouk', poids: 55, proprietaire: 'Mokhtar', entraineur: 'M\'ghorghor' },
        { cheval: 'REHAB AL BADR', jockey: 'A. Ayed', poids: 55, proprietaire: 'Houcine', entraineur: 'Nasri Ammar' },
        { cheval: 'REMETH NAGHAM', jockey: 'H. Jrid', poids: 55, proprietaire: 'Mohamed', entraineur: 'M\'ghorghor' },
        { cheval: 'RAYHANA EL HADI', jockey: 'M. Lahmer', poids: 55, proprietaire: 'Mokhtar', entraineur: 'M\'ghorghor' },
        { cheval: 'REMETT CHARGUI', jockey: 'A. Mahjoub', poids: 55, proprietaire: 'Salim', entraineur: 'M\'ghorghor' },
        { cheval: 'RIJOU', jockey: 'M. Lahmer', poids: 55, proprietaire: 'Salim', entraineur: 'M\'ghorghor' },
        { cheval: 'RIFJ', jockey: 'H. Mabrouk', poids: 55, proprietaire: 'Salim', entraineur: 'M\'ghorghor' },
        { cheval: 'RAMZ ETTAHADI', jockey: 'Y. Yaldeminou', poids: 55, proprietaire: 'Ahmed', entraineur: 'Dhaou Regai' }
      ],
      2: [ // Prix DE CHOUCHA
        { cheval: 'RAHIB ALBADEIA', jockey: 'S. Khalouati', poids: 55, proprietaire: 'Kaïs', entraineur: 'Dr. Gharbi' },
        { cheval: 'RAMZ AL HOSN', jockey: 'M. Jouini', poids: 55, proprietaire: 'Ghanem', entraineur: 'Nasri Ammar' },
        { cheval: 'SAHOUH', jockey: 'A. Mabrouk', poids: 55, proprietaire: 'Said', entraineur: 'M\'ghorghor' },
        { cheval: 'RAGOAN', jockey: 'H. Mabrouk', poids: 55, proprietaire: 'Jahouchi', entraineur: 'Nasri Ammar' },
        { cheval: 'RAMEH', jockey: 'M. Lahmer', poids: 55, proprietaire: 'Salim', entraineur: 'Sadoq Triki' },
        { cheval: 'RABEE EL EZZ', jockey: 'F. Jallagi', poids: 55, proprietaire: 'Kamel', entraineur: 'M\'ghorghor' },
        { cheval: 'RAZANE', jockey: 'S. Seif Daas', poids: 55, proprietaire: 'Kamel', entraineur: 'Dhaou Brik' }
      ]
      // Ajoutez les autres courses si nécessaire
    };

    let totalInscriptions = 0;
    
    for (const [courseNum, participants] of Object.entries(courseParticipants)) {
      const race = races.find(r => r.race_number === parseInt(courseNum));
      if (!race) {
        console.log(`⚠️  Course ${courseNum} non trouvée`);
        continue;
      }

      console.log(`\n📋 Course ${courseNum}: ${race.name}`);
      
      for (let i = 0; i < participants.length; i++) {
        const p = participants[i];
        const horse = horsesMap.get(p.cheval);
        const jockey = jockeysMap.get(p.jockey);
        const trainer = trainersMap.get(p.entraineur);
        const owner = ownersMap.get(p.proprietaire);

        if (!horse) {
          console.log(`   ⚠️  Cheval ${p.cheval} non trouvé`);
          continue;
        }
        if (!jockey) {
          console.log(`   ⚠️  Jockey ${p.jockey} non trouvé`);
          continue;
        }

        try {
          const entryData = {
            race_id: race.id,
            horse_id: horse.id,
            jockey_id: jockey.id,
            trainer_id: trainer?.id,
            owner_id: owner?.id,
            cloth_number: i + 1,
            draw_position: i + 1,
            weight_carried_kg: p.poids,
            odds: 2.0 + Math.random() * 8.0
          };

          await supabaseRequest('race_entries', {
            method: 'POST',
            body: JSON.stringify(entryData)
          });

          console.log(`   ✅ ${i + 1}. ${p.cheval} (${p.jockey}) - ${p.poids}kg`);
          totalInscriptions++;
        } catch (error) {
          if (error.message.includes('duplicate key')) {
            console.log(`   ↪ ${i + 1}. ${p.cheval} déjà inscrit`);
          } else {
            console.log(`   ⚠️  ${i + 1}. ${p.cheval} - erreur: ${error.message}`);
          }
        }
      }
    }

    console.log('\n='.repeat(60));
    console.log('✅ INSCRIPTIONS TERMINÉES');
    console.log(`📊 ${totalInscriptions} nouvelles inscriptions créées`);
    console.log('🏇 Les courses de Ben Guerdane sont prêtes !');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

// Exécution
createRaceEntries();
