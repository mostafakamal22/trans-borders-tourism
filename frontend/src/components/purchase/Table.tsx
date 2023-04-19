import { TiDelete } from "react-icons/ti";
import FormButton from "../shared/FormButton";
import { TableRowProps } from "../shared/PaginationTable";
import { purchaseTableHeaderTitles } from "./constants";
import { Link } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import {
  IPurchaseDocument,
  IPurchaseType,
} from "../../../../backend/models/purchaseModel";
import dayjs from "dayjs";

//Define table data
export const tableHeader = (
  <tr className="border-y border-y-black">
    {purchaseTableHeaderTitles.map((title) => (
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
}: TableRowProps<IPurchaseDocument>) => {
  const { item: purchase, index, tableBodyData } = basicOptions;
  const {
    handleRemoving,

    isDeleting,
    setId,
    setIsOpen,
  } = extraOptions;

  return (
    <tr
      key={purchase?.id}
      className={`${
        index % 2 === 0 ? "bg-white" : "bg-gray-100"
      } border-b border-b-black`}
    >
      {/* Delete Purchase */}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        <form
          className="m-auto max-w-[150px]"
          onSubmit={(event) => handleRemoving(event, purchase?.id)}
        >
          <FormButton
            bgColor={["bg-red-600", "bg-red-700", "bg-red-800"]}
            icon={<TiDelete size={20} />}
            isLoading={isDeleting}
          />
        </form>
      </th>

      {/* Payment Voucher */}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        <Link
          to={`/purchases/${purchase?.id}`}
          className="inline-flex items-center rounded border border-transparent bg-orange-800 px-2 py-2 text-xs font-bold text-white transition-all duration-300 ease-in-out
             hover:border-orange-800 hover:bg-white hover:text-orange-800"
        >
          سند الصرف
        </Link>
      </th>

      {/*Update Purchase*/}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        <button
          className="flex w-full items-center justify-center rounded border border-transparent bg-blue-800 px-3 py-2.5 text-xs font-bold text-white transition-all duration-300 ease-in-out
            hover:border-blue-800 hover:bg-white hover:text-blue-800"
          onClick={() => {
            setId?.(purchase?.id);
            setIsOpen?.(true);
          }}
        >
          <AiFillEdit size={20} />
        </button>
      </th>

      {/*Purchase Total*/}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        {purchase?.total}
      </th>

      {/*Purchase Tax*/}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        {purchase.purchase_types.map((type: IPurchaseType, index: number) => (
          <span key={index}>
            <span>{type?.tax ? type.tax : "-"}</span>
          </span>
        ))}
      </th>

      {/*Purchase Subtotal*/}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        {purchase.purchase_types.map((type: IPurchaseType, index: number) => (
          <span key={index}>
            <span>{type?.total ? type?.total : "-"}</span>
          </span>
        ))}
      </th>

      {/*Purchase Supplier*/}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        {purchase.purchase_types.map((type: IPurchaseType, index: number) => (
          <span
            key={index}
            className="my-1 flex flex-row-reverse items-center justify-center gap-1 rounded bg-purple-400 p-1"
          >
            <span>{type?.supplier ? type.supplier : "-"}</span>
          </span>
        ))}
      </th>

      {/*Purchase Description*/}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        {purchase.purchase_types.map((type: IPurchaseType, index: number) => (
          <span
            key={index}
            className="my-1 flex flex-row-reverse items-center justify-center gap-1 rounded bg-purple-400 p-1"
          >
            <span>{type?.description ? type.description : "-"}</span>
          </span>
        ))}
      </th>

      {/*Purchase Types*/}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        {purchase.purchase_types.map((type: IPurchaseType, index: number) => (
          <span
            key={index}
            className="my-1 flex flex-row-reverse items-center justify-center gap-1 rounded bg-amber-400 p-1"
          >
            {type?.name}
          </span>
        ))}
      </th>

      {/*Purchase Date*/}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        {dayjs(purchase?.date).format("DD/MM/YYYY")}
      </th>

      {/*Purchase NO*/}
      <th
        scope="row"
        className="text-gray-90  border-x border-x-black p-1 text-center"
      >
        {tableBodyData.findIndex((t) => t.id === purchase?.id) + 1}
      </th>
    </tr>
  );
};
