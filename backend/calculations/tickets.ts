import dayjs from "dayjs";
import { ITicketDocument } from "../models/ticketModel";
import { TotalMonthValues } from "./invoices";

export type TicketsChartsCalculations = (tickets: ITicketDocument[]) => {
  totalMonthValues: number[];
  totalForEveryPaymentMethod: number[];
  totalLastThreeValues: {
    [x: number]: TotalMonthValues;
  };
  topEmployees: (string | number)[][];
  topSuppliers: (string | number)[][];
};

//Calculate Tickets' Charts Needed Calcualtions
export const ticketsChartsCalculations: TicketsChartsCalculations = (
  tickets
) => {
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

  // Totals For Tickets' Payment Methods
  let totalForEveryPaymentMethod: { [paymentMethod: string]: number } = {
    bank: 0,
    cash: 0,
    credit: 0,
    later: 0,
  };

  //Count The Top Employees.
  const employeesCounter: { [employee: string]: number } = {};

  //Count The Top Suppliers.
  const suppliersCounter: { [supplier: string]: number } = {};

  //Loop Through Tickets And Add All Values We Need Each To The Specific Object Defined.
  tickets.forEach((ticket: ITicketDocument) => {
    const month = dayjs(ticket?.payment_date)?.month();
    const year = dayjs(ticket?.payment_date)?.year();
    const ticketProfit = isNaN(ticket?.profit) ? 0 : +ticket?.profit;
    const ticketEmployee = ticket?.employee;
    const ticketSupplier = ticket?.supplier;
    const ticketPaymentMethod = ticket?.payment_method;

    //Month And Year Data
    if (month >= 0 && year) {
      totalMonthValues[month as keyof TotalMonthValues] += ticketProfit;

      if (
        totalLastThreeValues?.[year]?.[month as keyof TotalMonthValues] >= 0
      ) {
        totalLastThreeValues[year][month as keyof TotalMonthValues] +=
          ticketProfit;
      }
    }

    //Tickets Payment Methods
    if (ticketPaymentMethod) {
      totalForEveryPaymentMethod[ticketPaymentMethod] += 1;
    }

    //Top Employees
    if (ticketEmployee && employeesCounter.hasOwnProperty(ticketEmployee)) {
      employeesCounter[ticketEmployee] += 1;
    } else if (ticketEmployee) {
      employeesCounter[ticketEmployee] = 1;
    }

    //Top Suppliers
    if (ticketSupplier && suppliersCounter.hasOwnProperty(ticketSupplier)) {
      suppliersCounter[ticketSupplier] += 1;
    } else if (ticketSupplier) {
      suppliersCounter[ticketSupplier] = 1;
    }
  });

  return {
    totalMonthValues: Object.values(totalMonthValues),
    totalLastThreeValues: { ...totalLastThreeValues },
    totalForEveryPaymentMethod: Object.values(totalForEveryPaymentMethod),
    topEmployees: Object.keys(employeesCounter)
      .map((key) => [key, employeesCounter[key]])
      .sort((a, b) => +b[1] - +a[1])
      .slice(0, 5),
    topSuppliers: Object.keys(suppliersCounter)
      .map((key) => [key, suppliersCounter[key]])
      .sort((a, b) => +b[1] - +a[1])
      .slice(0, 5),
  };
};
