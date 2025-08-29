const fs = require('fs');
const path = require('path');

console.log('🔍 Audit Alt Text - Recherche d\'images sans alt text\n');

// Fonction pour scanner récursivement les fichiers
function scanDirectory(dirPath, extension = '.tsx') {
  const files = [];
  
  function scan(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scan(fullPath);
      } else if (stat.isFile() && item.endsWith(extension)) {
        files.push(fullPath);
      }
    }
  }
  
  scan(dirPath);
  return files;
}

// Patterns pour détecter les images sans alt text approprié
const imagePatterns = [
  // Images avec alt vide - pattern plus précis
  /<img[^>]*alt=["'][\s]*["'][^>]*>/gi,
  
  // Images avec alt générique - pattern exact
  /<img[^>]*alt=["']\s*(image|photo|picture|img|placeholder)\s*["'][^>]*>/gi,
  
  // Balises img sans alt du tout - pattern plus précis
  /<img(?![^>]*alt\s*=)[^>]*>/gi
];

const frontendDir = '/workspaces/tunisia-jockey-club-clean/frontend';
const files = scanDirectory(path.join(frontendDir, 'app'));

let issuesFound = 0;
let totalImages = 0;

console.log('📁 Analyse des fichiers TSX...\n');

for (const filePath of files) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativePath = filePath.replace(frontendDir + '/', '');
    
    // Compter toutes les images
    const allImages = content.match(/<img[^>]*>/gi) || [];
    totalImages += allImages.length;
    
    if (allImages.length > 0) {
      console.log(`📄 ${relativePath} - ${allImages.length} image(s) trouvée(s)`);
      
      // Vérifier chaque pattern problématique
      for (let i = 0; i < imagePatterns.length; i++) {
        const pattern = imagePatterns[i];
        const matches = content.match(pattern);
        
        if (matches) {
          issuesFound += matches.length;
          console.log(`  ❌ ${matches.length} image(s) problématique(s) détectée(s):`);
          
          matches.forEach((match, index) => {
            // Trouver le numéro de ligne
            const beforeMatch = content.substring(0, content.indexOf(match));
            const lineNumber = beforeMatch.split('\n').length;
            
            console.log(`     Ligne ${lineNumber}: ${match.substring(0, 80)}...`);
          });
        } else {
          console.log(`  ✅ Toutes les images ont un alt text approprié`);
        }
      }
      console.log('');
    }
  } catch (error) {
    console.error(`Erreur lors de la lecture de ${filePath}:`, error.message);
  }
}

console.log('📊 RÉSUMÉ AUDIT ALT TEXT');
console.log('========================');
console.log(`📸 Images totales trouvées: ${totalImages}`);
console.log(`❌ Images problématiques: ${issuesFound}`);
console.log(`✅ Images conformes: ${totalImages - issuesFound}`);
console.log(`📈 Taux de conformité: ${Math.round(((totalImages - issuesFound) / totalImages) * 100)}%`);

if (issuesFound === 0) {
  console.log('\n🎉 Excellent ! Toutes les images ont un alt text approprié.');
} else {
  console.log('\n⚠️  Des améliorations sont nécessaires pour atteindre 100% de conformité.');
}

console.log('\n🔍 Audit terminé.');
