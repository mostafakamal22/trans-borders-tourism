import { useEffect, useState } from "react";
import { FcDebt } from "react-icons/fc";
import { UseResetStatus } from "../../hooks/UseResetStatus";
import { resetAdminAuthStatus } from "../../state/features/admin/auth/adminAuthSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../state/features/hooks/StateHooks";
import {
  createVisa,
  resetVisasStatus,
} from "../../state/features/visa/visaSlice";
import { FormInput } from "../shared/FormInput";
import { visaTableHeaderTitles } from "../visa/Visas";
import { inputClassNamesStyles, lableClassNamesStyles } from "./CreateInvoice";
import logo from "../../assets/imgs/trans-logo.png";
import MessagesContainer from "../shared/MessagesContainer";
import FormButton from "../shared/FormButton";
import { RiSendPlaneFill } from "react-icons/ri";

export const CreateVisa = () => {
  //state for Visa Details
  const [visaDetails, setVisaDetails] = useState({
    name: "",
    number: "",
    version: "",
    provider: "",
    type: "",
    state: "",
    passportId: "",
    paymentDate: "",
    netFare: 0,
    sales: 0,
    profit: 0,
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
      name: visaDetails.name,
      number: visaDetails.number,
      version: visaDetails.version,
      provider: visaDetails.provider,
      type: visaDetails.type,
      state: visaDetails.state,
      passportId: visaDetails.passportId,
      paymentDate: visaDetails.paymentDate,
      netFare: visaDetails.netFare,
      sales: visaDetails.sales,
      profit: visaDetails.profit,
    };

    dispatch(createVisa(visaData));
  };

  //clean up status (when mount and unmount)
  UseResetStatus(() => {
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
    <div className="max-w-6xl w-full mx-auto my-20 p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
      <h3 className="flex justify-center items-center text-xl text-center font-bold px-2 py-4 mb-10 bg-red-200 border-b-4 border-red-800 rounded shadow ">
        <FcDebt className="mr-1" size={50} />
        <span>إضافة تأشيرة جديد</span>
      </h3>

      <img className="mx-auto" src={logo} alt="logo" />

      <form onSubmit={handleSubmit}>
        <p className="font-bold p-2 rounded text-lg text-white bg-red-800 my-4">
          [ Visa Details ]
        </p>
        <div className="flex justify-center items-center font-semibold flex-wrap gap-4 px-5 py-5">
          <FormInput
            label={visaTableHeaderTitles[4]}
            name="customerName"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="text"
            defaultValue={visaDetails.name}
            onChange={(e) =>
              setVisaDetails({ ...visaDetails, name: e.target.value })
            }
            required
          />

          <FormInput
            label={visaTableHeaderTitles[2]}
            name="customerNumber"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="text"
            defaultValue={visaDetails.number}
            onChange={(e) =>
              setVisaDetails({ ...visaDetails, number: e.target.value })
            }
            required
          />

          <FormInput
            label={visaTableHeaderTitles[3]}
            name="passportId"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="text"
            defaultValue={visaDetails.passportId}
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
            defaultValue={visaDetails.provider}
            onChange={(e) =>
              setVisaDetails({ ...visaDetails, provider: e.target.value })
            }
            required
          />

          <FormInput
            label={visaTableHeaderTitles[8]}
            name="VisaType"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="text"
            defaultValue={visaDetails.type}
            onChange={(e) =>
              setVisaDetails({ ...visaDetails, type: e.target.value })
            }
            required
          />

          <FormInput
            label={visaTableHeaderTitles[1]}
            name="VisaState"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="text"
            defaultValue={visaDetails.state}
            onChange={(e) =>
              setVisaDetails({ ...visaDetails, state: e.target.value })
            }
            required
          />

          <FormInput
            label={visaTableHeaderTitles[9]}
            name="VisaVersion"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="text"
            defaultValue={visaDetails.version}
            onChange={(e) =>
              setVisaDetails({ ...visaDetails, version: e.target.value })
            }
            required
          />

          <FormInput
            label={visaTableHeaderTitles[7]}
            name="netFare"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="number"
            defaultValue={visaDetails.netFare}
            onChange={(e) =>
              setVisaDetails({
                ...visaDetails,
                netFare: +e.target.value,
              })
            }
            required
            min={0}
            step={0.01}
          />

          <FormInput
            label={visaTableHeaderTitles[6]}
            name="sales"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="number"
            defaultValue={visaDetails.sales}
            onChange={(e) =>
              setVisaDetails({
                ...visaDetails,
                sales: +e.target.value,
              })
            }
            required
            min={0}
            step={0.01}
          />

          <FormInput
            label={visaTableHeaderTitles[5]}
            name="totalPayment"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="number"
            defaultValue={visaDetails.profit}
            onChange={(e) =>
              setVisaDetails({
                ...visaDetails,
                profit: +e.target.value,
              })
            }
            required
            min={0}
            step={0.01}
          />

          <FormInput
            label={visaTableHeaderTitles[11]}
            name="paymentDate"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="date"
            defaultValue={visaDetails.paymentDate}
            onChange={(e) =>
              setVisaDetails({
                ...visaDetails,
                paymentDate: e.target.value,
              })
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
          text={{ default: "حفظ التأشيرة", loading: "جارى الحفظ" }}
          isLoading={isLoading}
          icon={<RiSendPlaneFill className="ml-1" size={25} />}
        />
      </form>
    </div>
  );
};
