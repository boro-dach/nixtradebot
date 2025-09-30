export const formatMarketCap = (value: number): string => {
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}b`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}m`;
  }
  return `$${value.toFixed(2)}`;
};
