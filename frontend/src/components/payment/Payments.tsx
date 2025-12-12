import { useState, useEffect, useRef, useCallback } from "react";
import { PaginationTable } from "../shared/PaginationTable";
import { PaymentSearchQueries } from "../payment/types";
import { useSearchParams } from "react-router-dom";
import {
  PaymentSearchQuery,
  useDeletePaymentMutation,
  useGetPaymentsQuery,
} from "../../state/features/payment/paymentApiSlice";
import { scrollToTable, useScroll } from "../../hooks/useScroll";
import { NoSavedRecords } from "../shared/NoSavedRecords";
import { NoSearchResult } from "../shared/NoSearchResult";
import { AnimatePresence } from "framer-motion";
import { FetchingMessage } from "../shared/FetchingMessage";
import { tableHeader, tableRow } from "./Table";
import { Filters, FiltersSummary } from "./Filters";
import { Totals } from "./Totals";
import { UpdatePayment } from "../forms/UpdatePayment";
import { useDetectClickOutside } from "../../hooks/useDetectClickOutside";
import { useDownloadExcel } from "react-export-table-to-excel";
import { RiFileExcel2Fill } from "react-icons/ri";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import PaymentMain from "../../assets/icons/payment-main.svg?react";
import DataFetchingErrorMessage from "../shared/DataFetchingErrorMessage";
import DataFetchingSpinner from "../shared/DataFetchingSpinner";

export default function Payments() {
  //Search Params
  const [searchQuery, setSearchQuery] = useState<PaymentSearchQueries>({
    day: "",
    year: "",
    month: "",
    type: "",
    method: "",
  });

  const { year, month, day, method, type } = searchQuery;

  const notInitialRender = useRef(false);

  //Table Row State
  const [tableRows, setTableRows] = useState(50);

  //Get Page Number From URL
  const [URLSearchParams] = useSearchParams();
  const pageNumber: number = URLSearchParams.get("page")
    ? +URLSearchParams.get("page")!
    : 1;

  //Create Search Object To Pass As Query Option
  let searchObj: PaymentSearchQuery = {
    query: {
      day: +day,
      month: +month,
      year: +year,
      type,
      method,
    },
    option: {
      limit: tableRows,
      page: pageNumber,
    },
  };

  //Table to Excel
  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Payments table",
    sheet: "Payments",
  });

  const { data, isLoading, isFetching, isSuccess, error } =
    useGetPaymentsQuery(searchObj);

  const payments = data?.docs ? data.docs : [];

  const [deletePayment, { isLoading: isDeleting }] = useDeletePaymentMutation();

  //Is modal open
  const [isOpen, setIsOpen] = useState(false);

  //Is Filter Open
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  //Payment ID to Update
  const [id, setId] = useState("");

  // handle Delete Payment
  const handleRemoving = useCallback(
    async (e: React.SyntheticEvent, removedPaymentID: string) => {
      e.preventDefault();

      await deletePayment(removedPaymentID);
    },
    []
  );

  useEffect(() => {
    if (notInitialRender.current && isSuccess && !isFetching && !isLoading) {
      scrollToTable();
    } else {
      notInitialRender.current = true;
    }
  }, [pageNumber, isSuccess, isFetching, isLoading, scrollToTable]);

  useScroll("filterHeader");
  useDocumentTitle("المصــروفات");
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
          <PaymentMain className="mr-1 h-20 w-20 drop-shadow" />
        </span>
        المصــروفات
      </h2>

      {/*Show Payments' Filters*/}
      <FiltersSummary
        searchQuery={searchQuery}
        count={data?.totalDocs ? data.totalDocs : 0}
        setIsFilterOpen={setIsFilterOpen}
        isFilterOpen={isFilterOpen}
      />

      <Filters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setIsFilterOpen={setIsFilterOpen}
        isFilterOpen={isFilterOpen}
        tableRows={tableRows}
        setTableRows={setTableRows}
      />

      {/*Show Payments' Totals*/}
      {!isFetching && payments?.length !== 0 && <Totals payments={payments} />}

      {/* isFetching Message */}
      {isFetching && <FetchingMessage isFetching={isFetching} />}

      {/*Display Table All Data Needed*/}
      {payments?.length > 0 && (
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
            tableBodyData={payments}
            options={data!}
            handleRemoving={handleRemoving}
            setIsOpen={setIsOpen}
            setId={setId}
            isDeleting={isDeleting}
            ref={tableRef}
          />
        </>
      )}

      {/* if there is No Payments Records */}
      {!year &&
        !month &&
        !day &&
        !type &&
        !method &&
        payments?.length === 0 &&
        !isFetching && <NoSavedRecords customMsg={["مصروفات", "المصروفات"]} />}

      {/* if there is search query no Payments matches >>> No Search Found*/}
      {(year || month || day || method || type) &&
        payments?.length === 0 &&
        !isFetching && <NoSearchResult />}

      {/* Show update Payments Modal */}
      <AnimatePresence initial={false}>
        {isOpen && <UpdatePayment setIsOpen={setIsOpen} id={id} />}
      </AnimatePresence>
    </main>
  );
}
