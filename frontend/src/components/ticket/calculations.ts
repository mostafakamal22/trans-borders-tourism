import { ITicketDocument } from "../../../../backend/models/ticketModel";

//Calculate Tickets' totals of [cost, sales and profits]
export const ticketsCalculations = (tickets: ITicketDocument[]) => {
  let totalValues = {
    costs: 0,
    sales: 0,
    profits: 0,
  };

  tickets.map((ticket) => {
    totalValues.sales += ticket?.sales || 0;
    totalValues.costs += ticket?.cost || 0;
    totalValues.profits += ticket?.profit || 0;
  });

  return totalValues;
};

export type TotalMonthValues = {
  0: number;
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  7: number;
  8: number;
  9: number;
  10: number;
  11: number;
};
