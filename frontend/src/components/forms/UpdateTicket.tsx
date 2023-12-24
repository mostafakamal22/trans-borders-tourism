import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { ReactComponent as TicketAlt } from "../../assets/icons/ticket-alt.svg";
import { FormInput } from "../shared/FormInput";
import FormButton from "../shared/FormButton";
import { RiSendPlaneFill } from "react-icons/ri";
import { AiFillCloseCircle } from "react-icons/ai";
import {
  useGetOneTicketQuery,
  useUpdateTicketMutation,
} from "../../state/features/ticket/ticketsApiSlice";
import { ticketsTableHeaderTitles } from "../ticket/constants";
import {
  inputClassNamesStyles,
  lableClassNamesStyles,
} from "../invoice/constants";
import { paymentMethods } from "../payment/constants";
import { PaymentMethods } from "../payment/types";
import { motion } from "framer-motion";
import {
  closeBtnAnimationsOptions,
  modalAnimationOptions,
} from "../helpers/animationOptions";
import DataFetchingErrorMessage from "../shared/DataFetchingErrorMessage";
import DataFetchingSpinner from "../shared/DataFetchingSpinner";

export const UpdateTicket = ({
  id,
  setIsOpen,
}: {
  id: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  //initialize state
  const initialTicketDetails = {
    name: "",
    type: "",
    employee: "",
    supplier: "",
    paymentDate: "",
    paymentMethod: "",
    cost: 0,
    sales: 0,
    profit: 0,
    paidAmount: 0,
    remainingAmount: 0,
  };

  // Data fetching
  const { data: foundTicket, isLoading, error } = useGetOneTicketQuery({ id });

  //state for Ticket Details
  const [ticketDetails, setTicketDetails] = useState(initialTicketDetails);

  const [updateTicket, { isLoading: isUpdating }] = useUpdateTicketMutation();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const ticketData = {
      id,
      name: ticketDetails?.name.trim(),
      type: ticketDetails?.type?.trim(),
      employee: ticketDetails?.employee?.trim(),
      supplier: ticketDetails?.supplier?.trim(),
      cost: ticketDetails.cost,
      sales: ticketDetails.sales,
      profit: ticketDetails.profit,
      paymentDate: ticketDetails.paymentDate,
      paymentMethod: ticketDetails.paymentMethod,
      paidAmount: ticketDetails.paidAmount,
      remainingAmount: ticketDetails.remainingAmount,
    };

    await updateTicket(ticketData);
  };

  // Initialize state after data is fetched
  useEffect(() => {
    if (foundTicket) {
      //Ticket Details
      setTicketDetails({
        name: foundTicket?.customer_name,
        type: foundTicket?.type || "",
        employee: foundTicket?.employee || "",
        supplier: foundTicket?.supplier || "",
        paymentDate: foundTicket?.payment_date
          ? dayjs(foundTicket?.payment_date).format("YYYY-MM-DD")
          : "",
        paymentMethod: foundTicket?.payment_method as string,
        cost: foundTicket?.cost,
        sales: foundTicket?.sales,
        profit: foundTicket?.profit,
        paidAmount: foundTicket?.paid_amount,
        remainingAmount: foundTicket?.remaining_amount,
      });
    }
  }, [foundTicket]);

  useEffect(() => {
    //scroll page back to top when component first mount
    const yOffset = window.scrollY;
    window.scrollBy(0, -yOffset);
  }, []);

  //Show Error Message if could not fetch data
  if (error) {
    return <DataFetchingErrorMessage />;
  }

  //Show spinner when Loading State is true
  if (!foundTicket || isLoading) return <DataFetchingSpinner />;

  return (
    <div className="fixed inset-0 z-50  h-screen w-full overflow-y-auto overflow-x-hidden bg-black/75 scrollbar-thin scrollbar-track-transparent  scrollbar-thumb-gray-400 scrollbar-track-rounded-full md:inset-0">
      <motion.button
        {...closeBtnAnimationsOptions}
        className="fixed top-5 right-[5%] inline-flex items-center rounded border border-transparent bg-red-800 px-2  py-2 text-xs font-bold text-white shadow transition-all duration-300 ease-in-out hover:border-red-800
       hover:bg-white hover:text-red-800 sm:px-3 sm:text-sm"
        onClick={() => setIsOpen(false)}
        type="button"
      >
        <AiFillCloseCircle className="mr-1" size={20} />
        إغلاق
      </motion.button>
      <motion.div
        {...modalAnimationOptions}
        key={"modal"}
        className="mx-auto my-5 w-full max-w-5xl rounded bg-slate-50 p-6 shadow-lg shadow-black/30"
      >
        <h3 className="mb-10 flex items-center justify-center rounded bg-red-800 px-2 py-4 text-center text-xl font-bold text-white shadow ">
          <TicketAlt className="mr-2 h-16 w-16 drop-shadow" />
          <span>تعديل التذكرة</span>
        </h3>

        <form onSubmit={handleSubmit}>
          <p className="my-4 rounded bg-red-800 p-2 text-lg font-bold text-white">
            [ بيانات التذكرة الحالية ]
          </p>
          <div className="mb-10 flex flex-wrap items-center justify-center gap-4 px-5 py-5 font-semibold">
            <FormInput
              label={ticketsTableHeaderTitles[0]}
              name="customerNameUpdate"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="text"
              value={ticketDetails.name}
              onChange={(e) =>
                setTicketDetails({ ...ticketDetails, name: e.target.value })
              }
              required
            />

            <FormInput
              label={ticketsTableHeaderTitles[1]}
              name="typeUpdate"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="text"
              value={ticketDetails.type}
              onChange={(e) =>
                setTicketDetails({ ...ticketDetails, type: e.target.value })
              }
            />

            <FormInput
              label={ticketsTableHeaderTitles[2]}
              name="Updateاسم الموظف"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="text"
              value={ticketDetails.employee}
              onChange={(e) =>
                setTicketDetails({
                  ...ticketDetails,
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
              value={ticketDetails.cost}
              onChange={(e) =>
                setTicketDetails({
                  ...ticketDetails,
                  cost: +e.target.value,
                  sales: 0,
                  profit: 0,
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
              value={ticketDetails.sales}
              onChange={(e) =>
                setTicketDetails({
                  ...ticketDetails,
                  sales: +e.target.value,
                  profit: +e.target.value - ticketDetails.cost,
                  paidAmount: +e.target.value,
                  remainingAmount: 0,
                })
              }
              min={0}
              step={0.01}
            />

            <FormInput
              label={ticketsTableHeaderTitles[5]}
              name="profit"
              labeClassNames={lableClassNamesStyles.default}
              className={`${inputClassNamesStyles.default} bg-slate-200`}
              type="number"
              value={ticketDetails.profit}
              disabled
              min={0}
              step={0.01}
            />

            <FormInput
              label={"Paid Amount"}
              name="paidAmount"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="number"
              value={ticketDetails.paidAmount}
              onChange={(e) =>
                setTicketDetails({
                  ...ticketDetails,
                  paidAmount: +e.target.value,
                  remainingAmount: ticketDetails.sales - +e.target.value,
                })
              }
              min={0}
              step={0.01}
            />

            <FormInput
              label={"Remaining Amount"}
              name="remainingAmount"
              labeClassNames={lableClassNamesStyles.default}
              className={`${inputClassNamesStyles.default} bg-slate-200`}
              type="number"
              value={ticketDetails.remainingAmount}
              disabled
              min={0}
              step={0.01}
            />

            <select
              name="paymentMethodUpdate"
              id="paymentMethodUpdate"
              className={inputClassNamesStyles.default}
              value={ticketDetails.paymentMethod}
              onChange={(e) =>
                setTicketDetails({
                  ...ticketDetails,
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

            <label
              htmlFor="paymentMethodUpdate"
              className={lableClassNamesStyles.default}
            >
              {"Payment Method"}
            </label>

            <FormInput
              label={ticketsTableHeaderTitles[6]}
              name="supplierUpdate"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="text"
              value={ticketDetails.supplier}
              onChange={(e) =>
                setTicketDetails({
                  ...ticketDetails,
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
              value={ticketDetails.paymentDate}
              onChange={(e) =>
                setTicketDetails({
                  ...ticketDetails,
                  paymentDate: e.target.value,
                })
              }
            />
          </div>

          {/*Form Button */}
          <FormButton
            text={{ default: "حفظ التعديلات", loading: "جارى الحفظ" }}
            isLoading={isUpdating}
            icon={<RiSendPlaneFill className="ml-1" size={25} />}
          />
        </form>
      </motion.div>
    </div>
  );
};
