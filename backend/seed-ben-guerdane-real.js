const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ltfnwtzruqnrppxvstso.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx0Zm53dHpydXFucnBweHZzdHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3OTUwMTksImV4cCI6MjA1MDM3MTAxOX0.Y_gTsZi7A8Tju0IYNJnV6dHiZwQYFFzMdvO23oSLgxk';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedBenGuerdaneProgram() {
  console.log('🏇 Ajout du programme officiel Hippodrome de Ben Guerdane - Samedi 2 août 2025...');

  try {
    // 1. Créer/vérifier l'hippodrome de Ben Guerdane
    const { data: racecourse, error: racecourseError } = await supabase
      .from('racecourses')
      .upsert([{
        name: 'Hippodrome de Ben Guerdane',
        location: 'Ben Guerdane, Médenine',
        capacity: 5000,
        track_type: 'turf',
        created_at: new Date().toISOString()
      }], { 
        onConflict: 'name',
        ignoreDuplicates: false 
      })
      .select();

    if (racecourseError) {
      console.error('❌ Erreur hippodrome:', racecourseError);
      return;
    }

    const racecourseId = racecourse[0].id;
    console.log('✅ Hippodrome créé/trouvé:', racecourseId);

    // 2. Créer les 4 courses du programme
    const races = [
      {
        race_name: 'Prix DE JEKITIS',
        race_date: '2025-08-02',
        race_time: '16:30',
        distance_meters: 1400,
        max_runners: 11,
        max_participants: 11,
        prize_money: 4250,
        race_number: 1,
        status: 'scheduled',
        race_class: 'Conditions',
        conditions: 'Pour poulains et pouliches de 3 ans Pur Sang Arabe n\'ayant pas gagné 3.500 DT – Poids 55 kg',
        racecourse_id: racecourseId,
        entry_fee: 2400,
        forfeit_fee_1: 8000,
        forfeit_fee_2: 16000,
        prize_breakdown: '1.168,75 – 467,50 – 233,750 – 148,750'
      },
      {
        race_name: 'Prix DE CHOUCHA (A Réservée)',
        race_date: '2025-08-02',
        race_time: '17:00',
        distance_meters: 1700,
        max_runners: 7,
        max_participants: 7,
        prize_money: 4250,
        race_number: 2,
        status: 'scheduled',
        race_class: 'Réservée',
        conditions: 'Course réservée',
        racecourse_id: racecourseId,
        prize_breakdown: '1.168,75 – 467,50 – 233,750 – 148,750'
      },
      {
        race_name: 'Prix DE CHIKRBEN (A Réservée)',
        race_date: '2025-08-02',
        race_time: '17:30',
        distance_meters: 2000,
        max_runners: 9,
        max_participants: 9,
        prize_money: 4250,
        race_number: 3,
        status: 'scheduled',
        race_class: 'Réservée',
        conditions: 'Course réservée',
        racecourse_id: racecourseId,
        prize_breakdown: '1.168,75 – 467,50 – 233,750 – 148,750'
      },
      {
        race_name: 'Prix DE BEN GUERDANE (Handicap)',
        race_date: '2025-08-02',
        race_time: '18:00',
        distance_meters: 2000,
        max_runners: 12,
        max_participants: 12,
        prize_money: 3825,
        race_number: 4,
        status: 'scheduled',
        race_class: 'Handicap',
        conditions: 'Course à handicap',
        racecourse_id: racecourseId
      }
    ];

    const { data: insertedRaces, error: racesError } = await supabase
      .from('races')
      .insert(races)
      .select();

    if (racesError) {
      console.error('❌ Erreur courses:', racesError);
      return;
    }

    console.log('✅ 4 courses ajoutées:', insertedRaces.map(r => `${r.race_number}. ${r.race_name}`));

    // 3. Ajouter quelques chevaux et jockeys pour la première course (Prix DE JEKITIS)
    const jekitisRace = insertedRaces.find(r => r.race_name === 'Prix DE JEKITIS');
    
    // Propriétaires
    const owners = [
      { name: 'Salim Bouaziz', colors: 'M.BL-BC.BL-P.BL-M' },
      { name: 'Naceur Arjoun', colors: 'MJL-BR-GR-JA-MC' },
      { name: 'Jouini Mounir', colors: 'BL-RJ-MJ-BL' },
      { name: 'Mokhtar Ghorbal', colors: 'BL-BR-VT-MC' },
      { name: 'Houcine Jrid', colors: 'RJ-CR-JN-MC' }
    ];

    const { data: insertedOwners } = await supabase
      .from('owners')
      .upsert(owners, { onConflict: 'name', ignoreDuplicates: false })
      .select();

    // Jockeys
    const jockeys = [
      { name: 'M. Jallagi', license_number: 'MJ001' },
      { name: 'K. Jouini', license_number: 'KJ002' },
      { name: 'A. Mahjoub', license_number: 'AM003' },
      { name: 'H. Mabrouk', license_number: 'HM004' },
      { name: 'A. Ayed', license_number: 'AA005' }
    ];

    const { data: insertedJockeys } = await supabase
      .from('jockeys')
      .upsert(jockeys, { onConflict: 'license_number', ignoreDuplicates: false })
      .select();

    // Entraîneurs
    const trainers = [
      { name: 'Sadoq Triki', license_number: 'ST001' },
      { name: 'M\'ghorghor', license_number: 'MG002' },
      { name: 'Nasri Ammar', license_number: 'NA003' }
    ];

    const { data: insertedTrainers } = await supabase
      .from('trainers')
      .upsert(trainers, { onConflict: 'license_number', ignoreDuplicates: false })
      .select();

    // Chevaux pour le Prix DE JEKITIS
    const horses = [
      {
        name: 'RIGEB',
        gender: 'M',
        age: 3,
        breed: 'Pur Sang Arabe',
        sire: 'KANDO F.AL',
        dam: 'Fatouma EL Kahloucha',
        owner_id: insertedOwners.find(o => o.name === 'Salim Bouaziz')?.id,
        trainer_id: insertedTrainers.find(t => t.name === 'Sadoq Triki')?.id
      },
      {
        name: 'RAMZ EL FAKHIR',
        gender: 'M',
        age: 3,
        breed: 'Pur Sang Arabe',
        sire: 'SAMMYD',
        dam: 'Khawla',
        owner_id: insertedOwners.find(o => o.name === 'Naceur Arjoun')?.id,
        trainer_id: insertedTrainers.find(t => t.name === 'M\'ghorghor')?.id
      },
      {
        name: 'ZAHOUEL',
        gender: 'F',
        age: 3,
        breed: 'Pur Sang Arabe',
        sire: 'SANADIK HH',
        dam: 'Nisbahat',
        owner_id: insertedOwners.find(o => o.name === 'Jouini Mounir')?.id,
        trainer_id: insertedTrainers.find(t => t.name === 'Sadoq Triki')?.id
      },
      {
        name: 'RIM ESSOUHEIL',
        gender: 'F',
        age: 3,
        breed: 'Pur Sang Arabe',
        sire: 'JAWAD AM',
        dam: 'Sibakat',
        owner_id: insertedOwners.find(o => o.name === 'Mokhtar Ghorbal')?.id,
        trainer_id: insertedTrainers.find(t => t.name === 'M\'ghorghor')?.id
      },
      {
        name: 'REHAB AL BADR',
        gender: 'F',
        age: 3,
        breed: 'Pur Sang Arabe',
        sire: 'RAYHAN EL Badr',
        dam: 'Samia',
        owner_id: insertedOwners.find(o => o.name === 'Houcine Jrid')?.id,
        trainer_id: insertedTrainers.find(t => t.name === 'Nasri Ammar')?.id
      }
    ];

    const { data: insertedHorses } = await supabase
      .from('horses')
      .insert(horses)
      .select();

    console.log('✅ 5 chevaux ajoutés pour le Prix DE JEKITIS');

    // Participations pour le Prix DE JEKITIS
    const raceEntries = [
      {
        race_id: jekitisRace.id,
        horse_id: insertedHorses.find(h => h.name === 'RIGEB')?.id,
        jockey_id: insertedJockeys.find(j => j.name === 'M. Jallagi')?.id,
        cloth_number: 1,
        draw_position: 1,
        weight_carried_kg: 55,
        starting_position: 1
      },
      {
        race_id: jekitisRace.id,
        horse_id: insertedHorses.find(h => h.name === 'RAMZ EL FAKHIR')?.id,
        jockey_id: insertedJockeys.find(j => j.name === 'K. Jouini')?.id,
        cloth_number: 2,
        draw_position: 2,
        weight_carried_kg: 55,
        starting_position: 2
      },
      {
        race_id: jekitisRace.id,
        horse_id: insertedHorses.find(h => h.name === 'ZAHOUEL')?.id,
        jockey_id: insertedJockeys.find(j => j.name === 'A. Mahjoub')?.id,
        cloth_number: 3,
        draw_position: 3,
        weight_carried_kg: 55,
        starting_position: 3
      },
      {
        race_id: jekitisRace.id,
        horse_id: insertedHorses.find(h => h.name === 'RIM ESSOUHEIL')?.id,
        jockey_id: insertedJockeys.find(j => j.name === 'H. Mabrouk')?.id,
        cloth_number: 4,
        draw_position: 4,
        weight_carried_kg: 55,
        starting_position: 4
      },
      {
        race_id: jekitisRace.id,
        horse_id: insertedHorses.find(h => h.name === 'REHAB AL BADR')?.id,
        jockey_id: insertedJockeys.find(j => j.name === 'A. Ayed')?.id,
        cloth_number: 5,
        draw_position: 5,
        weight_carried_kg: 55,
        starting_position: 5
      }
    ];

    const { data: insertedEntries } = await supabase
      .from('race_entries')
      .insert(raceEntries)
      .select();

    console.log('✅ 5 participations ajoutées pour le Prix DE JEKITIS');

    console.log('\n🎉 PROGRAMME COMPLET HIPPODROME BEN GUERDANE AJOUTÉ !');
    console.log('📅 Samedi 2 août 2025 – 37e Journée – Début 16h00');
    console.log('🏁 1ère Course – 16h30 – Prix DE JEKITIS (4.250 DT)');
    console.log('🏁 2ème Course – 17h00 – Prix DE CHOUCHA (4.250 DT)');
    console.log('🏁 3ème Course – 17h30 – Prix DE CHIKRBEN (4.250 DT)');
    console.log('🏁 4ème Course – 18h00 – Prix DE BEN GUERDANE (3.825 DT)');
    console.log('\n✅ Base de données mise à jour avec les vraies données !');

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

seedBenGuerdaneProgram();
