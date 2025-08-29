const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✓ Database connected successfully');
    
    // Check tables
    const raceCount = await prisma.race.count();
    const racecoursesCount = await prisma.racecourse.count();
    const horsesCount = await prisma.horse.count();
    
    console.log('Table counts:');
    console.log('- Races:', raceCount);
    console.log('- Racecourses:', racecoursesCount);
    console.log('- Horses:', horsesCount);
    
    // Test query
    const latestRace = await prisma.race.findFirst({
      orderBy: { createdAt: 'desc' },
      include: {
        racecourse: true,
        raceEntries: {
          take: 3,
          include: {
            horse: true
          }
        }
      }
    });
    
    if (latestRace) {
      console.log('✓ Latest race found:', latestRace.name);
      console.log('✓ Racecourse:', latestRace.racecourse?.name);
      console.log('✓ Entries:', latestRace.raceEntries.length);
    } else {
      console.log('⚠ No races found in database');
    }
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
