#!/usr/bin/env node

/**
 * 🔍 Script de vérification des données Ben Guerdane
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Configuration Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkRacecourse() {
  console.log('🏟️  Vérification hippodrome...');
  
  const { data, error } = await supabase
    .from('racecourses')
    .select('*')
    .eq('id', 'bdea3c2e-8b4f-4c5d-9e7f-123456789abc');

  if (error) {
    console.error('❌ Erreur:', error);
    return false;
  }

  if (data.length > 0) {
    console.log(`✅ Hippodrome trouvé: ${data[0].name}`);
    return true;
  } else {
    console.log('❌ Hippodrome non trouvé');
    return false;
  }
}

async function checkRaces() {
  console.log('🏁 Vérification courses...');
  
  const { data, error } = await supabase
    .from('races')
    .select(`
      *,
      racecourses(name),
      race_entries(
        id,
        horses(name),
        jockeys(user_id, users(first_name, last_name))
      )
    `)
    .eq('race_date', '2025-08-02')
    .order('race_number');

  if (error) {
    console.error('❌ Erreur:', error);
    return false;
  }

  console.log(`✅ ${data.length} courses trouvées pour le 2 août 2025:`);
  
  data.forEach(race => {
    console.log(`  🏁 Course ${race.race_number}: ${race.name}`);
    console.log(`     💰 Prix: ${race.prize_money} DT`);
    console.log(`     📏 Distance: ${race.distance_meters}m`);
    console.log(`     👥 Participants: ${race.race_entries?.length || 0}`);
    console.log('');
  });

  return data.length > 0;
}

async function checkHorses() {
  console.log('🐎 Vérification chevaux...');
  
  const { data, error } = await supabase
    .from('horses')
    .select('*')
    .limit(10);

  if (error) {
    console.error('❌ Erreur:', error);
    return false;
  }

  console.log(`✅ ${data.length} chevaux (échantillon):`);
  data.forEach(horse => {
    console.log(`  🐎 ${horse.name} (${horse.sex}, ${horse.breed})`);
  });

  return data.length > 0;
}

async function checkJockeys() {
  console.log('🏇 Vérification jockeys...');
  
  const { data, error } = await supabase
    .from('jockeys')
    .select(`
      *,
      users(first_name, last_name)
    `)
    .limit(5);

  if (error) {
    console.error('❌ Erreur:', error);
    return false;
  }

  console.log(`✅ ${data.length} jockeys (échantillon):`);
  data.forEach(jockey => {
    const fullName = `${jockey.users?.first_name} ${jockey.users?.last_name}`;
    console.log(`  🏇 ${fullName} (${jockey.weight_kg}kg)`);
  });

  return data.length > 0;
}

async function checkTrainers() {
  console.log('👨‍🏫 Vérification entraîneurs...');
  
  const { data, error } = await supabase
    .from('trainers')
    .select(`
      *,
      users(first_name, last_name)
    `)
    .limit(5);

  if (error) {
    console.error('❌ Erreur:', error);
    return false;
  }

  console.log(`✅ ${data.length} entraîneurs (échantillon):`);
  data.forEach(trainer => {
    const fullName = `${trainer.users?.first_name} ${trainer.users?.last_name}`;
    console.log(`  👨‍🏫 ${fullName} (${trainer.experience_years} ans d'expérience)`);
  });

  return data.length > 0;
}

async function checkRaceEntries() {
  console.log('📝 Vérification inscriptions...');
  
  const { data, error } = await supabase
    .from('race_entries')
    .select(`
      *,
      races(name, race_number),
      horses(name),
      jockeys(users(first_name, last_name)),
      trainers(users(first_name, last_name))
    `)
    .limit(10);

  if (error) {
    console.error('❌ Erreur:', error);
    return false;
  }

  console.log(`✅ ${data.length} inscriptions (échantillon):`);
  data.forEach(entry => {
    const jockeyName = `${entry.jockeys?.users?.first_name} ${entry.jockeys?.users?.last_name}`;
    console.log(`  📝 Course ${entry.races?.race_number}: ${entry.horses?.name} avec ${jockeyName}`);
  });

  return data.length > 0;
}

async function checkCompleteData() {
  console.log('📊 Vérification complète des données...');
  
  const { data: raceData, error: raceError } = await supabase
    .from('races')
    .select(`
      *,
      racecourses(name, location),
      race_entries(
        id,
        cloth_number,
        weight_carried_kg,
        horses(name, sex, breed),
        jockeys(
          weight_kg,
          users(first_name, last_name)
        ),
        trainers(
          users(first_name, last_name)
        )
      )
    `)
    .eq('race_date', '2025-08-02')
    .order('race_number');

  if (raceError) {
    console.error('❌ Erreur:', raceError);
    return false;
  }

  console.log('\n📋 PROGRAMME COMPLET - Samedi 2 août 2025');
  console.log('🏟️  Hippodrome de Ben Guerdane');
  console.log('=====================================\n');

  raceData.forEach(race => {
    console.log(`🏁 ${race.race_number}ère Course - ${race.race_time}`);
    console.log(`📛 Prix: ${race.name}`);
    console.log(`💰 Allocation: ${race.prize_money} DT`);
    console.log(`📏 Distance: ${race.distance_meters} m`);
    console.log(`🏇 Participants: ${race.race_entries.length}`);
    console.log('');

    race.race_entries.forEach(entry => {
      const jockeyName = `${entry.jockeys?.users?.first_name || ''} ${entry.jockeys?.users?.last_name || ''}`.trim();
      const trainerName = `${entry.trainers?.users?.first_name || ''} ${entry.trainers?.users?.last_name || ''}`.trim();
      
      console.log(`  ${entry.cloth_number}. ${entry.horses?.name} - ${jockeyName} (${entry.weight_carried_kg}kg) - Entr.: ${trainerName}`);
    });
    
    console.log('\n' + '-'.repeat(50) + '\n');
  });

  return true;
}

async function main() {
  try {
    console.log('🔍 VÉRIFICATION DES DONNÉES BEN GUERDANE');
    console.log('=========================================\n');

    const checks = [
      await checkRacecourse(),
      await checkRaces(),
      await checkHorses(),
      await checkJockeys(),
      await checkTrainers(),
      await checkRaceEntries()
    ];

    const allChecksPass = checks.every(check => check);

    console.log('\n📊 RÉSUMÉ DES VÉRIFICATIONS:');
    console.log(`✅ Toutes les vérifications: ${allChecksPass ? 'RÉUSSIES' : 'ÉCHOUÉES'}`);

    if (allChecksPass) {
      console.log('\n🎉 Les données sont correctement injectées !');
      console.log('🔄 Affichage du programme complet...\n');
      await checkCompleteData();
    } else {
      console.log('\n❌ Certaines vérifications ont échoué');
      console.log('💡 Veuillez d\'abord exécuter: node inject-ben-guerdane-data.js');
    }

  } catch (error) {
    console.error('💥 ERREUR:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
