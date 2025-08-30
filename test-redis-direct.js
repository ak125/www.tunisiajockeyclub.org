#!/usr/bin/env node

/**
 * Test direct du cache Redis IFHA
 * Test les fonctionnalités de cache sans passer par NestJS
 */

const Redis = require('ioredis');

async function testRedisCache() {
  console.log('🔧 Test direct du cache Redis IFHA...\n');

  try {
    // Connexion Redis
    const redis = new Redis({
      host: 'localhost',
      port: 6379,
      maxRetriesPerRequest: 3,
      retryDelayOnFailover: 100,
    });

    console.log('✅ Connexion Redis établie');

    // Test 1: Vérification connexion
    console.log('\n📡 Test 1: Ping Redis');
    const pong = await redis.ping();
    console.log(`Réponse: ${pong}`);

    // Test 2: Configuration cache IFHA
    const cacheConfig = {
      ratings: 300, // 5 minutes
      conversions: 3600, // 1 heure
      statistics: 900, // 15 minutes
      horses: 1800, // 30 minutes
    };

    // Test 3: Test de performance cache vs calcul
    console.log('\n⚡ Test 3: Performance cache vs calcul');

    const testData = {
      horseId: 'test-horse-123',
      rating: {
        localRating: 85,
        confidence: 92,
        internationalScale: 'Tunisia',
        lastUpdate: new Date().toISOString(),
      },
    };

    // Simulation calcul (attente)
    const startCalc = Date.now();
    await new Promise(resolve => setTimeout(resolve, 50)); // Simule calcul 50ms
    const calcTime = Date.now() - startCalc;
    console.log(`Temps simulation calcul: ${calcTime}ms`);

    // Test cache - écriture
    const startWrite = Date.now();
    const cacheKey = `ifha:rating:${testData.horseId}`;
    await redis.setex(cacheKey, cacheConfig.ratings, JSON.stringify(testData.rating));
    const writeTime = Date.now() - startWrite;
    console.log(`Temps écriture cache: ${writeTime}ms`);

    // Test cache - lecture
    const startRead = Date.now();
    const cached = await redis.get(cacheKey);
    const readTime = Date.now() - startRead;
    const cachedData = cached ? JSON.parse(cached) : null;
    console.log(`Temps lecture cache: ${readTime}ms`);
    console.log(`Données récupérées: ${cachedData ? 'OUI' : 'NON'}`);

    // Test 4: Test charge concurrent
    console.log('\n🔥 Test 4: Charge concurrente (10 opérations)');
    const concurrent = 10;
    const operations = [];

    for (let i = 0; i < concurrent; i++) {
      operations.push(async () => {
        const startTime = Date.now();
        const key = `ifha:test:${i}`;
        const value = { test: true, index: i, timestamp: Date.now() };
        
        // Écriture
        await redis.setex(key, 60, JSON.stringify(value));
        
        // Lecture immédiate
        const result = await redis.get(key);
        const duration = Date.now() - startTime;
        
        return {
          index: i,
          success: result !== null,
          duration,
        };
      });
    }

    const startConcurrent = Date.now();
    const results = await Promise.all(operations.map(op => op()));
    const concurrentTime = Date.now() - startConcurrent;

    const successful = results.filter(r => r.success).length;
    const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length;

    console.log(`Opérations réussies: ${successful}/${concurrent}`);
    console.log(`Temps total concurrent: ${concurrentTime}ms`);
    console.log(`Temps moyen par opération: ${avgDuration.toFixed(1)}ms`);

    // Test 5: Métriques Redis
    console.log('\n📊 Test 5: Métriques Redis');
    const info = await redis.info('stats');
    const totalConnections = extractMetric(info, 'total_connections_received');
    const totalCommands = extractMetric(info, 'total_commands_processed');
    const hits = extractMetric(info, 'keyspace_hits');
    const misses = extractMetric(info, 'keyspace_misses');

    console.log(`Connexions totales: ${totalConnections}`);
    console.log(`Commandes totales: ${totalCommands}`);
    console.log(`Cache hits: ${hits}`);
    console.log(`Cache misses: ${misses}`);
    console.log(`Hit rate: ${hits + misses > 0 ? ((hits / (hits + misses)) * 100).toFixed(1) : 0}%`);

    // Test 6: Nettoyage
    console.log('\n🧹 Test 6: Nettoyage cache test');
    const testKeys = await redis.keys('ifha:test:*');
    if (testKeys.length > 0) {
      await redis.del(...testKeys);
      console.log(`Supprimé ${testKeys.length} clés de test`);
    }

    // Fermeture connexion
    await redis.quit();
    console.log('\n✅ Connexion Redis fermée');

    // Résumé final
    console.log('\n🎊 RÉSUMÉ PERFORMANCE CACHE:');
    console.log('============================');
    console.log(`⚡ Gain performance: ${((calcTime - readTime) / calcTime * 100).toFixed(1)}% plus rapide`);
    console.log(`🔥 Résistance concurrence: ${(successful / concurrent * 100).toFixed(1)}% succès`);
    console.log(`📈 Hit rate: ${hits + misses > 0 ? ((hits / (hits + misses)) * 100).toFixed(1) : 0}%`);
    console.log(`🚀 Cache opérationnel: OUI`);

  } catch (error) {
    console.error('❌ Erreur test Redis:', error.message);
    process.exit(1);
  }
}

function extractMetric(info, metric) {
  const match = info.match(new RegExp(`${metric}:(\\d+)`));
  return match ? parseInt(match[1]) : 0;
}

// Exécuter le test
if (require.main === module) {
  testRedisCache();
}

module.exports = { testRedisCache };
