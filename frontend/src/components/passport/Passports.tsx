import {
  useState,
  useDeferredValue,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { PaginationTable } from "../shared/PaginationTable";
import { UpdatePassport } from "../forms/UpdatePassport";
import { tableHeader, tableRow } from "./Table";
import { PassportSearchQueries, PassportService } from "./types";
import { Totals } from "./Totals";
import { Filters, FiltersSummary } from "./Filters";
import {
  PassportSearchQuery,
  useDeletePassportMutation,
  useGetPassportsQuery,
} from "../../state/features/passport/passportsApiSlice";
import { useSearchParams } from "react-router-dom";
import {
  InvoiceData,
  useCreateInvoiceMutation,
} from "../../state/features/invoice/invoiceApiSlice";
import { passportService } from "./constants";
import { scrollToTable, useScroll } from "../../hooks/useScroll";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { AnimatePresence } from "framer-motion";
import { NoSearchResult } from "../shared/NoSearchResult";
import { NoSavedRecords } from "../shared/NoSavedRecords";
import { FetchingMessage } from "../shared/FetchingMessage";
import { ReactComponent as PassportMain } from "../../assets/icons/passport-main.svg";
import { useDetectClickOutside } from "../../hooks/useDetectClickOutside";
import { useDownloadExcel } from "react-export-table-to-excel";
import { RiFileExcel2Fill } from "react-icons/ri";
import DataFetchingErrorMessage from "../shared/DataFetchingErrorMessage";
import DataFetchingSpinner from "../shared/DataFetchingSpinner";

export const Passports = () => {
  //Search Queries
  const [searchQuery, setSearchQuery] = useState<PassportSearchQueries>({
    year: "",
    month: "",
    day: "",
    nationality: "",
    state: [
      { value: "accepted", checked: false },
      { value: "rejected", checked: false },
      { value: "refunded", checked: false },
      { value: "delivered", checked: false },
    ],
    service: [
      { value: "30days", checked: false },
      { value: "60days", checked: false },
      { value: "90days", checked: false },
      { value: "extend_permission", checked: false },
      { value: "cancel_permission", checked: false },
      { value: "report_request", checked: false },
      { value: "renew_resedency", checked: false },
      { value: "cancel_resedency", checked: false },
      { value: "temp_shutdown_with_escape", checked: false },
      { value: "change_situation", checked: false },
    ],
  });

  const { year, month, day, state, service, nationality } = searchQuery;

  const deferredNationality = useDeferredValue(nationality);

  const notInitialRender = useRef(false);

  //Table to Excel
  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Passports table",
    sheet: "Passports",
  });

  //Table Row State
  const [tableRows, setTableRows] = useState(50);

  //Get Page Number From URL
  const [URLSearchParams] = useSearchParams();
  const pageNumber: number = URLSearchParams.get("page")
    ? +URLSearchParams.get("page")!
    : 1;

  const stateArr = state.filter((s) => s.checked).map((s) => s.value);
  const serviceArr = service.filter((s) => s.checked).map((s) => s.value);

  //Create Search Object To Pass As Query Option
  let searchObj: PassportSearchQuery = {
    query: {
      day: +day,
      month: +month,
      year: +year,
      nationality: deferredNationality,
      state: stateArr,
      service: serviceArr,
    },
    option: {
      limit: tableRows,
      page: pageNumber,
    },
  };

  const { data, isLoading, isFetching, isSuccess, error } =
    useGetPassportsQuery(searchObj);

  const passports = data?.docs ? data.docs : [];

  const [deletePassport, { isLoading: isDeleting }] =
    useDeletePassportMutation();

  const [createInvoice, { isLoading: isCreatingInvoice }] =
    useCreateInvoiceMutation();

  //Is modal open
  const [isOpen, setIsOpen] = useState<boolean>(false);

  //Is Filter Open
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  //PassportID to Update
  const [id, setId] = useState("");

  // handle Delete Passport
  const handleRemoving = useCallback(
    async (e: React.SyntheticEvent, removedPassportID: string) => {
      e.preventDefault();

      await deletePassport(removedPassportID);
    },
    []
  );

  // handle Creating invoice
  const handleAddInvoice = useCallback(
    async (
      e: React.SyntheticEvent,
      customerName: string,
      passport_service: string,
      paymentDate: Date,
      passportSales: number,
      passportSpecialKey: string
    ) => {
      e.preventDefault();

      const invoiceData: InvoiceData = {
        customer: { name: customerName },
        details: [
          {
            name:
              passport_service === "90days" ||
              passport_service === "60days" ||
              passport_service === "30days"
                ? " فيزا " + passportService[passport_service]
                : passportService[passport_service as keyof PassportService],
            quantity: 1,
            price: passportSales,
          },
        ],
        ID: passportSpecialKey,
        total: passportSales,
        subtotal: 0,
        date: paymentDate,
        taxDue: 0,
        taxRate: 0,
        taxable: 0,
      };

      await createInvoice(invoiceData);
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
  useDocumentTitle("الجـــوازات");
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
          <PassportMain className="h-20 w-20 drop-shadow" />
        </span>
        الجـــوازات
      </h2>

      {/*Show Passports' Filters*/}
      <FiltersSummary
        setIsFilterOpen={setIsFilterOpen}
        isFilterOpen={isFilterOpen}
        searchQuery={searchQuery}
        stateArr={stateArr}
        serviceArr={serviceArr}
        count={data?.totalDocs ? data.totalDocs : 0}
      />
      <Filters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setIsFilterOpen={setIsFilterOpen}
        isFilterOpen={isFilterOpen}
        tableRows={tableRows}
        setTableRows={setTableRows}
      />

      {/*Show Passports' Totals*/}
      {!isFetching && passports?.length !== 0 && (
        <Totals passports={passports} />
      )}

      {/* isFetching Message */}
      {isFetching && <FetchingMessage isFetching={isFetching} />}

      {/*Display Table All Data Needed*/}
      {passports?.length > 0 && (
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
            tableBodyData={passports}
            options={data!}
            handleRemoving={handleRemoving}
            handleAddInvoice={handleAddInvoice}
            setIsOpen={setIsOpen}
            setId={setId}
            isDeleting={isDeleting}
            isCreatingInvoice={isCreatingInvoice}
            ref={tableRef}
          />
        </>
      )}

      {/* if there is No Passports Records */}
      {!year &&
        !month &&
        !day &&
        !deferredNationality &&
        stateArr?.length === 0 &&
        serviceArr?.length === 0 &&
        passports?.length === 0 &&
        !isFetching && <NoSavedRecords customMsg={["جوازات", "الجوازات"]} />}

      {/* if there is search query and no Passport matches >>> No Result Found*/}
      {(year ||
        month ||
        day ||
        deferredNationality ||
        stateArr?.length > 0 ||
        serviceArr?.length > 0) &&
        passports?.length === 0 &&
        !isFetching && <NoSearchResult />}

      {/* Show update Passport Modal */}
      <AnimatePresence initial={false}>
        {isOpen && <UpdatePassport setIsOpen={setIsOpen} id={id} />}
      </AnimatePresence>
    </main>
  );
};
