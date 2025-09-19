const fetch = require('node-fetch');

const SUPABASE_URL = 'https://hssigihofbbdehqrnnoz.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzc2lnaWhvZmJiZGVocXJubm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTU1OTM0OSwiZXhwIjoyMDcxMTM1MzQ5fQ.LJXci09iPB2JrHMMQlCorfDdRnJhMQCfhVNU01YD7o4';

async function supabaseRequest(endpoint, method = 'GET', body = null) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const headers = {
    'apikey': SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  const config = {
    method,
    headers
  };

  if (body && (method === 'POST' || method === 'PATCH' || method === 'PUT')) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`❌ Erreur requête ${method} ${endpoint}:`, error.message);
    throw error;
  }
}

async function seedBenGuerdaneWithAPI() {
  console.log('🏇 Insertion du programme officiel - Hippodrome de Ben Guerdane - 02/08/2025 (via API REST)');

  try {
    // 1. Vérifier si l'hippodrome existe, sinon le créer
    let racecourse;
    try {
      const existing = await supabaseRequest('racecourses?code=eq.BG&select=*');
      if (existing.length > 0) {
        racecourse = existing[0];
        console.log('✅ Hippodrome existant trouvé:', racecourse.name);
      } else {
        throw new Error('Not found');
      }
    } catch {
      const newRacecourse = await supabaseRequest('racecourses', 'POST', {
        name: 'Hippodrome de Ben Guerdane',
        code: 'BG',
        location: 'Ben Guerdane, Tunisie',
        track_type: 'turf',
        capacity: 5000,
      });
      racecourse = newRacecourse[0];
      console.log('✅ Hippodrome créé:', racecourse.name);
    }

    // 2. Créer les utilisateurs et entraîneurs
    const trainers = [
      'Sadoq Triki', 'M\'ghorghor', 'Nasri Ammar', 'Dhaou Regai', 'Dr. Gharbi',
      'Dhaou Brik', 'Farouk Ouahida', 'Faouzi Ali B.', 'Rached Zouari',
      'M. Massrour', 'Abou Ghriba', 'M. Zghidi'
    ];

    const trainerRecords = {};
    for (const trainerName of trainers) {
      const [firstName, ...lastNameParts] = trainerName.split(' ');
      const lastName = lastNameParts.join(' ') || '';
      const email = `${trainerName.toLowerCase().replace(/[^a-z0-9]/g, '')}@trainer.tn`;

      try {
        // Créer l'utilisateur
        const user = await supabaseRequest('users', 'POST', {
          email,
          password: '$2b$10$hashedpassword',
          first_name: firstName,
          last_name: lastName,
          role: 'trainer',
        });

        // Créer le profil entraîneur
        const trainer = await supabaseRequest('trainers', 'POST', {
          user_id: user[0].id,
          license_number: `TN-TR-${Math.floor(Math.random() * 10000)}`,
          years_experience: Math.floor(Math.random() * 20) + 5,
        });

        trainerRecords[trainerName] = trainer[0];
        console.log('✅ Entraîneur créé:', trainerName);
      } catch (error) {
        console.warn(`⚠️  Entraîneur ${trainerName} peut-être déjà existant:`, error.message);
        // On continue quand même
      }
    }

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
    ];

    const jockeyRecords = {};
    for (const jockeyData of jockeys) {
      const [firstName, ...lastNameParts] = jockeyData.name.split(' ');
      const lastName = lastNameParts.join(' ') || '';
      const email = `${jockeyData.name.toLowerCase().replace(/[^a-z0-9]/g, '')}@jockey.tn`;

      try {
        const user = await supabaseRequest('users', 'POST', {
          email,
          password: '$2b$10$hashedpassword',
          first_name: firstName,
          last_name: lastName,
          role: 'jockey',
        });

        const jockey = await supabaseRequest('jockeys', 'POST', {
          user_id: user[0].id,
          license_number: `TN-JK-${Math.floor(Math.random() * 10000)}`,
          weight_kg: jockeyData.weight,
          wins: Math.floor(Math.random() * 50),
          places: Math.floor(Math.random() * 30),
          shows: Math.floor(Math.random() * 20),
        });

        jockeyRecords[jockeyData.name] = jockey[0];
        console.log('✅ Jockey créé:', jockeyData.name);
      } catch (error) {
        console.warn(`⚠️  Jockey ${jockeyData.name} peut-être déjà existant:`, error.message);
      }
    }

    // 4. Créer les propriétaires
    const owners = [
      'Salim Bouaziz', 'Naceur Arjoun', 'Jouini Mounir', 'Mokhtar Ghorbal',
      'Houcine Jrid', 'Mohamed Ali Bahloul', 'Ahmed Regai'
    ];

    const ownerRecords = {};
    for (const ownerName of owners) {
      const [firstName, ...lastNameParts] = ownerName.split(' ');
      const lastName = lastNameParts.join(' ') || '';
      const email = `${ownerName.toLowerCase().replace(/[^a-z0-9]/g, '')}@owner.tn`;

      try {
        const user = await supabaseRequest('users', 'POST', {
          email,
          password: '$2b$10$hashedpassword',
          first_name: firstName,
          last_name: lastName,
          role: 'member',
        });

        const owner = await supabaseRequest('owners', 'POST', {
          user_id: user[0].id,
          stable_name: `Écurie ${ownerName}`,
          colors_description: 'Couleurs du propriétaire',
          registration_number: `TN-OW-${Math.floor(Math.random() * 10000)}`,
        });

        ownerRecords[ownerName] = owner[0];
        console.log('✅ Propriétaire créé:', ownerName);
      } catch (error) {
        console.warn(`⚠️  Propriétaire ${ownerName} peut-être déjà existant:`, error.message);
      }
    }

    // 5. Créer les courses
    const races = [
      {
        race_number: 1,
        name: 'Prix DE JEKITIS',
        race_date: '2025-08-02',
        race_time: '16:30:00',
        racecourse_id: racecourse.id,
        distance_meters: 1400,
        prize_money: 4250,
        max_runners: 11,
        status: 'scheduled',
        race_type: 'flat',
        race_class: 'condition',
        category: 'Listed',
        conditions: 'Pour poulains et pouliches de 3 ans Pur Sang Arabe n\'ayant pas gagné 3.500 DT – Poids 55 kg',
        terrain_state: 'bon',
      },
      {
        race_number: 2,
        name: 'Prix DE CHOUCHA (A Réservée)',
        race_date: '2025-08-02',
        race_time: '17:00:00',
        racecourse_id: racecourse.id,
        distance_meters: 1700,
        prize_money: 4250,
        max_runners: 7,
        status: 'scheduled',
        race_type: 'flat',
        race_class: 'reserved',
        category: 'Listed',
        terrain_state: 'bon',
      },
      {
        race_number: 3,
        name: 'Prix BRIK',
        race_date: '2025-08-02',
        race_time: '17:30:00',
        racecourse_id: racecourse.id,
        distance_meters: 1200,
        prize_money: 3500,
        max_runners: 8,
        status: 'scheduled',
        race_type: 'flat',
        race_class: 'handicap',
        category: 'Listed',
        terrain_state: 'bon',
      },
      {
        race_number: 4,
        name: 'Prix EL GHARBI',
        race_date: '2025-08-02',
        race_time: '18:00:00',
        racecourse_id: racecourse.id,
        distance_meters: 1600,
        prize_money: 5000,
        max_runners: 9,
        status: 'scheduled',
        race_type: 'flat',
        race_class: 'condition',
        category: 'Listed',
        terrain_state: 'bon',
      }
    ];

    const raceRecords = [];
    for (const raceData of races) {
      try {
        const race = await supabaseRequest('races', 'POST', raceData);
        if (race && race[0]) {
          raceRecords.push(race[0]);
          console.log('✅ Course créée:', race[0].name);
        }
      } catch (error) {
        console.error('❌ Erreur création course:', raceData.name, error.message);
      }
    }

    // 6. Créer quelques chevaux pour la première course
    if (raceRecords.length > 0) {
      const race1 = raceRecords[0];
      const horses = [
        { name: 'RIGEB', owner: 'Salim Bouaziz', jockey: 'M. Jallagi', trainer: 'Sadoq Triki' },
        { name: 'RAMZ EL FAKHIR', owner: 'Naceur Arjoun', jockey: 'K. Jouini', trainer: 'M\'ghorghor' },
        { name: 'ZAHOUEL', owner: 'Jouini Mounir', jockey: 'A. Mahjoub', trainer: 'Sadoq Triki' },
        { name: 'FELLA DU LOUP', owner: 'Mokhtar Ghorbal', jockey: 'H. Mabrouk', trainer: 'Nasri Ammar' },
      ];

      for (let i = 0; i < horses.length; i++) {
        const horseData = horses[i];
        
        try {
          // Créer le cheval
          const horse = await supabaseRequest('horses', 'POST', {
            name: horseData.name,
            registration_number: `BG-${horseData.name.replace(/\s+/g, '')}-${Date.now() + i}`,
            date_of_birth: '2022-01-01',
            sex: 'stallion',
            breed: 'Arabian',
            color: 'bay',
            owner_id: ownerRecords[horseData.owner]?.id,
            trainer_id: trainerRecords[horseData.trainer]?.id,
            current_rating: Math.floor(Math.random() * 30) + 60,
          });

          if (horse && horse[0] && jockeyRecords[horseData.jockey] && race1.id) {
            // Créer l'inscription
            await supabaseRequest('race_entries', 'POST', {
              race_id: race1.id,
              horse_id: horse[0].id,
              jockey_id: jockeyRecords[horseData.jockey].id,
              trainer_id: trainerRecords[horseData.trainer]?.id,
              owner_id: ownerRecords[horseData.owner]?.id,
              weight_carried_kg: 55,
              draw_position: i + 1,
              cloth_number: i + 1,
              odds: Math.random() * 10 + 2,
            });

            console.log('✅ Cheval et inscription créés:', horseData.name);
          }
        } catch (error) {
          console.warn(`⚠️  Erreur avec cheval ${horseData.name}:`, error.message);
        }
      }
    }

    console.log('🎉 Programme officiel de Ben Guerdane inséré avec succès!');
    console.log(`📊 Résumé: ${raceRecords.length} courses créées`);

  } catch (error) {
    console.error('❌ Erreur générale:', error.message);
    throw error;
  }
}

// Exécuter le seed
seedBenGuerdaneWithAPI()
  .then(() => {
    console.log('✅ Seed terminé avec succès');
  })
  .catch((error) => {
    console.error('❌ Erreur finale:', error.message);
    process.exit(1);
  });
