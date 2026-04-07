/**
 * Formats a date object into dd:mm:yy hh:mm string.
 */
export const formatDate = (date: Date): string => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}:${month}:${year} ${hours}:${minutes}`;
};

/**
 * Formats a number as currency using the provided currency code.
 */
export const formatCurrency = (
  amount: number,
  currency: string = "USD",
): string => {
  const symbols: { [key: string]: string } = {
    USD: "$",
    EUR: "€",
    INR: "₹",
    GBP: "£",
  };

  const symbol = symbols[currency] || "$";
  return `${symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
