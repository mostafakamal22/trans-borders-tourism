export type InvoiceSearchQueries = string;

export type FilterProps = {
  setSearchQuery: React.Dispatch<React.SetStateAction<InvoiceSearchQueries>>;
  searchQuery: InvoiceSearchQueries;
  setTableRows: React.Dispatch<React.SetStateAction<number>>;
  tableRows: number;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterOpen: boolean;
};

export type FilterSummaryProps = {
  searchQuery: InvoiceSearchQueries;
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
