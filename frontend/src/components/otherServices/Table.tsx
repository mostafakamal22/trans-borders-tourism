import dayjs from "dayjs";
import { tableHeaderTitles } from "./constants";
import { TableRowProps } from "../shared/PaginationTable";
import { IOtherService } from "../../state/features/otherService/otherServiceApiSlice";
import { Link } from "react-router-dom";

//Define OtherService Main Table Data
export const tableHeader = (
  <tr className="border-y border-y-black">
    {[...tableHeaderTitles.reverse()].map((title) => (
      <th
        key={title}
        scope="col"
        className="border-x border-x-black px-3 py-3 text-center"
      >
        {title}
      </th>
    ))}
  </tr>
);

export const tableRow = ({ basicOptions }: TableRowProps<IOtherService>) => {
  const { item: otherService, index, tableBodyData } = basicOptions;

  const total = otherService.price * otherService.quantity;
  // Generate background color based on bill ID
  const getBillIdBgColor = (billId: number | null): string => {
    if (!billId) return index % 2 === 0 ? "bg-white" : "bg-gray-100";

    const colors = [
      "bg-blue-200",
      "bg-green-300",
      "bg-yellow-300",
      "bg-purple-200",
      "bg-pink-300",
      "bg-red-200",
      "bg-orange-300",
      "bg-teal-300",
      "bg-cyan-200",
      "bg-rose-300",
    ];

    return colors[billId % colors.length];
  };

  return (
    <tr
      key={`${otherService?.id}-${index}`}
      className={`${getBillIdBgColor(
        otherService?.bill_id,
      )} border-b border-b-black`}
    >
      {/*OtherService Date*/}
      <th
        scope="row"
        className="whitespace-nowrap border-x  border-x-black p-2 text-center  text-gray-900 "
      >
        {otherService?.date
          ? dayjs(otherService?.date).format("DD/MM/YYYY")
          : "-"}
      </th>

      {/*OtherService Total*/}
      <th
        scope="row"
        className="whitespace-nowrap border-x  border-x-black p-2 text-center  text-gray-900"
      >
        {total.toFixed(2)}
      </th>

      {/*OtherService quantity*/}
      <th
        scope="row"
        className="whitespace-nowrap border-x  border-x-black p-2 text-center  text-gray-900"
      >
        {otherService?.quantity || "-"}
      </th>

      {/*OtherService price*/}
      <th
        scope="row"
        className="whitespace-nowrap border-x  border-x-black p-2 text-center  text-gray-900"
      >
        {otherService?.price || "-"}
      </th>

      {/*OtherService description*/}
      <th
        scope="row"
        className="whitespace-nowrap border-x  border-x-black p-2 text-center  text-gray-900"
      >
        {otherService?.desc || "-"}
      </th>

      {/*Customer Name*/}
      <th
        scope="row"
        className="border-x  border-x-black p-1 text-center text-gray-900"
      >
        {otherService?.bill_customer_name || "-"}
      </th>

      {/*Bill ID*/}
      <th
        scope="row"
        className="border-x  border-x-black p-1 text-center text-gray-900"
      >
        {otherService?.bill_id ? (
          <Link to={`/bills/${otherService.bill_id}`}>
            {otherService?.bill_id}
          </Link>
        ) : (
          "-"
        )}
      </th>

      {/*passport NO*/}
      <th
        scope="row"
        className="text-gray-90  border-x border-x-black p-1 text-center"
      >
        {tableBodyData.findIndex(
          (o: IOtherService) => o.id === otherService?.id,
        ) + 1}
      </th>
    </tr>
  );
};
