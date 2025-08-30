const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testRatingSystem() {
  console.log('🎯 Test du système de rating des chevaux...\n');

  try {
    // 1. Vérifier les statistiques générales
    console.log('📊 Récupération des statistiques...');
    const statsResponse = await axios.get(`${BASE_URL}/ratings/statistics`);
    console.log('Statistiques:', JSON.stringify(statsResponse.data, null, 2));

    // 2. Liste des chevaux avec ratings
    console.log('\n🐴 Liste des chevaux avec ratings...');
    const listResponse = await axios.get(`${BASE_URL}/ratings/list`);
    console.log('Chevaux avec ratings:', JSON.stringify(listResponse.data, null, 2));

    // 3. Si on a des chevaux, tester le rating d'un cheval
    const horses = listResponse.data.horses;
    if (horses && horses.length > 0) {
      const firstHorse = horses[0];
      console.log(`\n🎯 Test rating du cheval ${firstHorse.name} (${firstHorse.id})...`);
      
      const horseRatingResponse = await axios.get(`${BASE_URL}/ratings/horse/${firstHorse.id}`);
      console.log('Rating cheval:', JSON.stringify(horseRatingResponse.data, null, 2));

      // 4. Tester le calcul du rating initial
      console.log(`\n🧮 Test calcul rating initial...`);
      try {
        const initialRatingResponse = await axios.post(`${BASE_URL}/ratings/calculate-initial/${firstHorse.id}`);
        console.log('Rating initial:', JSON.stringify(initialRatingResponse.data, null, 2));
      } catch (error) {
        if (error.response) {
          console.log('Erreur attendue (normal si < 3 courses):', error.response.data.message);
        }
      }
    } else {
      console.log('Aucun cheval avec rating trouvé.');
    }

    console.log('\n✅ Test du système de rating terminé avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors du test:', error.response?.data || error.message);
  }
}

// Lancer le test
testRatingSystem();
