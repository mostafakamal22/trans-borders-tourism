import {
  useState,
  useDeferredValue,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { ReactComponent as BillMain } from "../../assets/icons/invoice-main.svg";
import { PaginationTable } from "../shared/PaginationTable";
import { useSearchParams } from "react-router-dom";
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
import { saveAs } from "file-saver";
import { AiFillPrinter } from "react-icons/ai";
import DataFetchingErrorMessage from "../shared/DataFetchingErrorMessage";
import DataFetchingSpinner from "../shared/DataFetchingSpinner";
import JSZip from "jszip";
import ConvertingMessage from "../shared/ConvertingMessage";
import ConvertedBillToPDF from "./ConvertedBillToPDF";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ReactDOMServer from "react-dom/server";

export default function Bills() {
  //Search Query State
  const [searchQuery, setSearchQuery] = useState<BillSearchQueries>({
    year: "",
    month: "",
    day: "",
    name: "",
    type: "",
  });

  //Converting Bill to PDFs state
  const [isConvering, setIsConverting] = useState(false);

  //Table to Excel
  const tableRef = useRef(null);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Invoices table",
    sheet: "Invoices",
  });

  const { year, month, day, name, type } = searchQuery;

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

  const { data, isLoading, isFetching, isSuccess, error } = useGetBillsQuery({
    query: {
      day: +day,
      month: +month,
      year: +year,
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
  const handleRemoving = useCallback(
    async (e: React.SyntheticEvent, removedBillID: string) => {
      e.preventDefault();

      await deleteBill(removedBillID);
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

  // // Function to render each ShowBill component as a PDF
  const handleDownloadBillsAsPDF = async () => {
    setIsConverting(true);
    const zip = new JSZip();

    for (let i = 0; i < bills.length; i++) {
      // Render the ShowBill component as a string (HTML) using ReactDOMServer
      const billElementHTML = ReactDOMServer.renderToString(
        <ConvertedBillToPDF bill={bills[i]} />
      );

      // Create a temporary div element and set its innerHTML to the rendered HTML
      const tempDiv = document.createElement("div");

      tempDiv.innerHTML = billElementHTML;
      document.body.appendChild(tempDiv);

      // Use html2canvas to capture the tempDiv as an image
      const canvas = await html2canvas(tempDiv, {
        scale: 1, // Adjust the scale if needed
      });

      // Create PDF and add the captured image
      const imgData = canvas.toDataURL("image/png", 0.5); // Adjust the quality if needed
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(
        imgData,
        "PNG",
        10,
        10,
        190,
        (canvas.height / canvas.width) * 190,
        undefined,
        "FAST"
      );

      // Generate a Blob from the PDF and add it to the ZIP file
      const pdfBlob = pdf.output("blob");
      zip.file(`bill-${bills[i].ID}.pdf`, pdfBlob);

      // Clean up the tempDiv after capturing
      document.body.removeChild(tempDiv);
    }

    // Generate ZIP and trigger download
    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "bills.zip");

    setIsConverting(false);
  };

  // const generatePdf = async (bills: IBillDocument[]) => {
  //   try {
  //     setIsConverting(true);
  //     const pdfBlobs = await Promise.all(
  //       bills.map((bill) => generatePdfUrl(bill))
  //     );
  //     await createAndDownloadZip(pdfBlobs);
  //     setIsConverting(false);
  //   } catch (error) {
  //     console.error("Error generating PDFs:", error);
  //     setIsConverting(false);
  //   }
  // };

  // const generatePdfUrl = (bill: IBillDocument): Promise<Blob> => {
  //   return new Promise((resolve, reject) => {
  //     const pdfElement = (
  //       <BlobProvider document={<ConvertedBillToPDF bill={bill} />}>
  //         {({ blob, loading, error }) => {
  //           if (!loading && !error && blob) {
  //             resolve(blob);
  //           } else if (error) {
  //             reject(error);
  //           }
  //           return null;
  //         }}
  //       </BlobProvider>
  //     );
  //     ReactDOM.render(pdfElement, document.createElement("div"));
  //   });
  // };

  // async function createAndDownloadZip(pdfBlobs: Blob[]) {
  //   const zip = new JSZip();
  //   const agent_name = "Bill"; // This can be dynamic for different PDFs.

  //   for (let i = 0; i < pdfBlobs.length; i++) {
  //     const blob = pdfBlobs[i];
  //     zip.file(`${agent_name}-${i}.pdf`, blob);
  //   }

  //   const zipBlob = await zip.generateAsync({ type: "blob" });
  //   saveAs(zipBlob, "Bills.zip");
  // }

  useScroll("filterHeader");
  useDocumentTitle("(جديدة) الفواتير");
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
          <BillMain className="h-20 w-20 drop-shadow" />
        </span>
        (جديدة) الفواتير
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

      {/* isConverting Message */}
      {isConvering && <ConvertingMessage />}

      {/*Display Table All Data Needed*/}
      {bills?.length > 0 && (
        <>
          <div className="my-10 flex flex-wrap items-center justify-center gap-4">
            <button
              className="flex items-center justify-center gap-1 rounded border bg-green-200 px-2 py-2 text-xs font-bold text-green-800 shadow transition-all duration-300 ease-in-out hover:border-green-800 hover:bg-white
            hover:text-green-800 sm:px-3 sm:text-sm"
              onClick={onDownload}
            >
              <RiFileExcel2Fill size={20} />
              <span>Export excel</span>
            </button>
            <button
              onClick={handleDownloadBillsAsPDF}
              className="flex items-center justify-center gap-1 rounded border bg-red-200 px-2 py-2 text-xs font-bold text-red-800 shadow transition-all duration-300 ease-in-out hover:border-red-800 hover:bg-white
            hover:text-red-800 sm:px-3 sm:text-sm"
            >
              <AiFillPrinter className="mr-1" size={20} />
              Download PDFs
            </button>
          </div>

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
      {!year &&
        !month &&
        !day &&
        !deferredName &&
        !deferredType &&
        !isFetching &&
        bills?.length === 0 && (
          <NoSavedRecords customMsg={["فواتير", "الفواتير"]} />
        )}

      {/* if there is search query and no Bill matches >>> No Search Found*/}
      {(year || month || day || deferredName || deferredType) &&
        bills?.length === 0 &&
        !isFetching && <NoSearchResult />}

      {/* Show update Bill Modal */}
      <AnimatePresence initial={false}>
        {isOpen && <UpdateBill setIsOpen={setIsOpen} id={id} />}
      </AnimatePresence>
    </main>
  );
}
