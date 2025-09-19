require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Données complètes Course 2 - Prix de Choucha
const COURSE_2_DATA = {
  participants: [
    {
      number: 1,
      horse_name: "Rahib Albadeia",
      owner: "Kais Ghabri",
      jockey: "S. Khaouar",
      weight: 57.0,
      trainer: "Br. Ghabri",
      sire: "Tej El Ahlem",
      dam: "Kalimat Essalem",
      performance: "3-3-0-3-3"
    },
    {
      number: 2,
      horse_name: "Ramaz Al Hosn",
      owner: "Ghanem Abdessattar",
      jockey: "M.A. Bouchnib",
      weight: 55.0,
      trainer: "Nassim Alibi",
      sire: "Derbes",
      dam: "Hajiz",
      performance: "2-2-4-0-5"
    },
    {
      number: 3,
      horse_name: "Rafaan",
      owner: "Said Belhadj",
      jockey: "MOU. Mechi",
      weight: 55.0,
      trainer: "Jamel Brik",
      sire: "Derbes",
      dam: "Halfaaouine",
      performance: "6-4-5-5-0"
    },
    {
      number: 4,
      horse_name: "Ragouj",
      owner: "Jahouache Abdessattar",
      jockey: "W.B. Kraiem",
      weight: 54.0,
      trainer: "Sof. Salah",
      sire: "Derbes",
      dam: "Danidana",
      performance: "7-0-0"
    },
    {
      number: 5,
      horse_name: "Choucha",
      owner: "Jamil Sfaxi",
      jockey: "T. Mahfoudh",
      weight: 53.0,
      trainer: "Med Hajeri",
      sire: "Ghazi Farid",
      dam: "Anida",
      performance: "0"
    },
    {
      number: 6,
      horse_name: "Rabeb El Ezz",
      owner: "Salim Bouaziz",
      jockey: "M. Am Allagui",
      weight: 53.0,
      trainer: "Sadok Trifa",
      sire: "Derbes",
      dam: "Gaddada",
      performance: "7"
    },
    {
      number: 7,
      horse_name: "Razane",
      owner: "Kamel Mosrati",
      jockey: "Seif Daas",
      weight: 53.0,
      trainer: "Dhaou Brik",
      sire: "Hacher",
      dam: "Ghayahib",
      performance: "0"
    }
  ],
  results: [
    { horse_name: "Rahib Albadeia", position: 1, gap: "Gagnant", time: "2'10''" },
    { horse_name: "Razane", position: 2, gap: "Loin", time: null },
    { horse_name: "Rafaan", position: 3, gap: "4L", time: null },
    { horse_name: "Ragouj", position: 4, gap: "Loin", time: null },
    { horse_name: "Ramaz Al Hosn", position: 5, gap: "6L", time: null },
    { horse_name: "Rabeb El Ezz", position: 6, gap: "Loin", time: null }
  ]
};

async function injectCompleteCourse2() {
  console.log('🏇 Injection complète Course 2 - Prix de Choucha');
  
  try {
    // 1. Créer les propriétaires
    console.log('👨‍💼 Création des propriétaires...');
    const owners = [...new Set(COURSE_2_DATA.participants.map(p => p.owner))];
    for (const owner of owners) {
      await supabase
        .from('users')
        .upsert({
          name: owner,
          email: `${owner.toLowerCase().replace(/\s+/g, '.')}@owner.tn`,
          role: 'owner',
          created_at: new Date().toISOString()
        }, { onConflict: 'email' });
    }
    console.log(`✅ ${owners.length} propriétaires créés/mis à jour`);

    // 2. Créer les jockeys
    console.log('🏇 Création des jockeys...');
    const jockeys = [...new Set(COURSE_2_DATA.participants.map(p => p.jockey))];
    for (const jockey of jockeys) {
      await supabase
        .from('jockeys')
        .upsert({
          name: jockey,
          license_number: `JCK-${jockey.replace(/\s+/g, '').toUpperCase()}`,
          created_at: new Date().toISOString()
        }, { onConflict: 'license_number' });
    }
    console.log(`✅ ${jockeys.length} jockeys créés/mis à jour`);

    // 3. Créer les entraîneurs
    console.log('👨‍🏫 Création des entraîneurs...');
    const trainers = [...new Set(COURSE_2_DATA.participants.map(p => p.trainer))];
    for (const trainer of trainers) {
      await supabase
        .from('trainers')
        .upsert({
          name: trainer,
          license_number: `TRN-${trainer.replace(/\s+/g, '').toUpperCase()}`,
          created_at: new Date().toISOString()
        }, { onConflict: 'license_number' });
    }
    console.log(`✅ ${trainers.length} entraîneurs créés/mis à jour`);

    // 4. Créer les chevaux
    console.log('🐎 Création des chevaux...');
    for (const participant of COURSE_2_DATA.participants) {
      await supabase
        .from('horses')
        .upsert({
          name: participant.horse_name,
          breed: 'Pur Sang Arabe',
          birth_year: 2022, // 3 ans en 2025
          sex: ['Choucha', 'Rabeb El Ezz', 'Razane'].includes(participant.horse_name) ? 'F' : 'M',
          sire: participant.sire,
          dam: participant.dam,
          created_at: new Date().toISOString()
        }, { onConflict: 'name' });
    }
    console.log(`✅ ${COURSE_2_DATA.participants.length} chevaux créés/mis à jour`);

    // 5. Trouver la course
    const { data: races } = await supabase
      .from('races')
      .select('id, name')
      .ilike('name', '%CHOUCHA%')
      .eq('race_number', 2)
      .limit(1);

    if (!races || races.length === 0) {
      console.error('❌ Course Prix de Choucha non trouvée');
      return;
    }

    const raceId = races[0].id;
    console.log(`✅ Course trouvée: ${races[0].name} (${raceId})`);

    // 6. Créer les inscriptions (race_entries)
    console.log('📝 Création des inscriptions...');
    for (const participant of COURSE_2_DATA.participants) {
      const { data: horse } = await supabase
        .from('horses')
        .select('id')
        .eq('name', participant.horse_name)
        .single();

      const { data: jockey } = await supabase
        .from('jockeys')
        .select('id')
        .eq('name', participant.jockey)
        .single();

      if (horse && jockey) {
        await supabase
          .from('race_entries')
          .upsert({
            race_id: raceId,
            horse_id: horse.id,
            jockey_id: jockey.id,
            horse_number: participant.number,
            weight: participant.weight,
            created_at: new Date().toISOString()
          }, { onConflict: 'race_id,horse_id' });
      }
    }
    console.log(`✅ ${COURSE_2_DATA.participants.length} inscriptions créées`);

    // 7. Mettre à jour le statut de la course
    await supabase
      .from('races')
      .update({ status: 'finished' })
      .eq('id', raceId);

    // 8. Supprimer anciens résultats et injecter les nouveaux
    await supabase
      .from('race_results')
      .delete()
      .eq('race_id', raceId);

    console.log('🏆 Injection des résultats...');
    const results = [];
    
    for (const result of COURSE_2_DATA.results) {
      const { data: horses } = await supabase
        .from('horses')
        .select('id, name')
        .eq('name', result.horse_name)
        .limit(1);

      if (horses && horses.length > 0) {
        let gapNumeric = 0;
        if (result.gap === "Gagnant") {
          gapNumeric = 0;
        } else if (result.gap === "Loin") {
          gapNumeric = 15;
        } else if (result.gap.includes('L')) {
          gapNumeric = parseFloat(result.gap.replace('L', '')) || 0;
        }

        results.push({
          race_id: raceId,
          horse_id: horses[0].id,
          position: result.position,
          time: result.time,
          lengths_behind: gapNumeric,
          notes: result.gap === "Loin" ? "Loin" : null,
          created_at: new Date().toISOString()
        });

        console.log(`✅ ${result.position}. ${result.horse_name} - ${result.gap}`);
      }
    }

    if (results.length > 0) {
      await supabase
        .from('race_results')
        .insert(results);
      console.log(`🎉 ${results.length} résultats officiels insérés !`);
    }

    // 9. Afficher le résumé final
    console.log('\n🏆 PODIUM OFFICIEL PRIX DE CHOUCHA:');
    console.log('🥇 1er : Rahib Albadeia (S. Khaouar) - 2\'10\'\'');
    console.log('🥈 2e : Razane (Seif Daas) - Loin');
    console.log('🥉 3e : Rafaan (MOU. Mechi) - 4L');
    console.log('   4e : Ragouj (W.B. Kraiem) - Loin');
    console.log('   5e : Ramaz Al Hosn (M.A. Bouchnib) - 6L');
    console.log('   6e : Rabeb El Ezz (M. Am Allagui) - Loin');
    console.log('   NP : Choucha (T. Mahfoudh) - Non Partant');

    console.log('\n📊 Résumé:');
    console.log(`- 7 participants inscrits`);
    console.log(`- 6 classés (1 non partant)`);
    console.log(`- Course terminée (status: finished)`);
    console.log(`- Temps officiel: 2'10'' (Rahib Albadeia)`);
    
    console.log('\n✨ Injection complète Course 2 terminée avec succès !');

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Exécuter
injectCompleteCourse2();
