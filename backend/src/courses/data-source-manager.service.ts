import { Injectable } from '@nestjs/common';
import { CourseData, CourseDataWithSource } from './courses.interfaces';

@Injectable()
export class DataSourceManager {
  
  // ⚡ TIER 1: Données officielles (Programme actuel)
  getCurrentProgram(): CourseDataWithSource[] {
    return [
      {
        id: 'bg-2025-001',
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
        source: 'OFFICIAL_PROGRAM',
        priority: 1
      },
      {
        id: 'bg-2025-002',
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
        source: 'OFFICIAL_PROGRAM',
        priority: 1
      },
      {
        id: 'bg-2025-003',
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
        source: 'OFFICIAL_PROGRAM',
        priority: 1
      },
      {
        id: 'bg-2025-004',
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
        source: 'OFFICIAL_PROGRAM',
        priority: 1
      }
    ];
  }

  // 📊 Smart Data Fusion Strategy
  mergeSources(
    officialProgram: CourseDataWithSource[],
    supabaseData: CourseData[],
    cacheData?: CourseData[]
  ): CourseDataWithSource[] {
    
    // 1. Priorité aux données officielles
    const merged: CourseDataWithSource[] = [...officialProgram];
    
    // 2. Ajouter données Supabase (sans doublons)
    supabaseData.forEach(course => {
      const exists = merged.find(c => 
        c.name === course.name || 
        c.id === course.id
      );
      
      if (!exists) {
        merged.push({
          ...course,
          source: 'SUPABASE',
          priority: 2
        });
      }
    });
    
    // 3. Trier par priorité puis par date
    return merged.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority! - b.priority!;
      }
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }

  // 🎯 Configuration dynamique des sources
  getDataSourceConfig() {
    return {
      sources: [
        {
          name: 'OFFICIAL_PROGRAM',
          priority: 1,
          enabled: true,
          description: 'Programme officiel Ben Guerdane'
        },
        {
          name: 'SUPABASE',
          priority: 2,
          enabled: true,
          description: 'Base de données historique'
        },
        {
          name: 'REDIS_CACHE',
          priority: 0,
          enabled: true,
          description: 'Cache haute performance'
        }
      ],
      strategy: 'HYBRID_PRIORITY',
      fallback: 'OFFICIAL_PROGRAM'
    };
  }
}

// 🏆 Pattern de Service Unifié
@Injectable()
export class UnifiedCoursesService {
  constructor(private dataManager: DataSourceManager) {}
  
  async getAllCourses(): Promise<CourseData[]> {
    try {
      // 1. Récupérer toutes les sources
      const officialProgram = this.dataManager.getCurrentProgram();
      const supabaseData = await this.getSupabaseData();
      
      // 2. Fusion intelligente
      const mergedData = this.dataManager.mergeSources(
        officialProgram,
        supabaseData
      );
      
      // 3. Convertir vers CourseData standard (sans source/priority)
      return mergedData.map((course) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { source, priority, ...courseData } = course;
        return courseData;
      });
      
    } catch {
      // 3. Fallback sur programme officiel
      console.warn('Fallback to official program');
      const officialProgram = this.dataManager.getCurrentProgram();
      return officialProgram.map((course) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { source, priority, ...courseData } = course;
        return courseData;
      });
    }
  }
  
  private async getSupabaseData(): Promise<CourseData[]> {
    // Implémentation Supabase existante
    return [];
  }
}
