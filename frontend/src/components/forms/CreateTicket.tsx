import { useState, useEffect } from "react";
import { ReactComponent as TicketAlt } from "../../assets/icons/ticket-alt.svg";
import { RiSendPlaneFill } from "react-icons/ri";
import FormButton from "../shared/FormButton";
import { FormInput } from "../shared/FormInput";
import { useCreateTicketMutation } from "../../state/features/ticket/ticketsApiSlice";
import { useScroll } from "../../hooks/useScroll";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { ticketsTableHeaderTitles } from "../ticket/constants";
import {
  inputClassNamesStyles,
  lableClassNamesStyles,
} from "../invoice/constants";
import { paymentMethods } from "../payment/constants";
import { PaymentMethods } from "../payment/types";

export const CreateTicket = () => {
  //state for Ticket Details
  const [ticketsDetails, setTicketsDetails] = useState({
    name: "",
    type: "",
    employee: "",
    supplier: "",
    paymentDate: "",
    paymentMethod: "cash",
    cost: 0,
    sales: 0,
    profit: 0,
    paidAmount: 0,
    remainingAmount: 0,
  });

  const [createTicket, { isSuccess, isLoading }] = useCreateTicketMutation();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const ticketData = {
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

    await createTicket(ticketData);
  };

  useEffect(() => {
    if (isSuccess) {
      //Set Ticket Inputs To Default
      setTicketsDetails({
        name: "",
        type: "",
        employee: "",
        supplier: "",
        paymentDate: "",
        paymentMethod: "cash",
        cost: 0,
        sales: 0,
        profit: 0,
        paidAmount: 0,
        remainingAmount: 0,
      });
    }
  }, [isSuccess]);

  useScroll("createTicket");
  useDocumentTitle("إضافة تذكرة جديدة");

  return (
    <section id="createTicket" className="w-full">
      <h3 className="mb-10 flex items-center justify-center rounded bg-red-800 px-2 py-4 text-center text-xl font-bold text-white shadow ">
        <TicketAlt className="mr-2 h-16 w-16 drop-shadow" />
        <span>إضافة تذكرة جديدة</span>
      </h3>

      <form onSubmit={handleSubmit}>
        <p className="my-4 rounded bg-red-800 p-2 text-lg font-bold text-white">
          [ بيانات التذكرة ]
        </p>
        <div className="mb-10 flex flex-wrap items-center justify-center gap-4 px-5 py-5 font-semibold">
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

          <select
            name="paymentMethod"
            id="paymentMethod"
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
            htmlFor="paymentMethod"
            className={lableClassNamesStyles.default}
          >
            {"Payment Method"}
          </label>

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

        {/*Form Button */}
        <FormButton
          text={{ default: "حفظ التذكرة", loading: "جارى الحفظ" }}
          isLoading={isLoading}
          icon={<RiSendPlaneFill className="ml-1" size={25} />}
        />
      </form>
    </section>
  );
};
