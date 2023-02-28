import { TiDelete } from "react-icons/ti";
import FormButton from "../shared/FormButton";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { tableHeaderTitles } from "./constants";
import { IInvoiceDocument } from "../../../../backend/models/invoiceModel";
import { TableRowProps } from "../shared/PaginationTable";
import { invoiceHeaderTitles } from "../invoice/constants";
import { IProduct } from "../../../../backend/models/invoiceModel";

//Define table data
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
    <th scope="col" className="border-x border-x-black p-1 text-center">
      م
    </th>
  </tr>
);

export const tableRow = ({
  basicOptions,
  extraOptions,
}: TableRowProps<IInvoiceDocument>) => {
  const { item: invoice, index, tableBodyData } = basicOptions;
  const { isDeleting, handleRemoving } = extraOptions;
  return (
    <tr
      key={invoice?.id}
      className={`${
        index % 2 === 0 ? "bg-white" : "bg-gray-100"
      } border-b border-b-black`}
    >
      {/* Delete Invoice */}
      <th
        scope="row"
        className="whitespace-nowrap border-x border-x-black  p-2 text-center text-gray-900"
      >
        <form
          className="m-auto max-w-[150px]"
          onSubmit={(event) => handleRemoving(event, invoice?.id)}
        >
          <FormButton
            bgColor={["bg-red-600", "bg-red-700", "bg-red-800"]}
            icon={<TiDelete className="mb-[-2px]" size={25} />}
            isLoading={isDeleting}
          />
        </form>
      </th>

      {/* Show Invoice */}
      <th
        scope="row"
        className="whitespace-nowrap border-x border-x-black  p-2 text-center text-gray-900"
      >
        <Link
          to={`/invoices/${invoice?.id}`}
          state={{ invoice }}
          className="m-auto max-w-[150px] rounded bg-blue-800 px-3 py-2 text-white shadow-sm"
        >
          عرض الفاتورة
        </Link>
      </th>

      {/*Invoice Date*/}
      <th
        scope="row"
        className="whitespace-nowrap  border-x border-x-black  p-2 text-center text-gray-900"
      >
        {invoice?.date ? dayjs(invoice?.date).format("DD/MM/YYYY") : "-"}
      </th>

      {/*Invoice Total*/}
      <th
        scope="row"
        className="whitespace-nowrap  border-x border-x-black  p-2 text-center text-gray-900"
      >
        {invoice?.total ? invoice.total : invoice?.details?.[0]?.price}
      </th>

      {/*Invoice ID*/}
      <th
        scope="row"
        className="whitespace-nowrap  border-x border-x-black  p-2 text-center text-gray-900"
      >
        {invoice?.date
          ? dayjs(invoice?.date).format(
              `YYYYMMDD-${dayjs(invoice?.createdAt as string).hour()}`
            )
          : dayjs(invoice?.createdAt as string).format(
              `YYYYMMDD-${dayjs(invoice?.createdAt as string).hour()}`
            )}
      </th>

      {/*Customer Name*/}
      <th
        scope="row"
        className="whitespace-nowrap  border-x border-x-black  p-2 text-center text-gray-900"
      >
        {invoice?.customer?.name ? invoice.customer.name : "-"}
      </th>

      {/*Invoice NO*/}
      <th
        scope="row"
        className="text-gray-90  border-x border-x-black p-1 text-center"
      >
        {tableBodyData?.findIndex(
          (p: IInvoiceDocument) => p.id === invoice?.id
        ) + 1}
      </th>
    </tr>
  );
};

//Define invoice table data
export const invoiceTableHeader = (
  <tr className="border-b border-b-black">
    {invoiceHeaderTitles.map((title: string) => (
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

export const invoiceTableRow = (detail: IProduct, index: number) => {
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
        className="whitespace-nowrap  border-x border-x-black  p-2  text-center text-gray-900"
      >
        {index + 1}
      </th>

      {/*Description*/}
      <th
        scope="row"
        className="whitespace-nowrap  border-x border-x-black  p-2  text-center text-gray-900"
      >
        {detail.name ? detail.name : "-"}
      </th>

      {/*Quantity*/}
      <th
        scope="row"
        className="whitespace-nowrap  border-x border-x-black  p-2  text-center text-gray-900"
      >
        {detail.quantity}
      </th>

      {/*Price*/}
      <th
        scope="row"
        className="whitespace-nowrap  border-x border-x-black  p-2  text-center text-gray-900"
      >
        {detail.price}
      </th>

      {/*Total*/}
      <th
        scope="row"
        className="whitespace-nowrap  border-x border-x-black  p-2  text-center text-gray-900"
      >
        {detail.price * detail.quantity}
      </th>
    </tr>
  );
};
