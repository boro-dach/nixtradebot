const formatNumberWithSuffix = (value: number): string => {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(0)}b`; // 674b
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(0)}m`; // 104m
  }
  return value.toString();
};

export const formatStatValue = (
  value: number,
  type: "currency" | "number"
): string => {
  const formattedNumber = formatNumberWithSuffix(value);
  return type === "currency" ? `$${formattedNumber}` : formattedNumber;
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value);
};

export const formatPercentage = (value: number) => {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
};
