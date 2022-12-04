import dayjs from "dayjs";
import { Navigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../state/features/hooks/StateHooks";
import logo from "../../assets/imgs/trans-logo.png";
import stamp from "../../assets/imgs/trans-border-stamp.png";
import ReactToPrint from "react-to-print";
import { useRef, useEffect } from "react";
import { AiFillPrinter } from "react-icons/ai";

export type CompanyInfos = {
  name: string[];
  address: string;
  website: string;
  email: string;
  tel: string[];
  mob: string[];
};

export const comapanyInfos: CompanyInfos = {
  name: ["TRANS BORDERS TOURISM L.L.C"],
  address: "DUBAI-DEIRA-ABU HAIL",
  website: "http://tbtourism.com",
  email: "Info@tbtourism.com",
  tel: ["045782747"],
  mob: ["+971556620879", "+971507597677"],
};

const tableHeaderTitles = ["NO.", "Description", "Quantity", "Price", "Total"];

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
        {/*Detail NO*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x  border-x-black text-center"
        >
          {index + 1}
        </th>

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

        {/*Total*/}
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
        className="max-w-6xl min-h-[75vh] w-full mx-auto my-20 overflow-x-auto  p-6 bg-slate-50 rounded shadow-lg shadow-black/30 print:shadow-none print:min-h-screen print:my-0 print:flex print:flex-col print:justify-between"
      >
        <div className="flex items-center">
          <div className="max-w-[300px] text-left">
            <p className="text-blue-700 text-xl font-bold">
              {comapanyInfos.name[0]}
            </p>
            <p>{comapanyInfos.address}</p>

            {comapanyInfos.tel.map((tel) => (
              <p key={tel}>TEL:- {tel}</p>
            ))}

            {comapanyInfos.mob.map((mob) => (
              <p key={mob}>MOB:- {mob}</p>
            ))}

            <p>
              EMAIL:-{" "}
              <span className="underline text-blue-700">
                {comapanyInfos.email}
              </span>
            </p>
            <p>
              WEBSITE:-{" "}
              <a
                className="underline text-blue-700"
                href={comapanyInfos.website}
                target={"_blank"}
              >
                {comapanyInfos.website}
              </a>
            </p>
          </div>

          <img
            className="max-h-[100%] w-[300px]  mx-auto"
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
            className="font-bold text-xl p-1 bg-red-100 mb-4"
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

        <div className="flex justify-center items-center gap-3 my-10 text-left font-semibold">
          <p className="mx-1">
            Paid Amount
            <span
              style={{ printColorAdjust: "exact" }}
              className="ml-4 py-2 px-4 bg-red-100 rounded"
            >
              {invoice.paid_amount || invoice.paid_amount === 0
                ? invoice.paid_amount
                : invoice.total}
            </span>
          </p>
          <p className="mx-1">
            Remaining Amount
            <span
              style={{ printColorAdjust: "exact" }}
              className="ml-4 py-2 px-4 bg-red-100 rounded"
            >
              {invoice.remaining_amount ? invoice.remaining_amount : 0}
            </span>
          </p>
          <p className="mx-1">
            Payment Method
            <span
              style={{ printColorAdjust: "exact" }}
              className="ml-4 py-2 px-4 bg-red-100 rounded"
            >
              {invoice.payment_method ? invoice.payment_method : "-"}
            </span>
          </p>
        </div>

        <div className=" mt-5">
          <h3
            style={{ printColorAdjust: "exact" }}
            className="font-bold text-xl p-1 bg-red-100 mb-4"
          >
            Other Comments
          </h3>

          <p className="text-left">
            {!invoice.other ? "No Comment." : invoice.other}
          </p>
        </div>

        <div className="relative min-h-[200px] flex items-center justify-center my-10">
          <img
            className="absolute left-10 top-5 z-10 max-h-[100%] w-[200px] print:w-[130px]  mx-auto"
            src={stamp}
            alt="stamp"
          />

          <div>
            <p>
              If you have any questions about this invoice, please contact us.
            </p>

            <p className="font-bold text-lg">Thank You For Your Business!</p>
          </div>
        </div>
      </div>
    </>
  );
};
