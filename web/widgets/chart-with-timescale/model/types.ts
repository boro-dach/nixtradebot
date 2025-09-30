export type TimescaleOption = "1D" | "7D" | "1M" | "1Y" | "All";

export interface TimescaleState {
  selected: TimescaleOption;
  setSelected: (timescale: TimescaleOption) => void;
}
