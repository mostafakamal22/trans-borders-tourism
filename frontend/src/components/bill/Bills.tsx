import { useState, useDeferredValue, useEffect, useRef } from "react";
import { ReactComponent as BillMain } from "../../assets/icons/invoice-main.svg";
import { PaginationTable } from "../shared/PaginationTable";
import { useSearchParams } from "react-router-dom";
import { MainSpinner } from "../shared/MainSpinner";
import { BillSearchQueries } from "./types";
import {
  useGetBillsQuery,
  useDeleteBillMutation,
} from "../../state/features/bill/billApiSlice";
import { Filters, FiltersSummary } from "./Filters";
import { tableHeader, tableRow } from "./Table";
import { scrollToTable, useScroll } from "../../hooks/useScroll";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { FetchingMessage } from "../shared/FetchingMessage";
import { NoSavedRecords } from "../shared/NoSavedRecords";
import { NoSearchResult } from "../shared/NoSearchResult";
import { useDetectClickOutside } from "../../hooks/useDetectClickOutside";
import { AnimatePresence } from "framer-motion";
import { UpdateBill } from "../forms/UpdateBill";
import { useDownloadExcel } from "react-export-table-to-excel";
import { RiFileExcel2Fill } from "react-icons/ri";

export const Bills = () => {
  //Search Query State
  const [searchQuery, setSearchQuery] = useState<BillSearchQueries>({
    name: "",
    type: "",
  });

  //Table to Excel
  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Invoices table",
    sheet: "Invoices",
  });

  const { name, type } = searchQuery;

  const deferredName = useDeferredValue(name);
  const deferredType = useDeferredValue(type);

  const notInitialRender = useRef<boolean>(false);

  //Table Row State
  const [tableRows, setTableRows] = useState(50);

  //Is Filter Open
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  //BillID to Update
  const [id, setId] = useState("");

  //Is modal open
  const [isOpen, setIsOpen] = useState<boolean>(false);

  //Get Page Number From URL
  const [URLSearchParams] = useSearchParams();
  const pageNumber: number = URLSearchParams.get("page")
    ? +URLSearchParams.get("page")!
    : 1;

  const { data, isLoading, isFetching, isSuccess, isError } = useGetBillsQuery({
    query: {
      name: deferredName.trim(),
      type: deferredType.trim(),
    },
    option: {
      limit: tableRows,
      page: pageNumber,
    },
  });

  const bills = data?.docs ? data.docs : [];

  const [deleteBill, { isLoading: isDeleting }] = useDeleteBillMutation();

  //Handle Delete Bill
  const handleRemoving = async (
    e: React.SyntheticEvent,
    removedBillID: string
  ) => {
    e.preventDefault();

    await deleteBill(removedBillID);
  };

  useEffect(() => {
    if (notInitialRender.current && isSuccess && !isFetching && !isLoading) {
      scrollToTable();
    } else {
      notInitialRender.current = true;
    }
  }, [pageNumber, isSuccess, isFetching, isLoading, scrollToTable]);

  useScroll("filterHeader");
  useDocumentTitle("الفواتير -جديد-");
  useDetectClickOutside({ setIsFilterOpen, isFilterOpen });

  return (
    <section className="w-full">
      <h2 className="my-4 mb-10 flex items-center justify-center rounded bg-red-700 px-2 py-4 text-3xl font-bold text-white shadow">
        <span className="mr-2 flex items-center justify-center">
          <BillMain className="h-20 w-20 drop-shadow" />
        </span>
        -الفواتير -جديد
      </h2>

      {/*search Bills with name*/}
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

      {/*Display Table All Data Needed*/}
      {!isLoading && bills?.length > 0 && (
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
            tableBodyData={bills}
            options={data!}
            handleRemoving={handleRemoving}
            isDeleting={isDeleting}
            setIsOpen={setIsOpen}
            setId={setId}
            ref={tableRef}
          />
        </>
      )}

      {/* if there is No Bill Records */}
      {!deferredName &&
        !deferredType &&
        !isLoading &&
        !isFetching &&
        !isError &&
        bills?.length === 0 && (
          <NoSavedRecords customMsg={["فواتير", "الفواتير"]} />
        )}

      {/* if there is search query and no Bill matches >>> No Search Found*/}
      {(deferredName || deferredType) &&
        bills?.length === 0 &&
        !isLoading &&
        !isFetching &&
        !isError && <NoSearchResult />}

      {/* Show update Bill Modal */}
      <AnimatePresence initial={false}>
        {isOpen && <UpdateBill setIsOpen={setIsOpen} id={id} />}
      </AnimatePresence>

      {/* Show spinner when Loading State is true */}
      {isLoading && <MainSpinner isLoading={isLoading} />}
    </section>
  );
};
