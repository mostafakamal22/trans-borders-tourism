import { useState, useEffect } from "react";
import {
  AiFillCloseCircle,
  AiFillMinusCircle,
  AiFillPlusCircle,
} from "react-icons/ai";
import { RiSendPlaneFill } from "react-icons/ri";
import FormButton from "../shared/FormButton";
import { FormInput } from "../shared/FormInput";
import dayjs from "dayjs";
import {
  useGetPaymentsQuery,
  useUpdatePaymentMutation,
} from "../../state/features/payment/paymentApiSlice";
import {
  inputClassNamesStyles,
  lableClassNamesStyles,
} from "../invoice/constants";
import {
  closeBtnAnimationsOptions,
  modalAnimationOptions,
} from "../helpers/animationOptions";
import { motion } from "framer-motion";
import { paymentMethods, paymentTypes } from "../payment/constants";
import { PaymentMethods, PaymentTypes } from "../payment/types";
import { ReactComponent as PaymentAlt } from "../../assets/icons/payment-alt.svg";
import { IPaymentType } from "../../../../backend/models/paymentModel";

export const UpdatePayment = ({
  id,
  setIsOpen,
}: {
  id: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { payment } = useGetPaymentsQuery(
    {},
    {
      selectFromResult: ({ data }) => ({
        payment: data?.docs.find((payment) => payment.id === id),
      }),
    }
  );

  if (!payment) {
    setIsOpen(false);
    return null;
  }

  //state for payment Details
  const [paymentDetails, setPaymentDetails] = useState({
    date: dayjs(payment?.date).format("YYYY-MM-DD"),
    total: payment?.total,
  });

  const paymentTypesData = [
    ...payment?.payment_types?.map((item: any) => {
      return {
        name: item?.name,
        description: item?.description,
        method: item?.method,
        cost: item?.cost,
        tax: item?.tax ? item?.tax : 0,
        total: item?.total,
      };
    }),
  ];

  //state for paymentTypes Details
  const [paymentTypesDetails, setPaymentTypesDetails] =
    useState<IPaymentType[]>(paymentTypesData);

  //state for items
  const [itemsCount, setItemsCount] = useState(1);

  const handleItemCount = (num: number) => {
    if (num < 0 && itemsCount === 1) return;

    setItemsCount(itemsCount + num);

    const newItems =
      num > 0
        ? [
            ...paymentTypesDetails,
            {
              name: "bank_payments",
              description: "",
              method: "bank",
              cost: 0,
              tax: 0,
              total: 0,
            },
          ]
        : [...paymentTypesDetails].splice(0, paymentTypesDetails.length - 1);

    setPaymentTypesDetails(newItems);

    const newTotal = newItems.reduce((prev, curr) => prev + curr.total, 0);
    setPaymentDetails({ ...paymentDetails, total: +newTotal.toFixed(2) });
  };

  const [updatePayment, { isLoading }] = useUpdatePaymentMutation();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const paymentData = {
      id,
      paymentTypes: [...paymentTypesDetails],
      total: paymentDetails.total,
      paymentDate: paymentDetails.date,
    };

    await updatePayment(paymentData);
  };

  useEffect(() => {
    //scroll page back to top when component first mount
    const yOffset = window.scrollY;
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
          <PaymentAlt className="mr-2 h-16 w-16 drop-shadow" />
          <span>تعديل المصروف </span>
        </h3>

        <form onSubmit={handleSubmit}>
          <p className="my-4 rounded bg-red-800 p-2 text-lg font-bold text-white">
            [ تفــاصيل نوع المصروف الحالية ]
          </p>
          {paymentTypesDetails.map((item, index) => (
            <div
              key={index}
              className="flex flex-wrap items-center justify-center gap-4 px-5 py-5  font-semibold"
            >
              <select
                name="itemName"
                className={inputClassNamesStyles.default}
                value={item.name}
                onChange={(e) => {
                  const newArr = [...paymentTypesDetails];
                  newArr[index].name = e.target.value;
                  setPaymentTypesDetails(newArr);
                }}
              >
                {Object.keys(paymentTypes).map((name: string) => (
                  <option key={name} value={name}>
                    {paymentTypes[name as keyof PaymentTypes]}
                  </option>
                ))}
              </select>
              <label
                htmlFor="itemName"
                className={lableClassNamesStyles.default}
              >
                نوع المصـروف
              </label>

              <select
                name="method"
                className={inputClassNamesStyles.default}
                value={item.method}
                onChange={(e) => {
                  const newArr = [...paymentTypesDetails];
                  newArr[index].method = e.target.value;
                  setPaymentTypesDetails(newArr);
                }}
              >
                {Object.keys(paymentMethods).map((name: string) => (
                  <option key={name} value={name}>
                    {paymentMethods[name as keyof PaymentMethods]}
                  </option>
                ))}
              </select>

              <label htmlFor="method" className={lableClassNamesStyles.default}>
                طريقة دفع المصـروف
              </label>

              <FormInput
                label="شرح المصـروف"
                name="itemDescription"
                labeClassNames={lableClassNamesStyles.default}
                className={inputClassNamesStyles.default}
                type="text"
                value={item.description}
                onChange={(e) => {
                  const newArr = [...paymentTypesDetails];
                  newArr[index].description = e.target.value;
                  setPaymentTypesDetails(newArr);
                }}
              />

              <FormInput
                label="المبلغ قبل الضريبة"
                name="itemTotal"
                labeClassNames={lableClassNamesStyles.default}
                className={inputClassNamesStyles.default}
                type="number"
                value={item.cost}
                onChange={(e) => {
                  const newArr = [...paymentTypesDetails];
                  newArr[index].cost = +e.target.value;
                  newArr[index].total = +e.target.value + newArr[index].tax;
                  setPaymentTypesDetails(newArr);

                  const newTotal = paymentTypesDetails.reduce(
                    (prev, curr) => prev + curr.total,
                    0
                  );
                  setPaymentDetails({
                    ...paymentDetails,
                    total: +newTotal.toFixed(2),
                  });
                }}
                min={0}
                step={0.01}
              />

              <FormInput
                label="الضريبة"
                name="itemTotal"
                labeClassNames={lableClassNamesStyles.default}
                className={inputClassNamesStyles.default}
                type="number"
                value={item.tax}
                onChange={(e) => {
                  const newArr = [...paymentTypesDetails];
                  newArr[index].tax = +e.target.value;
                  newArr[index].total = newArr[index].cost + +e.target.value;
                  setPaymentTypesDetails(newArr);

                  const newTotal = paymentTypesDetails.reduce(
                    (prev, curr) => prev + curr.total,
                    0
                  );
                  setPaymentDetails({
                    ...paymentDetails,
                    total: +newTotal.toFixed(2),
                  });
                }}
                min={0}
                step={0.01}
              />

              <FormInput
                label="الاجمالى بعد الضريبة"
                name="itemTotal"
                labeClassNames={lableClassNamesStyles.default}
                className={`${inputClassNamesStyles.default} bg-slate-200`}
                type="number"
                value={item.total}
                disabled
                min={0}
                step={0.01}
              />
            </div>
          ))}

          <div className="flex justify-around">
            <button
              className="my-5 flex items-center rounded border bg-blue-800 px-2 py-2 text-xs font-bold text-white shadow transition-all duration-300 ease-in-out hover:border-blue-800
             hover:bg-white hover:text-blue-800 sm:px-3 sm:text-sm"
              onClick={() => handleItemCount(1)}
              type="button"
            >
              <AiFillPlusCircle className="mr-1" size={20} />
              إضافة نوع جديد
            </button>

            <button
              className="my-5 flex items-center rounded border bg-red-800 px-2 py-2 text-xs font-bold text-white shadow transition-all duration-300 ease-in-out hover:border-red-800
             hover:bg-white hover:text-red-800 sm:px-3 sm:text-sm"
              onClick={() => handleItemCount(-1)}
              type="button"
            >
              <AiFillMinusCircle className="mr-1" size={20} />
              حذف نوع مصروف
            </button>
          </div>

          <p className="my-4 rounded bg-red-800 p-2 text-lg font-bold text-white">
            [ تفــاصيل المصروف الحالية ]
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 px-5 py-5 font-semibold">
            <FormInput
              label="المبلغ الكــلى"
              name="totalPayment"
              labeClassNames={lableClassNamesStyles.default}
              className={`${inputClassNamesStyles.default} bg-slate-200`}
              type="number"
              value={paymentDetails.total}
              disabled
              min={0}
              step={0.01}
              required
            />

            <FormInput
              label="تــاريـخ المصــروف"
              name="paymentDate"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="date"
              value={paymentDetails.date}
              onChange={(e) =>
                setPaymentDetails({ ...paymentDetails, date: e.target.value })
              }
              required
            />
          </div>

          {/*Form Button */}
          <FormButton
            text={{ default: "تعديل المصــروف", loading: "جارى التعديل" }}
            isLoading={isLoading}
            icon={<RiSendPlaneFill className="mr-1" size={25} />}
          />
        </form>
      </motion.div>
    </div>
  );
};
