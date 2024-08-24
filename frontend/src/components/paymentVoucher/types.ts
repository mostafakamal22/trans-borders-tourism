export type PaymentVoucherSearchQueries = {
  year: number | string;
  month: number | string;
  day: number | string;
  customerName: string;
};

export type FilterProps = {
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterOpen: boolean;
  setSearchQuery: React.Dispatch<
    React.SetStateAction<PaymentVoucherSearchQueries>
  >;
  searchQuery: PaymentVoucherSearchQueries;
  setTableRows: React.Dispatch<React.SetStateAction<number>>;
  tableRows: number;
};

export type FilterSummaryProps = {
  searchQuery: PaymentVoucherSearchQueries;
  count: number;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterOpen: boolean;
};
