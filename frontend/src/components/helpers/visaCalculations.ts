//Calculate Visas' total of [total, Sales and Net fare]
export const visaCalculations = (visas: []) => {
  let totalValues = {
    netFares: 0,
    sales: 0,
    profits: 0,
  };

  visas.map((visa: { profit: number; net_fare: number; sales: number }) => {
    totalValues.sales += visa?.sales || 0;
    totalValues.netFares += visa?.net_fare || 0;
    totalValues.profits += visa?.profit || 0;
  });

  return totalValues;
};
