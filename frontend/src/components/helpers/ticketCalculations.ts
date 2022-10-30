//Calculate Tickets' total of [total]
export const ticketsCalculations = (tickets: []) => {
  let totalValues = {
    costs: 0,
    sales: 0,
    profits: 0,
  };

  tickets.map((ticket: { profit: number; cost: number; sales: number }) => {
    totalValues.sales += ticket?.sales || 0;
    totalValues.costs += ticket?.cost || 0;
    totalValues.profits += ticket?.profit || 0;
  });

  return totalValues;
};
