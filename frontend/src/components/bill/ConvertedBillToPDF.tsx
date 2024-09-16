import dayjs from "dayjs";
import logo from "../../assets/imgs/trans-logo.png";
import stamp from "../../assets/imgs/trans-border-stamp.png";
import {
  billPassportTableHeader,
  billPassportTableRows,
  billTableRow,
  calculateTableTotals,
} from "./Table";
import {
  IBillDocument,
  IBillProduct,
} from "../../../../backend/models/billModel";
import { comapanyInfos } from "./constants";
import { Fragment } from "react";

interface ConvertedBillToPDFProps {
  bill: IBillDocument;
}

export default function ConvertedBillToPDF({ bill }: ConvertedBillToPDFProps) {
  const { totalAmount, totalServices, TotalVAT } = calculateTableTotals(
    bill.details
  );

  const TotalsRow = (
    <tr className="border-b bg-white font-bold">
      <td></td>
      <td></td>

      {/*Total Services Prices*/}
      <th
        scope="row"
        className="border-x bg-red-100 p-2 text-center text-sm text-gray-900"
      >
        {totalServices.toFixed(2)}
      </th>

      <td></td>

      {/*Total Discount*/}
      <th
        scope="row"
        className="border-x bg-red-100 p-2 text-center text-sm text-gray-900"
      >
        {"0.00"}
      </th>

      {/*Total VAT*/}
      <th
        scope="row"
        className="border-x bg-red-100 p-2 text-center text-sm text-gray-900"
      >
        {TotalVAT.toFixed(2)}
      </th>

      {/*Total Sales (Amount)*/}
      <th
        scope="row"
        className="border-x bg-red-100 p-2 text-center text-sm text-gray-900"
      >
        {totalAmount.toFixed(2)}
      </th>
    </tr>
  );

  return (
    <div
      id="showBill"
      className="mx-auto h-full min-h-[100vh] w-full overflow-x-auto p-10 print:my-0 print:flex print:min-h-screen print:flex-col print:justify-between print:border-none print:shadow-none"
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
          <p className="mb-2 text-3xl font-bold text-blue-400">TAX INVOICE</p>

          <p className="my-4 text-sm">
            DATE{" "}
            <span className="rounded-sm bg-red-100 p-1">
              {bill?.date ? dayjs(bill.date).format("DD/MM/YYYY") : "-"}
            </span>
          </p>
          <p className="my-4 text-sm">
            INVOICE #{" "}
            <span className="rounded-sm bg-red-100 p-1">[{bill.ID}]</span>
          </p>
        </div>
      </div>

      <div className=" mt-5">
        <h2 className="mb-4 flex items-center justify-center bg-red-100 p-1 text-xl font-bold">
          Bill To
        </h2>

        <p className="text-left">
          Name:- {bill?.customer?.name ? bill.customer.name : "-"}
        </p>
        <p className="text-left">Mobile:- {"-"}</p>
      </div>

      <div>
        <div className="relative my-10 overflow-x-auto rounded border-y-4 border-red-800 shadow-md sm:rounded-lg">
          <table className="w-full text-sm font-bold text-gray-500">
            <thead className="bg-red-100 uppercase text-gray-900">
              {billPassportTableHeader}
            </thead>
            <tbody>
              {bill.details.map((detail: IBillProduct, index: number) => (
                <Fragment key={index}>
                  {detail.type === "Passport"
                    ? billPassportTableRows(detail, index)
                    : billTableRow(detail, index)}
                </Fragment>
              ))}

              {TotalsRow}
            </tbody>
          </table>
        </div>
      </div>

      <div className="my-10 flex items-center justify-center gap-3 text-left font-semibold">
        <p className="mx-1">
          Paid Amount
          <span className="ml-4 rounded bg-red-100 py-2 px-4">
            {bill?.total}
          </span>
        </p>
        <p className="mx-1">
          Remaining Amount
          <span className="ml-4 rounded bg-red-100 py-2 px-4">
            {bill?.remaining_amount ? bill.remaining_amount : 0}
          </span>
        </p>
        <p className="mx-1">
          Payment Method
          <span className="ml-4 rounded bg-red-100 py-2 px-4">
            {bill?.payment_method
              ? bill.payment_method.charAt(0).toUpperCase() +
                bill.payment_method.slice(1)
              : "-"}
          </span>
        </p>
      </div>

      <div className=" mt-5">
        <h3 className="mb-4 bg-red-100 p-1 text-xl font-bold">
          Other Comments
        </h3>

        <p className="text-left">{!bill?.other ? "No Comment." : bill.other}</p>
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
  );
}
