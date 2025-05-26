export const formatPrice = (price) =>
  new Intl.NumberFormat("no-NO").format(price);
