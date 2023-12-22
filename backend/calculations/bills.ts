import dayjs from "dayjs";
import { IBillDocument } from "../../backend/models/billModel";
import { TotalMonthValues } from "./invoices";

export type BillsChartsCalculations = (bills: IBillDocument[]) => {
  totalMonthValues: number[];
  totalLastThreeValues: {
    [x: number]: TotalMonthValues;
  };
};

//Calculate Bills' Charts Needed Calcualtions
export const billsChartsCalculations: BillsChartsCalculations = (bills) => {
  //Totals For Every Month
  let totalMonthValues: TotalMonthValues = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
  };

  //Totals For Last 3 Years
  let totalLastThreeValues: { [year: number]: TotalMonthValues } = {
    [dayjs().year()]: {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
    },
    [dayjs().year() - 1]: {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
    },
    [dayjs().year() - 2]: {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
    },
  };

  bills.forEach((bill: IBillDocument) => {
    const month = dayjs(bill?.date)?.month();
    const year = dayjs(bill?.date)?.year();
    const billTotal = bill?.total ? bill.total : bill?.details?.[0]?.price;

    if (month >= 0 && year) {
      totalMonthValues[month as keyof TotalMonthValues] += billTotal;

      if (
        totalLastThreeValues?.[year]?.[month as keyof TotalMonthValues] >= 0
      ) {
        totalLastThreeValues[year][month as keyof TotalMonthValues] +=
          billTotal;
      }
    }
  });

  return {
    totalMonthValues: Object.values(totalMonthValues),
    totalLastThreeValues: { ...totalLastThreeValues },
  };
};
