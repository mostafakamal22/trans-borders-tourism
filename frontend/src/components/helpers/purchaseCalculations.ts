//Calculate Purchases' total of [total]
export const purchaseCalculations = (purchases: []) => {
  let totalValues = {
    totals: 0,
  };

  purchases.map((purchase: { total: number }) => {
    totalValues.totals += purchase?.total || 0;
  });

  return totalValues;
};
