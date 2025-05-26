export const formatPrice = (price) =>
  new Intl.NumberFormat("no-NO", {
    style: "currency",
    currency: "NOK",
    minimumFractionDigits: 0,
  }).format(price);
