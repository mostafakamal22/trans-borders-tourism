//Calculate Passports' total of [total price, tax rate, taxable, service price]
export const passportsCalculations = (passports: []) => {
  let totalValues = {
    totals: 0,
    taxRates: 0,
    taxables: 0,
    servicePrices: 0,
  };

  passports.map(
    (passport: {
      total: number;
      tax_rate: number;
      taxable: number;
      service_price: number;
    }) => {
      totalValues.totals += passport?.total || 0;
      totalValues.taxRates += passport?.tax_rate || 0;
      totalValues.taxables += passport?.taxable || 0;
      totalValues.servicePrices += passport?.service_price || 0;
    }
  );

  return totalValues;
};
