import { create } from "zustand";
import { TimescaleState, TimescaleOption } from "./types";

export const useTimescaleStore = create<TimescaleState>((set) => ({
  selected: "1M",

  setSelected: (timescale) => set({ selected: timescale }),
}));
