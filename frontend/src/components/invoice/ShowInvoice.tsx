import dayjs from "dayjs";
import { Navigate, useLocation } from "react-router-dom";
import logo from "../../assets/imgs/trans-logo.png";
import stamp from "../../assets/imgs/trans-border-stamp.png";
import ReactToPrint from "react-to-print";
import { useRef } from "react";
import { AiFillPrinter } from "react-icons/ai";
import { comapanyInfos } from "./constants";
import {
  invoicePassportTableHeader,
  invoicePassportTableRows,
  invoiceTableHeader,
  invoiceTableRow,
} from "./Table";
import {
  IInvoiceDocument,
  IProduct,
} from "../../../../backend/models/invoiceModel";
import { useScroll } from "../../hooks/useScroll";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export const ShowInvoice = () => {
  const location = useLocation();
  const invoice: IInvoiceDocument = location?.state?.invoice;

  const componentRef = useRef<HTMLDivElement>(null);

  useScroll("showInvoice");
  useDocumentTitle("عرض فاتورة");

  if (!invoice) return <Navigate to={"/not-found"} replace />;

  //Check if invoice date is before 30/4/2023 or not
  const invoiceDate = invoice?.date;
  const cutoffDate = dayjs("2023-05-01");

  const isInvoiceBefore1May2023 = dayjs(invoiceDate).isBefore(cutoffDate);

  //check if invoice.ID contains a string starts with  "After-30-4" >> Passport Invoice
  const isPassportInvoice = invoice?.ID && invoice.ID.startsWith("After-30-4");

  //Invoice Number
  const invoiceNo = invoice?.no
    ? invoice?.no
    : invoice?.date
    ? dayjs(invoice?.date).format(
        `YYYYMMDD-${dayjs(invoice?.createdAt as string).hour()}`
      )
    : dayjs(invoice?.createdAt as string).format(
        `YYYYMMDD-${dayjs(invoice?.createdAt as string).hour()}`
      );

  return (
    <>
      <ReactToPrint
        trigger={() => (
          <button
            className="fixed top-[15vh] left-4 z-10 my-5 inline-flex items-center rounded border bg-red-200 px-2 py-2 text-xs font-bold text-red-800 shadow transition-all duration-300 ease-in-out hover:border-red-800 hover:bg-white
            hover:text-red-800 print:hidden sm:px-3 sm:text-sm"
          >
            <AiFillPrinter className="mr-1" size={20} />
            طباعة الفاتورة
          </button>
        )}
        content={() => componentRef.current}
      />
      <div
        id="showInvoice"
        ref={componentRef}
        className="mx-auto my-10 min-h-[75vh] w-full max-w-5xl overflow-x-auto rounded border border-black bg-slate-50 p-10 print:my-0 print:flex print:min-h-screen print:flex-col print:justify-between print:border-none print:shadow-none"
      >
        <div className="flex items-center">
          <div className="max-w-[300px] text-left text-sm">
            <p className="text-xl font-bold text-blue-700">
              {comapanyInfos.name[0]}
            </p>
            {!isInvoiceBefore1May2023 ? <p>TRN:- {comapanyInfos.TRN}</p> : null}
            <p>{comapanyInfos.address}</p>

            {comapanyInfos.tel.map((tel) => (
              <p key={tel}>TEL:- {tel}</p>
            ))}

            {comapanyInfos.mob.map((mob) => (
              <p key={mob}>MOB:- {mob}</p>
            ))}

            <p>
              EMAIL:-{" "}
              <span className="text-blue-700 underline">
                {comapanyInfos.email}
              </span>
            </p>
            <p>
              WEBSITE:-{" "}
              <a
                className="text-blue-700 underline"
                href={comapanyInfos.website}
                target={"_blank"}
              >
                {comapanyInfos.website}
              </a>
            </p>
          </div>

          <img
            className="mx-auto max-h-[100%]  w-[300px]"
            src={logo}
            alt="logo"
          />

          <div className="w-[300px] self-start text-right">
            {!isInvoiceBefore1May2023 ? (
              <p className="text-3xl font-bold text-blue-400">TAX INVOICE</p>
            ) : (
              <p className="text-3xl font-bold text-blue-400">INVOICE</p>
            )}
            <p className="text-sm">
              DATE{" "}
              <span
                style={{ printColorAdjust: "exact" }}
                className="rounded-sm bg-red-100 p-1"
              >
                {invoice?.date ? dayjs(invoice.date).format("DD/MM/YYYY") : "-"}
              </span>
            </p>
            <p className="text-sm">
              INVOICE #{" "}
              <span
                style={{ printColorAdjust: "exact" }}
                className="rounded-sm bg-red-100 p-1"
              >
                [{invoiceNo}]
              </span>
            </p>
          </div>
        </div>

        <div className=" mt-5">
          <h2
            style={{ printColorAdjust: "exact" }}
            className="mb-4 bg-red-100 p-1 text-xl font-bold"
          >
            Bill To
          </h2>

          <p className="text-left">
            Name:- {invoice?.customer?.name ? invoice.customer.name : "-"}
          </p>
          <p className="text-left">
            Mobile:- {invoice?.customer?.number ? invoice.customer.number : "-"}
          </p>
        </div>

        <div>
          <div className="relative my-10 overflow-x-auto rounded border-y-4 border-red-800 shadow-md sm:rounded-lg">
            <table className="w-full text-sm font-bold text-gray-500 ">
              <thead
                style={{ printColorAdjust: "exact" }}
                className="bg-red-100 uppercase text-gray-900"
              >
                {isPassportInvoice
                  ? invoicePassportTableHeader
                  : invoiceTableHeader}
              </thead>
              <tbody>
                {invoice.details.map((detail: IProduct, index: number) =>
                  isPassportInvoice
                    ? invoicePassportTableRows(
                        detail,
                        invoice?.ID as string,
                        index
                      )
                    : invoiceTableRow(detail, index)
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="my-10 flex items-center justify-center gap-3 text-left font-semibold">
          <p className="mx-1">
            Paid Amount
            <span
              style={{ printColorAdjust: "exact" }}
              className="ml-4 rounded bg-red-100 py-2 px-4"
            >
              {invoice?.paid_amount || invoice?.paid_amount === 0
                ? invoice.paid_amount
                : invoice?.total}
            </span>
          </p>
          <p className="mx-1">
            Remaining Amount
            <span
              style={{ printColorAdjust: "exact" }}
              className="ml-4 rounded bg-red-100 py-2 px-4"
            >
              {invoice?.remaining_amount ? invoice.remaining_amount : 0}
            </span>
          </p>
          <p className="mx-1">
            Payment Method
            <span
              style={{ printColorAdjust: "exact" }}
              className="ml-4 rounded bg-red-100 py-2 px-4"
            >
              {invoice?.payment_method ? invoice.payment_method : "-"}
            </span>
          </p>
        </div>

        <div className=" mt-5">
          <h3
            style={{ printColorAdjust: "exact" }}
            className="mb-4 bg-red-100 p-1 text-xl font-bold"
          >
            Other Comments
          </h3>

          <p className="text-left">
            {!invoice?.other ? "No Comment." : invoice.other}
          </p>
        </div>

        <div className="relative my-10 flex min-h-[200px] items-center justify-center">
          <img
            className="absolute left-10 top-5 z-10 mx-auto max-h-[100%] w-[200px]  print:w-[130px]"
            src={stamp}
            alt="stamp"
          />

          <div>
            <p>
              If you have any questions about this invoice, please contact us.
            </p>

            <p className="text-lg font-bold">Thank You For Your Business!</p>
          </div>
        </div>
      </div>
    </>
  );
};
