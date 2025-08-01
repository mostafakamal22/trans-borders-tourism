import { ITicketDocument } from "../../../../backend/models/ticketModel";
import { TableRowProps } from "../shared/PaginationTable";
import { creditStates, ticketsTableHeaderTitles } from "./constants";
import { AiFillEdit } from "react-icons/ai";
import { TiDelete } from "react-icons/ti";
import { paymentMethods } from "../payment/constants";
import { PaymentMethods } from "../payment/types";
import { Link } from "react-router-dom";
import FormButton from "../shared/FormButton";
import dayjs from "dayjs";

//Define table data
export const tableHeader = (
  <tr className="border-y border-y-black">
    {[...ticketsTableHeaderTitles]
      .slice(8)
      .reverse()
      .map((title) => (
        <th
          key={title}
          scope="col"
          className="max-w-[100px] border-x border-x-black p-1 text-center"
        >
          {title}
        </th>
      ))}

    {[...creditStates].map((title) => (
      <th
        key={title}
        scope="col"
        className="max-w-[100px] border-x border-x-black p-1 text-center"
      >
        {title}
      </th>
    ))}

    {[...ticketsTableHeaderTitles]
      .slice(0, 8)
      .reverse()
      .map((title) => (
        <th
          key={title}
          scope="col"
          className="max-w-[100px] border-x border-x-black p-1 text-center"
        >
          {title}
        </th>
      ))}
    <th scope="col" className="border-x border-x-black p-1 text-center">
      رقم الفاتورة
    </th>
    <th scope="col" className="border-x border-x-black p-1 text-center">
      م
    </th>
  </tr>
);

export const tableRow = ({
  basicOptions,
  extraOptions,
}: TableRowProps<ITicketDocument & { bill_id: number | null }>) => {
  const { item: ticket, index, tableBodyData } = basicOptions;
  const {
    handleRemoving,
    // handleAddInvoice,
    // isCreatingInvoice,
    isDeleting,
    setId,
    setIsOpen,
  } = extraOptions;

  const cutoffDate = dayjs("2025-05-01");

  const isTicketBefore1May2025 = dayjs(ticket?.payment_date).isBefore(
    cutoffDate
  );

  const tax = !isTicketBefore1May2025
    ? // calculateTicketTax({
      //     sales: ticket.sales,
      //     cost: ticket.cost,
      //   })
      ticket?.taxable || 0
    : 0;

  return (
    <tr
      key={ticket?.id}
      className={`${
        index % 2 === 0 ? "bg-white" : "bg-gray-100"
      } border-b border-b-black`}
    >
      {/* Delete ticket */}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        <form
          className="m-auto max-w-[150px]"
          onSubmit={(event) => handleRemoving(event, ticket?.id)}
        >
          <FormButton
            bgColor={["bg-red-600", "bg-red-700", "bg-red-800"]}
            icon={<TiDelete size={20} />}
            isLoading={isDeleting}
          />
        </form>
      </th>

      {/* Make Invoice */}
      {/* <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        <form
          className="m-auto max-w-[150px]"
          onSubmit={(event) => handleAddInvoice?.(event, ticket)}
        >
          <FormButton
            bgColor={["bg-orange-600", "bg-orange-700", "bg-orange-800"]}
            icon={<AiFillFileAdd size={20} />}
            isLoading={isCreatingInvoice}
          />
        </form>
      </th> */}

      {/* Update ticket */}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        <button
          className="flex w-full items-center justify-center rounded border border-transparent bg-blue-800 px-3 py-2.5 text-xs font-bold text-white transition-all duration-300 ease-in-out
            hover:border-blue-800 hover:bg-white hover:text-blue-800"
          onClick={() => {
            setId?.(ticket?.id);
            setIsOpen?.(true);
          }}
        >
          <AiFillEdit size={20} />
        </button>
      </th>

      {/*Payment Date*/}
      <th
        scope="row"
        className="border-x  border-x-black p-1 text-center text-gray-900"
      >
        {!ticket?.payment_date
          ? "-"
          : dayjs(ticket?.payment_date).format("DD/MM/YYYY")}
      </th>

      {/*Supplier*/}
      <th
        scope="row"
        className="border-x  border-x-black  p-1 text-center text-gray-900"
      >
        {ticket?.supplier ? ticket?.supplier : "-"}
      </th>

      {/*Paid Amount*/}
      <th
        scope="row"
        className="border-x  border-x-black  p-1 text-center text-gray-900"
      >
        {ticket?.paid_amount}
      </th>

      {/*Remaining Amount*/}
      <th
        scope="row"
        className="border-x  border-x-black  p-1 text-center text-gray-900"
      >
        {ticket?.remaining_amount}
      </th>

      {/*Payment Method*/}
      <th
        scope="row"
        className="border-x  border-x-black  p-1 text-center text-gray-900"
      >
        {ticket?.payment_method
          ? paymentMethods[ticket?.payment_method as keyof PaymentMethods]
          : "-"}
      </th>

      {/*Profit*/}
      <th
        scope="row"
        className="border-x  border-x-black  p-1 text-center text-gray-900"
      >
        {ticket?.profit}
      </th>

      {/*Sales*/}
      <th
        scope="row"
        className="border-x  border-x-black  p-1 text-center text-gray-900"
      >
        {ticket?.sales}
      </th>

      {/*Taxable*/}
      <th
        scope="row"
        className="border-x  border-x-black  p-1 text-center text-gray-900"
      >
        {tax}
      </th>

      {/*Total*/}
      <th
        scope="row"
        className="border-x  border-x-black  p-1 text-center text-gray-900"
      >
        {ticket?.total || 0}
      </th>

      {/*Cost*/}
      <th
        scope="row"
        className="border-x  border-x-black  p-1 text-center text-gray-900"
      >
        {ticket?.cost}
      </th>

      {/*Employee*/}
      <th
        scope="row"
        className="border-x  border-x-black  p-1 text-center text-gray-900"
      >
        {ticket?.employee ? ticket.employee : "-"}
      </th>

      {/*Type*/}
      <th
        scope="row"
        className="border-x  border-x-black  p-1 text-center text-gray-900"
      >
        {ticket?.type ? ticket.type : "-"}
      </th>

      {/*Customer Name*/}
      <th
        scope="row"
        className="border-x  border-x-black bg-red-200 p-1 text-center text-gray-900"
      >
        {ticket?.customer_name ? ticket.customer_name : "-"}
      </th>

      {/*Bill ID*/}
      <th
        scope="row"
        className="border-x  border-x-black bg-green-200 p-1 text-center text-gray-900"
      >
        {ticket?.bill_id ? (
          <Link to={`/bills/${ticket.bill_id}`}>{ticket?.bill_id}</Link>
        ) : (
          "-"
        )}
      </th>

      {/*ticket NO*/}
      <th
        scope="row"
        className="text-gray-90  border-x border-x-black p-1 text-center"
      >
        {tableBodyData.findIndex((t) => t.id === ticket?.id) + 1}
      </th>
    </tr>
  );
};

// export const calculateTicketTax = (ticket: ITicketDocument): string => {
//   const tax = ticket?.sales - (ticket?.total || 0);

//   return tax.toFixed(2);
// };
