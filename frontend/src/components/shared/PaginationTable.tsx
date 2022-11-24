import { useSearchParams } from "react-router-dom";
import Pagination from "./Pagination";
import useTable from "./useTable";

export const PaginationTable = ({
  tableHeader,
  tableBodyData,
  tableRow,
  rowsPerPage,
}: any) => {
  const [searchParams, setSearchParams] = useSearchParams({ page: "1" });
  const page = +searchParams.get("page")!;

  const { slice, range } = useTable(tableBodyData, page, rowsPerPage);
  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg my-10 border-y-4 border-red-800 rounded">
      <table className="w-full text-sm font-bold text-gray-500 ">
        <thead className="text-gray-900 uppercase bg-blue-300">
          {tableHeader}
        </thead>
        <tbody>{slice.map((item, index) => tableRow(item, index))}</tbody>
      </table>

      <Pagination
        range={range}
        slice={slice}
        setPage={setSearchParams}
        page={page}
      />
    </div>
  );
};
