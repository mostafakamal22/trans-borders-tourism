import { useState, useEffect } from "react";
import { RiSendPlaneFill } from "react-icons/ri";
import { FormInput } from "../shared/FormInput";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { useCreatePaymentMutation } from "../../state/features/payment/paymentApiSlice";
import { useScroll } from "../../hooks/useScroll";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import {
  inputClassNamesStyles,
  lableClassNamesStyles,
} from "../invoice/constants";
import { paymentMethods, paymentTypes } from "../payment/constants";
import { PaymentMethods, PaymentTypes } from "../payment/types";
import { IPaymentType } from "../../../../backend/models/paymentModel";
import FormButton from "../shared/FormButton";
import PaymentAlt from "../../assets/icons/payment-alt.svg?react";

export default function CreatePayment() {
  //state for payment Details
  const [paymentDetails, setPaymentDetails] = useState({
    date: "",
    total: 0,
  });

  //state for paymentTypes Details
  const [paymentTypesDetails, setPaymentTypesDetails] = useState<
    IPaymentType[]
  >([
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
  ]);

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
        : paymentTypesDetails.splice(0, paymentTypesDetails.length - 1);

    setPaymentTypesDetails(newItems);

    const newTotal = newItems.reduce((prev, curr) => prev + curr.total, 0);
    setPaymentDetails({ ...paymentDetails, total: newTotal });
  };

  const [createPayment, { isSuccess, isLoading }] = useCreatePaymentMutation();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const paymentData = {
      paymentTypes: [...paymentTypesDetails],
      total: paymentDetails.total,
      paymentDate: paymentDetails.date,
    };

    await createPayment(paymentData);
  };

  useEffect(() => {
    if (isSuccess) {
      //Set Payment Inputs To Default
      setPaymentDetails({
        date: "",
        total: 0,
      });

      setPaymentTypesDetails([
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
      ]);
    }
  }, [isSuccess]);

  useScroll("createPayment");
  useDocumentTitle("إضافة مصروف جديد");

  return (
    <section id="createPayment" className="w-full">
      <h3 className="mb-10 flex items-center justify-center rounded bg-red-800 px-2 py-4 text-center text-xl font-bold text-white shadow ">
        <PaymentAlt className="mr-2 h-16 w-16 drop-shadow" />
        <span>إضافة مصروف جديد</span>
      </h3>

      <form onSubmit={handleSubmit}>
        <p className="my-4 rounded bg-red-800 p-2 text-lg font-bold text-white">
          [ تفـاصيل نوع المصروف ]
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
            <label htmlFor="itemName" className={lableClassNamesStyles.default}>
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
          [ تفــاصيل المصروف ]
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
          text={{ default: "حفظ المصــروف", loading: "جارى الحفظ" }}
          isLoading={isLoading}
          icon={<RiSendPlaneFill className="mr-1" size={25} />}
        />
      </form>
    </section>
  );
}
