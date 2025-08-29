import { hash } from 'bcryptjs';

const SUPABASE_URL = 'https://hssigihofbbdehqrnnoz.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzc2lnaWhvZmJiZGVocXJubm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTU1OTM0OSwiZXhwIjoyMDcxMTM1MzQ5fQ.LJXci09iPB2JrHMMQlCorfDdRnJhMQCfhVNU01YD7o4';

// Helper function pour faire des requêtes à l'API Supabase
async function supabaseRequest(endpoint: string, method: string = 'GET', body?: any) {
  const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
  const headers: Record<string, string> = {
    'apikey': SUPABASE_SERVICE_ROLE_KEY,
    'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    'Content-Type': 'application/json',
  };

  if (method === 'POST') {
    headers['Prefer'] = 'return=representation';
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`${method} ${endpoint}: ${response.status} ${errorText}`);
  }

  if (response.status === 204) return null; // No content
  return await response.json();
}

async function clearDatabase() {
  console.log('🗑️  Nettoyage des données existantes...');
  
  const tables = [
    'race_results',
    'race_entries', 
    'races',
    'horses',
    'sessions',
    'jockeys',
    'trainers',
    'owners',
    'racecourses',
    'users'
  ];  for (const table of tables) {
    try {
      await supabaseRequest(`${table}?id=neq.00000000-0000-0000-0000-000000000000`, 'DELETE');
      console.log(`  ✅ Table ${table} vidée`);
    } catch (error: any) {
      if (!error.message.includes('no rows')) {
        console.log(`  ⚠️ Avertissement ${table}:`, error.message);
      }
    }
  }
}

async function seedDatabase() {
  console.log('🌱 Début du seeding via API Supabase...');

  await clearDatabase();

  // 1. Créer les hippodromes
  console.log('🏇 Création des hippodromes...');
  const racecourses = await supabaseRequest('racecourses', 'POST', [
    {
      name: 'Hippodrome de Carthage',
      code: 'CART',
      location: 'Carthage, Tunis',
      capacity: 5000,
    },
    {
      name: 'Hippodrome de Tunis',
      code: 'TUNI',
      location: 'Tunis Centre',
      capacity: 8000,
    },
    {
      name: 'Hippodrome de Sousse',
      code: 'SOUS',
      location: 'Sousse',
      capacity: 3000,
    },
    {
      name: 'Hippodrome de Bizerte',
      code: 'BIZE',
      location: 'Bizerte',
      capacity: 2500,
    },
  ]);

  // 2. Créer les utilisateurs
  console.log('👥 Création des utilisateurs...');
  const hashedPassword = await hash('password123', 10);
  
  // Créer d'abord l'admin
  const adminUsers = await supabaseRequest('users', 'POST', [
    {
      email: 'admin@tunisiajockeyclub.com',
      password: hashedPassword,
      first_name: 'Admin',
      last_name: 'TJC',
      role: 'admin',
      phone: '+216 71 123 456',
      address: 'Avenue Habib Bourguiba',
      city: 'Tunis',
      postal_code: '1000',
      license_number: 'TJC-ADM-001',
      date_of_birth: null,
    },
  ]);

  // Créer les propriétaires
  const ownerUsers = await supabaseRequest('users', 'POST', [
    {
      email: 'haras.elons@email.com',
      password: hashedPassword,
      first_name: 'Mohamed',
      last_name: 'El Ons',
      role: 'owner',
      phone: '+216 98 111 222',
      address: 'Route de Bizerte',
      city: 'Tunis',
      postal_code: '1010',
      license_number: 'TJC-OWN-001',
      date_of_birth: null,
    },
    {
      email: 'ecurie.albaraka@email.com',
      password: hashedPassword,
      first_name: 'Farid',
      last_name: 'Al Baraka',
      role: 'owner',
      phone: '+216 98 333 444',
      address: 'Zone Industrielle',
      city: 'Sousse',
      postal_code: '4000',
      license_number: 'TJC-OWN-002',
      date_of_birth: null,
    },
    {
      email: 'haras.carthage@email.com',
      password: hashedPassword,
      first_name: 'Sami',
      last_name: 'Carthage',
      role: 'owner',
      phone: '+216 98 555 666',
      address: 'Route de Carthage',
      city: 'Tunis',
      postal_code: '1005',
      license_number: 'TJC-OWN-003',
      date_of_birth: null,
    },
  ]);

  // Créer les entraîneurs
  const trainerUsers = await supabaseRequest('users', 'POST', [
    {
      email: 'mohamed.gharbi@email.com',
      password: hashedPassword,
      first_name: 'Mohamed',
      last_name: 'Gharbi',
      role: 'trainer',
      phone: '+216 98 777 888',
      address: 'Écuries de Carthage',
      city: 'Tunis',
      postal_code: '1005',
      license_number: 'TJC-TRA-001',
      date_of_birth: null,
    },
    {
      email: 'slim.karray@email.com',
      password: hashedPassword,
      first_name: 'Slim',
      last_name: 'Karray',
      role: 'trainer',
      phone: '+216 98 999 000',
      address: 'Centre Équestre',
      city: 'Sousse',
      postal_code: '4002',
      license_number: 'TJC-TRA-002',
      date_of_birth: null,
    },
    {
      email: 'farid.mansour@email.com',
      password: hashedPassword,
      first_name: 'Farid',
      last_name: 'Mansour',
      role: 'trainer',
      phone: '+216 98 111 333',
      address: 'Haras El Fejja',
      city: 'Manouba',
      postal_code: '2010',
      license_number: 'TJC-TRA-003',
      date_of_birth: null,
    },
  ]);

  // Créer les jockeys
  const jockeyUsers = await supabaseRequest('users', 'POST', [
    {
      email: 'ahmed.benali@email.com',
      password: hashedPassword,
      first_name: 'Ahmed',
      last_name: 'Ben Ali',
      role: 'jockey',
      phone: '+216 98 123 789',
      address: 'Cité Sportive',
      city: 'Tunis',
      postal_code: '1004',
      date_of_birth: '1996-03-15',
      license_number: 'TJC-JOC-001',
    },
    {
      email: 'mohamed.khalil@email.com',
      password: hashedPassword,
      first_name: 'Mohamed',
      last_name: 'Khalil',
      role: 'jockey',
      phone: '+216 98 456 789',
      address: 'Quartier Olympique',
      city: 'Tunis',
      postal_code: '1003',
      date_of_birth: '1993-07-22',
      license_number: 'TJC-JOC-002',
    },
    {
      email: 'youssef.mansour@email.com',
      password: hashedPassword,
      first_name: 'Youssef',
      last_name: 'Mansour',
      role: 'jockey',
      phone: '+216 98 654 321',
      address: 'Zone Résidentielle',
      city: 'Sousse',
      postal_code: '4001',
      date_of_birth: '1998-11-08',
      license_number: 'TJC-JOC-003',
    },
    {
      email: 'karim.saidi@email.com',
      password: hashedPassword,
      first_name: 'Karim',
      last_name: 'Saidi',
      role: 'jockey',
      phone: '+216 98 987 654',
      address: 'Avenue de la République',
      city: 'Bizerte',
      postal_code: '7000',
      date_of_birth: '1989-05-12',
      license_number: 'TJC-JOC-004',
    },
    {
      email: 'slim.karray.jockey@email.com',
      password: hashedPassword,
      first_name: 'Slim',
      last_name: 'Karray Jr',
      role: 'jockey',
      phone: '+216 98 147 258',
      address: 'Résidence Sportive',
      city: 'Tunis',
      postal_code: '1006',
      date_of_birth: '2001-09-25',
      license_number: 'TJC-JOC-005',
    },
  ]);

  // Combiner tous les utilisateurs pour la suite
  const users = [...adminUsers, ...ownerUsers, ...trainerUsers, ...jockeyUsers];

  // Récupérer les utilisateurs par rôle
  const adminUser = adminUsers[0];
  const ownerUsersList = ownerUsers;
  const trainerUsersList = trainerUsers;
  const jockeyUsersList = jockeyUsers;

  // 3. Créer les profils spécialisés
  console.log('🏆 Création des profils spécialisés...');
  
  // Créer les owners
  const owners = await supabaseRequest('owners', 'POST', [
    {
      user_id: ownerUsersList[0].id,
      stable_name: 'Haras El Ons',
      colors_description: 'Rouge et blanc, étoiles dorées',
      registration_number: 'TJC-STA-001',
    },
    {
      user_id: ownerUsersList[1].id,
      stable_name: 'Écurie Al Baraka',
      colors_description: 'Vert et or, rayures',
      registration_number: 'TJC-STA-002',
    },
    {
      user_id: ownerUsersList[2].id,
      stable_name: 'Haras de Carthage',
      colors_description: 'Bleu et argent, losanges',
      registration_number: 'TJC-STA-003',
    },
  ]);

  // Créer les trainers
  const trainers = await supabaseRequest('trainers', 'POST', [
    {
      user_id: trainerUsersList[0].id,
      license_number: 'TJC-TRA-001',
      years_experience: 15,
      specialization: 'Galop et Obstacles',
      stable_location: 'Carthage Training Center',
    },
    {
      user_id: trainerUsersList[1].id,
      license_number: 'TJC-TRA-002',
      years_experience: 12,
      specialization: 'Jeunes chevaux',
      stable_location: 'Sousse Equestrian Center',
    },
    {
      user_id: trainerUsersList[2].id,
      license_number: 'TJC-TRA-003',
      years_experience: 18,
      specialization: 'Courses de fond',
      stable_location: 'El Fejja Training Ground',
    },
  ]);

  // Créer les jockeys
  const jockeys = await supabaseRequest('jockeys', 'POST', [
    {
      user_id: jockeyUsersList[0].id,
      license_number: 'TJC-JOC-001',
      weight_kg: 52.0,
      height_cm: 165,
      wins: 67,
      places: 134,
      shows: 245,
    },
    {
      user_id: jockeyUsersList[1].id,
      license_number: 'TJC-JOC-002',
      weight_kg: 54.0,
      height_cm: 168,
      wins: 89,
      places: 198,
      shows: 398,
    },
    {
      user_id: jockeyUsersList[2].id,
      license_number: 'TJC-JOC-003',
      weight_kg: 51.0,
      height_cm: 163,
      wins: 34,
      places: 78,
      shows: 156,
    },
    {
      user_id: jockeyUsersList[3].id,
      license_number: 'TJC-JOC-004',
      weight_kg: 55.0,
      height_cm: 170,
      wins: 95,
      places: 248,
      shows: 512,
    },
    {
      user_id: jockeyUsersList[4].id,
      license_number: 'TJC-JOC-005',
      weight_kg: 50.0,
      height_cm: 162,
      wins: 8,
      places: 19,
      shows: 45,
    },
  ]);

  // 4. Créer les chevaux
  console.log('🐎 Création des chevaux...');
  const horses = await supabaseRequest('horses', 'POST', [
    {
      name: 'Thunder Bay',
      registration_number: 'TJC-H-001',
      date_of_birth: '2020-04-15',
      color: 'Bai brun',
      breed: 'Pur-sang Arabe',
      sire_name: 'Desert King',
      dam_name: 'Golden Mare',
      owner_id: owners[0].id,
      trainer_id: trainers[0].id,
      current_rating: 92,
    },
    {
      name: 'Desert Storm',
      registration_number: 'TJC-H-002',
      date_of_birth: '2021-06-08',
      color: 'Alezan',
      breed: 'Pur-sang Anglais',
      sire_name: 'Storm Rider',
      dam_name: 'Desert Rose',
      owner_id: owners[1].id,
      trainer_id: trainers[1].id,
      current_rating: 87,
    },
    {
      name: 'Sahara Prince',
      registration_number: 'TJC-H-003',
      date_of_birth: '2019-02-20',
      color: 'Gris',
      breed: 'Pur-sang Arabe',
      sire_name: 'Prince of Sands',
      dam_name: 'Sahara Queen',
      owner_id: owners[2].id,
      trainer_id: trainers[2].id,
      current_rating: 95,
    },
    {
      name: 'Atlas Runner',
      registration_number: 'TJC-H-004',
      date_of_birth: '2018-08-12',
      color: 'Bai',
      breed: 'Anglo-Arabe',
      sire_name: 'Mountain King',
      dam_name: 'Valley Wind',
      owner_id: owners[0].id,
      trainer_id: trainers[1].id,
      current_rating: 82,
    },
    {
      name: 'Medina Star',
      registration_number: 'TJC-H-005',
      date_of_birth: '2022-03-30',
      color: 'Noir',
      breed: 'Pur-sang Arabe',
      sire_name: 'Star Gazer',
      dam_name: 'Medina Moon',
      owner_id: owners[2].id,
      trainer_id: trainers[0].id,
      current_rating: 78,
    },
  ]);

  // 5. Créer des courses
  console.log('🏁 Création des courses...');
  const races = await supabaseRequest('races', 'POST', [
    // Courses passées
    {
      race_number: 1,
      race_date: '2025-08-20',
      race_time: '14:30:00',
      racecourse_id: racecourses[0].id,
      name: 'Prix de Carthage',
      race_class: 'Groupe 3',
      distance_meters: 1600,
      prize_money: 25000.00,
      conditions: 'Bon',
      max_runners: 16,
    },
    {
      race_number: 2,
      race_date: '2025-08-15',
      race_time: '15:00:00',
      racecourse_id: racecourses[1].id,
      name: 'Grand Prix de Tunis',
      race_class: 'Groupe 1',
      distance_meters: 2000,
      prize_money: 50000.00,
      conditions: 'Lourd',
      max_runners: 18,
    },
    // Courses à venir
    {
      race_number: 3,
      race_date: '2025-08-25',
      race_time: '14:30:00',
      racecourse_id: racecourses[0].id,
      name: 'Prix International',
      race_class: 'Groupe 2',
      distance_meters: 1600,
      prize_money: 35000.00,
      conditions: 'Bon prévu',
      max_runners: 16,
    },
    {
      race_number: 4,
      race_date: '2025-08-30',
      race_time: '15:00:00',
      racecourse_id: racecourses[1].id,
      name: "Grand Prix d'Été",
      race_class: 'Groupe 1',
      distance_meters: 2000,
      prize_money: 60000.00,
      conditions: 'Bon prévu',
      max_runners: 18,
    },
  ]);

  console.log('🎉 Seeding terminé avec succès !');
  console.log(`
📊 Résumé des données créées :
- 🏇 Hippodromes: ${racecourses.length}
- 👥 Utilisateurs: ${users.length}
- 🏰 Propriétaires: ${owners.length}
- 🎓 Entraîneurs: ${trainers.length}
- 👤 Jockeys: ${jockeys.length}
- 🐎 Chevaux: ${horses.length}
- 🏁 Courses: ${races.length}
  `);
}

// Exécuter le seeding
seedDatabase()
  .catch((error) => {
    console.error('❌ Erreur lors du seeding:', error);
    process.exit(1);
  });
