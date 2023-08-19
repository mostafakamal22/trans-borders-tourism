import dayjs from "dayjs";
import { Navigate, useLocation } from "react-router-dom";
import logo from "../../assets/imgs/trans-logo.png";
import stamp from "../../assets/imgs/trans-border-stamp.png";
import ReactToPrint from "react-to-print";
import { useRef } from "react";
import { AiFillPrinter } from "react-icons/ai";
import {
  billPassportTableHeader,
  billPassportTableRows,
  billTableHeader,
  billTableRow,
} from "./Table";
import {
  IBillDocument,
  IBillProduct,
} from "../../../../backend/models/billModel";
import { useScroll } from "../../hooks/useScroll";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { comapanyInfos } from "./constants";
import { Fragment } from "react";

export const ShowBill = () => {
  const location = useLocation();
  const bill: IBillDocument = location?.state?.bill;

  const componentRef = useRef<HTMLDivElement>(null);

  useScroll("showBill");
  useDocumentTitle("عرض فاتورة");

  if (!bill) return <Navigate to={"/not-found"} replace />;

  console.log(bill.details);

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
        id="showBill"
        ref={componentRef}
        className="mx-auto my-10 min-h-[75vh] w-full max-w-5xl overflow-x-auto rounded border border-black bg-slate-50 p-10 print:my-0 print:flex print:min-h-screen print:flex-col print:justify-between print:border-none print:shadow-none"
      >
        <div className="flex items-center">
          <div className="max-w-[300px] text-left text-sm">
            <p className="text-xl font-bold text-blue-700">
              {comapanyInfos.name[0]}
            </p>
            <p>TRN:- {comapanyInfos.TRN}</p>
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
            <p className="text-3xl font-bold text-blue-400">TAX BILL</p>

            <p className="text-sm">
              DATE{" "}
              <span
                style={{ printColorAdjust: "exact" }}
                className="rounded-sm bg-red-100 p-1"
              >
                {bill?.date ? dayjs(bill.date).format("DD/MM/YYYY") : "-"}
              </span>
            </p>
            <p className="text-sm">
              BILL #{" "}
              <span
                style={{ printColorAdjust: "exact" }}
                className="rounded-sm bg-red-100 p-1"
              >
                [{bill.ID}]
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
            Name:- {bill?.customer?.name ? bill.customer.name : "-"}
          </p>
          <p className="text-left">Mobile:- {"-"}</p>
        </div>

        <div>
          {bill.details.map((detail: IBillProduct, index: number) => (
            <div
              key={index}
              className="relative my-10 overflow-x-auto rounded border-y-4 border-red-800 shadow-md sm:rounded-lg"
            >
              <table className="w-full text-sm font-bold text-gray-500">
                <thead
                  style={{ printColorAdjust: "exact" }}
                  className="bg-red-100 uppercase text-gray-900"
                >
                  {detail.type === "Passport"
                    ? billPassportTableHeader
                    : billTableHeader}
                </thead>
                <tbody>
                  {detail.type === "Passport"
                    ? billPassportTableRows(detail, index)
                    : billTableRow(detail, index)}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        <div className="my-10 flex items-center justify-center gap-3 text-left font-semibold">
          <p className="mx-1">
            Paid Amount
            <span
              style={{ printColorAdjust: "exact" }}
              className="ml-4 rounded bg-red-100 py-2 px-4"
            >
              {bill?.total}
            </span>
          </p>
          <p className="mx-1">
            Remaining Amount
            <span
              style={{ printColorAdjust: "exact" }}
              className="ml-4 rounded bg-red-100 py-2 px-4"
            >
              {bill?.remaining_amount ? bill.remaining_amount : 0}
            </span>
          </p>
          <p className="mx-1">
            Payment Method
            <span
              style={{ printColorAdjust: "exact" }}
              className="ml-4 rounded bg-red-100 py-2 px-4"
            >
              {bill?.payment_method ? bill.payment_method : "-"}
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
            {!bill?.other ? "No Comment." : bill.other}
          </p>
        </div>

        <div className="relative my-10 flex min-h-[200px] items-center justify-center">
          <img
            className="absolute left-10 top-5 z-10 mx-auto max-h-[100%] w-[200px]  print:w-[130px]"
            src={stamp}
            alt="stamp"
          />

          <div>
            <p>If you have any questions about this bill, please contact us.</p>

            <p className="text-lg font-bold">Thank You For Your Business!</p>
          </div>
        </div>
      </div>
    </>
  );
};
