import { useSearchParams } from "react-router-dom";
import Pagination from "./Pagination";
import React, { ReactNode, forwardRef } from "react";
import { ListResponse } from "../../state/features/passport/passportsApiSlice";
import { Document } from "mongoose";

export type TableRowProps<T> = {
  basicOptions: {
    item: T;
    index: number;
    tableBodyData: T[];
  };
  extraOptions: {
    handleRemoving: (...args: any) => void;
    handleAddInvoice?: (...args: any) => void;
    setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
    setId?: React.Dispatch<React.SetStateAction<string>>;
    isDeleting?: boolean;
    isCreatingInvoice?: boolean;
  };
};
export interface PaginationTableProps {
  tableHeader: ReactNode;
  tableRow: (props: TableRowProps<any>) => JSX.Element;
  tableBodyData: Document[];
  options: ListResponse<Document>;
  handleRemoving: (...args: any) => void;
  handleAddInvoice?: (...args: any) => void;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setId?: React.Dispatch<React.SetStateAction<string>>;
  isDeleting?: boolean;
  isCreatingInvoice?: boolean;
}

export const PaginationTable = forwardRef<
  HTMLTableElement,
  PaginationTableProps
>(
  (
    {
      tableHeader,
      tableBodyData,
      tableRow,
      options,
      handleRemoving,
      handleAddInvoice,
      setIsOpen,
      setId,
      isDeleting,
      isCreatingInvoice,
    },
    ref
  ) => {
    const [_, setSearchParams] = useSearchParams({ page: "1" });
    // const page = +searchParams.get("page")!;

    // const { slice, range } = useTable(tableBodyData, page, rowsPerPage);

    return (
      <div
        id="table"
        className="my-5 overflow-x-auto rounded border-y-4 border-red-800 py-5 shadow-md scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 scrollbar-corner-slate-700 scrollbar-track-rounded-full sm:rounded-lg"
      >
        <table
          id="excel-table"
          ref={ref}
          className="w-full text-xs text-gray-500"
        >
          <thead className="bg-blue-300 uppercase text-gray-900">
            {tableHeader}
          </thead>
          <tbody>
            {tableBodyData.map((item, index) =>
              tableRow({
                basicOptions: { item, index, tableBodyData },
                extraOptions: {
                  handleRemoving,
                  isDeleting,
                  handleAddInvoice,
                  setIsOpen,
                  setId,
                  isCreatingInvoice,
                },
              })
            )}
          </tbody>
        </table>

        <Pagination
          options={options}
          slice={tableBodyData}
          setPage={setSearchParams as () => void}
        />
      </div>
    );
  }
);
