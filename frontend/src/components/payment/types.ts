export type PaymentTypes = {
  rent: string;
  office: string;
  papers: string;
  transportation: string;
  payrolls: string;
  Commission: string;
  end_of_service: string;
  water_and_electricity: string;
  calls_and_internet: string;
  bank_payments: string;
  consultations: string;
  destroyed_devices: string;
  marketing: string;
  other: string;
};

export type PaymentMethods = {
  bank: string;
  later: string;
  cash: string;
  credit: string;
};

export type PaymentSearchQueries = {
  year: number | string;
  month: number | string;
  day: number | string;
  type: string;
  method: string;
};

export type FilterProps = {
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterOpen: boolean;
  setSearchQuery: React.Dispatch<React.SetStateAction<PaymentSearchQueries>>;
  searchQuery: PaymentSearchQueries;
  setTableRows: React.Dispatch<React.SetStateAction<number>>;
  tableRows: number;
};

export type FilterSummaryProps = {
  searchQuery: PaymentSearchQueries;
  count: number;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterOpen: boolean;
};

// export type PaymentsChartsCalculations = (payments: IPaymentDocument[]) => {
//   totalMonthValues: number[];
//   totalForEveryService: number[];
//   totalLastThreeValues: {
//     [x: number]: TotalMonthValues;
//   };
//   topNationalities: (string | number)[][];
// };
