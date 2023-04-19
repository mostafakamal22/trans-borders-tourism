import { useEffect, useState, useDeferredValue, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { MainSpinner } from "../shared/MainSpinner";
import { PaginationTable } from "../shared/PaginationTable";
import { PurchaseSearchQueries } from "./types";
import {
  PurchaseSearchQuery,
  useDeletePurchaseMutation,
  useGetPurchasesQuery,
} from "../../state/features/purchase/purchaseApiSlice";
import { useCreateInvoiceMutation } from "../../state/features/invoice/invoiceApiSlice";
import { scrollToTable, useScroll } from "../../hooks/useScroll";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { AnimatePresence } from "framer-motion";
import { NoSearchResult } from "../shared/NoSearchResult";
import { NoSavedRecords } from "../shared/NoSavedRecords";
import { tableHeader, tableRow } from "./Table";
import { FetchingMessage } from "../shared/FetchingMessage";
import { Totals } from "./Totals";
import { Filters, FiltersSummary } from "./Filters";
import { ReactComponent as PurchaseMain } from "../../assets/icons/purchase-main.svg";
import { UpdatePurchase } from "../forms/UpdatePurchase";

export const Purchases = () => {
  //Search Params
  const [searchQuery, setSearchQuery] = useState<PurchaseSearchQueries>({
    day: "",
    year: "",
    month: "",
    type: "",
    supplier: "",
  });

  const { year, month, day, supplier, type } = searchQuery;

  const deferredType = useDeferredValue(type);
  const deferredSupplier = useDeferredValue(supplier);

  const notInitialRender = useRef(false);

  //Table Row State
  const [tableRows, setTableRows] = useState(50);

  //Get Page Number From URL
  const [URLSearchParams] = useSearchParams();
  const pageNumber: number = URLSearchParams.get("page")
    ? +URLSearchParams.get("page")!
    : 1;

  //Create Search Object To Pass As Query Option
  let searchObj: PurchaseSearchQuery = {
    query: {
      day: +day,
      month: +month,
      year: +year,
      type: deferredType,
      supplier: deferredSupplier,
    },
    option: {
      limit: tableRows,
      page: pageNumber,
    },
  };

  const { data, isLoading, isFetching, isSuccess, isError } =
    useGetPurchasesQuery(searchObj);

  const purchases = data?.docs ? data.docs : [];

  const [deletePurchase, { isLoading: isDeleting }] =
    useDeletePurchaseMutation();

  const [createInvoice, { isLoading: isCreatingInvoice }] =
    useCreateInvoiceMutation();

  //Is modal open
  const [isOpen, setIsOpen] = useState(false);

  //Is Filter Open
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  //Purchase ID to Update
  const [id, setId] = useState("");

  // handle Delete Purchase
  const handleRemoving = async (
    e: React.SyntheticEvent,
    removedPurchaseID: string
  ) => {
    e.preventDefault();

    await deletePurchase(removedPurchaseID);
  };

  useEffect(() => {
    if (notInitialRender.current && isSuccess && !isFetching && !isLoading) {
      scrollToTable();
    } else {
      notInitialRender.current = true;
    }
  }, [pageNumber, isSuccess, isFetching, isLoading, scrollToTable]);

  useScroll("filterHeader");
  useDocumentTitle("المشتــريات");

  return (
    <section className="w-full">
      <h2 className="my-4 mb-10 flex items-center justify-center rounded bg-red-700 px-2 py-4 text-3xl font-bold text-white shadow">
        <span className="mr-2 flex items-center justify-center">
          <PurchaseMain className="mr-1 h-20 w-20 drop-shadow" />
        </span>
        المشتــريات
      </h2>

      {/*Show Purchases' Filters*/}
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

      {/*Show Purchases' Totals*/}
      {!isLoading && !isFetching && purchases?.length !== 0 && (
        <Totals purchases={purchases} />
      )}

      {/* isFetching Message */}
      {isFetching && <FetchingMessage isFetching={isFetching} />}

      {/*Display Table All Data Needed*/}
      {!isLoading && purchases?.length > 0 && (
        <PaginationTable
          tableRow={tableRow}
          tableHeader={tableHeader}
          tableBodyData={purchases}
          options={data!}
          handleRemoving={handleRemoving}
          setIsOpen={setIsOpen}
          setId={setId}
          isDeleting={isDeleting}
          isCreatingInvoice={isCreatingInvoice}
        />
      )}

      {/* if there is No Purchases Records */}
      {!year &&
        !month &&
        !day &&
        !deferredType &&
        !deferredSupplier &&
        purchases?.length === 0 &&
        !isLoading &&
        !isFetching &&
        !isError && <NoSavedRecords customMsg={["مشتريات", "المشتريات"]} />}

      {/* if there is search query no Purchases matches >>> No Search Found*/}
      {(year || month || day || deferredSupplier || deferredType) &&
        purchases?.length === 0 &&
        !isLoading &&
        !isFetching &&
        !isError && <NoSearchResult />}

      {/* Show update Purchases Modal */}
      <AnimatePresence initial={false}>
        {isOpen && <UpdatePurchase setIsOpen={setIsOpen} id={id} />}
      </AnimatePresence>

      {/* Show spinner when Loading State is true */}
      {isLoading && <MainSpinner isLoading={isLoading} />}
    </section>
  );
};
