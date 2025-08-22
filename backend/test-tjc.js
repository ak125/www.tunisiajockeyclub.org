const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testTJC() {
  try {
    console.log('🏇 Test du schéma Tunisia Jockey Club...\n');
    
    // 1. Test des utilisateurs
    const userCount = await prisma.user.count();
    console.log(`👤 Utilisateurs: ${userCount}`);
    
    // 2. Test des hippodromes
    const racecourseCount = await prisma.racecourse.count();
    console.log(`🏟️ Hippodromes: ${racecourseCount}`);
    
    // 3. Test des chevaux
    const horseCount = await prisma.horse.count();
    console.log(`🐎 Chevaux: ${horseCount}`);
    
    // 4. Test des courses
    const raceCount = await prisma.race.count();
    console.log(`🏁 Courses: ${raceCount}`);
    
    // 5. Lister quelques données
    console.log('\n📊 Échantillon de données:');
    
    const users = await prisma.user.findMany({
      select: { 
        firstName: true, 
        lastName: true, 
        email: true, 
        role: true 
      },
      take: 5
    });
    console.log('👥 Utilisateurs:', users);
    
    const racecourses = await prisma.racecourse.findMany({
      select: { 
        name: true, 
        code: true, 
        location: true, 
        trackType: true 
      }
    });
    console.log('🏟️ Hippodromes:', racecourses);
    
    const horses = await prisma.horse.findMany({
      select: { 
        name: true, 
        registrationNumber: true, 
        sex: true, 
        color: true 
      }
    });
    console.log('🐎 Chevaux:', horses);
    
    console.log('\n✅ Tunisia Jockey Club - Base de données opérationnelle!');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testTJC();
