import { supabase } from '../frontend/app/services/supabase.server';
import { getDashboardStats, getMonthlyRaceData, getHorsePerformance } from '../frontend/app/services/dashboard.server';

async function testSupabaseConnection() {
  console.log('🔍 Test de connexion Supabase...');
  
  try {
    // Test 1: Connexion de base
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('count')
      .limit(1);

    if (usersError) {
      console.error('❌ Erreur de connexion Supabase:', usersError);
      return false;
    }

    console.log('✅ Connexion Supabase établie');

    // Test 2: Statistiques du dashboard
    console.log('\n📊 Test des statistiques du dashboard...');
    const stats = await getDashboardStats();
    console.log('Stats récupérées:', stats);

    // Test 3: Données mensuelles
    console.log('\n📈 Test des données mensuelles...');
    const monthlyData = await getMonthlyRaceData();
    console.log('Données mensuelles:', monthlyData.slice(0, 3));

    // Test 4: Performance des chevaux
    console.log('\n🐎 Test des performances des chevaux...');
    const horsePerf = await getHorsePerformance();
    console.log('Top 3 chevaux:', horsePerf.slice(0, 3));

    return true;
  } catch (error) {
    console.error('❌ Erreur durant les tests:', error);
    return false;
  }
}

// Exécuter les tests
testSupabaseConnection()
  .then((success) => {
    if (success) {
      console.log('\n🎉 Tous les tests sont réussis !');
      process.exit(0);
    } else {
      console.log('\n💥 Certains tests ont échoué');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('💥 Erreur fatale:', error);
    process.exit(1);
  });
