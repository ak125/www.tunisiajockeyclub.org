const { PrismaClient } = require('@prisma/client');

async function testPrisma() {
  console.log('🔍 Test de connexion Prisma...');
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    // Test 1: Compter les courses
    console.log('\n📊 Test 1: Compter les courses...');
    const raceCount = await prisma.race.count();
    console.log(`✅ Nombre de courses dans la DB: ${raceCount}`);

    // Test 2: Récupérer une course simple
    console.log('\n📋 Test 2: Récupérer une course...');
    const firstRace = await prisma.race.findFirst({
      select: {
        id: true,
        name: true,
        raceDate: true,
        status: true,
      }
    });
    console.log('✅ Première course:', firstRace);

    // Test 3: Récupérer avec relation racecourse
    console.log('\n🏇 Test 3: Récupérer avec hippodrome...');
    const raceWithRacecourse = await prisma.race.findFirst({
      include: {
        racecourse: {
          select: {
            name: true,
            location: true,
          }
        }
      }
    });
    console.log('✅ Course avec hippodrome:', JSON.stringify(raceWithRacecourse, null, 2));

  } catch (error) {
    console.error('❌ Erreur Prisma:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();
