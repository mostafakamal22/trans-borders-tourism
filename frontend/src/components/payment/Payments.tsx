import { useState, useEffect, useDeferredValue, useRef } from "react";
import { PaginationTable } from "../shared/PaginationTable";
import { MainSpinner } from "../shared/MainSpinner";
import {
  PaymentMethods,
  PaymentSearchQueries,
  PaymentTypes,
} from "../payment/types";
import { useSearchParams } from "react-router-dom";
import {
  PaymentSearchQuery,
  useDeletePaymentMutation,
  useGetPaymentsQuery,
} from "../../state/features/payment/paymentApiSlice";
import { scrollToTable, useScroll } from "../../hooks/useScroll";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { NoSavedRecords } from "../shared/NoSavedRecords";
import { NoSearchResult } from "../shared/NoSearchResult";
import { AnimatePresence } from "framer-motion";
import { FetchingMessage } from "../shared/FetchingMessage";
import { ReactComponent as PaymentMain } from "../../assets/icons/payment-main.svg";
import { tableHeader, tableRow } from "./Table";
import { Filters, FiltersSummary } from "./Filters";
import { Totals } from "./Totals";
import { UpdatePayment } from "../forms/UpdatePayment";
import { paymentMethods, paymentTypes } from "./constants";

export const Payments = () => {
  //Search Params
  const [searchQuery, setSearchQuery] = useState<PaymentSearchQueries>({
    day: "",
    year: "",
    month: "",
    type: "",
    method: "",
  });

  const { year, month, day, method, type } = searchQuery;

  const deferredType = useDeferredValue(type);
  const deferredMethod = useDeferredValue(method);

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
      type: Object.keys(paymentTypes).find(
        (key) => paymentTypes[key as keyof PaymentTypes] === deferredType
      ),
      method: Object.keys(paymentMethods).find(
        (key) => paymentMethods[key as keyof PaymentMethods] === deferredMethod
      ),
    },
    option: {
      limit: tableRows,
      page: pageNumber,
    },
  };

  const { data, isLoading, isFetching, isSuccess, isError } =
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
  const handleRemoving = async (
    e: React.SyntheticEvent,
    removedPaymentID: string
  ) => {
    e.preventDefault();

    await deletePayment(removedPaymentID);
  };

  useEffect(() => {
    if (notInitialRender.current && isSuccess && !isFetching && !isLoading) {
      scrollToTable();
    } else {
      notInitialRender.current = true;
    }
  }, [pageNumber, isSuccess, isFetching, isLoading, scrollToTable]);

  useScroll("filterHeader");
  useDocumentTitle("المصــروفات");

  return (
    <section className="w-full">
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
      {!isLoading && !isFetching && payments?.length !== 0 && (
        <Totals payments={payments} />
      )}

      {/* isFetching Message */}
      {isFetching && <FetchingMessage isFetching={isFetching} />}

      {/*Display Table All Data Needed*/}
      {!isLoading && payments?.length > 0 && (
        <PaginationTable
          tableRow={tableRow}
          tableHeader={tableHeader}
          tableBodyData={payments}
          options={data!}
          handleRemoving={handleRemoving}
          setIsOpen={setIsOpen}
          setId={setId}
          isDeleting={isDeleting}
        />
      )}

      {/* if there is No Payments Records */}
      {!year &&
        !month &&
        !day &&
        !deferredType &&
        !deferredMethod &&
        payments?.length === 0 &&
        !isLoading &&
        !isFetching &&
        !isError && <NoSavedRecords customMsg={["مصروفات", "المصروفات"]} />}

      {/* if there is search query no Payments matches >>> No Search Found*/}
      {(year || month || day || deferredMethod || deferredType) &&
        payments?.length === 0 &&
        !isLoading &&
        !isFetching &&
        !isError && <NoSearchResult />}

      {/* Show update Payments Modal */}
      <AnimatePresence initial={false}>
        {isOpen && <UpdatePayment setIsOpen={setIsOpen} id={id} />}
      </AnimatePresence>

      {/* Show spinner when Loading State is true */}
      {isLoading && <MainSpinner isLoading={isLoading} />}
    </section>
  );
};
