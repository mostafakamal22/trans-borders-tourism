import { useState } from "react";
import { useEffect } from "react";
import FormButton from "../shared/FormButton";
import MessagesContainer from "../shared/MessagesContainer";
import { TiDelete } from "react-icons/ti";
import { FcSearch } from "react-icons/fc";
import { PaginationTable } from "../shared/PaginationTable";
import {
  useAppDispatch,
  useAppSelector,
} from "../../state/features/hooks/StateHooks";
import { deleteInvoice } from "../../state/features/invoice/invoiceSlice";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { MainSpinner } from "../shared/MainSpinner";

const tableHeaderTitles = [
  "Customer ID",
  "Customer Name",
  "Date",
  "Due Date",
  "Total",
  "Show Invoice",
  "Delete Invoice",
];

export const InvoiceListControl = () => {
  const { info } = useAppSelector((state) => state.adminAuth);
  const { invoiceList } = useAppSelector((state) => state.invoiceData);
  const dispatch = useAppDispatch();

  const { isLoading, isError, isSuccess, message } = useAppSelector(
    (state) => state.invoiceData
  );

  //search query state
  const [searchQuery, setSearchQuery] = useState("");

  //search message state
  const [msg, setMsg] = useState("");

  //   //filtered Invoiceslist
  //   const filteredInvoices =
  //     invoiceList &&
  //     invoiceList.filter((invoice: any) => {
  //       if (
  //         invoice?.customer?.name
  //           .toLowerCase()
  //           .includes(searchQuery.trim().toLowerCase())
  //       ) {
  //         return invoice;
  //       }
  //     });

  // handle Delete Invoice
  const handleRemoving = (e: any, removedInvoiceID: string) => {
    e.preventDefault();

    //get admin token
    const token = info.token;

    //payload (admin token + id of the invoice to delete)
    const invoiceData = {
      id: removedInvoiceID,
      token,
    };

    dispatch(deleteInvoice(invoiceData));
  };

  useEffect(() => {
    if (isError) {
      setMsg(message);
    }

    if (isSuccess && message) {
      setMsg(message);
    }
  }, [isError, message, isSuccess, msg]);

  //Define table data
  const tableHeader = (
    <tr>
      {tableHeaderTitles.map((title) => (
        <th
          key={title}
          scope="col"
          className="py-3 px-3 text-center border-x-2"
        >
          {title}
        </th>
      ))}
    </tr>
  );

  const tableRow = (invoice: any, index: number) => {
    return (
      <tr
        key={invoice._id}
        className={`${index % 2 === 0 ? "bg-white" : "bg-gray-100"} border-b `}
      >
        {/*Customer ID*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x-2 text-center"
        >
          {invoice.customer.ID}
        </th>

        {/*Customer Name*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x-2 text-center"
        >
          {invoice.customer.name}
        </th>

        {/*Invoice Date*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x-2 text-center"
        >
          {dayjs(invoice.date).format("DD/MM/YYYY")}
        </th>

        {/*Invoice Date*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x-2 text-center"
        >
          {dayjs(invoice.due_date).format("DD/MM/YYYY")}
        </th>

        {/*Invoice Total*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x-2 text-center"
        >
          {invoice.total}
        </th>

        {/* Show Invoice */}
        <th
          scope="row"
          className="p-2 text-gray-900 whitespace-nowrap  border-x-2 text-center"
        >
          <Link
            to={`/invoices/${invoice._id}`}
            className="max-w-[150px] m-auto text-white bg-blue-800 rounded shadow-sm px-3 py-2"
          >
            Show
          </Link>
        </th>

        {/* Delete Invoice */}
        <th
          scope="row"
          className="p-2 text-gray-900 whitespace-nowrap  border-x-2 text-center"
        >
          <form
            className="max-w-[150px] m-auto"
            onSubmit={(event) => handleRemoving(event, invoice._id)}
          >
            <FormButton
              text={{ default: "Delete" }}
              bgColor={["bg-red-600", "bg-red-700", "bg-red-800"]}
              icon={<TiDelete className="mb-[-2px]" size={25} />}
            />
          </form>
        </th>
      </tr>
    );
  };

  //   //clean up for usersList status (on mount , unmount)
  //   UseResetStatus(() => {
  //     dispatch(resetUsersStatus());
  //   });

  //   UseResetStatus(() => {
  //     return () => {
  //       dispatch(resetUsersStatus());
  //     };
  //   });

  return (
    <div className="max-w-5xl min-h-[75vh] w-full overflow-x-auto  p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
      <h3 className="text-2xl my-10 p-3 text-center font-bold bg-blue-200 text-gray-900 border-b-4 border-blue-800 rounded shadow">
        Invoices List ({invoiceList && invoiceList.length})
      </h3>

      {/*search Invoices with name*/}
      {(invoiceList?.length !== 0 || isLoading) && (
        <div className="flex justify-center items-center flex-wrap md:flex-nowrap gap-4 mb-6 p-4 bg-blue-200 rounded-md border-b-4 border-blue-800">
          <label
            htmlFor="searchQuery"
            className="flex items-center w-full md:w-auto text-black font-bold"
          >
            <FcSearch size={40} /> <span>Search Invoices By Name:-</span>
          </label>

          <input
            type="text"
            name="searchQuery"
            className="block w-full md:w-auto px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-500 rounded transition ease-in-out m-0
          focus:text-gray-700 focus:bg-white focus:border-black focus:shadow-md focus:outline-none"
            placeholder="search invoice"
            defaultValue={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {/*Request Status and Errors*/}
      {(isError || (isSuccess && message)) && (
        <MessagesContainer msg={msg} isSuccess={isSuccess} isError={isError} />
      )}

      {/*Display Table All Data Needed*/}
      {!isLoading && invoiceList?.length > 0 && (
        <PaginationTable
          tableRow={tableRow}
          tableHeader={tableHeader}
          tableBodyData={invoiceList}
          rowsPerPage={10}
        />
      )}

      {/* if there is No Invoice Records */}
      {!searchQuery && invoiceList?.length === 0 && !isLoading && (
        <div className="bg-yellow-200 text-gray-800 text-center font-bold my-4 py-4 px-2 border-l-4 border-yellow-600 rounded">
          There No Invoice Records Currently!
        </div>
      )}

      {/* if there is search query no Invoice matches >>> No Search Found*/}
      {searchQuery && invoiceList?.length === 0 && !isLoading && (
        <div className="bg-red-200 text-gray-800 text-center font-bold my-4 py-4 px-2 border-l-4 border-red-600 rounded">
          There No Search Result!
        </div>
      )}

      {/* Show spinner when Loading State is true */}
      {isLoading && <MainSpinner isLoading={isLoading} />}
    </div>
  );
};