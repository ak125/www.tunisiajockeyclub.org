import { supabase } from './supabase.server';

export interface DashboardStats {
  totalCourses: number;
  totalChevaux: number;
  totalJockeys: number;
  totalUtilisateurs: number;
  coursesThisMonth: number;
  coursesCompleted: number;
  coursesScheduled: number;
}

export interface MonthlyRaceData {
  mois: string;
  courses: number;
  participants: number;
}

export interface HorsePerformance {
  nom: string;
  victoires: number;
  courses: number;
  winRate: number;
}

export interface RaceTypeData {
  name: string;
  value: number;
  color: string;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Récupérer les statistiques depuis Supabase
    const [
      { count: totalCourses },
      { count: totalChevaux },
      { count: totalJockeys },
      { count: totalUtilisateurs },
      { count: coursesThisMonth },
      { count: coursesCompleted },
      { count: coursesScheduled }
    ] = await Promise.all([
      supabase.from('races').select('*', { count: 'exact', head: true }),
      supabase.from('horses').select('*', { count: 'exact', head: true }),
      supabase.from('jockeys').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase
        .from('races')
        .select('*', { count: 'exact', head: true })
        .gte('race_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]),
      supabase
        .from('races')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'finished'),
      supabase
        .from('races')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'scheduled')
    ]);

    return {
      totalCourses: totalCourses || 0,
      totalChevaux: totalChevaux || 0,
      totalJockeys: totalJockeys || 0,
      totalUtilisateurs: totalUtilisateurs || 0,
      coursesThisMonth: coursesThisMonth || 0,
      coursesCompleted: coursesCompleted || 0,
      coursesScheduled: coursesScheduled || 0,
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    // Retourner des données par défaut en cas d'erreur
    return {
      totalCourses: 0,
      totalChevaux: 0,
      totalJockeys: 0,
      totalUtilisateurs: 0,
      coursesThisMonth: 0,
      coursesCompleted: 0,
      coursesScheduled: 0,
    };
  }
}

export async function getMonthlyRaceData(): Promise<MonthlyRaceData[]> {
  try {
    // Récupérer les données des 6 derniers mois
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const { data: races } = await supabase
      .from('races')
      .select(`
        race_date,
        race_entries(count)
      `)
      .gte('race_date', sixMonthsAgo.toISOString().split('T')[0])
      .order('race_date', { ascending: true });

    // Grouper par mois
    const monthlyData: { [key: string]: { courses: number; participants: number } } = {};
    
    races?.forEach((race) => {
      const date = new Date(race.race_date);
      const monthKey = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { courses: 0, participants: 0 };
      }
      
      monthlyData[monthKey].courses += 1;
      monthlyData[monthKey].participants += Array.isArray(race.race_entries) ? race.race_entries.length : 0;
    });

    // Convertir en format pour le graphique
    return Object.entries(monthlyData).map(([mois, data]) => ({
      mois,
      courses: data.courses,
      participants: data.participants,
    }));

  } catch (error) {
    console.error('Erreur lors de la récupération des données mensuelles:', error);
    // Données de fallback
    return [
      { mois: 'Jan', courses: 12, participants: 156 },
      { mois: 'Fév', courses: 15, participants: 198 },
      { mois: 'Mar', courses: 18, participants: 234 },
      { mois: 'Avr', courses: 22, participants: 287 },
      { mois: 'Mai', courses: 19, participants: 245 },
      { mois: 'Jun', courses: 25, participants: 312 }
    ];
  }
}

export async function getHorsePerformance(): Promise<HorsePerformance[]> {
  try {
    const { data: horses } = await supabase
      .from('horses')
      .select(`
        name,
        race_entries(count),
        race_results(
          position
        )
      `)
      .limit(10);

    const performanceData = horses?.map((horse) => {
      const totalRaces = Array.isArray(horse.race_entries) ? horse.race_entries.length : 0;
      const victories = Array.isArray(horse.race_results) 
        ? horse.race_results.filter(result => result.position === 1).length 
        : 0;

      return {
        nom: horse.name,
        victoires: victories,
        courses: totalRaces,
        winRate: totalRaces > 0 ? (victories / totalRaces) * 100 : 0,
      };
    }).sort((a, b) => b.winRate - a.winRate) || [];

    return performanceData;

  } catch (error) {
    console.error('Erreur lors de la récupération des performances:', error);
    // Données de fallback
    return [
      { nom: 'Thunder Storm', victoires: 12, courses: 18, winRate: 66.7 },
      { nom: 'Desert Wind', victoires: 8, courses: 15, winRate: 53.3 },
      { nom: 'Golden Arrow', victoires: 10, courses: 16, winRate: 62.5 },
      { nom: 'Lightning Bolt', victoires: 6, courses: 12, winRate: 50.0 },
      { nom: 'Arabian Dream', victoires: 9, courses: 14, winRate: 64.3 }
    ];
  }
}

export async function getRaceTypeDistribution(): Promise<RaceTypeData[]> {
  try {
    const { data: races } = await supabase
      .from('races')
      .select('race_type')
      .not('race_type', 'is', null);

    // Compter les types de courses
    const typeCount: { [key: string]: number } = {};
    races?.forEach((race) => {
      const type = race.race_type || 'Autre';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    // Convertir en format pour le graphique
    const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
    let colorIndex = 0;

    return Object.entries(typeCount).map(([name, value]) => ({
      name,
      value,
      color: colors[colorIndex++ % colors.length],
    }));

  } catch (error) {
    console.error('Erreur lors de la récupération des types de courses:', error);
    // Données de fallback
    return [
      { name: 'Galop', value: 45, color: '#0088FE' },
      { name: 'Trot', value: 30, color: '#00C49F' },
      { name: 'Obstacles', value: 25, color: '#FFBB28' }
    ];
  }
}

export async function getRecentRaces(limit = 5) {
  try {
    const { data: races } = await supabase
      .from('races')
      .select(`
        id,
        name,
        race_date,
        race_time,
        status,
        racecourses(name),
        race_entries(count)
      `)
      .order('race_date', { ascending: false })
      .limit(limit);

    return races?.map((race) => ({
      id: race.id,
      name: race.name,
      date: race.race_date,
      time: race.race_time,
      status: race.status,
      racecourse: (race.racecourses as any)?.name || 'Inconnu',
      participants: Array.isArray(race.race_entries) ? race.race_entries.length : 0,
    })) || [];

  } catch (error) {
    console.error('Erreur lors de la récupération des courses récentes:', error);
    return [];
  }
}
