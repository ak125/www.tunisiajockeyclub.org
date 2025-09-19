import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/global-auth.guard';

@Controller('api/ben-guerdane')
@Public()
export class BenGuerdaneController {
  
  @Get()
  getBenGuerdaneProgram() {
    const program = [
      {
        id: 'bg-001',
        name: 'Prix DE JEKITIS',
        race_date: '2025-08-02',
        race_time: '16:30:00',
        distance_meters: 1400,
        max_runners: 11,
        prize_money: 4250,
        race_number: 1,
        status: 'scheduled',
        race_class: 'Conditions',
        conditions: 'Pour poulains et pouliches de 3 ans Pur Sang Arabe n\'ayant pas gagné 3.500 DT – Poids 55 kg',
        racecourse: {
          name: 'Hippodrome de Ben Guerdane',
          location: 'Ben Guerdane, Médenine'
        },
        entry_fee: 2400,
        prize_breakdown: '1.168,75 – 467,50 – 233,750 – 148,750',
        participants: [
          {
            cloth_number: 1,
            horse_name: 'RIGEB',
            jockey_name: 'M. Jallagi',
            weight_kg: 55,
            age: 3,
            gender: 'M',
            owner: 'Salim Bouaziz',
            trainer: 'Sadoq Triki',
            performance: '6 2 0'
          },
          {
            cloth_number: 2,
            horse_name: 'RAMZ EL FAKHIR',
            jockey_name: 'K. Jouini',
            weight_kg: 55,
            age: 3,
            gender: 'M',
            owner: 'Naceur Arjoun',
            trainer: 'M\'ghorghor',
            performance: '2 0 1'
          },
          {
            cloth_number: 3,
            horse_name: 'ZAHOUEL',
            jockey_name: 'A. Mahjoub',
            weight_kg: 55,
            age: 3,
            gender: 'F',
            owner: 'Jouini Mounir',
            trainer: 'Sadoq Triki',
            performance: '7 0 0'
          }
        ]
      },
      {
        id: 'bg-002',
        name: 'Prix DE CHOUCHA (A Réservée)',
        race_date: '2025-08-02',
        race_time: '17:00:00',
        distance_meters: 1700,
        max_runners: 7,
        prize_money: 4250,
        race_number: 2,
        status: 'scheduled',
        race_class: 'Réservée',
        racecourse: {
          name: 'Hippodrome de Ben Guerdane',
          location: 'Ben Guerdane, Médenine'
        }
      },
      {
        id: 'bg-003',
        name: 'Prix DE CHIKRBEN (A Réservée)',
        race_date: '2025-08-02',
        race_time: '17:30:00',
        distance_meters: 2000,
        max_runners: 9,
        prize_money: 4250,
        race_number: 3,
        status: 'scheduled',
        race_class: 'Réservée',
        racecourse: {
          name: 'Hippodrome de Ben Guerdane',
          location: 'Ben Guerdane, Médenine'
        }
      },
      {
        id: 'bg-004',
        name: 'Prix DE BEN GUERDANE (Handicap)',
        race_date: '2025-08-02',
        race_time: '18:00:00',
        distance_meters: 2000,
        max_runners: 12,
        prize_money: 3825,
        race_number: 4,
        status: 'scheduled',
        race_class: 'Handicap',
        racecourse: {
          name: 'Hippodrome de Ben Guerdane',
          location: 'Ben Guerdane, Médenine'
        }
      }
    ];

    return {
      status: 'success',
      message: 'Programme officiel Hippodrome Ben Guerdane - Samedi 2 août 2025',
      event: {
        date: '2025-08-02',
        venue: 'Hippodrome de Ben Guerdane',
        location: 'Ben Guerdane, Médenine',
        start_time: '16:00',
        journee: '37e Journée'
      },
      courses: program,
      total_races: program.length,
      total_prize_money: program.reduce((sum, race) => sum + race.prize_money, 0)
    };
  }

  @Get('jekitis')
  getJektisRace() {
    return {
      status: 'success',
      message: 'Détails du Prix DE JEKITIS',
      race: {
        id: 'bg-001',
        name: 'Prix DE JEKITIS',
        date: '2025-08-02',
        time: '16:30',
        distance: '1400m',
        prize_money: '4.250 DT',
        conditions: 'Pour poulains et pouliches de 3 ans Pur Sang Arabe n\'ayant pas gagné 3.500 DT – Poids 55 kg',
        venue: 'Hippodrome de Ben Guerdane',
        participants_count: 11,
        entry_fee: '2.400 DT',
        forfaits: '8.000 DT & 16.000 DT'
      }
    };
  }
}
