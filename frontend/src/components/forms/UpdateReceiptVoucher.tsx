import { useState, useEffect } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import { FormInput } from "../shared/FormInput";
import {
  inputClassNamesStyles,
  lableClassNamesStyles,
} from "../invoice/constants";
import { AiFillCloseCircle } from "react-icons/ai";
import {
  useGetOneReceiptVoucherQuery,
  useUpdateReceiptVoucherMutation,
} from "../../state/features/receiptVoucher/receiptVouchersApiSlice";
import { motion } from "framer-motion";
import {
  closeBtnAnimationsOptions,
  modalAnimationOptions,
} from "../helpers/animationOptions";
import DataFetchingErrorMessage from "../shared/DataFetchingErrorMessage";
import ReceiptVoucherAlt from "../../assets/icons/receiptVoucher-alt.svg?react";
import FormButton from "../shared/FormButton";
import DataFetchingSpinner from "../shared/DataFetchingSpinner";
import dayjs from "dayjs";

export const UpdateReceiptVoucher = ({
  id,
  setIsOpen,
}: {
  id: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // Initial state
  const initialReceiptVoucherDetails = {
    name: "",
    bank: "",
    referenceNumber: "",
    being: "",
    amount: 0,
    paymentDate: "",
  };

  // Data fetching
  const {
    data: foundReceiptVoucher,
    isLoading,
    error,
  } = useGetOneReceiptVoucherQuery({ id });

  //state for receiptVoucher Details
  const [receiptVoucherDetails, setReceiptVoucherDetails] = useState(
    initialReceiptVoucherDetails
  );

  const [updateReceiptVoucher, { isLoading: isUpdating }] =
    useUpdateReceiptVoucherMutation();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const receiptVoucherData = {
      id,
      customer_name: receiptVoucherDetails.name,
      bank: receiptVoucherDetails.bank,
      reference_number: receiptVoucherDetails.referenceNumber,
      being: receiptVoucherDetails.being,
      amount: receiptVoucherDetails.amount,
      payment_date: receiptVoucherDetails.paymentDate as unknown as Date,
    };

    await updateReceiptVoucher(receiptVoucherData);
  };

  // Initialize state after data is fetched
  useEffect(() => {
    if (foundReceiptVoucher) {
      //ReceiptVoucher Details
      setReceiptVoucherDetails({
        name: foundReceiptVoucher.customer_name,
        bank: foundReceiptVoucher?.bank || "",
        referenceNumber: foundReceiptVoucher?.reference_number || "",
        being: foundReceiptVoucher?.being || "",
        amount: foundReceiptVoucher.amount,
        paymentDate: foundReceiptVoucher?.payment_date
          ? dayjs(foundReceiptVoucher?.payment_date).format("YYYY-MM-DD")
          : "",
      });
    }
  }, [foundReceiptVoucher]);

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
  if (!foundReceiptVoucher || isLoading) return <DataFetchingSpinner />;

  return (
    <div className="fixed inset-0 z-50  h-screen w-full overflow-y-auto overflow-x-hidden bg-black/75 scrollbar-thin scrollbar-track-transparent  scrollbar-thumb-gray-400 scrollbar-track-rounded-full md:inset-0">
      <motion.button
        {...closeBtnAnimationsOptions}
        className="fixed right-[5%] top-5 inline-flex items-center rounded border border-transparent bg-red-800 px-2  py-2 text-xs font-bold text-white shadow transition-all duration-300 ease-in-out hover:border-red-800
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
          <ReceiptVoucherAlt className="mr-1 h-16 w-16 drop-shadow" />
          <span> تعديل بيانات السند</span>
        </h3>

        <form onSubmit={handleSubmit}>
          <p className="my-4 rounded bg-red-800 p-2 text-lg font-bold text-white">
            [ بيانات السند الحالية ]
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
              label="Reference Number"
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
            text={{ default: "حفظ التعديلات", loading: "جارى الحفظ" }}
            isLoading={isUpdating}
            icon={<RiSendPlaneFill className="ml-1" size={25} />}
          />
        </form>
      </motion.div>
    </div>
  );
};
