import { useState, useEffect } from "react";
import {
  AiFillCloseCircle,
  AiFillMinusCircle,
  AiFillPlusCircle,
} from "react-icons/ai";
import { RiSendPlaneFill } from "react-icons/ri";
import FormButton from "../shared/FormButton";
import { FormInput } from "../shared/FormInput";
import MessagesContainer from "../shared/MessagesContainer";
import { inputClassNamesStyles, lableClassNamesStyles } from "./CreateInvoice";
import logo from "../../assets/imgs/trans-logo.png";
import {
  useAppDispatch,
  useAppSelector,
} from "../../state/features/hooks/StateHooks";
import dayjs from "dayjs";
import { UseResetStatus } from "../../hooks/UseResetStatus";
import { resetAdminAuthStatus } from "../../state/features/admin/auth/adminAuthSlice";
import {
  resetPaymentsStatus,
  updatePayment,
} from "../../state/features/payment/paymentSlice";
import { FcInvite } from "react-icons/fc";

export const UpdatePayment = ({
  id,
  setIsOpen,
}: {
  id: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { paymentsList } = useAppSelector((state) => state.paymentsData);
  const payment = paymentsList.find((payment: any) => payment._id === id);

  //state for payment Details
  const [paymentDetails, setPaymentDetails] = useState({
    date: dayjs(payment.date).format("YYYY-MM-DD"),
    total: payment.total,
  });

  const paymentTypesData = [
    ...payment.payment_types.map((item: any) => {
      return { name: item.name, total: item.total };
    }),
  ];

  //state for paymentTypes Details
  const [paymentTypesDetails, setPaymentTypesDetails] =
    useState(paymentTypesData);

  //state for items
  const [itemsCount, setItemsCount] = useState(1);

  //state for alert messages
  const [msg, setMsg] = useState("");

  const { info } = useAppSelector((state) => state.adminAuth);
  const { isError, isSuccess, isLoading, message } = useAppSelector(
    (state) => state.paymentsData
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isError) {
      setMsg(message);
    }

    if (isSuccess) {
      setMsg(message);
    }
  }, [isError, isSuccess, message, info, msg]);

  const handleItemCount = async (num: number) => {
    if (num < 0 && itemsCount === 1) return;

    setItemsCount(itemsCount + num);

    const newItems =
      num > 0
        ? [
            ...paymentTypesDetails,
            {
              name: "",
              total: 0,
            },
          ]
        : paymentTypesDetails.splice(0, paymentTypesDetails.length - 1);

    setPaymentTypesDetails(newItems);

    const newTotal = newItems.reduce((prev, curr) => prev + curr.total, 0);
    setPaymentDetails({ ...paymentDetails, total: +newTotal.toFixed(2) });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    //set msg to none first
    setMsg("");

    const paymentData = {
      token: info.token,
      id,
      paymentTypes: [...paymentTypesDetails],
      total: paymentDetails.total,
      paymentDate: paymentDetails.date,
    };

    dispatch(updatePayment(paymentData));
  };

  //clean up status (when mount and unmount)
  UseResetStatus(() => {
    //scroll page back to top when component first mount
    const yOffset = window.pageYOffset;
    window.scrollBy(0, -yOffset);

    dispatch(resetAdminAuthStatus());
    dispatch(resetPaymentsStatus());
  });

  UseResetStatus(() => {
    return () => {
      dispatch(resetAdminAuthStatus());
      dispatch(resetPaymentsStatus());
    };
  });

  return (
    <div className="h-screen bg-gray-500/50 overflow-y-auto overflow-x-hidden fixed inset-0 z-50 w-full md:inset-0">
      <button
        className="fixed top-5 right-[10%] inline-flex font-bold text-xs sm:text-sm bg-red-800 text-white hover:bg-white  px-2 sm:px-3 py-2 border-transparent hover:text-red-800 border hover:border-red-800 items-center rounded
       shadow transition-all ease-in-out duration-300"
        onClick={() => setIsOpen(false)}
        type="button"
      >
        <AiFillCloseCircle className="mr-1" size={20} />
        إغلاق
      </button>
      <div className="max-w-6xl w-full mx-auto my-20 p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
        <h3 className="flex justify-center items-center text-xl text-center font-bold px-2 py-4 mb-10 bg-red-200 border-b-4 border-red-800 rounded shadow ">
          <FcInvite className="mr-1" size={50} />
          <span>تعديل المصروف </span>
        </h3>

        <img className="mx-auto" src={logo} alt="logo" />

        <form onSubmit={handleSubmit}>
          <p className="font-bold p-2 rounded text-lg text-white bg-red-800 my-4">
            [ تفــاصيل نوع المصروف الحالية ]
          </p>
          {paymentTypesDetails.map((item, index) => (
            <div
              key={index}
              className="flex flex-wrap items-center font-semibold  gap-4 px-5 py-5"
            >
              <FormInput
                label="نوع المصـروف"
                name="itemName"
                labeClassNames={lableClassNamesStyles.default}
                className={inputClassNamesStyles.default}
                type="text"
                value={item.name}
                onChange={(e) => {
                  const newArr = [...paymentTypesDetails];
                  newArr[index].name = e.target.value;
                  setPaymentTypesDetails(newArr);
                }}
                required
              />

              <FormInput
                label="المبلـغ"
                name="itemTotal"
                labeClassNames={lableClassNamesStyles.default}
                className={inputClassNamesStyles.default}
                type="number"
                value={item.total}
                onChange={(e) => {
                  const newArr = [...paymentTypesDetails];
                  newArr[index].total = +e.target.value;
                  setPaymentTypesDetails(newArr);

                  const newTotal = paymentTypesDetails.reduce(
                    (prev: number, curr: any) => prev + curr.total,
                    0
                  );
                  setPaymentDetails({ ...paymentDetails, total: newTotal });
                }}
                min={0}
                step={0.01}
                required
              />
            </div>
          ))}

          <div className="flex justify-around">
            <button
              className="inline-flex font-bold text-xs sm:text-sm bg-blue-800 text-white hover:bg-white my-5 px-2 sm:px-3 py-2 hover:text-blue-800 border hover:border-blue-800 items-center rounded
         shadow transition-all ease-in-out duration-300"
              onClick={() => handleItemCount(1)}
              type="button"
            >
              <AiFillPlusCircle className="mr-1" size={20} />
              إضافة نوع جديد
            </button>

            <button
              className="inline-flex font-bold text-xs sm:text-sm bg-red-800 text-white hover:bg-white my-5 px-2 sm:px-3 py-2 hover:text-red-800 border hover:border-red-800 items-center rounded
         shadow transition-all ease-in-out duration-300"
              onClick={() => handleItemCount(-1)}
              type="button"
            >
              <AiFillMinusCircle className="mr-1" size={20} />
              حذف نوع مصروف
            </button>
          </div>

          <p className="font-bold p-2 rounded text-lg text-white bg-red-800 my-4">
            [ تفــاصيل المصروف الحالية ]
          </p>
          <div className="flex justify-center items-center font-semibold flex-wrap gap-4 px-5 py-5">
            <FormInput
              label="المبلغ الكــلى"
              name="totalPayment"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="number"
              value={paymentDetails.total}
              onChange={(e) =>
                setPaymentDetails({ ...paymentDetails, total: +e.target.value })
              }
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

          {/*Request Status and Errors*/}
          {(isError || isSuccess) && (
            <MessagesContainer
              msg={msg}
              isSuccess={isSuccess}
              isError={isError}
            />
          )}

          {/*form button */}
          <FormButton
            text={{ default: "تعديل المصــروف", loading: "جارى التعديل" }}
            isLoading={isLoading}
            icon={<RiSendPlaneFill className="mr-1" size={25} />}
          />
        </form>
      </div>
    </div>
  );
};
