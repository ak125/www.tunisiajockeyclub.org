// Test simple d'import de @fafa/frontend
console.log('Test d\'import de @fafa/frontend...');

async function testImport() {
  try {
    const { getServerBuild } = await import('@fafa/frontend');
    console.log('✅ Import réussi:', typeof getServerBuild);
    
    const build = await getServerBuild();
    console.log('✅ Build récupéré:', typeof build);
    
  } catch (error) {
    console.error('❌ Erreur d\'import:', error);
  }
}

testImport();
