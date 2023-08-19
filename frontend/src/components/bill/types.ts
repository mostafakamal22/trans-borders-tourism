export type BillSearchQueries = string;

export type FilterProps = {
  setSearchQuery: React.Dispatch<React.SetStateAction<BillSearchQueries>>;
  searchQuery: BillSearchQueries;
  setTableRows: React.Dispatch<React.SetStateAction<number>>;
  tableRows: number;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterOpen: boolean;
};

export type FilterSummaryProps = {
  searchQuery: BillSearchQueries;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterOpen: boolean;
  count: number;
};

export type CompanyInfos = {
  name: string[];
  TRN: number;
  address: string;
  website: string;
  email: string;
  tel: string[];
  mob: string[];
};
