export type OtherServicesSearchQueries = string;

export type FilterProps = {
  setSearchQuery: React.Dispatch<
    React.SetStateAction<OtherServicesSearchQueries>
  >;
  searchQuery: OtherServicesSearchQueries;
  setTableRows: React.Dispatch<React.SetStateAction<number>>;
  tableRows: number;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterOpen: boolean;
};

export type FilterSummaryProps = {
  searchQuery: OtherServicesSearchQueries;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterOpen: boolean;
  count: number;
};
