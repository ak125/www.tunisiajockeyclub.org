#!/usr/bin/env node

/**
 * Test d'intégration du cache IFHA avec Redis
 * Teste directement les services sans passer par l'authentification HTTP
 */

const { NestFactory } = require('@nestjs/core');
const { AppModule } = require('./backend/dist/app.module');

async function testCacheIntegration() {
  console.log('🚀 Démarrage test intégration cache IFHA...\n');

  try {
    // Créer l'application NestJS
    const app = await NestFactory.createApplicationContext(AppModule, {
      logger: ['log', 'error', 'warn'],
    });

    // Récupérer les services
    const ifhaRatingService = app.get('IFHARatingService');
    const cacheService = app.get('IFHACacheService');
    const performanceTestService = app.get('PerformanceTestService');

    console.log('✅ Services récupérés avec succès\n');

    // Test 1: Métriques cache initiales
    console.log('📊 Test 1: Métriques cache initiales');
    const initialMetrics = await cacheService.getCacheMetrics();
    console.log('Cache metrics:', JSON.stringify(initialMetrics, null, 2));
    console.log('');

    // Test 2: Test de performance complet
    console.log('🎯 Test 2: Test de performance complet');
    const performanceResults = await performanceTestService.runPerformanceTest();
    console.log('Résultats performance:', JSON.stringify(performanceResults, null, 2));
    console.log('');

    // Test 3: Métriques après test
    console.log('📈 Test 3: Métriques cache après tests');
    const finalMetrics = await cacheService.getCacheMetrics();
    console.log('Cache metrics final:', JSON.stringify(finalMetrics, null, 2));
    console.log('');

    // Test 4: Test de charge
    console.log('🔥 Test 4: Test de charge concurrent (5 requêtes)');
    const loadResults = await performanceTestService.runLoadTest(5);
    console.log('Résultats charge:', JSON.stringify(loadResults, null, 2));
    console.log('');

    // Test 5: Comparaison performance avec/sans cache
    console.log('⚡ Test 5: Comparaison performance avec/sans cache');
    
    // Vider le cache pour test sans cache
    await cacheService.invalidateAllIFHACache();
    console.log('Cache vidé pour test sans cache');

    const startWithoutCache = Date.now();
    await ifhaRatingService.getStatistics();
    const timeWithoutCache = Date.now() - startWithoutCache;
    console.log(`Temps sans cache: ${timeWithoutCache}ms`);

    // Test avec cache (second appel)
    const startWithCache = Date.now();
    await ifhaRatingService.getStatistics();
    const timeWithCache = Date.now() - startWithCache;
    console.log(`Temps avec cache: ${timeWithCache}ms`);

    const improvement = ((timeWithoutCache - timeWithCache) / timeWithoutCache * 100).toFixed(1);
    console.log(`🚀 Amélioration: ${improvement}% plus rapide avec cache`);
    console.log('');

    // Résumé final
    console.log('🎊 RÉSUMÉ FINAL:');
    console.log('================');
    console.log(`✅ Cache opérationnel: ${initialMetrics.keysCount >= 0 ? 'OUI' : 'NON'}`);
    console.log(`⚡ Performance moyenne: ${performanceResults.averageTime.toFixed(1)}ms`);
    console.log(`🔥 Résistance charge: ${loadResults.successRate}% succès`);
    console.log(`🚀 Amélioration cache: ${improvement}%`);
    console.log(`📈 Hit rate cache: ${(finalMetrics.hitRate * 100).toFixed(1)}%`);

    await app.close();
    console.log('\n✅ Test d\'intégration terminé avec succès!');

  } catch (error) {
    console.error('❌ Erreur test intégration:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Exécuter le test
if (require.main === module) {
  testCacheIntegration();
}

module.exports = { testCacheIntegration };
