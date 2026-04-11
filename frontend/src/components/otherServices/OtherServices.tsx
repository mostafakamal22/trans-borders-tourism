import { useState, useDeferredValue, useEffect, useRef } from "react";
import { PaginationTable } from "../shared/PaginationTable";
import { useSearchParams } from "react-router-dom";
import { OtherServicesSearchQueries } from "./types";
import { useGetOtherServicesQuery } from "../../state/features/otherService/otherServiceApiSlice";
import { Filters, FiltersSummary } from "./Filters";
import { tableHeader, tableRow } from "./Table";
import { scrollToTable, useScroll } from "../../hooks/useScroll";
import { FetchingMessage } from "../shared/FetchingMessage";
import { NoSavedRecords } from "../shared/NoSavedRecords";
import { NoSearchResult } from "../shared/NoSearchResult";
import { useDetectClickOutside } from "../../hooks/useDetectClickOutside";
import { useDownloadExcel } from "react-export-table-to-excel";
import { RiFileExcel2Fill } from "react-icons/ri";
import OtherServiceMain from "../../assets/icons/otherService-main.svg?react";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import DataFetchingErrorMessage from "../shared/DataFetchingErrorMessage";
import DataFetchingSpinner from "../shared/DataFetchingSpinner";

export default function OtherServices() {
  //Search Query State
  const [searchQuery, setSearchQuery] =
    useState<OtherServicesSearchQueries>("");
  const deferredQuery = useDeferredValue(searchQuery);

  const notInitialRender = useRef<boolean>(false);

  //Table to Excel
  const tableRef = useRef<HTMLTableElement | null>(null);

  const [excelReady, setExcelReady] = useState(false);

  const { onDownload } = useDownloadExcel({
    currentTableRef: excelReady ? tableRef.current : null,
    filename: "OtherServices table",
    sheet: "OtherServices",
  });

  //Table Row State
  const [tableRows, setTableRows] = useState(50);

  //Is Filter Open
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  //Get Page Number From URL
  const [URLSearchParams] = useSearchParams();
  const pageNumber: number = URLSearchParams.get("page")
    ? +URLSearchParams.get("page")!
    : 1;

  const { data, isLoading, isFetching, isSuccess, error } =
    useGetOtherServicesQuery({
      query: { name: deferredQuery.trim() },
      option: {
        limit: tableRows,
        page: pageNumber,
      },
    });

  const otherServices = data?.docs ? data.docs : [];

  useEffect(() => {
    if (notInitialRender.current && isSuccess && !isFetching && !isLoading) {
      scrollToTable();
    } else {
      notInitialRender.current = true;
    }
  }, [pageNumber, isSuccess, isFetching, isLoading, scrollToTable]);

  useEffect(() => {
    if (tableRef.current) {
      setExcelReady(true);
    }
  }, [otherServices.length]);

  useScroll("filterHeader");
  useDocumentTitle("الخدمات الاخرى");
  useDetectClickOutside({ setIsFilterOpen, isFilterOpen });

  //Show Error Message if could not fetch data
  if (error) {
    return <DataFetchingErrorMessage />;
  }

  //Show spinner when Loading State is true
  if (!data || isLoading) return <DataFetchingSpinner />;

  return (
    <main className="w-full">
      <h2 className="my-4 mb-10 flex items-center justify-center rounded bg-red-700 px-2 py-4 text-3xl font-bold text-white shadow">
        <span className="mr-2 flex items-center justify-center">
          <OtherServiceMain className="h-20 w-20 drop-shadow" />
        </span>
        الخدمات الاخرى
      </h2>

      {/* Search OtherServices by client name */}
      <FiltersSummary
        searchQuery={searchQuery}
        setIsFilterOpen={setIsFilterOpen}
        isFilterOpen={isFilterOpen}
        count={data?.totalDocs ? data.totalDocs : 0}
      />

      <Filters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        tableRows={tableRows}
        setTableRows={setTableRows}
        setIsFilterOpen={setIsFilterOpen}
        isFilterOpen={isFilterOpen}
      />

      {/* isFetching Message */}
      {isFetching && <FetchingMessage isFetching={isFetching} />}

      {/* Display Table Data */}
      {otherServices?.length > 0 && (
        <>
          <button
            className="mx-auto my-5 flex items-center justify-center gap-1 rounded border bg-green-200 px-2 py-2 text-xs font-bold text-green-800 shadow transition-all duration-300 ease-in-out hover:border-green-800 hover:bg-white
            hover:text-green-800 sm:px-3 sm:text-sm"
            onClick={onDownload}
          >
            <RiFileExcel2Fill size={20} />
            <span>Export excel</span>
          </button>

          <PaginationTable
            tableRow={tableRow}
            tableHeader={tableHeader}
            tableBodyData={otherServices}
            options={data!}
            ref={tableRef}
          />
        </>
      )}

      {/* if there is No OtherService Records */}
      {!deferredQuery && !isFetching && otherServices?.length === 0 && (
        <NoSavedRecords customMsg={["خدمات اخرى", "الخدمات الاخرى"]} />
      )}

      {/* if there is search query and no OtherService matches >>> No Search Found*/}
      {deferredQuery && otherServices?.length === 0 && !isFetching && (
        <NoSearchResult />
      )}
    </main>
  );
}
