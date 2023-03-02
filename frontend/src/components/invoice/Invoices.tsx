import { useState, useDeferredValue, useEffect, useRef } from "react";
import { ReactComponent as InvoiceMain } from "../../assets/icons/invoice-main.svg";
import { PaginationTable } from "../shared/PaginationTable";
import { useSearchParams } from "react-router-dom";
import { MainSpinner } from "../shared/MainSpinner";
import { InvoiceSearchQueries } from "./types";
import {
  useGetInvoicesQuery,
  useDeleteInvoiceMutation,
} from "../../state/features/invoice/invoiceApiSlice";
import { Filters, FiltersSummary } from "./Filters";
import { tableHeader, tableRow } from "./Table";
import { scrollToTable, useScroll } from "../../hooks/useScroll";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { FetchingMessage } from "../shared/FetchingMessage";
import { NoSavedRecords } from "../shared/NoSavedRecords";
import { NoSearchResult } from "../shared/NoSearchResult";

export const Invoices = () => {
  //Search Query State
  const [searchQuery, setSearchQuery] = useState<InvoiceSearchQueries>("");
  const deferredQuery = useDeferredValue(searchQuery);

  const notInitialRender = useRef<boolean>(false);

  //Table Row State
  const [tableRows, setTableRows] = useState(50);

  //Is Filter Open
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  //Get Page Number From URL
  const [URLSearchParams] = useSearchParams();
  const pageNumber: number = URLSearchParams.get("page")
    ? +URLSearchParams.get("page")!
    : 1;

  const { data, isLoading, isFetching, isSuccess, isError } =
    useGetInvoicesQuery({
      query: { name: deferredQuery.trim() },
      option: {
        limit: tableRows,
        page: pageNumber,
      },
    });

  const invoices = data?.docs ? data.docs : [];

  const [deleteInvoice, { isLoading: isDeleting }] = useDeleteInvoiceMutation();

  //Handle Delete Invoice
  const handleRemoving = async (
    e: React.SyntheticEvent,
    removedInvoiceID: string
  ) => {
    e.preventDefault();

    await deleteInvoice(removedInvoiceID);
  };

  useEffect(() => {
    if (notInitialRender.current && isSuccess && !isFetching && !isLoading) {
      scrollToTable();
    } else {
      notInitialRender.current = true;
    }
  }, [pageNumber, isSuccess, isFetching, isLoading, scrollToTable]);

  useScroll("filterHeader");
  useDocumentTitle("الفواتير");

  return (
    <section className="w-full">
      <h2 className="my-4 mb-10 flex items-center justify-center rounded bg-red-700 px-2 py-4 text-3xl font-bold text-white shadow">
        <span className="mr-2 flex items-center justify-center">
          <InvoiceMain className="h-20 w-20 drop-shadow" />
        </span>
        الفواتير
      </h2>

      {/*search Invoices with name*/}
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
      {!isLoading && invoices?.length > 0 && (
        <PaginationTable
          tableRow={tableRow}
          tableHeader={tableHeader}
          tableBodyData={invoices}
          options={data!}
          handleRemoving={handleRemoving}
          isDeleting={isDeleting}
        />
      )}

      {/* if there is No Invoice Records */}
      {!deferredQuery &&
        !isLoading &&
        !isFetching &&
        !isError &&
        invoices?.length === 0 && (
          <NoSavedRecords customMsg={["فواتير", "الفواتير"]} />
        )}

      {/* if there is search query and no Invoice matches >>> No Search Found*/}
      {deferredQuery &&
        invoices?.length === 0 &&
        !isLoading &&
        !isFetching &&
        !isError && <NoSearchResult />}

      {/* Show spinner when Loading State is true */}
      {isLoading && <MainSpinner isLoading={isLoading} />}
    </section>
  );
};
