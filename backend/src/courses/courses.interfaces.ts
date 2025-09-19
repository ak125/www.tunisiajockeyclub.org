// Interface pour les données des courses
export interface CourseData {
  id: string | number;
  name: string;
  date: Date;
  status: string;
  distance: number;
  distanceMeters: number;
  maxParticipants: number;
  maxRunners: number;
  prizeMoney: number | null;
  racecourse: {
    name: string;
    location: string | null;
  };
  participantCount?: number;
  raceNumber?: number;
  raceType?: string | null;
  category?: string | null;
  winner?: {
    name: string;
    jockey: string;
  } | null;
}

// Interface étendue pour les données avec gestion des sources
export interface CourseDataWithSource extends CourseData {
  source?: string;
  priority?: number;
}

// Interface pour les statistiques des courses
export interface CourseStats {
  totalCourses: number;
  upcomingCourses: number;
  completedCourses: number;
  scheduledToday: number;
}

// Interface pour la réponse paginée
export interface PaginatedCoursesResponse {
  courses: CourseData[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
}

// Interface pour les détails d'une course
export interface CourseDetails {
  id: string | number;
  name: string;
  raceDate: Date;
  date: Date;
  status: string;
  distance: number;
  distanceMeters: number;
  maxParticipants: number | null;
  maxRunners: number | null;
  prizeMoney: number | null;
  racecourse: {
    name: string;
    location: string | null;
  };
  raceNumber: number;
  raceType: string | null;
  category: string | null;
  conditions: string | null;
  terrainState: string | null;
  raceEntries: Array<{
    id: string;
    clothNumber: number;
    drawPosition: number;
    startingPosition: number;
    weightCarriedKg: number | null;
    odds: number | null;
    horse: {
      id: string;
      name: string;
      age: number;
      weight: number;
      rating: number | null;
      trainer: {
        name: string;
      };
    };
    jockey: {
      id: string;
      name: string;
      weight: number | null;
    } | null;
  }>;
  raceResults: Array<{
    position: number;
    horse: {
      id: string;
      name: string;
    };
    jockey: {
      id: string;
      name: string;
    } | null;
    time: string | null;
    lengthsBehind: number | null;
  }>;
}
