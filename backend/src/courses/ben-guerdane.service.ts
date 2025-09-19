// Solution temporaire : ajouter Prix DE JEKITIS aux données existantes
import { Injectable } from '@nestjs/common';
import { CourseData } from './courses.interfaces';

@Injectable()
export class BenGuerdaneService {
  
  getBenGuerdaneCourses(): CourseData[] {
    return [
      {
        id: 'bg-001',
        name: 'Prix DE JEKITIS',
        date: new Date('2025-08-02T16:30:00'),
        status: 'scheduled',
        distance: 1400,
        distanceMeters: 1400,
        maxParticipants: 11,
        maxRunners: 11,
        prizeMoney: 4250,
        racecourse: {
          name: 'Hippodrome de Ben Guerdane',
          location: 'Ben Guerdane, Médenine',
        },
        raceNumber: 1,
        raceType: 'Conditions',
        category: 'Pur Sang Arabe',
        participantCount: 11,
      },
      {
        id: 'bg-002',
        name: 'Prix DE CHOUCHA (A Réservée)',
        date: new Date('2025-08-02T17:00:00'),
        status: 'scheduled',
        distance: 1700,
        distanceMeters: 1700,
        maxParticipants: 7,
        maxRunners: 7,
        prizeMoney: 4250,
        racecourse: {
          name: 'Hippodrome de Ben Guerdane',
          location: 'Ben Guerdane, Médenine',
        },
        raceNumber: 2,
        raceType: 'Réservée',
        category: 'Pur Sang Arabe',
        participantCount: 7,
      },
      {
        id: 'bg-003',
        name: 'Prix DE CHIKRBEN (A Réservée)',
        date: new Date('2025-08-02T17:30:00'),
        status: 'scheduled',
        distance: 2000,
        distanceMeters: 2000,
        maxParticipants: 9,
        maxRunners: 9,
        prizeMoney: 4250,
        racecourse: {
          name: 'Hippodrome de Ben Guerdane',
          location: 'Ben Guerdane, Médenine',
        },
        raceNumber: 3,
        raceType: 'Réservée',
        category: 'Pur Sang Arabe',
        participantCount: 9,
      },
      {
        id: 'bg-004',
        name: 'Prix DE BEN GUERDANE (Handicap)',
        date: new Date('2025-08-02T18:00:00'),
        status: 'scheduled',
        distance: 2000,
        distanceMeters: 2000,
        maxParticipants: 12,
        maxRunners: 12,
        prizeMoney: 3825,
        racecourse: {
          name: 'Hippodrome de Ben Guerdane',
          location: 'Ben Guerdane, Médenine',
        },
        raceNumber: 4,
        raceType: 'Handicap',
        category: 'Pur Sang Arabe',
        participantCount: 12,
      }
    ];
  }
  
  getJektisRaceDetails() {
    return {
      id: 'bg-001',
      name: 'Prix DE JEKITIS',
      date: '2025-08-02',
      time: '16:30',
      distance: '1400m',
      prize_money: '4.250 DT',
      conditions: 'Pour poulains et pouliches de 3 ans Pur Sang Arabe n\'ayant pas gagné 3.500 DT – Poids 55 kg',
      venue: 'Hippodrome de Ben Guerdane',
      participants: [
        'RIGEB (M. Jallagi)',
        'RAMZ EL FAKHIR (K. Jouini)',
        'ZAHOUEL (A. Mahjoub)',
        'RIM ESSOUHEIL (H. Mabrouk)',
        'REHAB AL BADR (A. Ayed)'
      ]
    };
  }
}
