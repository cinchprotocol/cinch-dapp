export function formatNumber(number) {
  if (isNaN(number)) {
    return "NaN";
  }
  if (number == 0) {
    return "0";
  }
  if (number < 10000) {
    return number.toLocaleString();
  }

  const suffixes = ["", "K", "M", "B", "T"];
  const magnitude = Math.floor(Math.log10(Math.abs(number)) / 3);
  const suffix = suffixes[magnitude];
  const scaled = number / Math.pow(10, magnitude * 3);
  const formatted = scaled.toFixed(2);

  return formatted.replace(/\.00$/, "") + suffix;
}