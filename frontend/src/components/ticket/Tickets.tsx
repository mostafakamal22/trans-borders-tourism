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

export const ticketsTableHeaderTitles = [
  "Customer Name",
  "Cost",
  "Sales",
  "Profit",
  "Suplier",
  "Booking",
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
    suplier: "",
    booking: "",
  });

  //Is modal open
  const [isOpen, setIsOpen] = useState(false);

  //PassportID to Update
  const [id, setId] = useState("");

  const { year, month, suplier, booking, name } = searchQuery;

  type SearchQueries = {
    year: string;
    month: string | number;
    suplier: string;
    booking: string;
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
    month || year || suplier || booking || name
      ? ticketsList.filter((ticket: any) => {
          const ticketDate = dayjs(ticket.payment_date)
            .format("DD/MM/YYYY")
            .split("/");

          const ticketData: SearchQueries = {
            year: ticketDate[2],
            month: +ticketDate[1],
            suplier: ticket.suplier,
            booking: ticket.booking,
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

  const { costs, profits, sales } = ticketsCalculations(filteredTickets);

  const { isLoading, isError, isSuccess, message } = useAppSelector(
    (state) => state.ticketsData
  );

  //search message state
  const [msg, setMsg] = useState("");

  // handle Delete Ticket
  const handleRemoving = (e: any, removedTicketID: string) => {
    e.preventDefault();

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
  const handleAddInvoice = (
    e: any,
    customerName: string,
    passport_service: string,
    paymentDate: string,
    passportSales: number
  ) => {
    e.preventDefault();

    //set msg to none first
    setMsg("");

    const invoiceData = {
      token: info.token,
      customer: { name: customerName },
      details: [
        {
          name: passport_service,
          quantity: 1,
          price: passportSales,
        },
      ],
      total: passportSales,
      subtotal: 0,
      date: paymentDate,
      taxDue: 0,
      taxRate: 0,
      taxable: 0,
    };

    dispatch(createInvoice(invoiceData));
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
          {[...filteredTickets]
            .reverse()
            .findIndex((t: any) => t._id === ticket._id) + 1}
        </th>

        {/*Customer Name*/}
        <th
          scope="row"
          className="p-1  text-gray-900 bg-red-200 border-x text-center border-x-black"
        >
          {ticket.customer_name}
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

        {/*Suplier*/}
        <th
          scope="row"
          className="p-1  text-gray-900  border-x text-center border-x-black"
        >
          {ticket.suplier}
        </th>

        {/*Booking*/}
        <th
          scope="row"
          className="p-1  text-gray-900  border-x text-center border-x-black"
        >
          {ticket.booking}
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
            onSubmit={(event) =>
              handleAddInvoice(
                event,
                ticket.customer_name,
                ticket.booking,
                ticket.payment_date,
                ticket.sales
              )
            }
          >
            <FormButton
              text={{ default: "إضافة", loading: " " }}
              bgColor={["bg-orange-600", "bg-orange-700", "bg-orange-800"]}
              isLoading={invoiceData.isLoading}
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
              type="text"
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
              type="text"
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
              Booking
            </label>
            <input
              type="text"
              name="booking"
              className={inputClassNamesStyles.default}
              value={booking}
              onChange={(e) =>
                setSearchQuery({
                  ...searchQuery,
                  booking: e.target.value,
                })
              }
            />
          </div>

          <div className="flex justify-center items-center flex-col gap-2">
            <label className={lableClassNamesStyles.default} htmlFor="suplier">
              Suplier
            </label>
            <input
              type="text"
              name="suplier"
              className={inputClassNamesStyles.default}
              value={suplier}
              onChange={(e) =>
                setSearchQuery({
                  ...searchQuery,
                  suplier: e.target.value,
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

          {booking && (
            <span className="bg-emerald-500 p-1 rounded-md text-white mx-1">
              {" Booking:- " + booking}
            </span>
          )}

          {suplier && (
            <span className="bg-pink-500 p-1 rounded-md text-white mx-1">
              {" Suplier:- " + suplier}
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
            isSuccess={isSuccess || invoiceData.isSuccess}
            isError={isError || invoiceData.isError}
          />
        ))}

      {/*Display Table All Data Needed*/}
      {!isLoading && filteredTickets?.length > 0 && (
        <PaginationTable
          tableRow={tableRow}
          tableHeader={tableHeader}
          tableBodyData={[...filteredTickets].reverse()}
          rowsPerPage={10}
        />
      )}

      {/* if there is No Passports Records */}
      {!year &&
        !month &&
        !name &&
        !suplier &&
        !booking &&
        filteredTickets?.length === 0 &&
        !isLoading && (
          <div className="bg-yellow-200 text-gray-800 text-center font-bold my-4 py-4 px-2 border-l-4 border-yellow-600 rounded">
            لا يوجد جوازات محفوظة الان, يرجى إضافة الجوازات لعرضها.
          </div>
        )}

      {/* if there is search query no passport matches >>> No Search Found*/}
      {(year || month || booking || name || suplier) &&
        filteredTickets?.length === 0 &&
        !isLoading && (
          <div className="bg-red-200 text-gray-800 text-center font-bold my-4 py-4 px-2 border-l-4 border-red-600 rounded">
            لا يوجد نتائج تطابق هذا البحث, تأكد من البيانات التى ادخلتها و حاول
            مجدداً
          </div>
        )}

      {/* Show update Passport Modal */}
      {/* {isOpen && <UpdatePassport setIsOpen={setIsOpen} id={id} />} */}

      {/* Show spinner when Loading State is true */}
      {isLoading && <MainSpinner isLoading={isLoading} />}
    </div>
  );
};
