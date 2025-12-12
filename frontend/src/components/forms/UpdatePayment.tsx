import { useState, useEffect } from "react";
import {
  AiFillCloseCircle,
  AiFillMinusCircle,
  AiFillPlusCircle,
} from "react-icons/ai";
import { RiSendPlaneFill } from "react-icons/ri";
import { FormInput } from "../shared/FormInput";
import dayjs from "dayjs";
import {
  useGetOnePaymentQuery,
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
import { IPaymentType } from "../../../../backend/models/paymentModel";
import FormButton from "../shared/FormButton";
import DataFetchingErrorMessage from "../shared/DataFetchingErrorMessage";
import DataFetchingSpinner from "../shared/DataFetchingSpinner";
import PaymentAlt from "../../assets/icons/payment-alt.svg?react";

export const UpdatePayment = ({
  id,
  setIsOpen,
}: {
  id: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  //initialize state
  const initialPaymentDetails = {
    date: dayjs().format("YYYY-MM-DD"),
    total: 0,
  };

  const initialPaymentTypes: IPaymentType[] = [
    {
      name: "",
      description: "",
      method: "",
      company_name: "",
      company_tax: "",
      cost: 0,
      tax: 0,
      total: 0,
    },
  ];

  // Data fetching
  const {
    data: foundPayment,
    isLoading,
    error,
  } = useGetOnePaymentQuery({ id });

  //state for payment Details
  const [paymentDetails, setPaymentDetails] = useState(initialPaymentDetails);

  //state for paymentTypes Details
  const [paymentTypesDetails, setPaymentTypesDetails] =
    useState<IPaymentType[]>(initialPaymentTypes);

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
              company_name: "",
              company_tax: "",
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

  const [updatePayment, { isLoading: isUpdating }] = useUpdatePaymentMutation();

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

  // Initialize state after data is fetched
  useEffect(() => {
    if (foundPayment) {
      //Payment Details
      setPaymentDetails({
        date: dayjs(foundPayment?.date).format("YYYY-MM-DD"),
        total: foundPayment?.total,
      });

      const paymentTypesData: IPaymentType[] = [
        ...foundPayment?.payment_types?.map((item: any) => {
          return {
            name: item?.name,
            description: item?.description,
            method: item?.method,
            company_name: item?.company_name,
            company_tax: item?.company_tax,
            cost: item?.cost,
            tax: item?.tax ? item?.tax : 0,
            total: item?.total,
          };
        }),
      ];

      //PaymentTypes Details
      setPaymentTypesDetails(paymentTypesData);
    }
  }, [foundPayment]);

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
  if (!foundPayment || isLoading) return <DataFetchingSpinner />;

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
                label="Company name"
                name="companyName"
                labeClassNames={lableClassNamesStyles.default}
                className={inputClassNamesStyles.default}
                type="text"
                value={item.company_name}
                onChange={(e) => {
                  const newArr = [...paymentTypesDetails];
                  newArr[index].company_name = e.target.value;
                  setPaymentTypesDetails(newArr);
                }}
              />

              <FormInput
                label="Company Tax Number"
                name="companyTax"
                labeClassNames={lableClassNamesStyles.default}
                className={inputClassNamesStyles.default}
                type="text"
                value={item.company_tax}
                onChange={(e) => {
                  const newArr = [...paymentTypesDetails];
                  newArr[index].company_tax = e.target.value;
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
            isLoading={isUpdating}
            icon={<RiSendPlaneFill className="mr-1" size={25} />}
          />
        </form>
      </motion.div>
    </div>
  );
};
