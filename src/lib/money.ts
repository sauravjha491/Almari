export function formatMoney(paisa: number) {
  const rupees = paisa / 100;
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(rupees);
}
