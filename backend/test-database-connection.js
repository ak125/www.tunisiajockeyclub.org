const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testDatabaseConnection() {
  try {
    console.log('🔍 Test de connexion à la base de données...');
    
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

    // Récupérer quelques courses si disponibles
    if (races > 0) {
      console.log('\n🏆 Exemples de courses:');
      const sampleRaces = await prisma.race.findMany({
        take: 3,
        include: {
          racecourse: true,
        },
        orderBy: {
          raceDate: 'desc'
        }
      });
      
      sampleRaces.forEach((race, index) => {
        console.log(`   ${index + 1}. ${race.name} - ${race.racecourse.name} (${race.raceDate.toISOString().split('T')[0]})`);
      });
    }

    // Récupérer quelques chevaux si disponibles
    if (horses > 0) {
      console.log('\n🐎 Exemples de chevaux:');
      const sampleHorses = await prisma.horse.findMany({
        take: 3,
        orderBy: {
          name: 'asc'
        }
      });
      
      sampleHorses.forEach((horse, index) => {
        console.log(`   ${index + 1}. ${horse.name} - ${horse.breed || 'Race non spécifiée'} (${horse.color || 'Couleur non spécifiée'})`);
      });
    }

    // Test de création d'un exemple si les tables sont vides
    if (races === 0 && racecourses === 0) {
      console.log('\n⚠️  Tables vides - Création de données d\'exemple...');
      
      // Créer un hippodrome d'exemple
      const racecourse = await prisma.racecourse.create({
        data: {
          name: 'Hippodrome de Kassar Said',
          location: 'Tunis, Tunisie',
          surface: 'Gazon',
          capacity: 15000
        }
      });
      
      console.log(`   ✅ Hippodrome créé: ${racecourse.name}`);
      
      // Créer une course d'exemple
      const race = await prisma.race.create({
        data: {
          raceNumber: 1,
          raceDate: new Date('2025-09-15'),
          raceTime: new Date('2025-09-15T15:00:00'),
          racecourseId: racecourse.id,
          name: 'Prix du President de la République',
          raceType: 'Plat',
          raceClass: 'Groupe I',
          category: 'Groupe I',
          distanceMeters: 2000,
          prizeMoney: 150000,
          conditions: 'Chevaux de 3 ans et plus',
          maxRunners: 16,
          status: 'scheduled'
        }
      });
      
      console.log(`   ✅ Course créée: ${race.name}`);
    }
    
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données:');
    console.error(error.message);
    
    if (error.code === 'P1001') {
      console.log('\n💡 Solutions possibles:');
      console.log('   - Vérifier que la base de données Supabase est accessible');
      console.log('   - Vérifier les credentials DATABASE_URL dans .env');
      console.log('   - Vérifier la connectivité réseau');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();
