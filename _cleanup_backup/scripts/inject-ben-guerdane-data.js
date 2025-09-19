const { createClient } = require('@supabase/supabase-js');

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// Données réelles du programme officiel - Hippodrome de Ben Guerdane
// Samedi 2 août 2025 – 37e Journée – Début 16h00

const programmeData = {
  date: new Date('2025-08-02'),
  hippodrome: {
    name: 'Hippodrome de Ben Guerdane',
    location: 'Ben Guerdane, Tunisie'
  },
  journee: 37,
  debutHeure: '16:00',
  courses: [
    {
      numero: 1,
      heure: '16:30',
      prix: 'DE JEKITIS',
      allocation: 4250,
      distance: 1400,
      condition: 'Pour poulains et pouliches de 3 ans Pur Sang Arabe n\'ayant pas gagné 3.500 DT – Poids 55 kg.',
      entree: 2400,
      forfaits: [8000, 16000],
      primes: [1168.75, 467.50, 233.75, 148.75],
      participants: [
        {
          proprietaire: 'Salim Bouaziz',
          couleurs: 'M.BL-BC.BL-P.BL-M',
          cheval: 'RIGEB',
          jockey: 'M. Jallagi',
          poids: 55,
          sexeAge: 'M 3',
          race: 'A',
          origines: 'KANDO F.AL – Fatouma EL Kahloucha',
          entraineur: 'Sadoq Triki',
          perf: '6 2 0'
        },
        {
          proprietaire: 'Naceur Arjoun',
          couleurs: 'MJL-BR-GR-JA-MC',
          cheval: 'RAMZ EL FAKHIR',
          jockey: 'K. Jouini',
          poids: 55,
          sexeAge: 'M 3',
          race: 'A',
          origines: 'SAMMYD – Khawla',
          entraineur: 'M\'ghorghor',
          perf: '2 0 1'
        },
        {
          proprietaire: 'Jouini Mounir',
          couleurs: 'BL-RJ-MJ-BL',
          cheval: 'ZAHOUEL',
          jockey: 'A. Mahjoub',
          poids: 55,
          sexeAge: 'F 3',
          race: 'A',
          origines: 'SANADIK HH – Nisbahat',
          entraineur: 'Sadoq Triki',
          perf: '7 0 0'
        },
        {
          proprietaire: 'Mokhtar Ghorbal',
          couleurs: 'BL-BR-VT-MC',
          cheval: 'RIM ESSOUHEIL',
          jockey: 'H. Mabrouk',
          poids: 55,
          sexeAge: 'F 3',
          race: 'A',
          origines: 'JAWAD AM – Sibakat',
          entraineur: 'M\'ghorghor',
          perf: '6 0 0'
        },
        {
          proprietaire: 'Houcine Jrid',
          couleurs: 'RJ-CR-JN-MC',
          cheval: 'REHAB AL BADR',
          jockey: 'A. Ayed',
          poids: 55,
          sexeAge: 'F 3',
          race: 'A',
          origines: 'RAYHAN EL Badr – Samia',
          entraineur: 'Nasri Ammar',
          perf: '2 0 0'
        },
        {
          proprietaire: 'Mohamed Ali Bahloul',
          couleurs: 'VT-CR-BL-CR',
          cheval: 'REMETH NAGHAM',
          jockey: 'H. Jrid',
          poids: 55,
          sexeAge: 'F 3',
          race: 'A',
          origines: 'AMIR – Naghama',
          entraineur: 'M\'ghorghor',
          perf: '3 0 0'
        },
        {
          proprietaire: 'Mokhtar Ghorbal',
          couleurs: 'RJ-VT-CR-CR',
          cheval: 'RAYHANA EL HADI',
          jockey: 'M. Lahmer',
          poids: 55,
          sexeAge: 'F 3',
          race: 'A',
          origines: 'GHAZI – Warda',
          entraineur: 'M\'ghorghor',
          perf: '3 0 0'
        },
        {
          proprietaire: 'Salim Bouaziz',
          couleurs: 'BL-BC-BL-AMT-BL',
          cheval: 'REMETT CHARGUI',
          jockey: 'A. Mahjoub',
          poids: 55,
          sexeAge: 'F 3',
          race: 'A',
          origines: 'KAMEL LONDES – Charga',
          entraineur: 'M\'ghorghor',
          perf: '2 0 0'
        },
        {
          proprietaire: 'Salim Bouaziz',
          couleurs: 'BL-CR-BL-AMT-BL',
          cheval: 'RIJOU',
          jockey: 'M. Lahmer',
          poids: 55,
          sexeAge: 'F 3',
          race: 'A',
          origines: 'RAYHAN EL Hadi – Amira',
          entraineur: 'M\'ghorghor',
          perf: '5 0 0'
        },
        {
          proprietaire: 'Salim Bouaziz',
          couleurs: 'BL-CR-BL-AMT-BL',
          cheval: 'RIFJ',
          jockey: 'H. Mabrouk',
          poids: 55,
          sexeAge: 'F 3',
          race: 'A',
          origines: 'MUNEER – Zaradallah',
          entraineur: 'M\'ghorghor',
          perf: '2 0 0'
        },
        {
          proprietaire: 'Ahmed Regai',
          couleurs: 'M.BL-BL-P.VT-BL',
          cheval: 'RAMZ ETTAHADI',
          jockey: 'Y. Yaldeminou',
          poids: 55,
          sexeAge: 'M 3',
          race: 'A',
          origines: 'MUNEER – Zeradallah',
          entraineur: 'Dhaou Regai',
          perf: '2 0 0'
        }
      ]
    },
    {
      numero: 2,
      heure: '17:00',
      prix: 'DE CHOUCHA (A Réservée)',
      allocation: 4250,
      distance: 1700,
      primes: [1168.75, 467.50, 233.75, 148.75],
      participants: [
        {
          proprietaire: 'Kaïs Gharbi',
          couleurs: 'RJ-BC-DENT-MD-PG',
          cheval: 'RAHIB ALBADEIA',
          jockey: 'S. Khalouati',
          poids: 55,
          sexeAge: 'M 3',
          race: 'A',
          origines: 'TEL EL AHEL – Khamet El Essalem',
          entraineur: 'Dr. Gharbi',
          perf: '3 2 0'
        },
        {
          proprietaire: 'Ghanem Abbessa',
          couleurs: 'CA-BL-BL-BC-ALS',
          cheval: 'RAMZ AL HOSN',
          jockey: 'M. Jouini',
          poids: 55,
          sexeAge: 'M 3',
          race: 'A',
          origines: 'DEEBES – Nawal',
          entraineur: 'Nasri Ammar',
          perf: '4 0 0'
        },
        {
          proprietaire: 'Said Belhadj',
          couleurs: 'CR-VT-MC-BL',
          cheval: 'SAHOUH',
          jockey: 'A. Mabrouk',
          poids: 55,
          sexeAge: 'M 3',
          race: 'A',
          origines: 'JARES – Hadina',
          entraineur: 'M\'ghorghor',
          perf: '2 0 0'
        },
        {
          proprietaire: 'Jahouchi Abd',
          couleurs: 'GRN-VT-AMT-CR',
          cheval: 'RAGOAN',
          jockey: 'H. Mabrouk',
          poids: 55,
          sexeAge: 'M 3',
          race: 'A',
          origines: 'RAMADHAN – Soumaya',
          entraineur: 'Nasri Ammar',
          perf: '2 0 0'
        },
        {
          proprietaire: 'Salim Bouaziz',
          couleurs: 'BL-CR-BL-AMT-BL',
          cheval: 'RAMEH',
          jockey: 'M. Lahmer',
          poids: 55,
          sexeAge: 'M 3',
          race: 'A',
          origines: 'GHOUFRAN – Imane',
          entraineur: 'Sadoq Triki',
          perf: '2 0 0'
        },
        {
          proprietaire: 'Kamel Mosrati',
          couleurs: 'JN-P.VT-MC-BL-VRT',
          cheval: 'RABEE EL EZZ',
          jockey: 'F. Jallagi',
          poids: 55,
          sexeAge: 'M 3',
          race: 'A',
          origines: 'BADER – Ghaydania',
          entraineur: 'M\'ghorghor',
          perf: '3 0 0'
        },
        {
          proprietaire: 'Kamel Mosrati',
          couleurs: 'JN-P.VT-MC-BL-VRT',
          cheval: 'RAZANE',
          jockey: 'S. Seif Daas',
          poids: 55,
          sexeAge: 'F 3',
          race: 'A',
          origines: 'HACHER – Ghayrabib',
          entraineur: 'Dhaou Brik',
          perf: '2 0 0'
        }
      ]
    },
    {
      numero: 3,
      heure: '17:30',
      prix: 'DE CHIKRBEN (A Réservée)',
      allocation: 4250,
      distance: 2000,
      participants: [
        {
          proprietaire: 'Salah Gharbi',
          couleurs: 'CA-TR-CR-BL-MC',
          cheval: 'OUALID AL AHD',
          jockey: 'O. Ayed',
          poids: 55,
          sexeAge: 'M 4',
          race: 'A',
          origines: 'FARFOURHOUD – Ouda',
          entraineur: 'Farouk Ouahida',
          perf: '2 0 0'
        },
        {
          proprietaire: 'Salim Bouaziz',
          couleurs: 'BL-CR-BL-AMT-BL',
          cheval: 'RAMZ EL AHD',
          jockey: 'K. Jouini',
          poids: 55,
          sexeAge: 'M 4',
          race: 'A',
          origines: 'SAYAT-TAYASSADRA',
          entraineur: 'M\'ghorghor',
          perf: '3 0 0'
        },
        {
          proprietaire: 'Salim Bouaziz',
          couleurs: 'BL-CR-BL-AMT-BL',
          cheval: 'KAREEM EL BADR',
          jockey: 'M. Lahmer',
          poids: 55,
          sexeAge: 'M 4',
          race: 'A',
          origines: 'SAYAT-TAYASSADRA',
          entraineur: 'M\'ghorghor',
          perf: '3 0 0'
        },
        {
          proprietaire: 'Salim Bouaziz',
          couleurs: 'BL-CR-BL-AMT-BL',
          cheval: 'NAWAL EL ARAB',
          jockey: 'A. Mabrouk',
          poids: 55,
          sexeAge: 'F 4',
          race: 'A',
          origines: 'SAYAT-TAYASSADRA',
          entraineur: 'M\'ghorghor',
          perf: '2 0 0'
        },
        {
          proprietaire: 'Hmida Jridi',
          couleurs: 'BL-BC-CR-BL',
          cheval: 'RYAH EL HADI',
          jockey: 'H. Jrid',
          poids: 55,
          sexeAge: 'F 4',
          race: 'A',
          origines: 'JAWAD – Wardia',
          entraineur: 'Nasri Ammar',
          perf: '2 0 0'
        },
        {
          proprietaire: 'Ali Ben Ahmed Jilani',
          couleurs: 'RJ-CR-BC-BL',
          cheval: 'LIYATH CHAAMBI',
          jockey: 'W. Bedhief',
          poids: 55,
          sexeAge: 'M 4',
          race: 'A',
          origines: 'RAMZI – Sondos',
          entraineur: 'Faouzi Ali B.',
          perf: '2 0 0'
        },
        {
          proprietaire: 'Hmida Jridi',
          couleurs: 'RJ-BL-CR-CR',
          cheval: 'SOUFIANE',
          jockey: 'M. Mabrouk',
          poids: 55,
          sexeAge: 'M 4',
          race: 'A',
          origines: 'BADER – Soumaya',
          entraineur: 'Nasri Ammar',
          perf: '2 0 0'
        },
        {
          proprietaire: 'Slim Jelassi',
          couleurs: 'RJ-CR-BC-BL',
          cheval: 'AZIZ',
          jockey: 'A. Mahjoub',
          poids: 55,
          sexeAge: 'M 4',
          race: 'A',
          origines: 'GHAZI – Ghadra',
          entraineur: 'Rached Zouari',
          perf: '2 0 0'
        },
        {
          proprietaire: 'Jebn Mabrouk',
          couleurs: 'VT-P.CR-CR-BL',
          cheval: 'NEXT MORNEG',
          jockey: 'K. Jouini',
          poids: 55,
          sexeAge: 'M 4',
          race: 'A',
          origines: 'RAMZ – Hamsa',
          entraineur: 'Rached Zouari',
          perf: '2 0 0'
        },
        {
          proprietaire: 'Jebn Mabrouk',
          couleurs: 'CR-VT-BL-CR',
          cheval: 'OSCAR',
          jockey: 'A. Balsem',
          poids: 55,
          sexeAge: 'M 4',
          race: 'A',
          origines: 'REFA – Fijlia',
          entraineur: 'Faouzi Ali B.',
          perf: '1 1 1'
        }
      ]
    },
    {
      numero: 4,
      heure: '18:00',
      prix: 'DE BEN GUERDANE (Handicap)',
      allocation: 3825,
      distance: 2000,
      participants: [
        {
          proprietaire: 'Walid Trabelsi',
          couleurs: 'NOE-LR-NO-PAL-BL',
          cheval: 'ZMIR',
          jockey: 'K.I. Mahfoudh',
          poids: 57,
          sexeAge: 'M 4',
          race: 'A',
          origines: 'TIDJANI LOTOS – Yoghert Halim',
          entraineur: 'M. Massrour',
          perf: '2 0 3'
        },
        {
          proprietaire: 'Nourdidene Jilani',
          couleurs: 'BL-RG-SJ-MT-MC',
          cheval: 'KINA HANNIBAL',
          jockey: 'T. Mahfoudh',
          poids: 57,
          sexeAge: 'F 4',
          race: 'A',
          origines: 'DARHAM – Tithen Essalem',
          entraineur: 'Sadoq Triki',
          perf: '4 0 3'
        },
        {
          proprietaire: 'Hedi Belguelaa',
          couleurs: 'BL-JR-ST-MO-MR',
          cheval: 'KHANESSA',
          jockey: 'H. Jlassi',
          poids: 55,
          sexeAge: 'F 4',
          race: 'A',
          origines: 'MINERETT – Zahra El Badr',
          entraineur: 'Abou Ghriba',
          perf: '2 0 2'
        },
        {
          proprietaire: 'Ghazi Ferrini',
          couleurs: 'BC-BT-DRET-RGE',
          cheval: 'AHMED EZ ZAHRA',
          jockey: 'M. Ayed',
          poids: 54,
          sexeAge: 'M 4',
          race: 'A',
          origines: 'DARHAM – Zahra Warda',
          entraineur: 'Abou Ghriba',
          perf: '6 0 7'
        },
        {
          proprietaire: 'Med Zribi',
          couleurs: 'BL-BT-MR-JA-MC',
          cheval: 'LIAM',
          jockey: 'W. Ben Meftah',
          poids: 54,
          sexeAge: 'M 4',
          race: 'A',
          origines: 'DARHAM – Ghadra Warda',
          entraineur: 'Faouzi Ali B.',
          perf: '4 0 5'
        },
        {
          proprietaire: 'Mohamed Fathi',
          couleurs: 'BL-GR-PD-CR-MC',
          cheval: 'LAHID',
          jockey: 'A. Khedhiri',
          poids: 54,
          sexeAge: 'M 4',
          race: 'A',
          origines: 'DARHAM – Salsabeel',
          entraineur: 'Abou Ghriba',
          perf: '4 0 2'
        },
        {
          proprietaire: 'Fathi Bellaji',
          couleurs: 'BL-CR-CHY-BL',
          cheval: 'OUALID AL CHAAMBI',
          jockey: 'M. Mabrouk',
          poids: 55,
          sexeAge: 'M 4',
          race: 'A',
          origines: 'HUMAM – Hamset El Chaambi',
          entraineur: 'M. Zghidi',
          perf: '3 0 3'
        },
        {
          proprietaire: 'Ghanem Abbessa',
          couleurs: 'BL-CR-BL-MT-MC',
          cheval: 'KAMEL EL AHD',
          jockey: 'S. Abd Essalem',
          poids: 55,
          sexeAge: 'M 4',
          race: 'A',
          origines: 'HUMAM – Khamset',
          entraineur: 'Nasri Ammar',
          perf: '3 0 3'
        },
        {
          proprietaire: 'Kamel Mosrati',
          couleurs: 'BL-CR-BL-ALS-BL',
          cheval: 'OUARDI EL ARAB',
          jockey: 'A. Abd Essalem',
          poids: 55,
          sexeAge: 'M 4',
          race: 'A',
          origines: 'GHOUFRAN – Raghda',
          entraineur: 'Abou Ghriba',
          perf: '2 0 0'
        },
        {
          proprietaire: 'Fathi Bellaji',
          couleurs: 'RJ-JA-CR-MT-BL',
          cheval: 'MOJAMEE',
          jockey: 'M. Mabrouk',
          poids: 55,
          sexeAge: 'M 4',
          race: 'A',
          origines: 'HUMAM – Hasna',
          entraineur: 'M. Zghidi',
          perf: '3 0 3'
        },
        {
          proprietaire: 'Kamel Mosrati',
          couleurs: 'BL-CR-MT-MC',
          cheval: 'OUALID AL KARAWI',
          jockey: 'M. Abd Essalem',
          poids: 55,
          sexeAge: 'M 4',
          race: 'A',
          origines: 'GHOUFRAN – Karima',
          entraineur: 'Abou Ghriba',
          perf: '2 0 0'
        },
        {
          proprietaire: 'Kafah Hammami',
          couleurs: 'RJ-BL-JR-CR-ALS',
          cheval: 'OUARABI AL WALJD',
          jockey: 'A. Jouini',
          poids: 55,
          sexeAge: 'M 4',
          race: 'A',
          origines: 'DARHAM – Bent Fatma',
          entraineur: 'Le propriétaire',
          perf: '2 0 0'
        }
      ]
    }
  ]
};

async function insertRacecourse() {
  try {
    // Vérifier si l'hippodrome existe déjà
    const { data: existingRacecourse, error: checkError } = await supabase
      .from('racecourses')
      .select('id')
      .eq('name', programmeData.hippodrome.name)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingRacecourse) {
      console.log('✓ Hippodrome déjà existant:', existingRacecourse.id);
      return existingRacecourse.id;
    }

    // Créer l'hippodrome
    const { data: racecourse, error: insertError } = await supabase
      .from('racecourses')
      .insert({
        name: programmeData.hippodrome.name,
        location: programmeData.hippodrome.location,
        country: 'Tunisia',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) throw insertError;

    console.log('✓ Hippodrome créé:', racecourse.id);
    return racecourse.id;
  } catch (error) {
    console.error('Erreur lors de la création de l\'hippodrome:', error);
    throw error;
  }
}

async function insertCourses(racecourseId) {
  const insertedCourses = [];

  for (const courseData of programmeData.courses) {
    try {
      // Créer la course
      const courseDateTime = new Date(programmeData.date);
      const [hours, minutes] = courseData.heure.split(':');
      courseDateTime.setHours(parseInt(hours), parseInt(minutes));

      const { data: course, error: courseError } = await supabase
        .from('races')
        .insert({
          name: courseData.prix,
          date: courseDateTime.toISOString(),
          racecourse_id: racecourseId,
          race_number: courseData.numero,
          distance_meters: courseData.distance,
          prize_money: courseData.allocation,
          status: 'SCHEDULED',
          max_participants: courseData.participants.length,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (courseError) throw courseError;

      console.log(`✓ Course ${courseData.numero} créée: ${course.id}`);

      // Insérer les participants
      for (let i = 0; i < courseData.participants.length; i++) {
        const participant = courseData.participants[i];
        
        // Créer ou récupérer le cheval
        let horse;
        const { data: existingHorse } = await supabase
          .from('horses')
          .select('id')
          .eq('name', participant.cheval)
          .single();

        if (existingHorse) {
          horse = existingHorse;
        } else {
          const { data: newHorse, error: horseError } = await supabase
            .from('horses')
            .insert({
              name: participant.cheval,
              age: parseInt(participant.sexeAge.split(' ')[1]) || 4,
              sex: participant.sexeAge.charAt(0) === 'M' ? 'male' : 'female',
              breed: participant.race === 'A' ? 'Arabian' : 'Thoroughbred',
              owner: participant.proprietaire,
              trainer: participant.entraineur,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();

          if (horseError) throw horseError;
          horse = newHorse;
        }

        // Créer ou récupérer le jockey
        let jockey;
        const { data: existingJockey } = await supabase
          .from('jockeys')
          .select('id')
          .eq('name', participant.jockey)
          .single();

        if (existingJockey) {
          jockey = existingJockey;
        } else {
          const { data: newJockey, error: jockeyError } = await supabase
            .from('jockeys')
            .insert({
              name: participant.jockey,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();

          if (jockeyError) throw jockeyError;
          jockey = newJockey;
        }

        // Créer la participation
        const { error: participationError } = await supabase
          .from('participations')
          .insert({
            race_id: course.id,
            horse_id: horse.id,
            jockey_id: jockey.id,
            gate_number: i + 1,
            weight: participant.poids,
            silks_colors: participant.couleurs,
            odds: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (participationError) throw participationError;
      }

      insertedCourses.push(course);
      console.log(`✓ ${courseData.participants.length} participants ajoutés à la course ${courseData.numero}`);

    } catch (error) {
      console.error(`Erreur lors de l'insertion de la course ${courseData.numero}:`, error);
      throw error;
    }
  }

  return insertedCourses;
}

async function main() {
  try {
    console.log('🏇 Injection des données officielles de Ben Guerdane...\n');
    
    console.log('1. Création de l\'hippodrome...');
    const racecourseId = await insertRacecourse();
    
    console.log('\n2. Injection des courses et participants...');
    const courses = await insertCourses(racecourseId);
    
    console.log('\n✅ Injection terminée avec succès !');
    console.log(`📊 Résumé:`);
    console.log(`   - 1 hippodrome : ${programmeData.hippodrome.name}`);
    console.log(`   - ${courses.length} courses créées`);
    console.log(`   - Date du programme : ${programmeData.date.toLocaleDateString('fr-FR')}`);
    console.log(`   - Journée n°${programmeData.journee}`);
    
    let totalParticipants = 0;
    programmeData.courses.forEach(course => {
      totalParticipants += course.participants.length;
    });
    console.log(`   - ${totalParticipants} participants au total`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'injection:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { programmeData, insertRacecourse, insertCourses };
