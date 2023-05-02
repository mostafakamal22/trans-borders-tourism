import { TiDelete } from "react-icons/ti";
import {
  IPaymentDocument,
  IPaymentType,
} from "../../../../backend/models/paymentModel";
import FormButton from "../shared/FormButton";
import { TableRowProps } from "../shared/PaginationTable";
import {
  paymentMethods,
  paymentTableHeaderTitles,
  paymentTypes,
} from "./constants";
import { AiFillEdit } from "react-icons/ai";
import { PaymentMethods, PaymentTypes } from "./types";
import dayjs from "dayjs";

//Define table data
export const tableHeader = (
  <tr className="border-y border-y-black">
    {paymentTableHeaderTitles.map((title) => (
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
}: TableRowProps<IPaymentDocument>) => {
  const { item: payment, index, tableBodyData } = basicOptions;
  const { handleRemoving, isDeleting, setId, setIsOpen } = extraOptions;

  return (
    <tr
      key={payment?.id}
      className={`${
        index % 2 === 0 ? "bg-white" : "bg-gray-100"
      } border-b border-b-black`}
    >
      {/* Delete Payment */}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        <form
          className="m-auto max-w-[150px]"
          onSubmit={(event) => handleRemoving(event, payment?.id)}
        >
          <FormButton
            bgColor={["bg-red-600", "bg-red-700", "bg-red-800"]}
            icon={<TiDelete size={20} />}
            isLoading={isDeleting}
          />
        </form>
      </th>

      {/*Update Payment*/}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        <button
          className="flex w-full items-center justify-center rounded border border-transparent bg-blue-800 px-3 py-2.5 text-xs font-bold text-white transition-all duration-300 ease-in-out
            hover:border-blue-800 hover:bg-white hover:text-blue-800"
          onClick={() => {
            setId?.(payment?.id);
            setIsOpen?.(true);
          }}
        >
          <AiFillEdit size={20} />
        </button>
      </th>

      {/*Payment Total*/}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        {payment?.total}
      </th>

      {/*Payment Tax*/}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        {payment.payment_types.map((type: IPaymentType, index: number) => (
          <span
            key={index}
            className="my-1 flex flex-row-reverse items-center justify-center gap-1 rounded"
          >
            <span>{type?.tax ? type.tax : "-"}</span>
          </span>
        ))}
      </th>

      {/*Payment Subtotal*/}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        {payment.payment_types.map((type: IPaymentType, index: number) => (
          <span
            key={index}
            className="my-1 flex flex-row-reverse items-center justify-center gap-1 rounded"
          >
            <span>{type?.cost ? type?.cost : "-"}</span>
          </span>
        ))}
      </th>

      {/*Payment Description*/}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        {payment?.payment_types?.map((type: IPaymentType, index: number) => (
          <span
            key={index}
            className="my-1 flex flex-row-reverse items-center justify-center gap-1 p-1"
          >
            <span>{type?.description ? type.description : "-"}</span>
          </span>
        ))}
      </th>

      {/*Payment Method*/}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        {payment?.payment_types?.map((type: IPaymentType, index: number) => (
          <span
            key={index}
            className="my-1 flex flex-row-reverse items-center justify-center gap-1 bg-teal-400 p-1"
          >
            <span>{paymentMethods[type?.method as keyof PaymentMethods]}</span>
          </span>
        ))}
      </th>

      {/*Payment Types*/}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        {payment?.payment_types?.map((type: IPaymentType, index: number) => (
          <span
            key={index}
            className="my-1 flex flex-row-reverse items-center justify-center gap-1 rounded bg-amber-400 p-1"
          >
            <span>{paymentTypes[type?.name as keyof PaymentTypes]}</span>
          </span>
        ))}
      </th>

      {/*Payment Date*/}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        {dayjs(payment?.date).format("DD/MM/YYYY")}
      </th>

      {/*Payment NO*/}
      <th
        scope="row"
        className="text-gray-90  border-x border-x-black p-1 text-center"
      >
        {tableBodyData.findIndex((t) => t.id === payment?.id) + 1}
      </th>
    </tr>
  );
};
