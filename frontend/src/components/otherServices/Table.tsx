import dayjs from "dayjs";
import { tableHeaderTitles } from "./constants";
import { TableRowProps } from "../shared/PaginationTable";
import { IOtherService } from "../../state/features/otherService/otherServiceApiSlice";
import { Link } from "react-router-dom";

//Define OtherService Main Table Data
export const tableHeader = (
  <tr className="border-y border-y-black">
    {tableHeaderTitles.reverse().map((title) => (
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

  return (
    <tr
      key={otherService?.id}
      className={`${
        index % 2 === 0 ? "bg-white" : "bg-gray-100"
      } border-b border-b-black`}
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
        className="border-x  border-x-black bg-red-200 p-1 text-center text-gray-900"
      >
        {otherService?.bill_customer_name || "-"}
      </th>

      {/*Bill ID*/}
      <th
        scope="row"
        className="border-x  border-x-black bg-green-200 p-1 text-center text-gray-900"
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
