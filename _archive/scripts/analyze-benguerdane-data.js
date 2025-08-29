#!/usr/bin/env node

const fetch = require('node-fetch');

console.log('📊 Analyse des données du programme de Ben Guerdane');
console.log('='.repeat(70));

// Structure des données extraites du programme officiel
const programmeData = {
  hippodrome: 'Ben Guerdane',
  date: '2025-08-02',
  journee: 37,
  debut: '16:00',
  
  courses: [
    {
      numero: 1,
      heure: '16:30',
      nom: 'Prix DE JEKITIS',
      allocation: 4250,
      distance: 1400,
      condition: 'Pour poulains et pouliches de 3 ans Pur Sang Arabe n\'ayant pas gagné 3.500 DT',
      poids: 55,
      entree: 2400,
      forfaits: { niveau1: 8000, niveau2: 16000 },
      primes: [1168.75, 467.50, 233.75, 148.75],
      participants: [
        { proprietaire: 'Salim Bouaziz', couleurs: 'M.BL-BC.BL-P.BL-M', cheval: 'RIGEB', jockey: 'M. Jallagi', poids: 55, sexe: 'M', age: 3, race: 'A', pere: 'KANDO F.AL', mere: 'Fatouma EL Kahloucha', entraineur: 'Sadoq Triki', performances: [6, 2, 0] },
        { proprietaire: 'Naceur Arjoun', couleurs: 'MJL-BR-GR-JA-MC', cheval: 'RAMZ EL FAKHIR', jockey: 'K. Jouini', poids: 55, sexe: 'M', age: 3, race: 'A', pere: 'SAMMYD', mere: 'Khawla', entraineur: 'M\'ghorghor', performances: [2, 0, 1] },
        { proprietaire: 'Jouini Mounir', couleurs: 'BL-RJ-MJ-BL', cheval: 'ZAHOUEL', jockey: 'A. Mahjoub', poids: 55, sexe: 'F', age: 3, race: 'A', pere: 'SANADIK HH', mere: 'Nisbahat', entraineur: 'Sadoq Triki', performances: [7, 0, 0] },
        { proprietaire: 'Mokhtar Ghorbal', couleurs: 'BL-BR-VT-MC', cheval: 'RIM ESSOUHEIL', jockey: 'H. Mabrouk', poids: 55, sexe: 'F', age: 3, race: 'A', pere: 'JAWAD AM', mere: 'Sibakat', entraineur: 'M\'ghorghor', performances: [6, 0, 0] },
        { proprietaire: 'Houcine Jrid', couleurs: 'RJ-CR-JN-MC', cheval: 'REHAB AL BADR', jockey: 'A. Ayed', poids: 55, sexe: 'F', age: 3, race: 'A', pere: 'RAYHAN EL Badr', mere: 'Samia', entraineur: 'Nasri Ammar', performances: [2, 0, 0] },
        { proprietaire: 'Mohamed Ali Bahloul', couleurs: 'VT-CR-BL-CR', cheval: 'REMETH NAGHAM', jockey: 'H. Jrid', poids: 55, sexe: 'F', age: 3, race: 'A', pere: 'AMIR', mere: 'Naghama', entraineur: 'M\'ghorghor', performances: [3, 0, 0] },
        { proprietaire: 'Mokhtar Ghorbal', couleurs: 'RJ-VT-CR-CR', cheval: 'RAYHANA EL HADI', jockey: 'M. Lahmer', poids: 55, sexe: 'F', age: 3, race: 'A', pere: 'GHAZI', mere: 'Warda', entraineur: 'M\'ghorghor', performances: [3, 0, 0] },
        { proprietaire: 'Salim Bouaziz', couleurs: 'BL-BC-BL-AMT-BL', cheval: 'REMETT CHARGUI', jockey: 'A. Mahjoub', poids: 55, sexe: 'F', age: 3, race: 'A', pere: 'KAMEL LONDES', mere: 'Charga', entraineur: 'M\'ghorghor', performances: [2, 0, 0] },
        { proprietaire: 'Salim Bouaziz', couleurs: 'BL-CR-BL-AMT-BL', cheval: 'RIJOU', jockey: 'M. Lahmer', poids: 55, sexe: 'F', age: 3, race: 'A', pere: 'RAYHAN EL Hadi', mere: 'Amira', entraineur: 'M\'ghorghor', performances: [5, 0, 0] },
        { proprietaire: 'Salim Bouaziz', couleurs: 'BL-CR-BL-AMT-BL', cheval: 'RIFJ', jockey: 'H. Mabrouk', poids: 55, sexe: 'F', age: 3, race: 'A', pere: 'MUNEER', mere: 'Zaradallah', entraineur: 'M\'ghorghor', performances: [2, 0, 0] },
        { proprietaire: 'Ahmed Regai', couleurs: 'M.BL-BL-P.VT-BL', cheval: 'RAMZ ETTAHADI', jockey: 'Y. Yaldeminou', poids: 55, sexe: 'M', age: 3, race: 'A', pere: 'MUNEER', mere: 'Zeradallah', entraineur: 'Dhaou Regai', performances: [2, 0, 0] }
      ]
    },
    {
      numero: 2,
      heure: '17:00',
      nom: 'Prix DE CHOUCHA (A Réservée)',
      allocation: 4250,
      distance: 1700,
      primes: [1168.75, 467.50, 233.75, 148.75],
      participants: [
        { proprietaire: 'Kaïs Gharbi', couleurs: 'RJ-BC-DENT-MD-PG', cheval: 'RAHIB ALBADEIA', jockey: 'S. Khalouati', poids: 55, sexe: 'M', age: 3, race: 'A', pere: 'TEL EL AHEL', mere: 'Khamet El Essalem', entraineur: 'Dr. Gharbi', performances: [3, 2, 0] },
        { proprietaire: 'Ghanem Abbessa', couleurs: 'CA-BL-BL-BC-ALS', cheval: 'RAMZ AL HOSN', jockey: 'M. Jouini', poids: 55, sexe: 'M', age: 3, race: 'A', pere: 'DEEBES', mere: 'Nawal', entraineur: 'Nasri Ammar', performances: [4, 0, 0] },
        { proprietaire: 'Said Belhadj', couleurs: 'CR-VT-MC-BL', cheval: 'SAHOUH', jockey: 'A. Mabrouk', poids: 55, sexe: 'M', age: 3, race: 'A', pere: 'JARES', mere: 'Hadina', entraineur: 'M\'ghorghor', performances: [2, 0, 0] },
        { proprietaire: 'Jahouchi Abd', couleurs: 'GRN-VT-AMT-CR', cheval: 'RAGOAN', jockey: 'H. Mabrouk', poids: 55, sexe: 'M', age: 3, race: 'A', pere: 'RAMADHAN', mere: 'Soumaya', entraineur: 'Nasri Ammar', performances: [2, 0, 0] },
        { proprietaire: 'Salim Bouaziz', couleurs: 'BL-CR-BL-AMT-BL', cheval: 'RAMEH', jockey: 'M. Lahmer', poids: 55, sexe: 'M', age: 3, race: 'A', pere: 'GHOUFRAN', mere: 'Imane', entraineur: 'Sadoq Triki', performances: [2, 0, 0] },
        { proprietaire: 'Kamel Mosrati', couleurs: 'JN-P.VT-MC-BL-VRT', cheval: 'RABEE EL EZZ', jockey: 'F. Jallagi', poids: 55, sexe: 'M', age: 3, race: 'A', pere: 'BADER', mere: 'Ghaydania', entraineur: 'M\'ghorghor', performances: [3, 0, 0] },
        { proprietaire: 'Kamel Mosrati', couleurs: 'JN-P.VT-MC-BL-VRT', cheval: 'RAZANE', jockey: 'S. Seif Daas', poids: 55, sexe: 'F', age: 3, race: 'A', pere: 'HACHER', mere: 'Ghayrabib', entraineur: 'Dhaou Brik', performances: [2, 0, 0] }
      ]
    },
    {
      numero: 3,
      heure: '17:30',
      nom: 'Prix DE CHIKRBEN (A Réservée)',
      allocation: 4250,
      distance: 2000,
      participants: [
        { proprietaire: 'Salah Gharbi', couleurs: 'CA-TR-CR-BL-MC', cheval: 'OUALID AL AHD', jockey: 'O. Ayed', poids: 55, sexe: 'M', age: 4, race: 'A', pere: 'FARFOURHOUD', mere: 'Ouda', entraineur: 'Farouk Ouahida', performances: [2, 0, 0] },
        { proprietaire: 'Salim Bouaziz', couleurs: 'BL-CR-BL-AMT-BL', cheval: 'RAMZ EL AHD', jockey: 'K. Jouini', poids: 55, sexe: 'M', age: 4, race: 'A', pere: 'SAYAT', mere: 'TAYASSADRA', entraineur: 'M\'ghorghor', performances: [3, 0, 0] },
        { proprietaire: 'Salim Bouaziz', couleurs: 'BL-CR-BL-AMT-BL', cheval: 'KAREEM EL BADR', jockey: 'M. Lahmer', poids: 55, sexe: 'M', age: 4, race: 'A', pere: 'SAYAT', mere: 'TAYASSADRA', entraineur: 'M\'ghorghor', performances: [3, 0, 0] },
        { proprietaire: 'Salim Bouaziz', couleurs: 'BL-CR-BL-AMT-BL', cheval: 'NAWAL EL ARAB', jockey: 'A. Mabrouk', poids: 55, sexe: 'F', age: 4, race: 'A', pere: 'SAYAT', mere: 'TAYASSADRA', entraineur: 'M\'ghorghor', performances: [2, 0, 0] },
        { proprietaire: 'Hmida Jridi', couleurs: 'BL-BC-CR-BL', cheval: 'RYAH EL HADI', jockey: 'H. Jrid', poids: 55, sexe: 'F', age: 4, race: 'A', pere: 'JAWAD', mere: 'Wardia', entraineur: 'Nasri Ammar', performances: [2, 0, 0] },
        { proprietaire: 'Ali Ben Ahmed Jilani', couleurs: 'RJ-CR-BC-BL', cheval: 'LIYATH CHAAMBI', jockey: 'W. Bedhief', poids: 55, sexe: 'M', age: 4, race: 'A', pere: 'RAMZI', mere: 'Sondos', entraineur: 'Faouzi Ali B.', performances: [2, 0, 0] },
        { proprietaire: 'Hmida Jridi', couleurs: 'RJ-BL-CR-CR', cheval: 'SOUFIANE', jockey: 'M. Mabrouk', poids: 55, sexe: 'M', age: 4, race: 'A', pere: 'BADER', mere: 'Soumaya', entraineur: 'Nasri Ammar', performances: [2, 0, 0] },
        { proprietaire: 'Slim Jelassi', couleurs: 'RJ-CR-BC-BL', cheval: 'AZIZ', jockey: 'A. Mahjoub', poids: 55, sexe: 'M', age: 4, race: 'A', pere: 'GHAZI', mere: 'Ghadra', entraineur: 'Rached Zouari', performances: [2, 0, 0] },
        { proprietaire: 'Jebn Mabrouk', couleurs: 'VT-P.CR-CR-BL', cheval: 'NEXT MORNEG', jockey: 'K. Jouini', poids: 55, sexe: 'M', age: 4, race: 'A', pere: 'RAMZ', mere: 'Hamsa', entraineur: 'Rached Zouari', performances: [2, 0, 0] },
        { proprietaire: 'Jebn Mabrouk', couleurs: 'CR-VT-BL-CR', cheval: 'OSCAR', jockey: 'A. Balsem', poids: 55, sexe: 'M', age: 4, race: 'A', pere: 'REFA', mere: 'Fijlia', entraineur: 'Faouzi Ali B.', performances: [1, 1, 1] }
      ]
    },
    {
      numero: 4,
      heure: '18:00',
      nom: 'Prix DE BEN GUERDANE (Handicap)',
      allocation: 3825,
      distance: 2000,
      type: 'Handicap',
      participants: [
        { proprietaire: 'Walid Trabelsi', couleurs: 'NOE-LR-NO-PAL-BL', cheval: 'ZMIR', jockey: 'K.I. Mahfoudh', poids: 57, sexe: 'M', age: 4, race: 'A', pere: 'TIDJANI LOTOS', mere: 'Yoghert Halim', entraineur: 'M. Massrour', performances: [2, 0, 3] },
        { proprietaire: 'Nourdidene Jilani', couleurs: 'BL-RG-SJ-MT-MC', cheval: 'KINA HANNIBAL', jockey: 'T. Mahfoudh', poids: 57, sexe: 'F', age: 4, race: 'A', pere: 'DARHAM', mere: 'Tithen Essalem', entraineur: 'Sadoq Triki', performances: [4, 0, 3] },
        { proprietaire: 'Hedi Belguelaa', couleurs: 'BL-JR-ST-MO-MR', cheval: 'KHANESSA', jockey: 'H. Jlassi', poids: 55, sexe: 'F', age: 4, race: 'A', pere: 'MINERETT', mere: 'Zahra El Badr', entraineur: 'Abou Ghriba', performances: [2, 0, 2] },
        { proprietaire: 'Ghazi Ferrini', couleurs: 'BC-BT-DRET-RGE', cheval: 'AHMED EZ ZAHRA', jockey: 'M. Ayed', poids: 54, sexe: 'M', age: 4, race: 'A', pere: 'DARHAM', mere: 'Zahra Warda', entraineur: 'Abou Ghriba', performances: [6, 0, 7] },
        { proprietaire: 'Med Zribi', couleurs: 'BL-BT-MR-JA-MC', cheval: 'LIAM', jockey: 'W. Ben Meftah', poids: 54, sexe: 'M', age: 4, race: 'A', pere: 'DARHAM', mere: 'Ghadra Warda', entraineur: 'Faouzi Ali B.', performances: [4, 0, 5] },
        { proprietaire: 'Mohamed Fathi', couleurs: 'BL-GR-PD-CR-MC', cheval: 'LAHID', jockey: 'A. Khedhiri', poids: 54, sexe: 'M', age: 4, race: 'A', pere: 'DARHAM', mere: 'Salsabeel', entraineur: 'Abou Ghriba', performances: [4, 0, 2] },
        { proprietaire: 'Fathi Bellaji', couleurs: 'BL-CR-CHY-BL', cheval: 'OUALID AL CHAAMBI', jockey: 'M. Mabrouk', poids: 55, sexe: 'M', age: 4, race: 'A', pere: 'HUMAM', mere: 'Hamset El Chaambi', entraineur: 'M. Zghidi', performances: [3, 0, 3] },
        { proprietaire: 'Ghanem Abbessa', couleurs: 'BL-CR-BL-MT-MC', cheval: 'KAMEL EL AHD', jockey: 'S. Abd Essalem', poids: 55, sexe: 'M', age: 4, race: 'A', pere: 'HUMAM', mere: 'Khamset', entraineur: 'Nasri Ammar', performances: [3, 0, 3] },
        { proprietaire: 'Kamel Mosrati', couleurs: 'BL-CR-BL-ALS-BL', cheval: 'OUARDI EL ARAB', jockey: 'A. Abd Essalem', poids: 55, sexe: 'M', age: 4, race: 'A', pere: 'GHOUFRAN', mere: 'Raghda', entraineur: 'Abou Ghriba', performances: [2, 0, 0] },
        { proprietaire: 'Fathi Bellaji', couleurs: 'RJ-JA-CR-MT-BL', cheval: 'MOJAMEE', jockey: 'M. Mabrouk', poids: 55, sexe: 'M', age: 4, race: 'A', pere: 'HUMAM', mere: 'Hasna', entraineur: 'M. Zghidi', performances: [3, 0, 3] },
        { proprietaire: 'Kamel Mosrati', couleurs: 'BL-CR-MT-MC', cheval: 'OUALID AL KARAWI', jockey: 'M. Abd Essalem', poids: 55, sexe: 'M', age: 4, race: 'A', pere: 'GHOUFRAN', mere: 'Karima', entraineur: 'Abou Ghriba', performances: [2, 0, 0] },
        { proprietaire: 'Kafah Hammami', couleurs: 'RJ-BL-JR-CR-ALS', cheval: 'OUARABI AL WALJD', jockey: 'A. Jouini', poids: 55, sexe: 'M', age: 4, race: 'A', pere: 'DARHAM', mere: 'Bent Fatma', entraineur: 'Le propriétaire', performances: [2, 0, 0] }
      ]
    }
  ]
};

// Fonctions d'analyse
function analyzeStatistics() {
  console.log('\n📈 STATISTIQUES GLOBALES');
  console.log('-'.repeat(50));
  
  const stats = {
    totalCourses: programmeData.courses.length,
    totalAllocation: 0,
    totalChevaux: 0,
    chevauxUniques: new Set(),
    proprietairesUniques: new Set(),
    jockeysUniques: new Set(),
    entraineursUniques: new Set(),
    performances: { courses: 0, victoires: 0, places: 0 }
  };

  programmeData.courses.forEach(course => {
    stats.totalAllocation += course.allocation;
    stats.totalChevaux += course.participants.length;
    
    course.participants.forEach(p => {
      stats.chevauxUniques.add(p.cheval);
      stats.proprietairesUniques.add(p.proprietaire);
      stats.jockeysUniques.add(p.jockey);
      stats.entraineursUniques.add(p.entraineur);
      
      if (p.performances) {
        stats.performances.courses += p.performances[0] || 0;
        stats.performances.victoires += p.performances[1] || 0;
        stats.performances.places += p.performances[2] || 0;
      }
    });
  });

  console.log(`📅 Date: ${programmeData.date} (37e Journée)`);
  console.log(`🏁 Nombre de courses: ${stats.totalCourses}`);
  console.log(`💰 Allocation totale: ${stats.totalAllocation.toLocaleString('fr-FR')} DT`);
  console.log(`🐎 Total participants: ${stats.totalChevaux}`);
  console.log(`🐴 Chevaux uniques: ${stats.chevauxUniques.size}`);
  console.log(`👤 Propriétaires: ${stats.proprietairesUniques.size}`);
  console.log(`🏇 Jockeys: ${stats.jockeysUniques.size}`);
  console.log(`🎓 Entraîneurs: ${stats.entraineursUniques.size}`);
  
  return stats;
}

function analyzeByOwner() {
  console.log('\n🏆 TOP PROPRIÉTAIRES (par nombre d\'engagements)');
  console.log('-'.repeat(50));
  
  const ownerStats = {};
  
  programmeData.courses.forEach(course => {
    course.participants.forEach(p => {
      if (!ownerStats[p.proprietaire]) {
        ownerStats[p.proprietaire] = {
          chevaux: new Set(),
          courses: 0,
          entraineurs: new Set()
        };
      }
      ownerStats[p.proprietaire].chevaux.add(p.cheval);
      ownerStats[p.proprietaire].courses++;
      ownerStats[p.proprietaire].entraineurs.add(p.entraineur);
    });
  });
  
  const sorted = Object.entries(ownerStats)
    .sort((a, b) => b[1].courses - a[1].courses)
    .slice(0, 5);
  
  sorted.forEach(([owner, stats], index) => {
    console.log(`${index + 1}. ${owner}: ${stats.courses} engagements, ${stats.chevaux.size} chevaux`);
    console.log(`   Chevaux: ${Array.from(stats.chevaux).join(', ')}`);
  });
}

function analyzeByTrainer() {
  console.log('\n🎓 TOP ENTRAÎNEURS (par nombre de chevaux)');
  console.log('-'.repeat(50));
  
  const trainerStats = {};
  
  programmeData.courses.forEach(course => {
    course.participants.forEach(p => {
      if (!trainerStats[p.entraineur]) {
        trainerStats[p.entraineur] = {
          chevaux: new Set(),
          proprietaires: new Set(),
          courses: 0
        };
      }
      trainerStats[p.entraineur].chevaux.add(p.cheval);
      trainerStats[p.entraineur].proprietaires.add(p.proprietaire);
      trainerStats[p.entraineur].courses++;
    });
  });
  
  const sorted = Object.entries(trainerStats)
    .sort((a, b) => b[1].chevaux.size - a[1].chevaux.size)
    .slice(0, 5);
  
  sorted.forEach(([trainer, stats], index) => {
    console.log(`${index + 1}. ${trainer}: ${stats.chevaux.size} chevaux, ${stats.courses} engagements`);
    console.log(`   Pour: ${Array.from(stats.proprietaires).join(', ')}`);
  });
}

function analyzePerformances() {
  console.log('\n🏅 MEILLEURES PERFORMANCES (chevaux expérimentés)');
  console.log('-'.repeat(50));
  
  const horses = [];
  
  programmeData.courses.forEach(course => {
    course.participants.forEach(p => {
      if (p.performances && p.performances[0] > 0) {
        const winRate = p.performances[1] ? (p.performances[1] / p.performances[0] * 100) : 0;
        const placeRate = p.performances[2] ? (p.performances[2] / p.performances[0] * 100) : 0;
        
        horses.push({
          cheval: p.cheval,
          proprietaire: p.proprietaire,
          entraineur: p.entraineur,
          courses: p.performances[0],
          victoires: p.performances[1],
          places: p.performances[2],
          winRate,
          totalPlaceRate: winRate + placeRate
        });
      }
    });
  });
  
  const sorted = horses
    .filter(h => h.courses >= 2)
    .sort((a, b) => b.winRate - a.winRate)
    .slice(0, 8);
  
  sorted.forEach((horse, index) => {
    console.log(`${index + 1}. ${horse.cheval} (${horse.proprietaire})`);
    console.log(`   ${horse.courses} courses, ${horse.victoires} victoires (${horse.winRate.toFixed(1)}%)`);
    console.log(`   Entraîneur: ${horse.entraineur}`);
  });
}

// Exécution de toutes les analyses
console.log('\n🏇 PROGRAMME OFFICIEL - HIPPODROME DE BEN GUERDANE');
console.log('Samedi 2 août 2025 - 37e Journée - Début 16h00');
console.log('='.repeat(70));

analyzeStatistics();
analyzeByOwner();
analyzeByTrainer();
analyzePerformances();

console.log('\n='.repeat(70));
console.log('✅ Analyse complète terminée');
console.log('📊 Données prêtes pour intégration dans la base de données');

// Export pour utilisation
module.exports = programmeData;
