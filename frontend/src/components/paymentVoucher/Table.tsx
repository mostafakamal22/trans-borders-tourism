import { TiDelete } from "react-icons/ti";
import FormButton from "../shared/FormButton";
import { TableRowProps } from "../shared/PaginationTable";
import { paymentVoucherTableHeaderTitles } from "./constants";
import { Link } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import { IPaymentVoucherDocument } from "../../../../backend/models/paymentVoucherModel";
import dayjs from "dayjs";
import { formatID } from "./utils";

//Define table data
export const tableHeader = (
  <tr className="border-y border-y-black">
    {paymentVoucherTableHeaderTitles.map((title) => (
      <th
        key={title}
        scope="col"
        className="max-w-[100px] border-x border-x-black p-1 text-center"
      >
        {title}
      </th>
    ))}
    <th
      scope="col"
      className="max-w-[100px] border-x border-x-black p-1 text-center"
    >
      م
    </th>
  </tr>
);

export const tableRow = ({
  basicOptions,
  extraOptions,
}: TableRowProps<IPaymentVoucherDocument>) => {
  const { item: paymentVoucher, index } = basicOptions;
  const { handleRemoving, isDeleting, setId, setIsOpen } = extraOptions;

  return (
    <tr
      key={paymentVoucher?.id}
      className={`${
        index % 2 === 0 ? "bg-white" : "bg-gray-100"
      } border-b border-b-black`}
    >
      {/* Delete Payment Voucher */}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        <form
          className="m-auto max-w-[150px]"
          onSubmit={(event) => handleRemoving(event, paymentVoucher?.id)}
        >
          <FormButton
            bgColor={["bg-red-600", "bg-red-700", "bg-red-800"]}
            icon={<TiDelete size={20} />}
            isLoading={isDeleting}
          />
        </form>
      </th>

      {/* Show Voucher */}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        <Link
          to={`/paymentVouchers/${paymentVoucher?.id}`}
          className="inline-flex items-center rounded border border-transparent bg-orange-800 px-2 py-2 text-xs font-bold text-white transition-all duration-300 ease-in-out
             hover:border-orange-800 hover:bg-white hover:text-orange-800"
        >
          سند الصرف
        </Link>
      </th>

      {/*Update Payment Voucher*/}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        <button
          className="flex w-full items-center justify-center rounded border border-transparent bg-blue-800 px-3 py-2.5 text-xs font-bold text-white transition-all duration-300 ease-in-out
            hover:border-blue-800 hover:bg-white hover:text-blue-800"
          onClick={() => {
            setId?.(paymentVoucher?.id);
            setIsOpen?.(true);
          }}
        >
          <AiFillEdit size={20} />
        </button>
      </th>

      {/*PaymentVoucher Amount*/}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        {paymentVoucher?.amount}
      </th>

      {/*PaymentVoucher Customer Name*/}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        {paymentVoucher.customer_name}
      </th>

      {/*PaymentVoucher Date*/}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        {dayjs(paymentVoucher?.payment_date).format("DD/MM/YYYY")}
      </th>

      {/*PaymentVoucher NO*/}
      <th
        scope="row"
        className="text-gray-90  border-x border-x-black p-1 text-center"
      >
        {formatID(paymentVoucher.ID)}
      </th>
    </tr>
  );
};
