import { useEffect, useState } from "react";
import FormButton from "../shared/FormButton";
import {
  inputClassNamesStyles,
  lableClassNamesStyles,
} from "../invoice/constants";
import { FormInput } from "../shared/FormInput";
import { RiSendPlaneFill } from "react-icons/ri";
import { useCreateReceiptVoucherMutation } from "../../state/features/receiptVoucher/receiptVouchersApiSlice";
import { useScroll } from "../../hooks/useScroll";
import ReceiptVoucherAlt from "../../assets/icons/receiptVoucher-alt.svg?react";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export default function CreateReceiptVoucher() {
  //state for receiptVoucher Details
  const [receiptVoucherDetails, setReceiptVoucherDetails] = useState({
    name: "",
    bank: "",
    referenceNumber: "",
    being: "",
    amount: 0,
    paymentDate: "",
  });

  const [createReceiptVoucher, { isSuccess, isLoading }] =
    useCreateReceiptVoucherMutation();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const receiptVoucherData = {
      customer_name: receiptVoucherDetails.name,
      bank: receiptVoucherDetails.bank,
      reference_number: receiptVoucherDetails.referenceNumber,
      being: receiptVoucherDetails.being,
      amount: receiptVoucherDetails.amount,
      payment_date: receiptVoucherDetails.paymentDate as unknown as Date,
    };

    await createReceiptVoucher(receiptVoucherData);
  };

  useEffect(() => {
    if (isSuccess) {
      //Set ReceiptVoucher Inputs To Default
      setReceiptVoucherDetails({
        name: "",
        bank: "",
        referenceNumber: "",
        being: "",
        amount: 0,
        paymentDate: "",
      });
    }
  }, [isSuccess]);

  useScroll("createReceiptVoucher");
  useDocumentTitle("إضافة سند جديد");

  return (
    <section id="createReceiptVoucher" className="w-full">
      <h3 className="mb-10 flex items-center justify-center rounded bg-red-800 px-2 py-4 text-center text-xl font-bold text-white shadow ">
        <ReceiptVoucherAlt className="mr-1 h-16 w-16 drop-shadow" />
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
            value={receiptVoucherDetails.name}
            onChange={(e) =>
              setReceiptVoucherDetails({
                ...receiptVoucherDetails,
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
            value={receiptVoucherDetails.amount}
            onChange={(e) =>
              setReceiptVoucherDetails({
                ...receiptVoucherDetails,
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
            value={receiptVoucherDetails.bank}
            onChange={(e) =>
              setReceiptVoucherDetails({
                ...receiptVoucherDetails,
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
            value={receiptVoucherDetails.referenceNumber}
            onChange={(e) =>
              setReceiptVoucherDetails({
                ...receiptVoucherDetails,
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
            value={receiptVoucherDetails.being}
            onChange={(e) =>
              setReceiptVoucherDetails({
                ...receiptVoucherDetails,
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
            value={receiptVoucherDetails.paymentDate}
            onChange={(e) =>
              setReceiptVoucherDetails({
                ...receiptVoucherDetails,
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
}
