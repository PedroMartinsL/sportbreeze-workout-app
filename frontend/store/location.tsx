import { create } from "zustand";

interface LocationState {
  coords: { latitude: number | null; longitude: number | null };
  setCoords: (coords: { latitude: number; longitude: number }) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  coords: { latitude: null, longitude: null },
  setCoords: (coords) => set({ coords }),
}));
