import { useEffect, useState } from "react";
import FormButton from "../shared/FormButton";
import {
  inputClassNamesStyles,
  lableClassNamesStyles,
} from "../invoice/constants";
import { ReactComponent as PaymentVoucherAlt } from "../../assets/icons/paymentVoucher-alt.svg";
import { FormInput } from "../shared/FormInput";
import { RiSendPlaneFill } from "react-icons/ri";
import { useCreatePaymentVoucherMutation } from "../../state/features/paymentVoucher/paymentVouchersApiSlice";
import { useScroll } from "../../hooks/useScroll";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export const CreatePaymentVoucher = () => {
  //state for paymentVoucher Details
  const [paymentVoucherDetails, setPaymentVoucherDetails] = useState({
    name: "",
    bank: "",
    referenceNumber: "",
    being: "",
    amount: 0,
    paymentDate: "",
  });

  const [createPaymentVoucher, { isSuccess, isLoading }] =
    useCreatePaymentVoucherMutation();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const paymentVoucherData = {
      customer_name: paymentVoucherDetails.name,
      bank: paymentVoucherDetails.bank,
      reference_number: paymentVoucherDetails.referenceNumber,
      being: paymentVoucherDetails.being,
      amount: paymentVoucherDetails.amount,
      payment_date: paymentVoucherDetails.paymentDate as unknown as Date,
    };

    await createPaymentVoucher(paymentVoucherData);
  };

  useEffect(() => {
    if (isSuccess) {
      //Set PaymentVoucher Inputs To Default
      setPaymentVoucherDetails({
        name: "",
        bank: "",
        referenceNumber: "",
        being: "",
        amount: 0,
        paymentDate: "",
      });
    }
  }, [isSuccess]);

  useScroll("createPaymentVoucher");
  useDocumentTitle("إضافة سند جديد");

  return (
    <section id="createPaymentVoucher" className="w-full">
      <h3 className="mb-10 flex items-center justify-center rounded bg-red-800 px-2 py-4 text-center text-xl font-bold text-white shadow ">
        <PaymentVoucherAlt className="mr-1 h-16 w-16 drop-shadow" />
        <span>إضافة سند جديد</span>
      </h3>

      <form onSubmit={handleSubmit}>
        <p className="my-4 rounded bg-red-800 p-2 text-lg font-bold text-white">
          [ بيانات السند ]
        </p>
        <div className="mb-10 flex flex-wrap items-center justify-center gap-4 px-5 py-5 font-semibold">
          <FormInput
            label="Customer Name"
            name="customerName"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="text"
            value={paymentVoucherDetails.name}
            onChange={(e) =>
              setPaymentVoucherDetails({
                ...paymentVoucherDetails,
                name: e.target.value,
              })
            }
            required
          />

          <FormInput
            label="Amount"
            name="amount"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="number"
            value={paymentVoucherDetails.amount}
            onChange={(e) =>
              setPaymentVoucherDetails({
                ...paymentVoucherDetails,
                amount: +e.target.value,
              })
            }
            min={0}
            step={0.01}
            required
          />

          <FormInput
            label="Bank"
            name="bank"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="text"
            value={paymentVoucherDetails.bank}
            onChange={(e) =>
              setPaymentVoucherDetails({
                ...paymentVoucherDetails,
                bank: e.target.value,
              })
            }
          />

          <FormInput
            label="ReferenceNumber"
            name="referenceNumber"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="text"
            value={paymentVoucherDetails.referenceNumber}
            onChange={(e) =>
              setPaymentVoucherDetails({
                ...paymentVoucherDetails,
                referenceNumber: e.target.value,
              })
            }
          />

          <FormInput
            label="Being"
            name="being"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="text"
            value={paymentVoucherDetails.being}
            onChange={(e) =>
              setPaymentVoucherDetails({
                ...paymentVoucherDetails,
                being: e.target.value,
              })
            }
          />

          <FormInput
            label={"Voucher Date"}
            name="paymentDate"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="date"
            value={paymentVoucherDetails.paymentDate}
            onChange={(e) =>
              setPaymentVoucherDetails({
                ...paymentVoucherDetails,
                paymentDate: e.target.value,
              })
            }
            required
          />
        </div>

        {/*Form Button */}
        <FormButton
          text={{ default: "حفظ السند", loading: "جارى الحفظ" }}
          isLoading={isLoading}
          icon={<RiSendPlaneFill className="ml-1" size={25} />}
        />
      </form>
    </section>
  );
};
