import { useState, useEffect } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import { FormInput } from "../shared/FormInput";
import { useCreateTicketMutation } from "../../state/features/ticket/ticketsApiSlice";
import { useScroll } from "../../hooks/useScroll";
import { ticketsTableHeaderTitles } from "../ticket/constants";
import {
  inputClassNamesStyles,
  lableClassNamesStyles,
} from "../invoice/constants";
import { paymentMethods } from "../payment/constants";
import { PaymentMethods } from "../payment/types";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import TicketAlt from "../../assets/icons/ticket-alt.svg?react";
import FormButton from "../shared/FormButton";

export default function CreateTicket() {
  //state for Ticket Details
  const [ticketDetails, setTicketDetails] = useState({
    name: "",
    type: "",
    employee: "",
    supplier: "",
    paymentDate: "",
    paymentMethod: "cash",
    cost: 0,
    total: 0,
    taxable: 0,
    sales: 0,
    profit: 0,
    paidAmount: 0,
    remainingAmount: 0,
  });

  const [createTicket, { isSuccess, isLoading }] = useCreateTicketMutation();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const ticketData = {
      name: ticketDetails.name.trim(),
      type: ticketDetails.type.trim(),
      employee: ticketDetails.employee.trim(),
      supplier: ticketDetails.supplier.trim(),
      cost: ticketDetails.cost,
      total: ticketDetails.total,
      taxable: ticketDetails.taxable,
      sales: ticketDetails.sales,
      profit: ticketDetails.profit,
      paymentDate: ticketDetails.paymentDate,
      paymentMethod: ticketDetails.paymentMethod,
      paidAmount: ticketDetails.paidAmount,
      remainingAmount: ticketDetails.remainingAmount,
    };

    await createTicket(ticketData);
  };

  useEffect(() => {
    if (isSuccess) {
      //Set Ticket Inputs To Default
      setTicketDetails({
        name: "",
        type: "",
        employee: "",
        supplier: "",
        paymentDate: "",
        paymentMethod: "cash",
        cost: 0,
        total: 0,
        taxable: 0,
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
            value={ticketDetails.name}
            onChange={(e) =>
              setTicketDetails({ ...ticketDetails, name: e.target.value })
            }
            required
          />

          <FormInput
            label={ticketsTableHeaderTitles[1]}
            name="type"
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
            name="اسم الموظف"
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
                total: 0,
                taxable: 0,
                sales: 0,
                profit: 0,
              })
            }
            min={0}
            step={0.01}
          />

          <FormInput
            label={ticketsTableHeaderTitles[4]}
            name="total"
            labeClassNames={lableClassNamesStyles.default}
            className={`${inputClassNamesStyles.default} bg-slate-200`}
            type="number"
            value={ticketDetails.total}
            disabled
            min={0}
            step={0.01}
          />

          <FormInput
            label={ticketsTableHeaderTitles[5]}
            name="taxable"
            labeClassNames={lableClassNamesStyles.default}
            className={`${inputClassNamesStyles.default} bg-slate-200`}
            type="number"
            value={ticketDetails.taxable}
            disabled
            min={0}
            step={0.01}
          />

          <FormInput
            label={ticketsTableHeaderTitles[6]}
            name="sales"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="number"
            value={ticketDetails.sales}
            onChange={(e) =>
              setTicketDetails({
                ...ticketDetails,
                sales: +e.target.value,
                total: calculateTicketTotal({
                  sales: +e.target.value,
                  cost: ticketDetails.cost,
                }),
                taxable: calculateTicketTax({
                  sales: +e.target.value,
                  cost: ticketDetails.cost,
                }),
                profit: +calculateTicketProfit({
                  sales: +e.target.value,
                  cost: ticketDetails.cost,
                }),
                paidAmount: +e.target.value,
                remainingAmount: 0,
              })
            }
            min={0}
            step={0.01}
          />

          <FormInput
            label={ticketsTableHeaderTitles[7]}
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
            name="paymentMethod"
            id="paymentMethod"
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
            htmlFor="paymentMethod"
            className={lableClassNamesStyles.default}
          >
            {"Payment Method"}
          </label>

          <FormInput
            label={ticketsTableHeaderTitles[8]}
            name="supplier"
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
            label={ticketsTableHeaderTitles[9]}
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
          text={{ default: "حفظ التذكرة", loading: "جارى الحفظ" }}
          isLoading={isLoading}
          icon={<RiSendPlaneFill className="ml-1" size={25} />}
        />
      </form>
    </section>
  );
}

export const calculateTicketTotal = ({
  sales,
  cost,
}: {
  sales: number;
  cost: number;
}): number => {
  const subTotal = ((sales - cost) * 100) / 105;
  const total = subTotal + cost;
  return +total.toFixed(2);
};

export const calculateTicketTax = ({
  sales,
  cost,
}: {
  sales: number;
  cost: number;
}): number => {
  const total = +calculateTicketTotal({
    sales,
    cost,
  });

  const tax = sales - total;
  return +tax.toFixed(2);
};

export const calculateTicketProfit = ({
  sales,
  cost,
}: {
  sales: number;
  cost: number;
}): number => {
  const total = +calculateTicketTotal({
    sales,
    cost,
  });
  const profit = total - cost;

  return +profit.toFixed(2);
};
