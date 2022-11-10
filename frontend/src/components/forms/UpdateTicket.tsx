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
import { PaymentMethods, paymentMethods } from "./CreatePayment";

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
    type: ticket.type,
    passportId: ticket.passport_id,
    employee: ticket.employee,
    supplier: ticket.supplier,
    paymentDate: ticket.payment_date
      ? dayjs(ticket?.payment_date).format("YYYY-MM-DD")
      : "",
    paymentMethod: ticket.payment_method,
    cost: ticket.cost,
    sales: ticket.sales,
    profit: ticket.profit,
    paidAmount: ticket.paid_amount,
    remainingAmount: ticket.remaining_amount,
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
      type: ticketsDetails.type.trim(),
      employee: ticketsDetails.employee.trim(),
      supplier: ticketsDetails.supplier.trim(),
      cost: ticketsDetails.cost,
      sales: ticketsDetails.sales,
      profit: ticketsDetails.profit,
      paymentDate: ticketsDetails.paymentDate,
      paymentMethod: ticketsDetails.paymentMethod,
      paidAmount: ticketsDetails.paidAmount,
      remainingAmount: ticketsDetails.remainingAmount,
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
              name="type"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="text"
              value={ticketsDetails.type}
              onChange={(e) =>
                setTicketsDetails({ ...ticketsDetails, type: e.target.value })
              }
            />

            <FormInput
              label={ticketsTableHeaderTitles[2]}
              name="اسم الموظف"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="text"
              value={ticketsDetails.employee}
              onChange={(e) =>
                setTicketsDetails({
                  ...ticketsDetails,
                  employee: e.target.value,
                })
              }
            />

            <FormInput
              label={ticketsTableHeaderTitles[3]}
              name="cost"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="number"
              value={ticketsDetails.cost}
              onChange={(e) =>
                setTicketsDetails({
                  ...ticketsDetails,
                  cost: +e.target.value,
                  profit: ticketsDetails.sales - +e.target.value,
                })
              }
              min={0}
              step={0.01}
            />

            <FormInput
              label={ticketsTableHeaderTitles[4]}
              name="sales"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="number"
              value={ticketsDetails.sales}
              onChange={(e) =>
                setTicketsDetails({
                  ...ticketsDetails,
                  sales: +e.target.value,
                  profit: +e.target.value - ticketsDetails.cost,
                })
              }
              min={0}
              step={0.01}
            />

            <FormInput
              label={ticketsTableHeaderTitles[5]}
              name="profit"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="number"
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
              label={"Paid Amount"}
              name="paidAmount"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="number"
              value={ticketsDetails.paidAmount}
              onChange={(e) =>
                setTicketsDetails({
                  ...ticketsDetails,
                  paidAmount: +e.target.value,
                  remainingAmount: ticketsDetails.sales - +e.target.value,
                })
              }
              min={0}
              step={0.01}
            />

            <FormInput
              label={"Remaining Amount"}
              name="remainingAmount"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="number"
              value={ticketsDetails.remainingAmount}
              onChange={(e) =>
                setTicketsDetails({
                  ...ticketsDetails,
                  remainingAmount: +e.target.value,
                })
              }
              min={0}
              step={0.01}
            />

            <label
              htmlFor="paymentMethod"
              className={lableClassNamesStyles.default}
            >
              {"Payment Method"}
            </label>
            <select
              name="paymentMethod"
              className={inputClassNamesStyles.default}
              value={ticketsDetails.paymentMethod}
              onChange={(e) =>
                setTicketsDetails({
                  ...ticketsDetails,
                  paymentMethod: e.target.value,
                })
              }
            >
              {Object.keys(paymentMethods).map((method: string) => (
                <option key={method} value={method}>
                  {paymentMethods[method as keyof PaymentMethods]}
                </option>
              ))}
            </select>

            <FormInput
              label={ticketsTableHeaderTitles[6]}
              name="supplier"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="text"
              value={ticketsDetails.supplier}
              onChange={(e) =>
                setTicketsDetails({
                  ...ticketsDetails,
                  supplier: e.target.value,
                })
              }
            />

            <FormInput
              label={ticketsTableHeaderTitles[7]}
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
