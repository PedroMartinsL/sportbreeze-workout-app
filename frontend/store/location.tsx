import { create } from "zustand";

interface LocationState {
  coords: { lat: number | null; lon: number | null };
  setCoords: (coords: { lat: number; lon: number }) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  coords: { lat: null, lon: null },
  setCoords: (coords) => set({ coords }),
}));
