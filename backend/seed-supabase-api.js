import { createClient } from '@supabase/supabase-js';
import { hash } from 'bcryptjs';

const SUPABASE_URL = 'https://hssigihofbbdehqrnnoz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzc2lnaWhvZmJiZGVocXJubm96Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NTkzNDksImV4cCI6MjA3MTEzNTM0OX0.fkeE84xM2u7iZ69YxMtgH7TH0xbYvc9i2-2tDMq5CQQ';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhzc2lnaWhvZmJiZGVocXJubm96Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NTU1OTM0OSwiZXhwIjoyMDcxMTM1MzQ5fQ.LJXci09iPB2JrHMMQlCorfDdRnJhMQCfhVNU01YD7o4';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function seedWithSupabaseAPI() {
  console.log('🌱 Début du seeding via API Supabase...');

  try {
    // 1. Nettoyer les données existantes (dans l'ordre pour respecter les FK)
    const tables = ['race_result', 'race_entry', 'race', 'horse', 'session', 'jockey', 'trainer', 'owner', 'racecourse', 'user'];
    
    console.log('🗑️  Nettoyage des données existantes...');
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (error && !error.message.includes('No rows')) {
        console.log(`⚠️  Avertissement ${table}:`, error.message);
      }
    }

    // 2. Créer les hippodromes
    console.log('🏇 Création des hippodromes...');
    const { data: racecourses, error: racecourseError } = await supabase
      .from('racecourse')
      .insert([
        {
          name: 'Hippodrome de Carthage',
          code: 'CART',
          location: 'Carthage, Tunis',
          track_type: 'Gazon',
          capacity: 5000,
        },
        {
          name: 'Hippodrome de Tunis',
          code: 'TUNI',
          location: 'Tunis Centre',
          track_type: 'Sable',
          capacity: 8000,
        },
        {
          name: 'Hippodrome de Sousse',
          code: 'SOUS',
          location: 'Sousse',
          track_type: 'Gazon',
          capacity: 3000,
        },
        {
          name: 'Hippodrome de Bizerte',
          code: 'BIZE',
          location: 'Bizerte',
          track_type: 'Mixte',
          capacity: 2500,
        },
      ])
      .select();

    if (racecourseError) throw racecourseError;
    console.log(`✅ ${racecourses.length} hippodromes créés`);

    // 3. Créer les utilisateurs
    console.log('👥 Création des utilisateurs...');
    const hashedPassword = await hash('password123', 10);
    
    const usersToCreate = [
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
      },
      // Propriétaires
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
      },
      // Entraîneurs
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
      },
      // Jockeys
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
    ];

    const { data: users, error: userError } = await supabase
      .from('user')
      .insert(usersToCreate)
      .select();

    if (userError) throw userError;
    console.log(`✅ ${users.length} utilisateurs créés`);

    // 4. Créer les profils spécialisés (propriétaires)
    const ownerUsers = users.filter(u => u.role === 'owner');
    if (ownerUsers.length > 0) {
      console.log('🏰 Création des profils propriétaires...');
      const { data: owners, error: ownerError } = await supabase
        .from('owner')
        .insert([
          {
            user_id: ownerUsers[0].id,
            stable_name: 'Haras El Ons',
            colors_description: 'Rouge et blanc, étoiles dorées',
            registration_number: 'TJC-STA-001',
          },
          {
            user_id: ownerUsers[1].id,
            stable_name: 'Écurie Al Baraka',
            colors_description: 'Vert et or, rayures',
            registration_number: 'TJC-STA-002',
          },
        ])
        .select();

      if (ownerError) throw ownerError;
      console.log(`✅ ${owners.length} propriétaires créés`);
    }

    // 5. Créer les profils entraîneurs
    const trainerUsers = users.filter(u => u.role === 'trainer');
    if (trainerUsers.length > 0) {
      console.log('🎓 Création des profils entraîneurs...');
      const { data: trainers, error: trainerError } = await supabase
        .from('trainer')
        .insert([
          {
            user_id: trainerUsers[0].id,
            license_number: 'TJC-TRA-001',
            years_experience: 15,
            specialization: 'Galop et Obstacles',
            stable_location: 'Carthage Training Center',
          },
        ])
        .select();

      if (trainerError) throw trainerError;
      console.log(`✅ ${trainers.length} entraîneurs créés`);
    }

    // 6. Créer les profils jockeys
    const jockeyUsers = users.filter(u => u.role === 'jockey');
    if (jockeyUsers.length > 0) {
      console.log('🏇 Création des profils jockeys...');
      const { data: jockeys, error: jockeyError } = await supabase
        .from('jockey')
        .insert(jockeyUsers.map((user, index) => ({
          user_id: user.id,
          license_number: user.license_number,
          weight_kg: [52.0, 54.0][index] || 53.0,
          height_cm: [165, 168][index] || 166,
          wins: [67, 89][index] || 50,
          places: [134, 198][index] || 100,
          shows: [245, 398][index] || 200,
        })))
        .select();

      if (jockeyError) throw jockeyError;
      console.log(`✅ ${jockeys.length} jockeys créés`);
    }

    console.log(`
🎉 Seeding terminé avec succès via API Supabase !

📊 Résumé des données créées :
- 👥 Utilisateurs: ${users.length}
- 🏇 Hippodromes: ${racecourses.length}
- 🏰 Propriétaires: ${ownerUsers.length}
- 🎓 Entraîneurs: ${trainerUsers.length}
- 🏇 Jockeys: ${jockeyUsers.length}

🔑 Compte admin créé:
   Email: admin@tunisiajockeyclub.com
   Mot de passe: password123
    `);

  } catch (error) {
    console.error('❌ Erreur lors du seeding:', error);
    throw error;
  }
}

// Installation des dépendances si nécessaire
async function ensureDependencies() {
  try {
    require('@supabase/supabase-js');
  } catch (error) {
    console.log('📦 Installation de @supabase/supabase-js...');
    const { execSync } = require('child_process');
    execSync('npm install @supabase/supabase-js', { stdio: 'inherit' });
  }
}

async function main() {
  await ensureDependencies();
  await seedWithSupabaseAPI();
}

main().catch((error) => {
  console.error('❌ Échec du seeding:', error);
  process.exit(1);
});
