import {
  useState,
  useEffect,
  useDeferredValue,
  useRef,
  useCallback,
} from "react";
import { PaginationTable } from "../shared/PaginationTable";
import { UpdateTicket } from "../forms/UpdateTicket";
import { TicketSearchQueries } from "./types";
import { useSearchParams } from "react-router-dom";
import {
  TicketSearchQuery,
  useDeleteTicketMutation,
  useGetTicketsQuery,
} from "../../state/features/ticket/ticketsApiSlice";
import {
  InvoiceData,
  useCreateInvoiceMutation,
} from "../../state/features/invoice/invoiceApiSlice";
import { ITicketDocument } from "../../../../backend/models/ticketModel";
import { scrollToTable, useScroll } from "../../hooks/useScroll";
import { Filters, FiltersSummary } from "./Filters";
import { Totals } from "./Totals";
import { tableHeader, tableRow } from "./Table";
import { paymentMethods } from "../payment/constants";
import { PaymentMethods } from "../payment/types";
import { AnimatePresence } from "framer-motion";
import { FetchingMessage } from "../shared/FetchingMessage";
import { NoSavedRecords } from "../shared/NoSavedRecords";
import { NoSearchResult } from "../shared/NoSearchResult";
import { useDetectClickOutside } from "../../hooks/useDetectClickOutside";
import { useDownloadExcel } from "react-export-table-to-excel";
import { RiFileExcel2Fill } from "react-icons/ri";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import TicketMain from "../../assets/icons/ticket-main.svg?react";
import DataFetchingErrorMessage from "../shared/DataFetchingErrorMessage";
import DataFetchingSpinner from "../shared/DataFetchingSpinner";

export default function Tickets() {
  //Search Params
  const [searchQuery, setSearchQuery] = useState<TicketSearchQueries>({
    day: "",
    year: "",
    month: "",
    type: "",
    supplier: "",
    employee: "",
    customerName: "",
    paymentMethod: [
      { value: "cash", checked: false },
      { value: "bank", checked: false },
      { value: "later", checked: false },
      { value: "credit", checked: false },
    ],
  });

  const {
    year,
    month,
    day,
    supplier,
    employee,
    paymentMethod,
    type,
    customerName,
  } = searchQuery;

  const deferredCustomerName = useDeferredValue(customerName);
  const deferredEmployee = useDeferredValue(employee);
  const deferredType = useDeferredValue(type);
  const deferredSupplier = useDeferredValue(supplier);

  const notInitialRender = useRef(false);

  //Table to Excel
  const tableRef = useRef<HTMLTableElement | null>(null);

  const [excelReady, setExcelReady] = useState(false);

  const { onDownload } = useDownloadExcel({
    currentTableRef: excelReady ? tableRef.current : null,
    filename: "Tickets table",
    sheet: "Tickets",
  });

  //Table Row State
  const [tableRows, setTableRows] = useState(50);

  //Get Page Number From URL
  const [URLSearchParams] = useSearchParams();
  const pageNumber: number = URLSearchParams.get("page")
    ? +URLSearchParams.get("page")!
    : 1;

  const paymentMethodArr = paymentMethod
    .filter((s) => s.checked)
    .map((s) => s.value);

  //Create Search Object To Pass As Query Option
  let searchObj: TicketSearchQuery = {
    query: {
      day: +day,
      month: +month,
      year: +year,
      type: deferredType,
      supplier: deferredSupplier,
      employee: deferredEmployee,
      customerName: deferredCustomerName,
      paymentMethod: paymentMethodArr,
    },
    option: {
      limit: tableRows,
      page: pageNumber,
    },
  };

  const { data, isLoading, isFetching, isSuccess, error } =
    useGetTicketsQuery(searchObj);

  const tickets = data?.docs ? data.docs : [];

  const [deleteTicket, { isLoading: isDeleting }] = useDeleteTicketMutation();

  const [createInvoice, { isLoading: isCreatingInvoice }] =
    useCreateInvoiceMutation();

  //Is modal open
  const [isOpen, setIsOpen] = useState(false);

  //Is Filter Open
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  //Ticket ID to Update
  const [id, setId] = useState("");

  //Handle Delete Ticket
  const handleRemoving = useCallback(
    async (e: React.SyntheticEvent, removedTicketID: string) => {
      e.preventDefault();

      await deleteTicket(removedTicketID);
    },
    []
  );

  //Handle Creating Invoice
  const handleAddInvoice = useCallback(
    async (e: React.SyntheticEvent, ticket: ITicketDocument) => {
      e.preventDefault();

      const invoiceData: InvoiceData = {
        customer: { name: ticket?.customer_name },
        details: [
          {
            name: ticket?.type as string,
            quantity: 1,
            price: ticket.sales,
          },
        ],
        subtotal: ticket?.sales,
        taxable: 0,
        taxRate: 0,
        taxDue: 0,
        total: ticket?.sales,
        date: ticket?.payment_date as Date,
        paidAmount: ticket?.paid_amount,
        remainingAmount: ticket?.remaining_amount,
        paymentMethod:
          paymentMethods[ticket?.payment_method as keyof PaymentMethods],
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

  useEffect(() => {
    if (tableRef.current) {
      setExcelReady(true);
    }
  }, [tickets.length]);

  useScroll("filterHeader");
  useDocumentTitle("التذاكــر");
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
          <TicketMain className="mr-1 h-20 w-20 drop-shadow" />
        </span>
        التذاكــر
      </h2>

      {/*Show Tickets' Filters*/}
      <FiltersSummary
        searchQuery={searchQuery}
        count={data?.totalDocs ? data.totalDocs : 0}
        paymentMethodArr={paymentMethodArr}
        setIsFilterOpen={setIsFilterOpen}
        isFilterOpen={isFilterOpen}
      />

      <Filters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        paymentMethodArr={paymentMethodArr}
        setIsFilterOpen={setIsFilterOpen}
        isFilterOpen={isFilterOpen}
        tableRows={tableRows}
        setTableRows={setTableRows}
      />

      {/*Show Tickets' Totals*/}
      {!isFetching && tickets?.length !== 0 && <Totals tickets={tickets} />}

      {/* isFetching Message */}
      {isFetching && <FetchingMessage isFetching={isFetching} />}

      {/* Display Table Data */}
      {tickets?.length > 0 && (
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
            tableBodyData={tickets}
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

      {/* if there is No Tickets Records */}
      {!year &&
        !month &&
        !day &&
        !deferredType &&
        !deferredSupplier &&
        !deferredEmployee &&
        !deferredCustomerName &&
        paymentMethodArr?.length === 0 &&
        tickets?.length === 0 &&
        !isFetching && <NoSavedRecords customMsg={["تذاكر", "التذاكر"]} />}

      {/* if there is search query no Tickets matches >>> No Search Found*/}
      {(year ||
        month ||
        day ||
        employee ||
        deferredSupplier ||
        deferredCustomerName ||
        deferredType ||
        deferredEmployee ||
        paymentMethodArr?.length > 0) &&
        tickets?.length === 0 &&
        !isFetching && <NoSearchResult />}

      {/* Show update Tickets Modal */}
      <AnimatePresence initial={false}>
        {isOpen && <UpdateTicket setIsOpen={setIsOpen} id={id} />}
      </AnimatePresence>
    </main>
  );
}
