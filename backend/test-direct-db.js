const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  datasources: {
    db: {
      url: process.env.DIRECT_URL || process.env.DATABASE_URL
    }
  }
});

async function testDatabaseConnection() {
  try {
    console.log('🔍 Test de connexion avec DIRECT_URL...');
    
    // Test de connexion basique
    await prisma.$connect();
    console.log('✅ Connexion à la base de données réussie');

    // Compter les tables principales
    const [races, horses, jockeys, racecourses, users] = await Promise.all([
      prisma.race.count(),
      prisma.horse.count(),
      prisma.jockey.count(),
      prisma.racecourse.count(),
      prisma.user.count(),
    ]);

    console.log('\n📊 Données disponibles dans les tables:');
    console.log(`   Courses (races): ${races}`);
    console.log(`   Chevaux (horses): ${horses}`);
    console.log(`   Jockeys: ${jockeys}`);
    console.log(`   Hippodromes (racecourses): ${racecourses}`);
    console.log(`   Utilisateurs (users): ${users}`);

    return { races, horses, jockeys, racecourses, users };
    
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:');
    console.error(error.message);
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();
