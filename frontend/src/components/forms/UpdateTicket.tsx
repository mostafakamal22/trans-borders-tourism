import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { FcTrademark } from "react-icons/fc";
import { UseResetStatus } from "../../hooks/UseResetStatus";
import { resetAdminAuthStatus } from "../../state/features/admin/auth/adminAuthSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../state/features/hooks/StateHooks";
import {
  resetTicketsStatus,
  updateTicket,
} from "../../state/features/ticket/ticketSlice";
import logo from "../../assets/imgs/trans-logo.png";
import { FormInput } from "../shared/FormInput";
import { ticketsTableHeaderTitles } from "../ticket/Tickets";
import { inputClassNamesStyles, lableClassNamesStyles } from "./CreateInvoice";
import MessagesContainer from "../shared/MessagesContainer";
import FormButton from "../shared/FormButton";
import { RiSendPlaneFill } from "react-icons/ri";
import { AiFillCloseCircle } from "react-icons/ai";

export const UpdateTicket = ({
  id,
  setIsOpen,
}: {
  id: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { ticketsList } = useAppSelector((state) => state.ticketsData);
  const ticket = ticketsList.find((ticket: any) => ticket._id === id);

  //state for Ticket Details
  const [ticketsDetails, setTicketsDetails] = useState({
    name: ticket.customer_name,
    booking: ticket.booking,
    suplier: ticket.suplier,
    paymentDate: dayjs(ticket.payment_date).format("YYYY-MM-DD"),
    cost: ticket.cost,
    sales: ticket.sales,
    profit: ticket.profit,
  });

  //state for alert messages
  const [msg, setMsg] = useState("");

  const { info } = useAppSelector((state) => state.adminAuth);
  const { isError, isSuccess, isLoading, message } = useAppSelector(
    (state) => state.ticketsData
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isError) {
      setMsg(message);
    }

    if (isSuccess) {
      setMsg(message);
    }
  }, [isError, isSuccess, message, info, msg]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    //set msg to none first
    setMsg("");

    const ticketData = {
      token: info.token,
      id,
      name: ticketsDetails.name.trim(),
      booking: ticketsDetails.booking.trim(),
      suplier: ticketsDetails.suplier.trim(),
      cost: ticketsDetails.cost,
      sales: ticketsDetails.sales,
      profit: ticketsDetails.profit,
      paymentDate: ticketsDetails.paymentDate,
    };

    dispatch(updateTicket(ticketData));
  };

  //clean up status (when mount and unmount)
  UseResetStatus(() => {
    //scroll page back to top when component first mount
    const yOffset = window.pageYOffset;
    window.scrollBy(0, -yOffset);

    dispatch(resetAdminAuthStatus());
    dispatch(resetTicketsStatus());
  });

  UseResetStatus(() => {
    return () => {
      dispatch(resetAdminAuthStatus());
      dispatch(resetTicketsStatus());
    };
  });

  return (
    <div className="h-screen bg-gray-500/50 overflow-y-auto overflow-x-hidden fixed inset-0 z-50 w-full md:inset-0">
      <button
        className="fixed top-5 right-[10%] inline-flex font-bold text-xs sm:text-sm bg-red-800 text-white hover:bg-white  px-2 sm:px-3 py-2 border-transparent hover:text-red-800 border hover:border-red-800 items-center rounded
     shadow transition-all ease-in-out duration-300"
        onClick={() => setIsOpen(false)}
        type="button"
      >
        <AiFillCloseCircle className="mr-1" size={20} />
        إغلاق
      </button>

      <div className="max-w-6xl w-full mx-auto my-20 p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
        <h3 className="flex justify-center items-center text-xl text-center font-bold px-2 py-4 mb-10 bg-red-200 border-b-4 border-red-800 rounded shadow ">
          <FcTrademark className="mr-1" size={50} />
          <span>تعديل التذكرة</span>
        </h3>

        <img className="mx-auto" src={logo} alt="logo" />

        <form onSubmit={handleSubmit}>
          <p className="font-bold p-2 rounded text-lg text-white bg-red-800 my-4">
            [ بيانات التذكرة الحالية ]
          </p>
          <div className="flex justify-center items-center font-semibold flex-wrap gap-4 px-5 py-5">
            <FormInput
              label={ticketsTableHeaderTitles[0]}
              name="customerName"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="text"
              value={ticketsDetails.name}
              onChange={(e) =>
                setTicketsDetails({ ...ticketsDetails, name: e.target.value })
              }
              required
            />

            <FormInput
              label={ticketsTableHeaderTitles[1]}
              name="cost"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="nmuber"
              value={ticketsDetails.cost}
              onChange={(e) =>
                setTicketsDetails({ ...ticketsDetails, cost: +e.target.value })
              }
              min={0}
              step={0.01}
            />

            <FormInput
              label={ticketsTableHeaderTitles[2]}
              name="sales"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="nmuber"
              value={ticketsDetails.sales}
              onChange={(e) =>
                setTicketsDetails({ ...ticketsDetails, sales: +e.target.value })
              }
              min={0}
              step={0.01}
            />

            <FormInput
              label={ticketsTableHeaderTitles[3]}
              name="profit"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="nmuber"
              value={ticketsDetails.profit}
              onChange={(e) =>
                setTicketsDetails({
                  ...ticketsDetails,
                  profit: +e.target.value,
                })
              }
              min={0}
              step={0.01}
            />

            <FormInput
              label={ticketsTableHeaderTitles[4]}
              name="suplier"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="text"
              value={ticketsDetails.suplier}
              onChange={(e) =>
                setTicketsDetails({
                  ...ticketsDetails,
                  suplier: e.target.value,
                })
              }
            />

            <FormInput
              label={ticketsTableHeaderTitles[5]}
              name="booking"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="text"
              value={ticketsDetails.booking}
              onChange={(e) =>
                setTicketsDetails({
                  ...ticketsDetails,
                  booking: e.target.value,
                })
              }
            />

            <FormInput
              label={ticketsTableHeaderTitles[6]}
              name="paymentDate"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="date"
              value={ticketsDetails.paymentDate}
              onChange={(e) =>
                setTicketsDetails({
                  ...ticketsDetails,
                  paymentDate: e.target.value,
                })
              }
            />
          </div>

          {/*Request Status and Errors*/}
          {(isError || isSuccess) && (
            <MessagesContainer
              msg={msg}
              isSuccess={isSuccess}
              isError={isError}
            />
          )}

          {/*form button */}
          <FormButton
            text={{ default: "حفظ التعديلات", loading: "جارى الحفظ" }}
            isLoading={isLoading}
            icon={<RiSendPlaneFill className="ml-1" size={25} />}
          />
        </form>
      </div>
    </div>
  );
};
