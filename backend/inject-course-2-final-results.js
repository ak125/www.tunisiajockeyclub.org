require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Résultats officiels Course 2 - Prix de Choucha
// 1er : n°1 – Rahib Albadeia (S. Khaouar) - 2'10''
// 2e : n°7 – Razane (Seif Daas) - Loin
// 3e : n°3 – Rafaan (MOU. Mechi) - 4L
// 4e : n°4 – Ragouj (W.B. Kraiem) - Loin
// 5e : n°2 – Ramaz Al Hosn (M.A. Bouchnib) - 6L
// 6e : n°6 – Rabeb El Ezz (M. Am Allagui) - Loin
// NP : n°5 – Choucha (T. Mahfoudh) - Non Partant

const COURSE_2_RESULTS = [
  { horse_name: "Rahib Albadeia", position: 1, gap: "Gagnant", time: "2'10''" },
  { horse_name: "Razane", position: 2, gap: "Loin", time: null },
  { horse_name: "Rafaan", position: 3, gap: "4L", time: null },
  { horse_name: "Ragouj", position: 4, gap: "Loin", time: null },
  { horse_name: "Ramaz Al Hosn", position: 5, gap: "6L", time: null },
  { horse_name: "Rabeb El Ezz", position: 6, gap: "Loin", time: null }
  // Choucha = Non Partant (NP) - pas dans les résultats classés
];

async function injectCourse2Results() {
  console.log('🏇 Injection des résultats Course 2 - Prix de Choucha');
  
  try {
    // 1. Trouver la course Prix DE CHOUCHA
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

    // 2. Mettre à jour le statut de la course à "finished"
    await supabase
      .from('races')
      .update({ status: 'finished' })
      .eq('id', raceId);

    console.log('✅ Statut de la course mis à jour: finished');

    // 3. Supprimer les anciens résultats s'ils existent
    await supabase
      .from('race_results')
      .delete()
      .eq('race_id', raceId);

    console.log('🧹 Anciens résultats supprimés');

    // 4. Insérer les nouveaux résultats
    const results = [];
    
    for (const result of COURSE_2_RESULTS) {
      // Chercher le cheval par nom exact
      const { data: horses } = await supabase
        .from('horses')
        .select('id, name')
        .eq('name', result.horse_name)
        .limit(1);

      if (horses && horses.length > 0) {
        // Convertir les gaps en valeurs numériques
        let gapNumeric = 0;
        if (result.gap === "Gagnant") {
          gapNumeric = 0;
        } else if (result.gap === "Loin") {
          gapNumeric = 15; // Valeur arbitraire pour "loin"
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
      } else {
        console.log(`❌ Cheval non trouvé: ${result.horse_name}`);
      }
    }

    // 5. Insérer tous les résultats
    if (results.length > 0) {
      const { error } = await supabase
        .from('race_results')
        .insert(results);

      if (error) {
        console.error('❌ Erreur lors de l\'insertion:', error);
      } else {
        console.log(`🎉 ${results.length} résultats officiels insérés !`);
      }
    }

    // 6. Afficher le podium final
    console.log('\n🏆 PODIUM OFFICIEL PRIX DE CHOUCHA:');
    console.log('🥇 1er : Rahib Albadeia (S. Khaouar) - 2\'10\'\'');
    console.log('🥈 2e : Razane (Seif Daas) - Loin');
    console.log('🥉 3e : Rafaan (MOU. Mechi) - 4L');
    console.log('   4e : Ragouj (W.B. Kraiem) - Loin');
    console.log('   5e : Ramaz Al Hosn (M.A. Bouchnib) - 6L');
    console.log('   6e : Rabeb El Ezz (M. Am Allagui) - Loin');
    console.log('   NP : Choucha (T. Mahfoudh) - Non Partant');

    console.log('\n✨ Injection des résultats Course 2 terminée');

  } catch (error) {
    console.error('❌ Erreur:', error);
  }
}

// Exécuter
injectCourse2Results();
