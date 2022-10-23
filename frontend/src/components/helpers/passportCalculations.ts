//Calculate Passports' total of [total price, tax rate, taxable, service price, sales, profits]
export const passportsCalculations = (passports: []) => {
  let totalValues = {
    totals: 0,
    taxRates: 0,
    taxables: 0,
    servicePrices: 0,
    sales: 0,
    profits: 0,
  };

  passports.map(
    (passport: {
      total: number;
      tax_rate: number;
      taxable: number;
      service_price: number;
      sales: number;
      profit: number;
    }) => {
      totalValues.totals += passport?.total || 0;
      totalValues.taxRates += passport?.tax_rate || 0;
      totalValues.taxables += passport?.taxable || 0;
      totalValues.servicePrices += passport?.service_price || 0;
      totalValues.sales += passport?.sales || 0;
      totalValues.profits += passport?.profit || 0;
    }
  );

  return totalValues;
};
