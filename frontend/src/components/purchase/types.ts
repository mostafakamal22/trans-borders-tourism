export type PurchaseSearchQueries = {
  year: number | string;
  month: number | string;
  day: number | string;
  type: string;
  supplier: string;
};

export type FilterProps = {
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterOpen: boolean;
  setSearchQuery: React.Dispatch<React.SetStateAction<PurchaseSearchQueries>>;
  searchQuery: PurchaseSearchQueries;
  setTableRows: React.Dispatch<React.SetStateAction<number>>;
  tableRows: number;
};

export type FilterSummaryProps = {
  searchQuery: PurchaseSearchQueries;
  count: number;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterOpen: boolean;
};

// export type PurchasesChartsCalculations = (purchases: IPurchaseDocument[]) => {
//   totalMonthValues: number[];
//   totalForEveryService: number[];
//   totalLastThreeValues: {
//     [x: number]: TotalMonthValues;
//   };
//   topNationalities: (string | number)[][];
// };
