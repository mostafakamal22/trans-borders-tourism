import {
  useEffect,
  useState,
  useDeferredValue,
  useRef,
  useCallback,
} from "react";
import { useSearchParams } from "react-router-dom";
import { PaginationTable } from "../shared/PaginationTable";
import { ReceiptVoucherSearchQueries } from "./types";
import {
  ReceiptVoucherSearchQuery,
  useDeleteReceiptVoucherMutation,
  useGetReceiptVouchersQuery,
} from "../../state/features/receiptVoucher/receiptVouchersApiSlice";
import { scrollToTable, useScroll } from "../../hooks/useScroll";
import { AnimatePresence } from "framer-motion";
import { NoSearchResult } from "../shared/NoSearchResult";
import { NoSavedRecords } from "../shared/NoSavedRecords";
import { tableHeader, tableRow } from "./Table";
import { FetchingMessage } from "../shared/FetchingMessage";
import { Totals } from "./Totals";
import { Filters, FiltersSummary } from "./Filters";
import { UpdateReceiptVoucher } from "../forms/UpdateReceiptVoucher";
import { useDetectClickOutside } from "../../hooks/useDetectClickOutside";
import { useDownloadExcel } from "react-export-table-to-excel";
import { RiFileExcel2Fill } from "react-icons/ri";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import ReceiptVoucherMain from "../../assets/icons/receiptVoucher-main.svg?react";
import DataFetchingErrorMessage from "../shared/DataFetchingErrorMessage";
import DataFetchingSpinner from "../shared/DataFetchingSpinner";

export default function ReceiptVouchers() {
  //Search Params
  const [searchQuery, setSearchQuery] = useState<ReceiptVoucherSearchQueries>({
    day: "",
    year: "",
    month: "",
    customerName: "",
  });

  const { year, month, day, customerName } = searchQuery;

  const deferredCustomerName = useDeferredValue(customerName);

  const notInitialRender = useRef(false);

  //Table to Excel
  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "ReceiptVouchers table",
    sheet: "ReceiptVouchers",
  });

  //Table Row State
  const [tableRows, setTableRows] = useState(50);

  //Get Page Number From URL
  const [URLSearchParams] = useSearchParams();
  const pageNumber: number = URLSearchParams.get("page")
    ? +URLSearchParams.get("page")!
    : 1;

  //Create Search Object To Pass As Query Option
  let searchObj: ReceiptVoucherSearchQuery = {
    query: {
      day: +day,
      month: +month,
      year: +year,
      customerName: deferredCustomerName,
    },
    option: {
      limit: tableRows,
      page: pageNumber,
    },
  };

  const { data, isLoading, isFetching, isSuccess, error } =
    useGetReceiptVouchersQuery(searchObj);

  const receiptVouchers = data?.docs ? data.docs : [];

  const [deleteReceiptVoucher, { isLoading: isDeleting }] =
    useDeleteReceiptVoucherMutation();

  //Is modal open
  const [isOpen, setIsOpen] = useState(false);

  //Is Filter Open
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  //ReceiptVoucher ID to Update
  const [id, setId] = useState("");

  // handle Delete ReceiptVoucher
  const handleRemoving = useCallback(
    async (e: React.SyntheticEvent, removedReceiptVoucherID: string) => {
      e.preventDefault();

      await deleteReceiptVoucher(removedReceiptVoucherID);
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
  useDocumentTitle("سنـــدات القبــض");
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
          <ReceiptVoucherMain className="mr-1 h-20 w-20 drop-shadow" />
        </span>
        سنـــدات القبــض
      </h2>

      {/*Show ReceiptVouchers' Filters*/}
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

      {/*Show ReceiptVouchers' Totals*/}
      {!isFetching && receiptVouchers?.length !== 0 && (
        <Totals receiptVouchers={receiptVouchers} />
      )}

      {/* isFetching Message */}
      {isFetching && <FetchingMessage isFetching={isFetching} />}

      {/*Display Table All Data Needed*/}
      {receiptVouchers?.length > 0 && (
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
            tableBodyData={receiptVouchers}
            options={data!}
            handleRemoving={handleRemoving}
            setIsOpen={setIsOpen}
            setId={setId}
            isDeleting={isDeleting}
            ref={tableRef}
          />
        </>
      )}

      {/* if there is No ReceiptVouchers Records */}
      {!year &&
        !month &&
        !day &&
        !deferredCustomerName &&
        receiptVouchers?.length === 0 &&
        !isFetching && <NoSavedRecords customMsg={["سندات", "السندات"]} />}

      {/* if there is search query no ReceiptVouchers matches >>> No Search Found*/}
      {(year || month || day || deferredCustomerName) &&
        receiptVouchers?.length === 0 &&
        !isFetching && <NoSearchResult />}

      {/* Show update ReceiptVouchers Modal */}
      <AnimatePresence initial={false}>
        {isOpen && <UpdateReceiptVoucher setIsOpen={setIsOpen} id={id} />}
      </AnimatePresence>
    </main>
  );
}
