#!/usr/bin/env node

/**
 * Test UI/UX automatisé - Tunisia Jockey Club
 * Vérifie la performance, accessibilité et expérience utilisateur
 */

const { performance } = require('perf_hooks');

async function testUIUX() {
  console.log('🎨 Test UI/UX Tunisia Jockey Club - IFHA System\n');

  const baseURL = 'http://localhost:3000';
  const results = {
    performance: {},
    accessibility: {},
    usability: {},
    responsive: {},
    issues: [],
    recommendations: []
  };

  try {
    // Test 1: Performance des pages principales
    console.log('⚡ Test 1: Performance des pages');
    
    const pages = [
      { name: 'Accueil', url: '/' },
      { name: 'Dashboard', url: '/dashboard' },
      { name: 'IFHA Rating', url: '/ifha' },
      { name: 'API Health', url: '/api/health' }
    ];

    for (const page of pages) {
      try {
        const start = performance.now();
        const response = await fetch(`${baseURL}${page.url}`, { 
          method: 'GET',
          headers: {
            'Accept': 'text/html,application/json,*/*',
            'User-Agent': 'UI-UX-Test/1.0'
          },
          signal: AbortSignal.timeout(5000)
        });
        const responseText = await response.text();
        const loadTime = Math.round(performance.now() - start);
        
        results.performance[page.name] = {
          loadTime,
          status: response.status,
          size: responseText.length || 0,
          rating: loadTime < 1000 ? 'Excellent' : loadTime < 2000 ? 'Bon' : 'À améliorer'
        };

        console.log(`  ${page.name}: ${loadTime}ms (${response.status}) - ${results.performance[page.name].rating}`);
      } catch (error) {
        results.performance[page.name] = { error: error.message, rating: 'Erreur' };
        console.log(`  ${page.name}: ❌ Erreur - ${error.message}`);
      }
    }

    // Test 2: Structure sémantique HTML
    console.log('\n🏗️ Test 2: Structure et sémantique');
    
    try {
      const homeResponse = await fetch(`${baseURL}/`);
      const html = await homeResponse.text();
      
      const semanticElements = [
        { element: '<header', name: 'Header' },
        { element: '<nav', name: 'Navigation' },
        { element: '<main', name: 'Main content' },
        { element: '<footer', name: 'Footer' },
        { element: '<h1', name: 'H1 Heading' },
        { element: 'aria-label', name: 'ARIA Labels' },
        { element: 'alt=', name: 'Alt text' }
      ];

      semanticElements.forEach(({ element, name }) => {
        const found = html.includes(element);
        results.accessibility[name] = found;
        console.log(`  ${name}: ${found ? '✅' : '❌'}`);
        if (!found) results.issues.push(`Manque: ${name}`);
      });

    } catch (error) {
      console.log('  ❌ Impossible de tester la structure HTML');
      results.issues.push('Structure HTML non testable');
    }

    // Test 3: Responsive Design (simulation)
    console.log('\n📱 Test 3: Design responsive');
    
    const viewports = [
      { name: 'Desktop', width: 1920, rating: 'primary' },
      { name: 'Tablet', width: 768, rating: 'good' },
      { name: 'Mobile', width: 375, rating: 'critical' }
    ];

    // Vérification CSS responsive via les fichiers
    try {
      const cssResponse = await fetch(`${baseURL}/output.css`);
      const css = await cssResponse.text();
      
      viewports.forEach(({ name, width }) => {
        const hasMediaQuery = css.includes(`@media`) && (
          css.includes(`${width}px`) || 
          css.includes('max-width') || 
          css.includes('min-width')
        );
        
        results.responsive[name] = hasMediaQuery ? 'Supporté' : 'Non détecté';
        console.log(`  ${name} (${width}px): ${hasMediaQuery ? '✅' : '⚠️'} ${results.responsive[name]}`);
      });
      
    } catch (error) {
      console.log('  ⚠️ CSS non accessible pour test responsive');
      results.responsive['Status'] = 'Non testable';
    }

    // Test 4: Performance API Backend
    console.log('\n🔌 Test 4: Performance API Backend');
    
    const apiEndpoints = [
      '/api/health',
      '/simple-test/ping',
      '/simple-test/status'
    ];

    for (const endpoint of apiEndpoints) {
      try {
        const start = performance.now();
        const response = await fetch(`${baseURL}${endpoint}`, { 
          method: 'GET',
          signal: AbortSignal.timeout(3000)
        });
        const apiTime = Math.round(performance.now() - start);
        
        results.performance[`API ${endpoint}`] = {
          responseTime: apiTime,
          status: response.status,
          rating: apiTime < 100 ? 'Excellent' : apiTime < 500 ? 'Bon' : 'Lent'
        };

        console.log(`  ${endpoint}: ${apiTime}ms (${response.status}) - ${results.performance[`API ${endpoint}`].rating}`);
      } catch (error) {
        console.log(`  ${endpoint}: ❌ ${error.message}`);
        results.issues.push(`API ${endpoint} inaccessible`);
      }
    }

    // Analyse et recommandations
    console.log('\n📊 ANALYSE UI/UX GLOBALE');
    console.log('========================');

    // Performance globale
    const performanceScores = Object.values(results.performance)
      .filter(p => p.loadTime || p.responseTime)
      .map(p => p.loadTime || p.responseTime);
    
    const avgPerformance = performanceScores.length > 0 
      ? performanceScores.reduce((a, b) => a + b, 0) / performanceScores.length 
      : 0;

    console.log(`\n🚀 Performance moyenne: ${Math.round(avgPerformance)}ms`);

    // Accessibilité
    const accessibilityScore = Object.values(results.accessibility).filter(Boolean).length;
    const totalAccessibilityTests = Object.keys(results.accessibility).length;
    const accessibilityPercent = totalAccessibilityTests > 0 
      ? Math.round((accessibilityScore / totalAccessibilityTests) * 100) 
      : 0;

    console.log(`♿ Score accessibilité: ${accessibilityPercent}%`);

    // Responsive
    const responsiveSupported = Object.values(results.responsive).filter(r => r === 'Supporté').length;
    console.log(`📱 Support responsive: ${responsiveSupported}/3 viewports`);

    // Recommandations basées sur les résultats
    console.log('\n💡 RECOMMANDATIONS UI/UX:');
    console.log('=========================');

    if (avgPerformance > 2000) {
      console.log('⚡ PERFORMANCE: Optimiser le temps de chargement (>2s détecté)');
      results.recommendations.push('Optimiser images et assets');
      results.recommendations.push('Implémenter lazy loading');
    }

    if (accessibilityPercent < 70) {
      console.log('♿ ACCESSIBILITÉ: Améliorer la sémantique HTML');
      results.recommendations.push('Ajouter labels ARIA manquants');
      results.recommendations.push('Améliorer structure sémantique');
    }

    if (responsiveSupported < 2) {
      console.log('📱 RESPONSIVE: Améliorer le support multi-écrans');
      results.recommendations.push('Ajouter media queries manquantes');
      results.recommendations.push('Tester sur vrais appareils');
    }

    if (results.issues.length > 0) {
      console.log('\n❌ PROBLÈMES DÉTECTÉS:');
      results.issues.forEach(issue => console.log(`  - ${issue}`));
    }

    if (results.recommendations.length > 0) {
      console.log('\n✅ ACTIONS PRIORITAIRES:');
      results.recommendations.forEach((rec, i) => console.log(`  ${i + 1}. ${rec}`));
    }

    // Score global UI/UX
    const globalScore = Math.round(
      ((avgPerformance < 1000 ? 100 : Math.max(0, 100 - avgPerformance / 20)) * 0.4) +
      (accessibilityPercent * 0.3) +
      ((responsiveSupported / 3) * 100 * 0.3)
    );

    console.log('\n🏆 SCORE UI/UX GLOBAL:');
    console.log('=====================');
    console.log(`${globalScore}/100 - ${
      globalScore >= 80 ? '🟢 Excellent' : 
      globalScore >= 60 ? '🟡 Bon' : 
      '🔴 À améliorer'
    }`);

    return results;

  } catch (error) {
    console.error('❌ Erreur test UI/UX:', error.message);
    return results;
  }
}

// Exécuter le test
if (require.main === module) {
  testUIUX().then(results => {
    console.log('\n✅ Test UI/UX terminé');
    // Sauvegarde optionnelle des résultats
    // require('fs').writeFileSync('ui-ux-results.json', JSON.stringify(results, null, 2));
  });
}

module.exports = { testUIUX };
