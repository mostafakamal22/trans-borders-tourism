import { useState, useEffect } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { FcDebt } from "react-icons/fc";
import { RiSendPlaneFill } from "react-icons/ri";
import { UseResetStatus } from "../../hooks/UseResetStatus";
import { resetAdminAuthStatus } from "../../state/features/admin/auth/adminAuthSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../state/features/hooks/StateHooks";
import {
  resetVisasStatus,
  updateVisa,
} from "../../state/features/visa/visaSlice";
import FormButton from "../shared/FormButton";
import { FormInput } from "../shared/FormInput";
import MessagesContainer from "../shared/MessagesContainer";
import { visaTableHeaderTitles } from "../visa/Visas";
import { inputClassNamesStyles, lableClassNamesStyles } from "./CreateInvoice";
import logo from "../../assets/imgs/trans-logo.png";
import dayjs from "dayjs";

export const UpdateVisa = ({
  id,
  setIsOpen,
}: {
  id: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { visasList } = useAppSelector((state) => state.visasData);
  const visa = visasList.find((purchase: any) => purchase._id === id);
  //state for Visa Details
  const [visaDetails, setVisaDetails] = useState({
    name: visa.customer_name,
    provider: visa.provider,
    type: visa.type,
    employee: visa.employee,
    passportId: visa.passport_id,
    paymentDate: visa.payment_date
      ? dayjs(visa?.payment_date).format("YYYY-MM-DD")
      : "",
    netFare: visa.net_fare,
    sales: visa.sales,
    profit: visa.profit,
  });

  //state for alert messages
  const [msg, setMsg] = useState("");

  const { info } = useAppSelector((state) => state.adminAuth);
  const { isError, isSuccess, isLoading, message } = useAppSelector(
    (state) => state.visasData
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

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    //set msg to none first
    setMsg("");

    const visaData = {
      token: info.token,
      id,
      name: visaDetails.name,
      provider: visaDetails.provider,
      type: visaDetails.type,
      employee: visaDetails.employee,
      passportId: visaDetails.passportId,
      paymentDate: visaDetails.paymentDate,
      netFare: visaDetails.netFare,
      sales: visaDetails.sales,
      profit: visaDetails.profit,
    };

    dispatch(updateVisa(visaData));
  };

  //clean up status (when mount and unmount)
  UseResetStatus(() => {
    //scroll page back to top when component first mount
    const yOffset = window.pageYOffset;
    window.scrollBy(0, -yOffset);

    dispatch(resetAdminAuthStatus());
    dispatch(resetVisasStatus());
  });

  UseResetStatus(() => {
    return () => {
      dispatch(resetAdminAuthStatus());
      dispatch(resetVisasStatus());
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
          <FcDebt className="mr-1" size={50} />
          <span>تعديل المبيعات</span>
        </h3>

        <img className="mx-auto" src={logo} alt="logo" />

        <form onSubmit={handleSubmit}>
          <p className="font-bold p-2 rounded text-lg text-white bg-red-800 my-4">
            [ التفاصيل الحالية ]
          </p>
          <div className="flex justify-center items-center font-semibold flex-wrap gap-4 px-5 py-5">
            <FormInput
              label={visaTableHeaderTitles[5]}
              name="customerName"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="text"
              value={visaDetails.name}
              onChange={(e) =>
                setVisaDetails({ ...visaDetails, name: e.target.value })
              }
              required
            />

            <FormInput
              label={visaTableHeaderTitles[4]}
              name="passportId"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="text"
              value={visaDetails.passportId}
              onChange={(e) =>
                setVisaDetails({ ...visaDetails, passportId: e.target.value })
              }
              required
            />

            <FormInput
              label={visaTableHeaderTitles[10]}
              name="VisaProvider"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="text"
              value={visaDetails.provider}
              onChange={(e) =>
                setVisaDetails({ ...visaDetails, provider: e.target.value })
              }
            />

            <FormInput
              label={visaTableHeaderTitles[9]}
              name="VisaType"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="text"
              value={visaDetails.type}
              onChange={(e) =>
                setVisaDetails({ ...visaDetails, type: e.target.value })
              }
            />

            <FormInput
              label={visaTableHeaderTitles[3]}
              name="employee"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="text"
              value={visaDetails.employee}
              onChange={(e) =>
                setVisaDetails({ ...visaDetails, employee: e.target.value })
              }
            />

            <FormInput
              label={visaTableHeaderTitles[8]}
              name="netFare"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="number"
              value={visaDetails.netFare}
              onChange={(e) =>
                setVisaDetails({
                  ...visaDetails,
                  netFare: +e.target.value,
                  profit: visaDetails.sales - +e.target.value,
                })
              }
              min={0}
              step={0.01}
            />

            <FormInput
              label={visaTableHeaderTitles[7]}
              name="sales"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="number"
              value={visaDetails.sales}
              onChange={(e) =>
                setVisaDetails({
                  ...visaDetails,
                  sales: +e.target.value,
                  profit: +e.target.value - visaDetails.netFare,
                })
              }
              min={0}
              step={0.01}
            />

            <FormInput
              label={visaTableHeaderTitles[6]}
              name="totalPayment"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="number"
              value={visaDetails.profit}
              onChange={(e) =>
                setVisaDetails({
                  ...visaDetails,
                  profit: +e.target.value,
                })
              }
              min={0}
              step={0.01}
            />

            <FormInput
              label={visaTableHeaderTitles[11]}
              name="paymentDate"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="date"
              value={visaDetails.paymentDate}
              onChange={(e) =>
                setVisaDetails({
                  ...visaDetails,
                  paymentDate: e.target.value,
                })
              }
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
            text={{ default: "حفظ التعديلات", loading: "جارى الحفظ" }}
            isLoading={isLoading}
            icon={<RiSendPlaneFill className="ml-1" size={25} />}
          />
        </form>
      </div>
    </div>
  );
};
