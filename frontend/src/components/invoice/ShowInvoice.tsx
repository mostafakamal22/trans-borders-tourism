import dayjs from "dayjs";
import { Navigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../state/features/hooks/StateHooks";
import logo from "../../assets/imgs/trans-logo.png";
import ReactToPrint from "react-to-print";
import { useRef, useEffect } from "react";
import { AiFillPrinter } from "react-icons/ai";

const tableHeaderTitles = ["Description", "Quantity", "Price"];

export const ShowInvoice = () => {
  const { invoiceList } = useAppSelector((state) => state.invoiceData);
  const invoiceID = useParams().id;
  const invoice = invoiceList.find((invoice: any) => invoice._id === invoiceID);

  const componentRef = useRef<HTMLDivElement>(null);

  if (!invoice)
    return (
      <>
        <Navigate to={"not-found"} />
      </>
    );

  //Define table data
  const tableHeader = (
    <tr className="border-b border-b-black">
      {tableHeaderTitles.map((title: string) => (
        <th
          key={title}
          scope="col"
          className="py-3 px-3 text-center border-x border-x-black"
        >
          {title}
        </th>
      ))}
    </tr>
  );

  const tableRow = (detail: any, index: number) => {
    return (
      <tr
        key={detail._id}
        style={{ printColorAdjust: "exact" }}
        className={`${
          index % 2 === 0 ? "bg-white" : "bg-red-100"
        } border-b border-b-black`}
      >
        {/*Description*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x  border-x-black text-center"
        >
          {detail.name ? detail.name : "-"}
        </th>

        {/*Quantity*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x  border-x-black text-center"
        >
          {detail.quantity}
        </th>

        {/*Price*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x  border-x-black text-center"
        >
          {detail.price}
        </th>
      </tr>
    );
  };

  //scroll page back to top when component first mount
  useEffect(() => {
    const yOffset = window.pageYOffset;
    window.scrollBy(0, -yOffset);
  }, []);

  return (
    <>
      <ReactToPrint
        trigger={() => (
          <button
            className="print:hidden fixed top-[50vh] right-2 z-10 inline-flex font-bold text-xs sm:text-sm bg-red-800 text-white hover:bg-white my-5 px-2 sm:px-3 py-2 hover:text-red-800 border hover:border-red-800 items-center rounded
            shadow transition-all ease-in-out duration-300"
          >
            <AiFillPrinter className="mr-1" size={20} />
            طباعة الفاتورة
          </button>
        )}
        content={() => componentRef.current}
      />
      <div
        ref={componentRef}
        className="max-w-6xl min-h-[75vh] w-full mx-auto my-20 overflow-x-auto  p-6 bg-slate-50 rounded shadow-lg shadow-black/30 print:shadow-none print:my-0"
      >
        <div className="flex items-center">
          <div className="max-w-[300px] text-left">
            <p className="text-blue-700 text-xl font-bold">
              TRANS BORDERS TOURISM L.L.C
            </p>
            <p>DUBAI-DEIRA-ABU HAIL</p>
            <p>TEL/045782747</p>
            <p>MOB/971556620879</p>
            <p>MOB/971507597677</p>
            <p className="underline text-blue-700">
              EMAIL/SAMEHDU2009@YAHOO.COM
            </p>
            <p className="underline text-blue-700">
              WEBSITE:-{" "}
              <a href="http://tbtourism.com/" target={"_blank"}>
                http://tbttourism.com/
              </a>
            </p>
          </div>

          <img
            className="self-start max-h-[100%] w-[250px]  mx-auto"
            src={logo}
            alt="logo"
          />

          <div className="self-start w-[300px] text-right">
            <p className="text-blue-400 text-3xl font-bold">INVOICE</p>
            <p>
              DATE{" "}
              <span
                style={{ printColorAdjust: "exact" }}
                className="bg-red-100 p-1 rounded-sm"
              >
                {invoice.date ? dayjs(invoice.date).format("DD/MM/YYYY") : "-"}
              </span>
            </p>
            <p>
              INVOICE #{" "}
              <span
                style={{ printColorAdjust: "exact" }}
                className="bg-red-100 p-1 rounded-sm"
              >
                [
                {"000" +
                  [...invoiceList].findIndex((p: any) => p._id === invoice._id)}
                ]
              </span>
            </p>
          </div>
        </div>

        <div className=" mt-5">
          <h2
            style={{ printColorAdjust: "exact" }}
            className="text-white font-bold text-xl p-1 bg-red-800 print:!bg-red-800 mb-4"
          >
            Bill To
          </h2>

          <p className="text-left">
            Name:- {invoice.customer.name ? invoice.customer.name : "-"}
          </p>
          <p className="text-left">
            Mobile:- {invoice.customer.number ? invoice.customer.number : "-"}
          </p>
        </div>

        <div>
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg my-10 border-y-4 border-red-800 rounded">
            <table className="w-full text-sm font-bold text-gray-500 ">
              <thead
                style={{ printColorAdjust: "exact" }}
                className="text-gray-900 uppercase bg-red-100"
              >
                {tableHeader}
              </thead>
              <tbody>
                {invoice.details.map((detail: any, index: number) =>
                  tableRow(detail, index)
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className=" text-left font-semibold">
          <p className="my-1">
            Subtotal
            <span
              style={{ printColorAdjust: "exact" }}
              className="ml-4 px-2 bg-red-100 rounded-sm"
            >
              {invoice.subtotal}
            </span>
          </p>
          <p className="my-1">
            Taxable
            <span
              style={{ printColorAdjust: "exact" }}
              className="ml-4 px-2 bg-red-100 rounded-sm"
            >
              {invoice.taxable}
            </span>
          </p>
          <p className="my-1">
            Tax rate
            <span
              style={{ printColorAdjust: "exact" }}
              className="ml-4 px-2 bg-red-100 rounded-sm"
            >
              {invoice.tax_rate}
            </span>
          </p>
          <p className="my-1">
            Tax due
            <span
              style={{ printColorAdjust: "exact" }}
              className="ml-4 px-2 bg-red-100 rounded-sm"
            >
              {invoice.tax_due}
            </span>
          </p>
          <p className="my-1">
            Total
            <span
              style={{ printColorAdjust: "exact" }}
              className="ml-4 px-2 bg-red-100 rounded-sm"
            >
              {invoice.total}
            </span>
          </p>
        </div>

        <div className=" mt-5">
          <h3
            style={{ printColorAdjust: "exact" }}
            className="text-white font-bold text-xl p-1 bg-red-800 mb-4"
          >
            Other Comments
          </h3>

          <p className="text-left">
            {!invoice.other ? "No Comment" : invoice.other}
          </p>
        </div>

        <div className=" my-10">
          <p>
            If you have any questions about this invoice, please contact us.
          </p>

          <p className="font-bold text-lg">Thank You For Your Business!</p>
        </div>
      </div>
    </>
  );
};
