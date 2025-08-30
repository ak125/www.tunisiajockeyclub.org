import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding de la base de données...');

  // Nettoyer les données existantes (en ordre pour respecter les contraintes FK)
  await prisma.raceResult.deleteMany();
  await prisma.raceEntry.deleteMany();
  await prisma.race.deleteMany();
  await prisma.horse.deleteMany();
  await prisma.session.deleteMany();
  await prisma.jockey.deleteMany();
  await prisma.trainer.deleteMany();
  await prisma.owner.deleteMany();
  await prisma.racecourse.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Données existantes supprimées');

  // 1. Créer les hippodromes
  const racecourses = await Promise.all([
    prisma.racecourse.create({
      data: {
        name: 'Hippodrome de Carthage',
        code: 'CART',
        location: 'Carthage, Tunis',
        trackType: 'Gazon',
        capacity: 5000,
      },
    }),
    prisma.racecourse.create({
      data: {
        name: 'Hippodrome de Tunis',
        code: 'TUNI',
        location: 'Tunis Centre',
        trackType: 'Sable',
        capacity: 8000,
      },
    }),
    prisma.racecourse.create({
      data: {
        name: 'Hippodrome de Sousse',
        code: 'SOUS',
        location: 'Sousse',
        trackType: 'Gazon',
        capacity: 3000,
      },
    }),
    prisma.racecourse.create({
      data: {
        name: 'Hippodrome de Bizerte',
        code: 'BIZE',
        location: 'Bizerte',
        trackType: 'Mixte',
        capacity: 2500,
      },
    }),
  ]);

  console.log('🏇 Hippodromes créés');

  // 2. Créer les utilisateurs avec différents rôles
  const hashedPassword = await hash('password123', 10);
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@tunisiajockeyclub.com',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'TJC',
      role: 'admin',
      phone: '+216 71 123 456',
      address: 'Avenue Habib Bourguiba',
      city: 'Tunis',
      postalCode: '1000',
      licenseNumber: 'TJC-ADM-001',
    },
  });

  // Créer des propriétaires
  const ownerUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'haras.elons@email.com',
        password: hashedPassword,
        firstName: 'Mohamed',
        lastName: 'El Ons',
        role: 'owner',
        phone: '+216 98 111 222',
        address: 'Route de Bizerte',
        city: 'Tunis',
        postalCode: '1010',
        licenseNumber: 'TJC-OWN-001',
      },
    }),
    prisma.user.create({
      data: {
        email: 'ecurie.albaraka@email.com',
        password: hashedPassword,
        firstName: 'Farid',
        lastName: 'Al Baraka',
        role: 'owner',
        phone: '+216 98 333 444',
        address: 'Zone Industrielle',
        city: 'Sousse',
        postalCode: '4000',
        licenseNumber: 'TJC-OWN-002',
      },
    }),
    prisma.user.create({
      data: {
        email: 'haras.carthage@email.com',
        password: hashedPassword,
        firstName: 'Sami',
        lastName: 'Carthage',
        role: 'owner',
        phone: '+216 98 555 666',
        address: 'Route de Carthage',
        city: 'Tunis',
        postalCode: '1005',
        licenseNumber: 'TJC-OWN-003',
      },
    }),
  ]);

  // Créer des entraîneurs
  const trainerUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'mohamed.gharbi@email.com',
        password: hashedPassword,
        firstName: 'Mohamed',
        lastName: 'Gharbi',
        role: 'trainer',
        phone: '+216 98 777 888',
        address: 'Écuries de Carthage',
        city: 'Tunis',
        postalCode: '1005',
        licenseNumber: 'TJC-TRA-001',
      },
    }),
    prisma.user.create({
      data: {
        email: 'slim.karray@email.com',
        password: hashedPassword,
        firstName: 'Slim',
        lastName: 'Karray',
        role: 'trainer',
        phone: '+216 98 999 000',
        address: 'Centre Équestre',
        city: 'Sousse',
        postalCode: '4002',
        licenseNumber: 'TJC-TRA-002',
      },
    }),
    prisma.user.create({
      data: {
        email: 'farid.mansour@email.com',
        password: hashedPassword,
        firstName: 'Farid',
        lastName: 'Mansour',
        role: 'trainer',
        phone: '+216 98 111 333',
        address: 'Haras El Fejja',
        city: 'Manouba',
        postalCode: '2010',
        licenseNumber: 'TJC-TRA-003',
      },
    }),
  ]);

  // Créer des jockeys
  const jockeyUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'ahmed.benali@email.com',
        password: hashedPassword,
        firstName: 'Ahmed',
        lastName: 'Ben Ali',
        role: 'jockey',
        phone: '+216 98 123 789',
        address: 'Cité Sportive',
        city: 'Tunis',
        postalCode: '1004',
        dateOfBirth: new Date('1996-03-15'),
        licenseNumber: 'TJC-JOC-001',
      },
    }),
    prisma.user.create({
      data: {
        email: 'mohamed.khalil@email.com',
        password: hashedPassword,
        firstName: 'Mohamed',
        lastName: 'Khalil',
        role: 'jockey',
        phone: '+216 98 456 789',
        address: 'Quartier Olympique',
        city: 'Tunis',
        postalCode: '1003',
        dateOfBirth: new Date('1993-07-22'),
        licenseNumber: 'TJC-JOC-002',
      },
    }),
    prisma.user.create({
      data: {
        email: 'youssef.mansour@email.com',
        password: hashedPassword,
        firstName: 'Youssef',
        lastName: 'Mansour',
        role: 'jockey',
        phone: '+216 98 654 321',
        address: 'Zone Résidentielle',
        city: 'Sousse',
        postalCode: '4001',
        dateOfBirth: new Date('1998-11-08'),
        licenseNumber: 'TJC-JOC-003',
      },
    }),
    prisma.user.create({
      data: {
        email: 'karim.saidi@email.com',
        password: hashedPassword,
        firstName: 'Karim',
        lastName: 'Saidi',
        role: 'jockey',
        phone: '+216 98 987 654',
        address: 'Avenue de la République',
        city: 'Bizerte',
        postalCode: '7000',
        dateOfBirth: new Date('1989-05-12'),
        licenseNumber: 'TJC-JOC-004',
      },
    }),
    prisma.user.create({
      data: {
        email: 'slim.karray.jockey@email.com',
        password: hashedPassword,
        firstName: 'Slim',
        lastName: 'Karray Jr',
        role: 'jockey',
        phone: '+216 98 147 258',
        address: 'Résidence Sportive',
        city: 'Tunis',
        postalCode: '1006',
        dateOfBirth: new Date('2001-09-25'),
        licenseNumber: 'TJC-JOC-005',
      },
    }),
  ]);

  console.log('👥 Utilisateurs créés');

  // 3. Créer les profils spécialisés
  const owners = await Promise.all([
    prisma.owner.create({
      data: {
        userId: ownerUsers[0].id,
        stableName: 'Haras El Ons',
        colorsDescription: 'Rouge et blanc, étoiles dorées',
        registrationNumber: 'TJC-STA-001',
      },
    }),
    prisma.owner.create({
      data: {
        userId: ownerUsers[1].id,
        stableName: 'Écurie Al Baraka',
        colorsDescription: 'Vert et or, rayures',
        registrationNumber: 'TJC-STA-002',
      },
    }),
    prisma.owner.create({
      data: {
        userId: ownerUsers[2].id,
        stableName: 'Haras de Carthage',
        colorsDescription: 'Bleu et argent, losanges',
        registrationNumber: 'TJC-STA-003',
      },
    }),
  ]);

  const trainers = await Promise.all([
    prisma.trainer.create({
      data: {
        userId: trainerUsers[0].id,
        licenseNumber: 'TJC-TRA-001',
        yearsExperience: 15,
        specialization: 'Galop et Obstacles',
        stableLocation: 'Carthage Training Center',
      },
    }),
    prisma.trainer.create({
      data: {
        userId: trainerUsers[1].id,
        licenseNumber: 'TJC-TRA-002',
        yearsExperience: 12,
        specialization: 'Jeunes chevaux',
        stableLocation: 'Sousse Equestrian Center',
      },
    }),
    prisma.trainer.create({
      data: {
        userId: trainerUsers[2].id,
        licenseNumber: 'TJC-TRA-003',
        yearsExperience: 18,
        specialization: 'Courses de fond',
        stableLocation: 'El Fejja Training Ground',
      },
    }),
  ]);

  const jockeys = await Promise.all([
    prisma.jockey.create({
      data: {
        userId: jockeyUsers[0].id,
        licenseNumber: 'TJC-JOC-001',
        weightKg: 52.0,
        heightCm: 165,
        wins: 67,
        places: 134,
        shows: 245,
      },
    }),
    prisma.jockey.create({
      data: {
        userId: jockeyUsers[1].id,
        licenseNumber: 'TJC-JOC-002',
        weightKg: 54.0,
        heightCm: 168,
        wins: 89,
        places: 198,
        shows: 398,
      },
    }),
    prisma.jockey.create({
      data: {
        userId: jockeyUsers[2].id,
        licenseNumber: 'TJC-JOC-003',
        weightKg: 51.0,
        heightCm: 163,
        wins: 34,
        places: 78,
        shows: 156,
      },
    }),
    prisma.jockey.create({
      data: {
        userId: jockeyUsers[3].id,
        licenseNumber: 'TJC-JOC-004',
        weightKg: 55.0,
        heightCm: 170,
        wins: 95,
        places: 248,
        shows: 512,
      },
    }),
    prisma.jockey.create({
      data: {
        userId: jockeyUsers[4].id,
        licenseNumber: 'TJC-JOC-005',
        weightKg: 50.0,
        heightCm: 162,
        wins: 8,
        places: 19,
        shows: 45,
      },
    }),
  ]);

  console.log('🏆 Profils spécialisés créés');

  // 4. Créer les chevaux
  const horses = await Promise.all([
    prisma.horse.create({
      data: {
        name: 'Thunder Bay',
        registrationNumber: 'TJC-H-001',
        dateOfBirth: new Date('2020-04-15'),
        sex: 'Stallion',
        color: 'Bai brun',
        breed: 'Pur-sang Arabe',
        sireName: 'Desert King',
        damName: 'Golden Mare',
        ownerId: owners[0].id,
        trainerId: trainers[0].id,
        currentRating: 92,
      },
    }),
    prisma.horse.create({
      data: {
        name: 'Desert Storm',
        registrationNumber: 'TJC-H-002',
        dateOfBirth: new Date('2021-06-08'),
        sex: 'Mare',
        color: 'Alezan',
        breed: 'Pur-sang Anglais',
        sireName: 'Storm Rider',
        damName: 'Desert Rose',
        ownerId: owners[1].id,
        trainerId: trainers[1].id,
        currentRating: 87,
      },
    }),
    prisma.horse.create({
      data: {
        name: 'Sahara Prince',
        registrationNumber: 'TJC-H-003',
        dateOfBirth: new Date('2019-02-20'),
        sex: 'Stallion',
        color: 'Gris',
        breed: 'Pur-sang Arabe',
        sireName: 'Prince of Sands',
        damName: 'Sahara Queen',
        ownerId: owners[2].id,
        trainerId: trainers[2].id,
        currentRating: 95,
      },
    }),
    prisma.horse.create({
      data: {
        name: 'Atlas Runner',
        registrationNumber: 'TJC-H-004',
        dateOfBirth: new Date('2018-08-12'),
        sex: 'Gelding',
        color: 'Bai',
        breed: 'Anglo-Arabe',
        sireName: 'Mountain King',
        damName: 'Valley Wind',
        ownerId: owners[0].id,
        trainerId: trainers[1].id,
        currentRating: 82,
      },
    }),
    prisma.horse.create({
      data: {
        name: 'Medina Star',
        registrationNumber: 'TJC-H-005',
        dateOfBirth: new Date('2022-03-30'),
        sex: 'Filly',
        color: 'Noir',
        breed: 'Pur-sang Arabe',
        sireName: 'Star Gazer',
        damName: 'Medina Moon',
        ownerId: owners[2].id,
        trainerId: trainers[0].id,
        currentRating: 78,
      },
    }),
  ]);

  console.log('🐎 Chevaux créés');

  // 5. Créer des courses (passées et à venir)
  const races = await Promise.all([
    // Courses passées
    prisma.race.create({
      data: {
        raceNumber: 1,
        raceDate: new Date('2025-08-20'),
        raceTime: new Date('2025-08-20T14:30:00'),
        racecourseId: racecourses[0].id,
        name: 'Prix de Carthage',
        raceType: 'Galop',
        raceClass: 'Groupe 3',
        distanceMeters: 1600,
        prizeMoney: 25000.00,
        conditions: 'Bon',
        maxRunners: 16,
        status: 'completed',
      },
    }),
    prisma.race.create({
      data: {
        raceNumber: 1,
        raceDate: new Date('2025-08-15'),
        raceTime: new Date('2025-08-15T15:00:00'),
        racecourseId: racecourses[1].id,
        name: 'Grand Prix de Tunis',
        raceType: 'Galop',
        raceClass: 'Groupe 1',
        distanceMeters: 2000,
        prizeMoney: 50000.00,
        conditions: 'Lourd',
        maxRunners: 18,
        status: 'completed',
      },
    }),
    prisma.race.create({
      data: {
        raceNumber: 2,
        raceDate: new Date('2025-08-10'),
        raceTime: new Date('2025-08-10T16:00:00'),
        racecourseId: racecourses[2].id,
        name: 'Course du Belvédère',
        raceType: 'Galop',
        raceClass: 'Listed',
        distanceMeters: 1800,
        prizeMoney: 18000.00,
        conditions: 'Bon',
        maxRunners: 12,
        status: 'completed',
      },
    }),
    // Courses à venir
    prisma.race.create({
      data: {
        raceNumber: 1,
        raceDate: new Date('2025-08-25'),
        raceTime: new Date('2025-08-25T14:30:00'),
        racecourseId: racecourses[0].id,
        name: 'Prix International',
        raceType: 'Galop',
        raceClass: 'Groupe 2',
        distanceMeters: 1600,
        prizeMoney: 35000.00,
        conditions: 'Bon prévu',
        maxRunners: 16,
        status: 'scheduled',
      },
    }),
    prisma.race.create({
      data: {
        raceNumber: 1,
        raceDate: new Date('2025-08-30'),
        raceTime: new Date('2025-08-30T15:00:00'),
        racecourseId: racecourses[1].id,
        name: "Grand Prix d'Été",
        raceType: 'Galop',
        raceClass: 'Groupe 1',
        distanceMeters: 2000,
        prizeMoney: 60000.00,
        conditions: 'Bon prévu',
        maxRunners: 18,
        status: 'scheduled',
      },
    }),
  ]);

  console.log('🏁 Courses créées');

  // 6. Créer des inscriptions et résultats pour les courses passées
  const completedRaces = races.filter(race => race.status === 'completed');
  
  // Inscriptions et résultats pour le Prix de Carthage
  await Promise.all([
    prisma.raceEntry.create({
      data: {
        raceId: completedRaces[0].id,
        horseId: horses[0].id, // Thunder Bay
        jockeyId: jockeys[0].id, // Ahmed Ben Ali
        trainerId: trainers[0].id,
        ownerId: owners[0].id,
        clothNumber: 1,
        drawPosition: 3,
        weightCarriedKg: 56.0,
        odds: 3.20,
      },
    }),
    prisma.raceEntry.create({
      data: {
        raceId: completedRaces[0].id,
        horseId: horses[1].id, // Desert Storm
        jockeyId: jockeys[1].id, // Mohamed Khalil
        trainerId: trainers[1].id,
        ownerId: owners[1].id,
        clothNumber: 2,
        drawPosition: 7,
        weightCarriedKg: 55.5,
        odds: 4.80,
      },
    }),
    prisma.raceEntry.create({
      data: {
        raceId: completedRaces[0].id,
        horseId: horses[2].id, // Sahara Prince
        jockeyId: jockeys[2].id, // Youssef Mansour
        trainerId: trainers[2].id,
        ownerId: owners[2].id,
        clothNumber: 3,
        drawPosition: 1,
        weightCarriedKg: 57.0,
        odds: 2.80,
      },
    }),
  ]);

  // Résultats du Prix de Carthage
  await Promise.all([
    prisma.raceResult.create({
      data: {
        raceId: completedRaces[0].id,
        horseId: horses[0].id, // Thunder Bay - 1er
        jockeyId: jockeys[0].id,
        position: 1,
        timeSeconds: 102.35,
        lengthsBehind: 0.00,
        startingPrice: 3.20,
        comments: 'Excellent finish, very strong',
      },
    }),
    prisma.raceResult.create({
      data: {
        raceId: completedRaces[0].id,
        horseId: horses[2].id, // Sahara Prince - 2e
        jockeyId: jockeys[2].id,
        position: 2,
        timeSeconds: 102.89,
        lengthsBehind: 1.50,
        startingPrice: 2.80,
        comments: 'Close second, good effort',
      },
    }),
    prisma.raceResult.create({
      data: {
        raceId: completedRaces[0].id,
        horseId: horses[1].id, // Desert Storm - 3e
        jockeyId: jockeys[1].id,
        position: 3,
        timeSeconds: 103.12,
        lengthsBehind: 2.25,
        startingPrice: 4.80,
        comments: 'Good placing for young horse',
      },
    }),
  ]);

  // Inscriptions pour les courses à venir
  const upcomingRaces = races.filter(race => race.status === 'scheduled');
  
  await Promise.all([
    prisma.raceEntry.create({
      data: {
        raceId: upcomingRaces[0].id, // Prix International
        horseId: horses[0].id, // Thunder Bay
        jockeyId: jockeys[0].id,
        trainerId: trainers[0].id,
        ownerId: owners[0].id,
        clothNumber: 1,
        drawPosition: 5,
        weightCarriedKg: 56.5,
        odds: 2.90,
      },
    }),
    prisma.raceEntry.create({
      data: {
        raceId: upcomingRaces[1].id, // Grand Prix d'Été
        horseId: horses[2].id, // Sahara Prince
        jockeyId: jockeys[2].id,
        trainerId: trainers[2].id,
        ownerId: owners[2].id,
        clothNumber: 4,
        drawPosition: 2,
        weightCarriedKg: 57.5,
        odds: 2.10,
      },
    }),
  ]);

  console.log('🎯 Inscriptions et résultats créés');

  // 7. Créer quelques sessions utilisateur
  await Promise.all([
    prisma.session.create({
      data: {
        userId: adminUser.id,
        sessionToken: 'admin-session-token-123',
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0 Dashboard',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
      },
    }),
  ]);

  console.log('🔐 Sessions créées');

  console.log('🎉 Seeding terminé avec succès !');
  console.log(`
📊 Résumé des données créées :
- 👥 Utilisateurs: ${await prisma.user.count()}
- 🏇 Hippodromes: ${await prisma.racecourse.count()}
- 🐎 Chevaux: ${await prisma.horse.count()}
- 👤 Jockeys: ${await prisma.jockey.count()}
- 🎓 Entraîneurs: ${await prisma.trainer.count()}
- 🏰 Propriétaires: ${await prisma.owner.count()}
- 🏁 Courses: ${await prisma.race.count()}
- 📋 Inscriptions: ${await prisma.raceEntry.count()}
- 🏆 Résultats: ${await prisma.raceResult.count()}
  `);
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
