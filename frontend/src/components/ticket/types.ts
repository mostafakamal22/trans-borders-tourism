import { ITicketDocument } from "../../../../backend/models/ticketModel";
import { TotalMonthValues } from "./calculations";

export type TicketSearchQueries = {
  year: string | number;
  day: string | number;
  month: string | number;
  customerName: string;
  type: string;
  employee: string;
  supplier: string;
  paymentMethod: { value: PaymentMethodsQueries; checked: boolean }[];
};

export type CreditStates = [
  "Paid Amount",
  "Remaining Amount",
  "Payment Method"
];

export const paymentMethodsQueries = [
  "cash",
  "credit",
  "later",
  "bank",
] as const;

export type PaymentMethodsQueries = (typeof paymentMethodsQueries)[number];

export type FilterProps = {
  paymentMethodArr: string[];
  setSearchQuery: React.Dispatch<React.SetStateAction<TicketSearchQueries>>;
  searchQuery: TicketSearchQueries;
  setTableRows: React.Dispatch<React.SetStateAction<number>>;
  tableRows: number;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterOpen: boolean;
};

export type FilterSummaryProps = {
  searchQuery: TicketSearchQueries;
  paymentMethodArr: string[];
  count: number;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterOpen: boolean;
};

export type TicketsChartsCalculations = (tickets: ITicketDocument[]) => {
  totalMonthValues: number[];
  totalForEveryPaymentMethod: number[];
  totalLastThreeValues: {
    [x: number]: TotalMonthValues;
  };
  topEmployees: (string | number)[][];
  topSuppliers: (string | number)[][];
};
