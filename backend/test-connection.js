import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔗 Test de connexion à la base de données...');
    
    // Test simple de connexion
    const result = await prisma.$queryRaw`SELECT version() as version, now() as timestamp`;
    
    console.log('✅ Connexion réussie !');
    console.log('📊 Résultat:', result);
    
  } catch (error) {
    console.error('❌ Erreur de connexion:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
