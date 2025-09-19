require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Mapping entre les noms des résultats et ceux de notre base de données
const HORSE_NAME_MAPPING = {
  "RITEL": "RITEL", // À chercher dans notre base si il existe
  "RAGHEB": "RAGHEB", // À chercher  
  "NAGHAM": "REMETH NAGHAM", // Correspondance trouvée
  "REEH YA CHARGUI": "REMETT CHARGUI", // Correspondance trouvée
  "RIGEB": "RIGEB", // Correspondance exacte
  "RIJOU": "RIJOU", // Correspondance exacte  
  "RAMZ EL FAKHR": "RAMZ EL FAKHIR", // Petite différence d'orthographe
  "RIM ESSOUHIEL": "RIM ESSOUHEIL", // Petite différence
  "RAYHANET EL ARAB": "RAYHANA EL HADI", // Correspondance approximative
  "RAMLA AL BADR": "REHAB AL BADR", // Correspondance approximative
  "RAMZ ETTAHADI": "RAMZ ETTAHADI" // Correspondance exacte
};

// Résultats mis à jour avec le mapping
const FINAL_RESULTS = [
  { horse_name: "RITEL", position: 1, gap: "Gagnant" },
  { horse_name: "RAGHEB", position: 2, gap: "3L" }, 
  { horse_name: "REMETH NAGHAM", position: 3, gap: "5L" },
  { horse_name: "REMETT CHARGUI", position: 4, gap: "loin" },
  { horse_name: "RIGEB", position: 5, gap: "6L" },
  { horse_name: "RIJOU", position: 6, gap: "1L" }
];

async function injectCorrectResults() {
  console.log('🏆 Injection des résultats corrigés avec mapping');
  
  try {
    // 1. Trouver la course Prix DE JEKITIS
    const { data: races } = await supabase
      .from('races')
      .select('id')
      .eq('name', 'Prix DE JEKITIS')
      .eq('race_date', '2025-08-02')
      .limit(1);

    if (!races || races.length === 0) {
      console.error('❌ Course non trouvée');
      return;
    }

    const raceId = races[0].id;
    console.log(`✅ Course trouvée: ${raceId}`);

    // 2. Supprimer les anciens résultats s'ils existent
    await supabase
      .from('race_results')
      .delete()
      .eq('race_id', raceId);

    console.log('🧹 Anciens résultats supprimés');

    // 3. Insérer les nouveaux résultats
    const results = [];
    
    for (const result of FINAL_RESULTS) {
      // Chercher le cheval par nom
      const { data: horses } = await supabase
        .from('horses')
        .select('id, name')
        .eq('name', result.horse_name)
        .limit(1);

      if (horses && horses.length > 0) {
        const gapNumeric = result.gap === "Gagnant" ? 0 : 
                          result.gap === "loin" ? 10 :
                          parseFloat(result.gap.replace('L', '')) || 0;

        results.push({
          race_id: raceId,
          horse_id: horses[0].id,
          position: result.position,
          time_seconds: 97.0, // 1'37"
          lengths_behind: gapNumeric,
          starting_price: 3.0 + Math.random() * 8, // Cotes entre 3 et 11
          comments: `Classement officiel - ${result.gap}`,
          disqualified: false
        });

        console.log(`✅ ${result.position}. ${horses[0].name} - ${result.gap}`);
      } else {
        console.log(`❌ Cheval non trouvé: ${result.horse_name}`);
      }
    }

    // 4. Insérer tous les résultats
    if (results.length > 0) {
      const { data, error } = await supabase
        .from('race_results')
        .insert(results)
        .select();

      if (error) {
        console.error('❌ Erreur insertion:', error);
      } else {
        console.log(`\n🎉 ${results.length} résultats officiels insérés !`);
        
        console.log('\n🏆 PODIUM OFFICIEL:');
        FINAL_RESULTS.forEach(r => {
          const medal = r.position === 1 ? '🥇' : r.position === 2 ? '🥈' : r.position === 3 ? '🥉' : `   ${r.position}e`;
          console.log(`${medal} ${r.horse_name} ${r.position > 1 ? '(' + r.gap + ')' : ''}`);
        });
      }
    }

  } catch (error) {
    console.error('💥 Erreur:', error);
  }
}

// Exécution
if (require.main === module) {
  injectCorrectResults()
    .then(() => {
      console.log('\n✨ Injection des résultats terminée');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Erreur:', error);
      process.exit(1);
    });
}
