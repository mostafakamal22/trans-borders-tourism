import dayjs from "dayjs";
import { useState, useEffect } from "react";
import { ReactComponent as TicketAlt } from "../../assets/icons/ticket-alt.svg";
import { FormInput } from "../shared/FormInput";
import FormButton from "../shared/FormButton";
import { RiSendPlaneFill } from "react-icons/ri";
import { AiFillCloseCircle } from "react-icons/ai";
import {
  useGetTicketsQuery,
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

export const UpdateTicket = ({
  id,
  setIsOpen,
}: {
  id: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { ticket } = useGetTicketsQuery(
    {},
    {
      selectFromResult: ({ data }) => ({
        ticket: data?.docs.find((ticket) => ticket.id === id),
      }),
    }
  );

  if (!ticket) {
    setIsOpen(false);
    return null;
  }

  //state for Ticket Details
  const [ticketsDetails, setTicketsDetails] = useState({
    name: ticket?.customer_name,
    type: ticket?.type,
    employee: ticket?.employee,
    supplier: ticket?.supplier,
    paymentDate: ticket?.payment_date
      ? dayjs(ticket?.payment_date).format("YYYY-MM-DD")
      : "",
    paymentMethod: ticket?.payment_method,
    cost: ticket?.cost,
    sales: ticket?.sales,
    profit: ticket?.profit,
    paidAmount: ticket?.paid_amount,
    remainingAmount: ticket?.remaining_amount,
  });

  const [updateTicket, { isLoading }] = useUpdateTicketMutation();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const ticketData = {
      id,
      name: ticketsDetails?.name.trim(),
      type: ticketsDetails?.type?.trim(),
      employee: ticketsDetails?.employee?.trim(),
      supplier: ticketsDetails?.supplier?.trim(),
      cost: ticketsDetails.cost,
      sales: ticketsDetails.sales,
      profit: ticketsDetails.profit,
      paymentDate: ticketsDetails.paymentDate,
      paymentMethod: ticketsDetails.paymentMethod,
      paidAmount: ticketsDetails.paidAmount,
      remainingAmount: ticketsDetails.remainingAmount,
    };

    await updateTicket(ticketData);
  };

  useEffect(() => {
    //scroll page back to top when component first mount
    const yOffset = window.pageYOffset;
    window.scrollBy(0, -yOffset);
  }, []);

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
              value={ticketsDetails.name}
              onChange={(e) =>
                setTicketsDetails({ ...ticketsDetails, name: e.target.value })
              }
              required
            />

            <FormInput
              label={ticketsTableHeaderTitles[1]}
              name="typeUpdate"
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
              name="Updateاسم الموظف"
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

            <select
              name="paymentMethodUpdate"
              id="paymentMethodUpdate"
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

          {/*Form Button */}
          <FormButton
            text={{ default: "حفظ التعديلات", loading: "جارى الحفظ" }}
            isLoading={isLoading}
            icon={<RiSendPlaneFill className="ml-1" size={25} />}
          />
        </form>
      </motion.div>
    </div>
  );
};
