import { TiDelete } from "react-icons/ti";
import FormButton from "../shared/FormButton";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { billPassportHeaderTitles, tableHeaderTitles } from "./constants";
import { IBillDocument } from "../../../../backend/models/billModel";
import { TableRowProps } from "../shared/PaginationTable";
import { billHeaderTitles } from "../bill/constants";
import { IBillProduct } from "../../../../backend/models/billModel";
import { Fragment } from "react";

//Define Bill Main Table Data
export const tableHeader = (
  <tr className="border-y border-y-black">
    {tableHeaderTitles.map((title) => (
      <th
        key={title}
        scope="col"
        className="border-x border-x-black py-3 px-3 text-center"
      >
        {title}
      </th>
    ))}
    <th scope="col" className="border-x border-x-black p-2 text-center">
      م
    </th>
  </tr>
);

export const tableRow = ({
  basicOptions,
  extraOptions,
}: TableRowProps<IBillDocument>) => {
  const { item: bill, index, tableBodyData } = basicOptions;
  const { isDeleting, handleRemoving } = extraOptions;

  return (
    <tr
      key={bill?.id}
      className={`${
        index % 2 === 0 ? "bg-white" : "bg-gray-100"
      } border-b border-b-black`}
    >
      {/* Delete Bill */}
      <th
        scope="row"
        className="whitespace-nowrap border-x   border-x-black p-2 text-center  text-gray-900"
      >
        <form
          className="m-auto max-w-[150px]"
          onSubmit={(event) => handleRemoving(event, bill?.id)}
        >
          <FormButton
            bgColor={["bg-red-600", "bg-red-700", "bg-red-800"]}
            icon={<TiDelete className="mb-[-2px]" size={25} />}
            isLoading={isDeleting}
          />
        </form>
      </th>

      {/* Show Bill */}
      <th
        scope="row"
        className="whitespace-nowrap border-x  border-x-black p-2 text-center  text-gray-900"
      >
        <Link
          to={`/bills/${bill?.id}`}
          state={{ bill }}
          className="m-auto max-w-[150px] rounded bg-blue-800 px-3 py-2 text-white shadow-sm"
        >
          عرض الفاتورة
        </Link>
      </th>

      {/* Edit Bill */}
      <th
        scope="row"
        className="whitespace-nowrap border-x  border-x-black p-2 text-center  text-gray-900"
      >
        <Link
          to={`/bills/${bill?.id}`}
          state={{ bill }}
          className="m-auto max-w-[150px] rounded bg-blue-800 px-3 py-2 text-white shadow-sm"
        >
          عرض الفاتورة
        </Link>
      </th>

      {/*Bill Date*/}
      <th
        scope="row"
        className="whitespace-nowrap border-x  border-x-black p-2 text-center  text-gray-900 "
      >
        {bill?.date ? dayjs(bill?.date).format("DD/MM/YYYY") : "-"}
      </th>

      {/*Bill Total*/}
      <th
        scope="row"
        className="whitespace-nowrap border-x  border-x-black p-2 text-center  text-gray-900"
      >
        {bill.total}
      </th>

      {/*Bill ID*/}
      <th
        scope="row"
        className="whitespace-nowrap border-x  border-x-black p-2 text-center  text-gray-900"
      >
        {bill.ID}
      </th>

      {/*Customer Name*/}
      <th
        scope="row"
        className="whitespace-nowrap border-x  border-x-black p-2 text-center  text-gray-900"
      >
        {bill.customer.name}
      </th>

      {/*Bill NO*/}
      <th
        scope="row"
        className="text-gray-90  border-x border-x-black p-2 text-center"
      >
        {tableBodyData?.findIndex((p: IBillDocument) => p.id === bill?.id) + 1}
      </th>
    </tr>
  );
};

//Define Normal Bill Table Data
export const billTableHeader = (
  <tr className="border-b border-b-black">
    {billHeaderTitles.map((title: string) => (
      <th
        key={title}
        scope="col"
        className="border-x border-x-black py-3 px-3 text-center"
      >
        {title}
      </th>
    ))}
  </tr>
);

export const billTableRow = (detail: IBillProduct, index: number) => {
  return (
    <tr
      key={index}
      style={{ printColorAdjust: "exact" }}
      className={`${
        index % 2 === 0 ? "bg-white" : "bg-red-100"
      } border-b border-b-black`}
    >
      {/*Detail NO*/}
      <th
        scope="row"
        className="whitespace-nowrap  border-x border-x-black p-2 text-center text-sm font-normal text-gray-900"
      >
        {index + 1}
      </th>

      {/*Description*/}
      <th
        scope="row"
        className="whitespace-nowrap  border-x border-x-black p-2 text-center text-sm font-normal text-gray-900"
      >
        {detail.desc ? detail.desc : "-"}
      </th>

      {/*Quantity*/}
      <th
        scope="row"
        className="whitespace-nowrap  border-x border-x-black p-2 text-center text-sm font-normal text-gray-900"
      >
        {detail.quantity}
      </th>

      {/*Price*/}
      <th
        scope="row"
        className="whitespace-nowrap  border-x border-x-black p-2 text-center text-sm font-normal text-gray-900"
      >
        {detail.price}
      </th>

      {/*Total*/}
      <th
        scope="row"
        className="whitespace-nowrap  border-x border-x-black p-2 text-center text-sm font-normal text-gray-900"
      >
        {detail.price * detail.quantity}
      </th>
    </tr>
  );
};

//Define Passport Bill Table Data
export const billPassportTableHeader = (
  <tr className="border-b">
    {billPassportHeaderTitles.map((title: string) => (
      <th key={title} scope="col" className="border-x p-2 text-center text-sm">
        {title}
      </th>
    ))}
  </tr>
);

export const billPassportTableRows = (
  detail: IBillProduct,
  // passportSpecialKey: string,
  index: number
) => {
  const sales = detail?.price;
  const servicePrice = detail?.data?.servicePrice;
  const total = ((sales - servicePrice) * 100) / 105;
  const VAT = sales - servicePrice - total;
  const totalServiceCharge = VAT + total;
  const totalServicesPrices = servicePrice + total;

  const passportServiceRow = (
    <tr className="border-b bg-white">
      {/*Service NO*/}
      <th
        scope="row"
        className="border-x p-2 text-center text-sm font-normal text-gray-900"
      >
        {"1"}
      </th>

      {/*Description*/}
      <th
        scope="row"
        className="border-x p-2 text-center text-sm font-normal text-gray-900"
      >
        {detail?.desc ? detail?.desc : "-"}
      </th>

      {/*Service Price*/}
      <th
        scope="row"
        className="border-x p-2 text-center text-sm font-normal text-gray-900"
      >
        {servicePrice.toFixed(2)}
      </th>

      {/*Quantity*/}
      <th
        scope="row"
        className="border-x p-2 text-center text-sm font-normal text-gray-900"
      >
        {detail?.quantity}
      </th>

      {/*Discount*/}
      <th
        scope="row"
        className="border-x p-2 text-center text-sm font-normal text-gray-900"
      >
        {"0.00"}
      </th>

      {/*VAT 5%*/}
      <th
        scope="row"
        className="border-x p-2 text-center text-sm font-normal text-gray-900"
      >
        {"0.00"}
      </th>

      {/*Amount*/}
      <th
        scope="row"
        className="border-x p-2 text-center text-sm font-normal text-gray-900"
      >
        {servicePrice.toFixed(2)}
      </th>
    </tr>
  );

  const serviceChargeRow = (
    <tr className="border-b bg-white">
      {/*Service NO*/}
      <th
        scope="row"
        className="border-x p-2 text-center text-sm font-normal text-gray-900"
      >
        {"2"}
      </th>

      {/*Description*/}
      <th
        scope="row"
        className="border-x p-2 text-center text-sm font-normal text-gray-900"
      >
        {"Service Charge"}
      </th>

      {/*Service Price*/}
      <th
        scope="row"
        className="border-x p-2 text-center text-sm font-normal text-gray-900"
      >
        {total?.toFixed(2)}
      </th>

      {/*Quantity*/}
      <th
        scope="row"
        className="border-x p-2 text-center text-sm font-normal text-gray-900"
      >
        {"1"}
      </th>

      {/*Discount*/}
      <th
        scope="row"
        className="border-x p-2 text-center text-sm font-normal text-gray-900"
      >
        {"0.00"}
      </th>

      {/*VAT 5%*/}
      <th
        scope="row"
        className="border-x p-2 text-center text-sm font-normal text-gray-900"
      >
        {VAT.toFixed(2)}
      </th>

      {/*Amount*/}
      <th
        scope="row"
        className="border-x p-2 text-center text-sm font-normal text-gray-900"
      >
        {totalServiceCharge.toFixed(2)}
      </th>
    </tr>
  );

  const TotalsRow = (
    <tr className="border-b bg-white font-bold">
      <td></td>
      <td></td>

      {/*Total Services Prices*/}
      <th
        style={{ printColorAdjust: "exact" }}
        scope="row"
        className="border-x bg-red-100 p-2 text-center text-sm text-gray-900"
      >
        {totalServicesPrices.toFixed(2)}
      </th>

      <td></td>

      {/*Total Discount*/}
      <th
        style={{ printColorAdjust: "exact" }}
        scope="row"
        className="border-x bg-red-100 p-2 text-center text-sm text-gray-900"
      >
        {"0.00"}
      </th>

      {/*Total VAT*/}
      <th
        style={{ printColorAdjust: "exact" }}
        scope="row"
        className="border-x bg-red-100 p-2 text-center text-sm text-gray-900"
      >
        {VAT.toFixed(2)}
      </th>

      {/*Total Sales (Amount)*/}
      <th
        style={{ printColorAdjust: "exact" }}
        scope="row"
        className="border-x bg-red-100 p-2 text-center text-sm text-gray-900"
      >
        {sales}
      </th>
    </tr>
  );

  return (
    <Fragment key={`${detail?.passport_ref}+${index}`}>
      {passportServiceRow}
      {serviceChargeRow}
      {TotalsRow}
    </Fragment>
  );
};
