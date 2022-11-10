import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { FcTrademark } from "react-icons/fc";
import { TiDelete, TiEdit } from "react-icons/ti";
import { UseResetStatus } from "../../hooks/UseResetStatus";
import { resetAdminAuthStatus } from "../../state/features/admin/auth/adminAuthSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../state/features/hooks/StateHooks";
import {
  createInvoice,
  resetInvoicesStatus,
} from "../../state/features/invoice/invoiceSlice";
import {
  deleteTicket,
  resetTicketsStatus,
} from "../../state/features/ticket/ticketSlice";
import {
  inputClassNamesStyles,
  lableClassNamesStyles,
} from "../forms/CreateInvoice";
import FormButton from "../shared/FormButton";
import { MainSpinner } from "../shared/MainSpinner";
import MessagesContainer from "../shared/MessagesContainer";
import { PaginationTable } from "../shared/PaginationTable";
import logo from "../../assets/imgs/trans-logo.png";
import { ticketsCalculations } from "../helpers/ticketCalculations";
import { UpdateTicket } from "../forms/UpdateTicket";
import { PaymentMethods, paymentMethods } from "../forms/CreatePayment";

export const ticketsTableHeaderTitles = [
  "Customer Name",
  "Type",
  "اسم الموظف",
  "Cost",
  "Sales",
  "Profit",
  "Supplier",
  "Date",
  "تعديل التذكرة",
  "إضافة فاتورة",
  "مسح التذكرة",
];

export const Tickets = () => {
  const { info } = useAppSelector((state) => state.adminAuth);
  const { ticketsList } = useAppSelector((state) => state.ticketsData);
  const invoiceData = useAppSelector((state) => state.invoiceData);

  const dispatch = useAppDispatch();

  //search Params
  const [searchQuery, setSearchQuery] = useState({
    year: "",
    month: "",
    name: "",
    supplier: "",
    employee: "",
  });

  //Is modal open
  const [isOpen, setIsOpen] = useState(false);

  //PassportID to Update
  const [id, setId] = useState("");

  const { year, month, supplier, employee, name } = searchQuery;

  type SearchQueries = {
    year: string;
    month: string | number;
    supplier: string;
    employee: string;
    name: string;
  };

  let availableSearchQueries: SearchQueries = {
    ...searchQuery,
    month: +month,
  };

  for (const key in availableSearchQueries) {
    if (!availableSearchQueries[key as keyof SearchQueries]) {
      delete availableSearchQueries[key as keyof SearchQueries];
    }
  }

  //filtered Tickets
  const filteredTickets: [] =
    month || year || supplier || employee || name
      ? ticketsList.filter((ticket: any) => {
          const ticketDate = dayjs(ticket.payment_date)
            .format("DD/MM/YYYY")
            .split("/");

          const ticketData: SearchQueries = {
            year: ticketDate[2],
            month: +ticketDate[1],
            supplier: ticket.supplier,
            employee: ticket.employee,
            name: ticket.customer_name,
          };

          if (
            Object.keys(availableSearchQueries).every(
              (key) =>
                ticketData[key as keyof SearchQueries] ===
                availableSearchQueries[key as keyof SearchQueries]
            )
          )
            return ticket;
        })
      : ticketsList;

  const sortedTickets = [...filteredTickets].sort((a: any, b: any) => {
    if (dayjs(b.payment_date).valueOf() === dayjs(a.payment_date).valueOf()) {
      return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();
    }

    return dayjs(b.payment_date).valueOf() - dayjs(a.payment_date).valueOf();
  });

  const { costs, profits, sales } = ticketsCalculations(filteredTickets);

  const { isLoading, isError, isSuccess, message } = useAppSelector(
    (state) => state.ticketsData
  );

  //search message state
  const [msg, setMsg] = useState("");

  // handle Delete Ticket
  const handleRemoving = (e: any, removedTicketID: string) => {
    e.preventDefault();

    //set msg to none first
    setMsg("");
    dispatch(resetInvoicesStatus());
    //get admin token
    const token = info.token;

    //payload (admin token + id of the Ticket to delete)
    const ticketData = {
      id: removedTicketID,
      token,
    };

    dispatch(deleteTicket(ticketData));
  };

  // handle Creating invoice
  const handleAddInvoice = (e: React.SyntheticEvent, ticket: any) => {
    e.preventDefault();

    //set msg to none first
    setMsg("");

    dispatch(resetTicketsStatus);

    const invoiceData = {
      token: info.token,
      customer: { name: ticket.customer_name },
      details: [
        {
          name: ticket.type,
          quantity: 1,
          price: ticket.sales,
        },
      ],
      total: ticket.sales,
      date: ticket.payment_date,
      paidAmount: ticket.paid_amount,
      remainingAmount: ticket.remaining_amount,
      paymentMethod:
        paymentMethods[ticket.payment_method as keyof PaymentMethods],
    };

    dispatch(createInvoice(invoiceData));
  };

  useEffect(() => {
    if (isError) {
      setMsg(message);
    }

    if (invoiceData.isError) {
      setMsg(invoiceData.message);
    }

    if (isSuccess && message) {
      setMsg(message);
    }

    if (invoiceData.isSuccess && invoiceData.message) {
      setMsg(invoiceData.message);
    }
  }, [isError, message, isSuccess, msg, invoiceData]);

  //Define table data
  const tableHeader = (
    <tr className="border-b border-b-black">
      <th scope="col" className="p-1 text-center border-x border-x-black">
        NO.
      </th>
      {[...ticketsTableHeaderTitles].map((title) => (
        <th
          key={title}
          scope="col"
          className="max-w-[100px] p-1 text-center border-x border-x-black"
        >
          {title}
        </th>
      ))}
    </tr>
  );

  const tableRow = (ticket: any, index: number) => {
    return (
      <tr
        key={ticket._id}
        className={`${
          index % 2 === 0 ? "bg-white" : "bg-gray-100"
        } border-b border-b-black`}
      >
        {/*ticket NO*/}
        <th
          scope="row"
          className="p-1  text-gray-90 border-x text-center border-x-black"
        >
          {sortedTickets.findIndex((t: any) => t._id === ticket._id) + 1}
        </th>

        {/*Customer Name*/}
        <th
          scope="row"
          className="p-1  text-gray-900 bg-red-200 border-x text-center border-x-black"
        >
          {ticket.customer_name}
        </th>

        {/*Type*/}
        <th
          scope="row"
          className="p-1  text-gray-900  border-x text-center border-x-black"
        >
          {ticket.type ? ticket.type : "-"}
        </th>

        {/*Employee*/}
        <th
          scope="row"
          className="p-1  text-gray-900  border-x text-center border-x-black"
        >
          {ticket.employee ? ticket.employee : "-"}
        </th>

        {/*Total Cost*/}
        <th
          scope="row"
          className="p-1  text-gray-900  border-x text-center border-x-black"
        >
          {ticket.cost}
        </th>

        {/*Sales*/}
        <th
          scope="row"
          className="p-1  text-gray-900  border-x text-center border-x-black"
        >
          {ticket.sales}
        </th>

        {/*Profit*/}
        <th
          scope="row"
          className="p-1  text-gray-900  border-x text-center border-x-black"
        >
          {ticket.profit}
        </th>

        {/*Supplier*/}
        <th
          scope="row"
          className="p-1  text-gray-900  border-x text-center border-x-black"
        >
          {ticket.supplier}
        </th>

        {/*Payment Date*/}
        <th
          scope="row"
          className="p-1  text-gray-900 border-x text-center border-x-black"
        >
          {!ticket?.payment_date
            ? "-"
            : dayjs(ticket.payment_date).format("DD/MM/YYYY")}
        </th>

        {/* Update ticket */}
        <th
          scope="row"
          className="p-1 text-gray-900 border-x text-center border-x-black"
        >
          <button
            className="inline-flex font-bold text-xs bg-blue-800 text-white hover:bg-white px-2 py-2 border-transparent hover:text-blue-800 border hover:border-blue-800 items-center rounded
             transition-all ease-in-out duration-300"
            onClick={() => {
              setId(ticket._id);
              setIsOpen(true);
            }}
          >
            تعديل
          </button>
        </th>

        {/* Make Invoice */}
        <th
          scope="row"
          className="p-1 text-gray-900 border-x text-center border-x-black"
        >
          <form
            className="max-w-[50px] m-auto"
            onSubmit={(event) => handleAddInvoice(event, ticket)}
          >
            <FormButton
              text={{ default: "إضافة" }}
              bgColor={["bg-orange-600", "bg-orange-700", "bg-orange-800"]}
              icon={<TiEdit className="mb-[-2px]" size={25} />}
            />
          </form>
        </th>

        {/* Delete ticket */}
        <th
          scope="row"
          className="p-1 text-gray-900 border-x text-center border-x-black"
        >
          <form
            className="max-w-[50px] m-auto"
            onSubmit={(event) => handleRemoving(event, ticket._id)}
          >
            <FormButton
              text={{ default: "حذف" }}
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
    //scroll page back to top when component first mount
    const yOffset = window.pageYOffset;
    window.scrollBy(0, -yOffset);

    dispatch(resetAdminAuthStatus());
    dispatch(resetTicketsStatus());
    dispatch(resetInvoicesStatus());
  });

  UseResetStatus(() => {
    return () => {
      dispatch(resetAdminAuthStatus());
      dispatch(resetTicketsStatus());
      dispatch(resetInvoicesStatus());
    };
  });

  return (
    <div className="max-w-[1300px] min-h-[75vh] w-full mx-auto my-20 overflow-x-auto  p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
      <img className="mx-auto" src={logo} alt="logo" />

      <div className="flex  justify-center items-center flex-wrap gap-4 my-5 p-4 bg-red-700 rounded-md ">
        <h4 className="basis-full flex justify-center items-center text-2xl my-4 p-3 text-center font-bold bg-red-200 text-gray-900 border-b-4 border-red-800 rounded shadow">
          فلتــرة التذاكــر
        </h4>
        <form className="basis-full  flex flex-col flex-wrap  md:flex-row-reverse justify-center items-center gap-4 mx-auto font-semibold ">
          <div className="flex justify-center items-center flex-col gap-2">
            <label className={lableClassNamesStyles.default} htmlFor="year">
              السنة
            </label>
            <input
              type="number"
              name="year"
              className={inputClassNamesStyles.default}
              value={year}
              onChange={(e) =>
                setSearchQuery({
                  ...searchQuery,
                  year: e.target.value,
                })
              }
            />
          </div>

          <div className="flex justify-center items-center flex-col gap-2">
            <label className={lableClassNamesStyles.default} htmlFor="month">
              الشهر
            </label>
            <input
              type="number"
              name="month"
              className={inputClassNamesStyles.default}
              value={month}
              onChange={(e) =>
                setSearchQuery({
                  ...searchQuery,
                  month: e.target.value,
                })
              }
            />
          </div>

          <div className="flex justify-center items-center flex-col gap-2">
            <label
              className={lableClassNamesStyles.default}
              htmlFor="customerName"
            >
              الاسم
            </label>
            <input
              type="text"
              name="customerName"
              className={inputClassNamesStyles.default}
              value={name}
              onChange={(e) =>
                setSearchQuery({
                  ...searchQuery,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div className="flex justify-center items-center flex-col gap-2">
            <label className={lableClassNamesStyles.default} htmlFor="booking">
              الموظف
            </label>
            <input
              type="text"
              name="booking"
              className={inputClassNamesStyles.default}
              value={employee}
              onChange={(e) =>
                setSearchQuery({
                  ...searchQuery,
                  employee: e.target.value,
                })
              }
            />
          </div>

          <div className="flex justify-center items-center flex-col gap-2">
            <label className={lableClassNamesStyles.default} htmlFor="supplier">
              Supplier
            </label>
            <input
              type="text"
              name="supplier"
              className={inputClassNamesStyles.default}
              value={supplier}
              onChange={(e) =>
                setSearchQuery({
                  ...searchQuery,
                  supplier: e.target.value,
                })
              }
            />
          </div>
        </form>

        <h3 className="basis-full flex justify-center items-center flex-row-reverse flex-wrap text-2xl my-5 p-3 text-center font-bold bg-red-200 text-gray-900 border-b-4 border-red-800 rounded shadow">
          <span>{" التذاكــر المحفوظة"}</span>
          {!month && !year && (
            <span className="bg-blue-500 p-1 rounded-md text-white mx-1">
              {" الكلية "}
            </span>
          )}
          {month && (
            <span className="bg-rose-500 p-1 rounded-md text-white mx-1">
              {" عن شهر " + month}
            </span>
          )}
          {year && (
            <span className="bg-amber-500 p-1 rounded-md text-white mx-1">
              {" سنة " + year}
            </span>
          )}

          {name && (
            <span className="bg-purple-500 p-1 rounded-md text-white mx-1">
              {" Customer Name:- " + name}
            </span>
          )}

          {employee && (
            <span className="bg-emerald-500 p-1 rounded-md text-white mx-1">
              {"الموظف:- " + employee}
            </span>
          )}

          {supplier && (
            <span className="bg-pink-500 p-1 rounded-md text-white mx-1">
              {" Supplier:- " + supplier}
            </span>
          )}
          <span>({filteredTickets.length})</span>

          <span className="flex justify-center items-center mr-2">
            <FcTrademark size={50} />
          </span>
        </h3>
      </div>

      <h4 className="flex justify-center items-center flex-row-reverse flex-wrap gap-2 text-2xl my-10 p-4 text-center font-bold bg-red-700 text-gray-900 rounded shadow">
        <span className="bg-blue-500 p-1 rounded-md text-white mx-1">
          {" إجمالى الربح " + `[ ${profits.toFixed(2)} ]`}
        </span>

        <span className="bg-rose-500 p-1 rounded-md text-white mx-1">
          {" إجمالى  تكلفة التذاكر " + `[ ${costs.toFixed(2)} ]`}
        </span>

        <span className="bg-amber-500 p-1 rounded-md text-white mx-1">
          {" إجمالى  سعر البيع " + `[ ${sales.toFixed(2)} ]`}
        </span>
      </h4>

      {/*Request Status and Errors*/}
      {isError ||
        (isSuccess && message && (
          <MessagesContainer
            msg={msg}
            isSuccess={isSuccess}
            isError={isError}
          />
        ))}

      {invoiceData.isError ||
        (invoiceData.isSuccess && invoiceData.message && (
          <MessagesContainer
            msg={msg}
            isSuccess={invoiceData.isSuccess}
            isError={invoiceData.isError}
          />
        ))}

      {/*Display Table All Data Needed*/}
      {!isLoading && !invoiceData.isLoading && filteredTickets?.length > 0 && (
        <PaginationTable
          tableRow={tableRow}
          tableHeader={tableHeader}
          tableBodyData={sortedTickets}
          rowsPerPage={10}
        />
      )}

      {/* if there is No Tickets Records */}
      {!year &&
        !month &&
        !name &&
        !supplier &&
        !employee &&
        filteredTickets?.length === 0 &&
        !isLoading &&
        !invoiceData.isLoading && (
          <div className="bg-yellow-200 text-gray-800 text-center font-bold my-4 py-4 px-2 border-l-4 border-yellow-600 rounded">
            لا يوجد تذاكر محفوظة الان, يرجى إضافة التذاكر لعرضها.
          </div>
        )}

      {/* if there is search query no Tickets matches >>> No Search Found*/}
      {(year || month || employee || name || supplier) &&
        filteredTickets?.length === 0 &&
        !isLoading &&
        !invoiceData.isLoading && (
          <div className="bg-red-200 text-gray-800 text-center font-bold my-4 py-4 px-2 border-l-4 border-red-600 rounded">
            لا يوجد نتائج تطابق هذا البحث, تأكد من البيانات التى ادخلتها و حاول
            مجدداً
          </div>
        )}

      {/* Show update Tickets Modal */}
      {isOpen && <UpdateTicket setIsOpen={setIsOpen} id={id} />}

      {/* Show spinner when Loading State is true */}
      {(isLoading || invoiceData.isLoading) && (
        <MainSpinner
          isLoading={isLoading ? isLoading : invoiceData.isLoading}
        />
      )}
    </div>
  );
};
