//Calculate Bank' total of [total]
export const banksCalculations = (banks: []) => {
  let totalValues = {
    totals: 0,
  };

  banks.map((bank: { total: number }) => {
    totalValues.totals += bank?.total || 0;
  });

  return totalValues;
};
