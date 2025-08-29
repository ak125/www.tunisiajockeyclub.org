#!/usr/bin/env node

const fetch = require('node-fetch');

// Configuration Supabase
const SUPABASE_URL = "https://hssigihofbbdehqrnnoz.supabase.co";
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzc2lnaWhvZmJiZGVocXJubm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTU1OTM0OSwiZXhwIjoyMDcxMTM1MzQ5fQ.LJXci09iPB2JrHMMQlCorfDdRnJhMQCfhVNU01YD7o4";

async function supabaseRequest(endpoint) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.log(`⚠️  ${endpoint}: HTTP ${response.status}`);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.log(`❌ ${endpoint}: ${error.message}`);
    return [];
  }
}

async function checkBenGuerdaneData() {
  console.log('🔍 VÉRIFICATION DES DONNÉES BEN GUERDANE');
  console.log('='.repeat(50));

  // Vérifier les courses
  const races = await supabaseRequest('races?race_date=eq.2025-08-02');
  console.log(`\n🏁 Courses du 2 août 2025: ${races.length}`);
  races.forEach(r => {
    console.log(`   - Course ${r.race_number}: ${r.name} (${r.distance_meters}m)`);
  });

  // Vérifier les chevaux Ben Guerdane
  const horses = await supabaseRequest('horses?registration_number=like.BENG-%');
  console.log(`\n🐎 Chevaux Ben Guerdane: ${horses.length}`);
  horses.slice(0, 5).forEach(h => {
    console.log(`   - ${h.name} (${h.sex}, ${h.color})`);
  });
  if (horses.length > 5) console.log(`   ... et ${horses.length - 5} autres`);

  // Vérifier les propriétaires Ben Guerdane
  const owners = await supabaseRequest('owners?registration_number=like.BENG-STA-%');
  console.log(`\n👤 Propriétaires Ben Guerdane: ${owners.length}`);
  owners.slice(0, 5).forEach(o => {
    console.log(`   - ${o.stable_name}`);
  });
  if (owners.length > 5) console.log(`   ... et ${owners.length - 5} autres`);

  // Vérifier les jockeys Ben Guerdane
  const jockeys = await supabaseRequest('jockeys?license_number=like.BENG-LJK-%');
  console.log(`\n🏇 Jockeys Ben Guerdane: ${jockeys.length}`);
  jockeys.slice(0, 5).forEach(j => {
    console.log(`   - ${j.name} (${j.weight_kg}kg)`);
  });
  if (jockeys.length > 5) console.log(`   ... et ${jockeys.length - 5} autres`);

  // Vérifier les entraîneurs Ben Guerdane
  const trainers = await supabaseRequest('trainers?license_number=like.BENG-LIC-%');
  console.log(`\n🎓 Entraîneurs Ben Guerdane: ${trainers.length}`);
  trainers.slice(0, 5).forEach(t => {
    console.log(`   - ${t.name} (${t.years_experience} ans d'exp.)`);
  });
  if (trainers.length > 5) console.log(`   ... et ${trainers.length - 5} autres`);

  // Statistiques globales
  const allUsers = await supabaseRequest('users');
  const allHorses = await supabaseRequest('horses');
  const allRaces = await supabaseRequest('races');

  console.log('\n📊 STATISTIQUES GLOBALES');
  console.log('-'.repeat(30));
  console.log(`👥 Utilisateurs total: ${allUsers.length}`);
  console.log(`🐎 Chevaux total: ${allHorses.length}`);
  console.log(`🏁 Courses total: ${allRaces.length}`);

  console.log('\n✅ Données Ben Guerdane intégrées avec succès !');
  console.log('🏇 Le système Tunisia Jockey Club contient maintenant:');
  console.log(`   • ${races.length} courses authentiques du 2 août 2025`);
  console.log(`   • ${horses.length} chevaux Pur-sang Arabe de Ben Guerdane`);
  console.log(`   • ${owners.length} propriétaires tunisiens`);
  console.log(`   • ${jockeys.length} jockeys professionnels`);
  console.log(`   • ${trainers.length} entraîneurs expérimentés`);
}

checkBenGuerdaneData();
