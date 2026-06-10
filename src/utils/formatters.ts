/**
 * Formats a number to a fixed decimal for display
 */
export const formatCarbon = (value: number, decimals: number = 1): string => {
  return value.toFixed(decimals);
};

/**
 * Formats a date timestamp to a readable string
 */
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleDateString();
};

/**
 * Calculates a percentage string
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.min((value / total) * 100, 100);
};
