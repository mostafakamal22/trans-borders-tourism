import { useState, useEffect } from "react";
import { FcInvite } from "react-icons/fc";
import { RiSendPlaneFill } from "react-icons/ri";
import { UseResetStatus } from "../../hooks/UseResetStatus";
import { resetAdminAuthStatus } from "../../state/features/admin/auth/adminAuthSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../state/features/hooks/StateHooks";
import {
  createPayment,
  resetPaymentsStatus,
} from "../../state/features/payment/paymentSlice";
import FormButton from "../shared/FormButton";
import MessagesContainer from "../shared/MessagesContainer";
import logo from "../../assets/imgs/trans-logo.png";
import { FormInput } from "../shared/FormInput";
import { inputClassNamesStyles, lableClassNamesStyles } from "./CreateInvoice";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";

export const CreatePayment = () => {
  //state for payment Details
  const [paymentDetails, setPaymentDetails] = useState({
    date: "",
    total: 0,
  });

  //state for paymentTypes Details
  const [paymentTypesDetails, setPaymentTypesDetails] = useState([
    {
      name: "",
      total: 0,
    },
  ]);

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
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    //set msg to none first
    setMsg("");

    const paymentData = {
      token: info.token,
      paymentTypes: [...paymentTypesDetails],
      total: paymentDetails.total,
      paymentDate: paymentDetails.date,
    };

    dispatch(createPayment(paymentData));
  };

  //clean up status (when mount and unmount)
  UseResetStatus(() => {
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
    <div className="max-w-6xl w-full mx-auto my-20 p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
      <h3 className="flex justify-center items-center text-xl text-center font-bold px-2 py-4 mb-10 bg-red-200 border-b-4 border-red-800 rounded shadow ">
        <FcInvite className="mr-1" size={50} />
        <span>إضافة مصروف جديدة</span>
      </h3>

      <img className="mx-auto" src={logo} alt="logo" />

      <form onSubmit={handleSubmit}>
        <p className="font-bold p-2 rounded text-lg text-white bg-red-800 my-4">
          [ تفــاصيل نوع المصروف ]
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
              defaultValue={item.name}
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
              defaultValue={item.total}
              onChange={(e) => {
                const newArr = [...paymentTypesDetails];
                newArr[index].total = +e.target.value;
                setPaymentTypesDetails(newArr);
              }}
              min={0}
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
          [ تفــاصيل المصروف ]
        </p>
        <div className="flex justify-center items-center font-semibold flex-wrap gap-4 px-5 py-5">
          <FormInput
            label="المبلغ الكــلى"
            name="totalPayment"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="number"
            defaultValue={paymentDetails.total}
            onChange={(e) =>
              setPaymentDetails({ ...paymentDetails, total: +e.target.value })
            }
            required
          />

          <FormInput
            label="تــاريـخ المصــروف"
            name="paymentDate"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="date"
            defaultValue={paymentDetails.date}
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
          text={{ default: "حفظ المصــروف", loading: "جارى الحفظ" }}
          isLoading={isLoading}
          icon={<RiSendPlaneFill className="mr-1" size={25} />}
        />
      </form>
    </div>
  );
};
