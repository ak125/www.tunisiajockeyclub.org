import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Race {
  id: string;
  name: string;
  date: string;
  status: 'upcoming' | 'live' | 'finished';
  horses: any[];
}

interface RaceState {
  races: Race[];
  currentRace: Race | null;
  isLoading: boolean;
  setRaces: (races: Race[]) => void;
  setCurrentRace: (race: Race | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useRaceStore = create<RaceState>()(
  devtools(
    (set) => ({
      races: [],
      currentRace: null,
      isLoading: false,
      setRaces: (races) => set({ races }),
      setCurrentRace: (currentRace) => set({ currentRace }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    { name: 'race-store' }
  )
);
