import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedBenGuerdaneProgram() {
  console.log('🏇 Insertion du programme officiel - Hippodrome de Ben Guerdane - 02/08/2025');

  try {
    // 1. Créer l'hippodrome s'il n'existe pas
    const racecourse = await prisma.racecourse.upsert({
      where: { code: 'BG' },
      update: {},
      create: {
        name: 'Hippodrome de Ben Guerdane',
        code: 'BG',
        location: 'Ben Guerdane, Tunisie',
        trackType: 'turf',
        capacity: 5000,
      },
    });

    console.log('✅ Hippodrome créé/vérifié:', racecourse.name);

    // 2. Créer les entraîneurs
    const trainers = [
      'Sadoq Triki', 'M\'ghorghor', 'Nasri Ammar', 'Dhaou Regai', 'Dr. Gharbi',
      'Dhaou Brik', 'Farouk Ouahida', 'Faouzi Ali B.', 'Rached Zouari',
      'M. Massrour', 'Abou Ghriba', 'M. Zghidi', 'Le propriétaire'
    ];

    const trainerRecords: Record<string, any> = {};
    for (const trainerName of trainers) {
      const [firstName, ...lastNameParts] = trainerName.split(' ');
      const lastName = lastNameParts.join(' ') || '';
      const email = `${trainerName.toLowerCase().replace(/[^a-z0-9]/g, '')}@trainer.tn`;

      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          password: '$2b$10$hashedpassword',
          firstName,
          lastName,
          role: 'trainer',
        },
      });

      const trainer = await prisma.trainer.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          licenseNumber: `TN-TR-${Math.floor(Math.random() * 10000)}`,
          yearsExperience: Math.floor(Math.random() * 20) + 5,
        },
      });

      trainerRecords[trainerName] = trainer;
    }

    console.log('✅ Entraîneurs créés:', Object.keys(trainerRecords).length);

    // 3. Créer les jockeys
    const jockeys = [
      { name: 'M. Jallagi', weight: 52 },
      { name: 'K. Jouini', weight: 53 },
      { name: 'A. Mahjoub', weight: 54 },
      { name: 'H. Mabrouk', weight: 52 },
      { name: 'A. Ayed', weight: 53 },
      { name: 'H. Jrid', weight: 54 },
      { name: 'M. Lahmer', weight: 52 },
      { name: 'Y. Yaldeminou', weight: 53 },
      { name: 'S. Khalouati', weight: 52 },
      { name: 'M. Jouini', weight: 53 },
      { name: 'A. Mabrouk', weight: 54 },
      { name: 'F. Jallagi', weight: 52 },
      { name: 'S. Seif Daas', weight: 53 },
      { name: 'O. Ayed', weight: 54 },
      { name: 'W. Bedhief', weight: 52 },
      { name: 'M. Mabrouk', weight: 53 },
      { name: 'A. Balsem', weight: 54 },
      { name: 'K.I. Mahfoudh', weight: 55 },
      { name: 'T. Mahfoudh', weight: 54 },
      { name: 'H. Jlassi', weight: 53 },
      { name: 'M. Ayed', weight: 52 },
      { name: 'W. Ben Meftah', weight: 53 },
      { name: 'A. Khedhiri', weight: 54 },
      { name: 'S. Abd Essalem', weight: 52 },
      { name: 'A. Abd Essalem', weight: 53 },
      { name: 'M. Abd Essalem', weight: 54 },
      { name: 'A. Jouini', weight: 52 },
    ];

    const jockeyRecords: Record<string, any> = {};
    for (const jockeyData of jockeys) {
      const [firstName, ...lastNameParts] = jockeyData.name.split(' ');
      const lastName = lastNameParts.join(' ') || '';
      const email = `${jockeyData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@jockey.tn`;

      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          password: '$2b$10$hashedpassword',
          firstName,
          lastName,
          role: 'jockey',
        },
      });

      const jockey = await prisma.jockey.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          licenseNumber: `TN-JK-${Math.floor(Math.random() * 10000)}`,
          weightKg: jockeyData.weight,
          wins: Math.floor(Math.random() * 50),
          places: Math.floor(Math.random() * 30),
          shows: Math.floor(Math.random() * 20),
        },
      });

      jockeyRecords[jockeyData.name] = jockey;
    }

    console.log('✅ Jockeys créés:', Object.keys(jockeyRecords).length);

    // 4. Créer les propriétaires
    const owners = [
      'Salim Bouaziz', 'Naceur Arjoun', 'Jouini Mounir', 'Mokhtar Ghorbal',
      'Houcine Jrid', 'Mohamed Ali Bahloul', 'Ahmed Regai', 'Kaïs Gharbi',
      'Ghanem Abbessa', 'Said Belhadj', 'Jahouchi Abd', 'Kamel Mosrati',
      'Salah Gharbi', 'Hmida Jridi', 'Ali Ben Ahmed Jilani', 'Slim Jelassi',
      'Jebn Mabrouk', 'Walid Trabelsi', 'Nourdidene Jilani', 'Hedi Belguelaa',
      'Ghazi Ferrini', 'Med Zribi', 'Mohamed Fathi', 'Fathi Bellaji', 'Kafah Hammami'
    ];

    const ownerRecords: Record<string, any> = {};
    for (const ownerName of owners) {
      const [firstName, ...lastNameParts] = ownerName.split(' ');
      const lastName = lastNameParts.join(' ') || '';
      const email = `${ownerName.toLowerCase().replace(/[^a-z0-9]/g, '')}@owner.tn`;

      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: {
          email,
          password: '$2b$10$hashedpassword',
          firstName,
          lastName,
          role: 'member',
        },
      });

      const owner = await prisma.owner.upsert({
        where: { userId: user.id },
        update: {},
        create: {
          userId: user.id,
          stableName: `Écurie ${ownerName}`,
          colorsDescription: 'Couleurs du propriétaire',
          registrationNumber: `TN-OW-${Math.floor(Math.random() * 10000)}`,
        },
      });

      ownerRecords[ownerName] = owner;
    }

    console.log('✅ Propriétaires créés:', Object.keys(ownerRecords).length);

    // 5. Créer les courses
    const raceDate = new Date('2025-08-02');
    
    // Course 1: Prix DE JEKITIS
    const race1 = await prisma.race.create({
      data: {
        raceNumber: 1,
        name: 'Prix DE JEKITIS',
        raceDate,
        raceTime: '16:30:00',
        distanceMeters: 1400,
        prizeMoney: 4250,
        maxRunners: 11,
        status: 'scheduled',
        raceType: 'flat',
        raceClass: 'condition',
        category: 'Listed',
        conditions: 'Pour poulains et pouliches de 3 ans Pur Sang Arabe n\'ayant pas gagné 3.500 DT – Poids 55 kg',
        racecourseId: racecourse.id,
        terrainState: 'bon',
      },
    });

    // Course 2: Prix DE CHOUCHA
    const race2 = await prisma.race.create({
      data: {
        raceNumber: 2,
        name: 'Prix DE CHOUCHA (A Réservée)',
        raceDate,
        raceTime: '17:00:00',
        distanceMeters: 1700,
        prizeMoney: 4250,
        maxRunners: 7,
        status: 'scheduled',
        raceType: 'flat',
        raceClass: 'reserved',
        category: 'Listed',
        racecourseId: racecourse.id,
        terrainState: 'bon',
      },
    });

    // Course 3: Prix DE CHIKRBEN
    const race3 = await prisma.race.create({
      data: {
        raceNumber: 3,
        name: 'Prix DE CHIKRBEN (A Réservée)',
        raceDate,
        raceTime: '17:30:00',
        distanceMeters: 2000,
        prizeMoney: 4250,
        maxRunners: 10,
        status: 'scheduled',
        raceType: 'flat',
        raceClass: 'reserved',
        category: 'Listed',
        racecourseId: racecourse.id,
        terrainState: 'bon',
      },
    });

    // Course 4: Prix DE BEN GUERDANE
    const race4 = await prisma.race.create({
      data: {
        raceNumber: 4,
        name: 'Prix DE BEN GUERDANE (Handicap)',
        raceDate,
        raceTime: '18:00:00',
        distanceMeters: 2000,
        prizeMoney: 3825,
        maxRunners: 12,
        status: 'scheduled',
        raceType: 'flat',
        raceClass: 'handicap',
        category: 'Handicap',
        racecourseId: racecourse.id,
        terrainState: 'bon',
      },
    });

    console.log('✅ Courses créées: 4');

    // 6. Créer les chevaux et les inscriptions pour la Course 1
    const race1Horses = [
      { name: 'RIGEB', owner: 'Salim Bouaziz', jockey: 'M. Jallagi', trainer: 'Sadoq Triki', weight: 55, sex: 'M', age: 3 },
      { name: 'RAMZ EL FAKHIR', owner: 'Naceur Arjoun', jockey: 'K. Jouini', trainer: 'M\'ghorghor', weight: 55, sex: 'M', age: 3 },
      { name: 'ZAHOUEL', owner: 'Jouini Mounir', jockey: 'A. Mahjoub', trainer: 'Sadoq Triki', weight: 55, sex: 'F', age: 3 },
      { name: 'RIM ESSOUHEIL', owner: 'Mokhtar Ghorbal', jockey: 'H. Mabrouk', trainer: 'M\'ghorghor', weight: 55, sex: 'F', age: 3 },
      { name: 'REHAB AL BADR', owner: 'Houcine Jrid', jockey: 'A. Ayed', trainer: 'Nasri Ammar', weight: 55, sex: 'F', age: 3 },
      { name: 'REMETH NAGHAM', owner: 'Mohamed Ali Bahloul', jockey: 'H. Jrid', trainer: 'M\'ghorghor', weight: 55, sex: 'F', age: 3 },
      { name: 'RAYHANA EL HADI', owner: 'Mokhtar Ghorbal', jockey: 'M. Lahmer', trainer: 'M\'ghorghor', weight: 55, sex: 'F', age: 3 },
      { name: 'REMETT CHARGUI', owner: 'Salim Bouaziz', jockey: 'A. Mahjoub', trainer: 'M\'ghorghor', weight: 55, sex: 'F', age: 3 },
      { name: 'RIJOU', owner: 'Salim Bouaziz', jockey: 'M. Lahmer', trainer: 'M\'ghorghor', weight: 55, sex: 'F', age: 3 },
      { name: 'RIFJ', owner: 'Salim Bouaziz', jockey: 'H. Mabrouk', trainer: 'M\'ghorghor', weight: 55, sex: 'F', age: 3 },
      { name: 'RAMZ ETTAHADI', owner: 'Ahmed Regai', jockey: 'Y. Yaldeminou', trainer: 'Dhaou Regai', weight: 55, sex: 'M', age: 3 },
    ];

    for (let i = 0; i < race1Horses.length; i++) {
      const horseData = race1Horses[i];
      
      // Créer le cheval
      const horse = await prisma.horse.create({
        data: {
          name: horseData.name,
          registrationNumber: `BG-${horseData.name.replace(/\s+/g, '')}-${Date.now()}`,
          dateOfBirth: new Date('2022-01-01'), // 3 ans en 2025
          sex: horseData.sex === 'M' ? 'stallion' : 'mare',
          breed: 'Arabian',
          color: 'bay',
          ownerId: ownerRecords[horseData.owner]?.id,
          trainerId: trainerRecords[horseData.trainer]?.id,
          currentRating: Math.floor(Math.random() * 30) + 60, // Rating entre 60-90
        },
      });

      // Créer l'inscription
      await prisma.raceEntry.create({
        data: {
          raceId: race1.id,
          horseId: horse.id,
          jockeyId: jockeyRecords[horseData.jockey]?.id,
          trainerId: trainerRecords[horseData.trainer]?.id,
          ownerId: ownerRecords[horseData.owner]?.id,
          weightCarriedKg: horseData.weight,
          drawPosition: i + 1,
          clothNumber: i + 1,
          odds: Math.random() * 10 + 2, // Cotes entre 2 et 12
        },
      });
    }

    console.log('✅ Chevaux et inscriptions Course 1 créés:', race1Horses.length);

    // Course 2 entries
    const race2Horses = [
      { name: 'RAHIB ALBADEIA', owner: 'Kaïs Gharbi', jockey: 'S. Khalouati', trainer: 'Dr. Gharbi', weight: 55, sex: 'M', age: 3 },
      { name: 'RAMZ AL HOSN', owner: 'Ghanem Abbessa', jockey: 'M. Jouini', trainer: 'Nasri Ammar', weight: 55, sex: 'M', age: 3 },
      { name: 'SAHOUH', owner: 'Said Belhadj', jockey: 'A. Mabrouk', trainer: 'M\'ghorghor', weight: 55, sex: 'M', age: 3 },
      { name: 'RAGOAN', owner: 'Jahouchi Abd', jockey: 'H. Mabrouk', trainer: 'Nasri Ammar', weight: 55, sex: 'M', age: 3 },
      { name: 'RAMEH', owner: 'Salim Bouaziz', jockey: 'M. Lahmer', trainer: 'Sadoq Triki', weight: 55, sex: 'M', age: 3 },
      { name: 'RABEE EL EZZ', owner: 'Kamel Mosrati', jockey: 'F. Jallagi', trainer: 'M\'ghorghor', weight: 55, sex: 'M', age: 3 },
      { name: 'RAZANE', owner: 'Kamel Mosrati', jockey: 'S. Seif Daas', trainer: 'Dhaou Brik', weight: 55, sex: 'F', age: 3 },
    ];

    for (let i = 0; i < race2Horses.length; i++) {
      const horseData = race2Horses[i];
      
      const horse = await prisma.horse.create({
        data: {
          name: horseData.name,
          registrationNumber: `BG-${horseData.name.replace(/\s+/g, '')}-${Date.now() + i}`,
          dateOfBirth: new Date('2022-01-01'),
          sex: horseData.sex === 'M' ? 'stallion' : 'mare',
          breed: 'Arabian',
          color: 'bay',
          ownerId: ownerRecords[horseData.owner]?.id,
          trainerId: trainerRecords[horseData.trainer]?.id,
          currentRating: Math.floor(Math.random() * 30) + 60,
        },
      });

      await prisma.raceEntry.create({
        data: {
          raceId: race2.id,
          horseId: horse.id,
          jockeyId: jockeyRecords[horseData.jockey]?.id,
          trainerId: trainerRecords[horseData.trainer]?.id,
          ownerId: ownerRecords[horseData.owner]?.id,
          weightCarriedKg: horseData.weight,
          drawPosition: i + 1,
          clothNumber: i + 1,
          odds: Math.random() * 10 + 2,
        },
      });
    }

    console.log('✅ Chevaux et inscriptions Course 2 créés:', race2Horses.length);

    console.log('🎉 Programme officiel de Ben Guerdane inséré avec succès!');
    
    // Vérifier les données
    const totalRaces = await prisma.race.count();
    const totalHorses = await prisma.horse.count();
    const totalEntries = await prisma.raceEntry.count();
    
    console.log(`📊 Statistiques finales:
    - Courses: ${totalRaces}
    - Chevaux: ${totalHorses}
    - Inscriptions: ${totalEntries}`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'insertion des données:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le seed si c'est le fichier principal
if (require.main === module) {
  seedBenGuerdaneProgram()
    .then(() => {
      console.log('✅ Seed terminé avec succès');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Erreur:', error);
      process.exit(1);
    });
}
