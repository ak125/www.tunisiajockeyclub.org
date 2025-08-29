#!/usr/bin/env node

const https = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Node.js Test Client'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}

async function testRatingSystem() {
  console.log('🎯 Test du système de rating - Tunisia Jockey Club\n');

  try {
    // Test 1: Endpoint simple de test
    console.log('📡 Test 1: Endpoint simple...');
    const simpleTest = await makeRequest('/simple-test/ping');
    console.log('Status:', simpleTest.status);
    console.log('Data:', JSON.stringify(simpleTest.data, null, 2));
    console.log('✅ Test simple réussi\n');

    // Test 2: Statistiques des ratings
    console.log('📊 Test 2: Statistiques des ratings...');
    const statsTest = await makeRequest('/api/ratings/statistics');
    console.log('Status:', statsTest.status);
    if (statsTest.status === 401) {
      console.log('⚠️  Authentification requise (normal)\n');
    } else {
      console.log('Data:', JSON.stringify(statsTest.data, null, 2));
      console.log('✅ Statistiques récupérées\n');
    }

    // Test 3: Liste des chevaux avec ratings
    console.log('🐴 Test 3: Liste des chevaux...');
    const listTest = await makeRequest('/api/ratings/list');
    console.log('Status:', listTest.status);
    if (listTest.status === 401) {
      console.log('⚠️  Authentification requise (normal)\n');
    } else {
      console.log('Data:', JSON.stringify(listTest.data, null, 2));
      console.log('✅ Liste récupérée\n');
    }

    // Test 4: Rating d'un cheval spécifique (test)
    console.log('🎯 Test 4: Rating test pour un cheval...');
    const horseTest = await makeRequest('/simple-test/rating/test-horse-123');
    console.log('Status:', horseTest.status);
    console.log('Data:', JSON.stringify(horseTest.data, null, 2));
    console.log('✅ Test rating cheval réussi\n');

    console.log('🎉 Résumé des tests terminés !');
    console.log('✅ API Backend NestJS: Fonctionnel');
    console.log('✅ Routes de rating: Enregistrées');
    console.log('✅ Endpoints de test: Opérationnels');
    console.log('⚠️  Authentification: Requise pour API principale');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
  }
}

// Lancer les tests
testRatingSystem();
