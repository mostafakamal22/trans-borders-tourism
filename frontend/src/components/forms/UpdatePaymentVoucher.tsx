import { useState, useEffect } from "react";
import { ReactComponent as PaymentVoucherAlt } from "../../assets/icons/paymentVoucher-alt.svg";
import { RiSendPlaneFill } from "react-icons/ri";
import FormButton from "../shared/FormButton";
import { FormInput } from "../shared/FormInput";
import {
  inputClassNamesStyles,
  lableClassNamesStyles,
} from "../invoice/constants";
import { AiFillCloseCircle } from "react-icons/ai";
import {
  useGetOnePaymentVoucherQuery,
  useUpdatePaymentVoucherMutation,
} from "../../state/features/paymentVoucher/paymentVouchersApiSlice";
import { motion } from "framer-motion";
import {
  closeBtnAnimationsOptions,
  modalAnimationOptions,
} from "../helpers/animationOptions";
import DataFetchingErrorMessage from "../shared/DataFetchingErrorMessage";
import DataFetchingSpinner from "../shared/DataFetchingSpinner";
import dayjs from "dayjs";

export const UpdatePaymentVoucher = ({
  id,
  setIsOpen,
}: {
  id: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // Initial state
  const initialPaymentVoucherDetails = {
    name: "",
    bank: "",
    referenceNumber: "",
    being: "",
    amount: 0,
    paymentDate: "",
  };

  // Data fetching
  const {
    data: foundPaymentVoucher,
    isLoading,
    error,
  } = useGetOnePaymentVoucherQuery({ id });

  //state for paymentVoucher Details
  const [paymentVoucherDetails, setPaymentVoucherDetails] = useState(
    initialPaymentVoucherDetails
  );

  const [updatePaymentVoucher, { isLoading: isUpdating }] =
    useUpdatePaymentVoucherMutation();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const paymentVoucherData = {
      id,
      customer_name: paymentVoucherDetails.name,
      bank: paymentVoucherDetails.bank,
      reference_number: paymentVoucherDetails.referenceNumber,
      being: paymentVoucherDetails.being,
      amount: paymentVoucherDetails.amount,
      payment_date: paymentVoucherDetails.paymentDate as unknown as Date,
    };

    await updatePaymentVoucher(paymentVoucherData);
  };

  // Initialize state after data is fetched
  useEffect(() => {
    if (foundPaymentVoucher) {
      //PaymentVoucher Details
      setPaymentVoucherDetails({
        name: foundPaymentVoucher.customer_name,
        bank: foundPaymentVoucher?.bank || "",
        referenceNumber: foundPaymentVoucher?.reference_number || "",
        being: foundPaymentVoucher?.being || "",
        amount: foundPaymentVoucher.amount,
        paymentDate: foundPaymentVoucher?.payment_date
          ? dayjs(foundPaymentVoucher?.payment_date).format("YYYY-MM-DD")
          : "",
      });
    }
  }, [foundPaymentVoucher]);

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
  if (!foundPaymentVoucher || isLoading) return <DataFetchingSpinner />;

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
          <PaymentVoucherAlt className="mr-1 h-16 w-16 drop-shadow" />
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
              label="Reference Number"
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
            text={{ default: "حفظ التعديلات", loading: "جارى الحفظ" }}
            isLoading={isUpdating}
            icon={<RiSendPlaneFill className="ml-1" size={25} />}
          />
        </form>
      </motion.div>
    </div>
  );
};
