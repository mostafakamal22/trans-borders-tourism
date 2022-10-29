import { useState } from "react";
import { useEffect } from "react";
import FormButton from "../shared/FormButton";
import MessagesContainer from "../shared/MessagesContainer";
import { TiDelete } from "react-icons/ti";
import { FcBarChart, FcSearch } from "react-icons/fc";
import { PaginationTable } from "../shared/PaginationTable";
import {
  useAppDispatch,
  useAppSelector,
} from "../../state/features/hooks/StateHooks";
import {
  deleteInvoice,
  resetInvoicesStatus,
} from "../../state/features/invoice/invoiceSlice";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { MainSpinner } from "../shared/MainSpinner";
import logo from "../../assets/imgs/trans-logo.png";
import { UseResetStatus } from "../../hooks/UseResetStatus";
import { resetAdminAuthStatus } from "../../state/features/admin/auth/adminAuthSlice";

const tableHeaderTitles = [
  "Invoice #",
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

  //filtered Invoiceslist
  const filteredInvoices =
    invoiceList &&
    invoiceList.filter((invoice: any) => {
      if (
        invoice?.customer?.name
          .toLowerCase()
          .includes(searchQuery.trim().toLowerCase())
      ) {
        return invoice;
      }
    });

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
    <tr className="border-b border-b-black">
      {tableHeaderTitles.map((title) => (
        <th
          key={title}
          scope="col"
          className="py-3 px-3 text-center border-x border-x-black"
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
        className={`${
          index % 2 === 0 ? "bg-white" : "bg-gray-100"
        } border-b border-b-black`}
      >
        {/*Invoice ID*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x border-x-black text-center"
        >
          {"000" +
            [...invoiceList].findIndex((p: any) => p._id === invoice._id)}
        </th>

        {/*Customer ID*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x border-x-black text-center"
        >
          {invoice.customer.ID ? invoice.customer.ID : "-"}
        </th>

        {/*Customer Name*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x border-x-black text-center"
        >
          {invoice.customer.name ? invoice.customer.name : "-"}
        </th>

        {/*Invoice Date*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x border-x-black text-center"
        >
          {invoice.date ? dayjs(invoice.date).format("DD/MM/YYYY") : "-"}
        </th>

        {/*Invoice Date*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x border-x-black text-center"
        >
          {invoice.due_date
            ? dayjs(invoice.due_date).format("DD/MM/YYYY")
            : "-"}
        </th>

        {/*Invoice Total*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x border-x-black text-center"
        >
          {invoice.total}
        </th>

        {/* Show Invoice */}
        <th
          scope="row"
          className="p-2 text-gray-900 whitespace-nowrap  border-x border-x-black text-center"
        >
          <Link
            to={`/invoices/${invoice._id}`}
            className="max-w-[150px] m-auto text-white bg-blue-800 rounded shadow-sm px-3 py-2"
          >
            عرض الفاتورة
          </Link>
        </th>

        {/* Delete Invoice */}
        <th
          scope="row"
          className="p-2 text-gray-900 whitespace-nowrap  border-x border-x-black text-center"
        >
          <form
            className="max-w-[150px] m-auto"
            onSubmit={(event) => handleRemoving(event, invoice._id)}
          >
            <FormButton
              text={{ default: "مسح الفاتورة" }}
              bgColor={["bg-red-600", "bg-red-700", "bg-red-800"]}
              icon={<TiDelete className="mb-[-2px]" size={25} />}
            />
          </form>
        </th>
      </tr>
    );
  };

  //clean up status (when mount and unmount)
  UseResetStatus(() => {
    dispatch(resetAdminAuthStatus());
    dispatch(resetInvoicesStatus());
  });

  UseResetStatus(() => {
    return () => {
      dispatch(resetAdminAuthStatus());
      dispatch(resetInvoicesStatus());
    };
  });

  return (
    <div className="max-w-6xl min-h-[75vh] w-full mx-auto my-20 overflow-x-auto  p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
      <h3 className="flex justify-center items-center text-2xl my-10 p-3 text-center font-bold bg-red-200 text-gray-900 border-b-4 border-red-800 rounded shadow">
        <span className="flex justify-center items-center mr-2">
          <FcBarChart size={50} />
        </span>
        ({filteredInvoices && filteredInvoices.length}) الفواتير المحفوظة
      </h3>

      <img className="mx-auto" src={logo} alt="logo" />

      {/*search Invoices with name*/}
      {(invoiceList?.length !== 0 || isLoading) && (
        <div className="flex justify-center items-center flex-wrap md:flex-nowrap gap-4 m-6 p-4 bg-red-700 rounded-md ">
          <input
            type="text"
            name="searchQuery"
            className="block w-full md:w-md px-3 py-1.5 text-base font-normal text-red-700 bg-white bg-clip-padding border border-solid border-red-500 rounded transition ease-in-out m-0
          focus:text-red-700 focus:bg-white focus:border-red focus:shadow-md focus:outline-none"
            placeholder="بحث عن الفاتورة بالإسم"
            defaultValue={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <label
            htmlFor="searchQuery"
            className="flex items-center w-full md:w-1/2 text-white font-bold"
          >
            <FcSearch size={40} /> <span>بحث عن فاتورة بإسم العميل </span>
          </label>
        </div>
      )}

      {/*Request Status and Errors*/}
      {(isError || (isSuccess && message)) && (
        <MessagesContainer msg={msg} isSuccess={isSuccess} isError={isError} />
      )}

      {/*Display Table All Data Needed*/}
      {!isLoading && filteredInvoices?.length > 0 && (
        <PaginationTable
          tableRow={tableRow}
          tableHeader={tableHeader}
          tableBodyData={filteredInvoices.reverse()}
          rowsPerPage={10}
        />
      )}

      {/* if there is No Invoice Records */}
      {!searchQuery && filteredInvoices?.length === 0 && !isLoading && (
        <div className="bg-yellow-200 text-gray-800 text-center font-bold my-4 py-4 px-2 border-l-4 border-yellow-600 rounded">
          لا يوجد فواتير محفوظة حالياُ, يرجى إضافة فواتير حتى يتم عرضها
        </div>
      )}

      {/* if there is search query no Invoice matches >>> No Search Found*/}
      {searchQuery && filteredInvoices?.length === 0 && !isLoading && (
        <div className="bg-red-200 text-gray-800 text-center font-bold my-4 py-4 px-2 border-l-4 border-red-600 rounded">
          لا يوجد فاتورة تطابق هذا الإسم, يرجى التأكد من الإسم وحاول مجدداً
        </div>
      )}

      {/* Show spinner when Loading State is true */}
      {isLoading && <MainSpinner isLoading={isLoading} />}
    </div>
  );
};
