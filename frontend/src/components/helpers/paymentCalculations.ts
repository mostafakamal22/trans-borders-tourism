//Calculate Payments' total of [total]
export const paymentsCalculations = (payments: []) => {
  let totalValues = {
    totals: 0,
  };

  payments.map((payment: { total: number }) => {
    totalValues.totals += payment?.total || 0;
  });

  return totalValues;
};
