import { useEffect, useState } from "react";
import { UseResetStatus } from "../../hooks/UseResetStatus";
import { resetAdminAuthStatus } from "../../state/features/admin/auth/adminAuthSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../state/features/hooks/StateHooks";
import {
  createPassport,
  resetPassportsStatus,
} from "../../state/features/passport/passportSlice";
import FormButton from "../shared/FormButton";
import MessagesContainer from "../shared/MessagesContainer";
import { inputClassNamesStyles, lableClassNamesStyles } from "./CreateInvoice";
import logo from "../../assets/imgs/trans-logo.png";
import { FcTemplate } from "react-icons/fc";
import { FormInput } from "../shared/FormInput";
import { RiSendPlaneFill } from "react-icons/ri";
import {
  PassportService,
  passportService,
  PassportState,
  passportState,
  tableHeaderTitles,
} from "../passport/Passports";

export const CreatePassport = () => {
  //state for passport Details
  const [passportDetails, setPassportDetails] = useState({
    name: "",
    nationality: "",
    state: "accepted",
    service: "30days",
    passportId: "",
    paymentDate: "",
    servicePrice: 0,
    taxable: 0,
    taxRate: 0,
    total: 0,
    sales: 0,
    profit: 0,
  });

  //state for alert messages
  const [msg, setMsg] = useState("");

  const { info } = useAppSelector((state) => state.adminAuth);
  const { isError, isSuccess, isLoading, message } = useAppSelector(
    (state) => state.passportsData
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

    const passportData = {
      token: info.token,
      name: passportDetails.name,
      nationality: passportDetails.nationality.trim(),
      state: passportDetails.state,
      service: passportDetails.service,
      passportId: passportDetails.passportId,
      paymentDate: passportDetails.paymentDate,
      servicePrice: passportDetails.servicePrice,
      taxable: passportDetails.taxable,
      taxRate: passportDetails.taxRate,
      total: passportDetails.total,
      sales: passportDetails.sales,
      profit: passportDetails.profit,
    };

    dispatch(createPassport(passportData));
  };

  //clean up status (when mount and unmount)
  UseResetStatus(() => {
    dispatch(resetAdminAuthStatus());
    dispatch(resetPassportsStatus());
  });

  UseResetStatus(() => {
    return () => {
      dispatch(resetAdminAuthStatus());
      dispatch(resetPassportsStatus());
    };
  });

  return (
    <div className="max-w-6xl w-full mx-auto my-20 p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
      <h3 className="flex justify-center items-center text-xl text-center font-bold px-2 py-4 mb-10 bg-red-200 border-b-4 border-red-800 rounded shadow ">
        <FcTemplate className="mr-1" size={50} />
        <span>إضافة جواز جديد</span>
      </h3>

      <img className="mx-auto" src={logo} alt="logo" />

      <form onSubmit={handleSubmit}>
        <p className="font-bold p-2 rounded text-lg text-white bg-red-800 my-4">
          [ بيانات الجواز ]
        </p>
        <div className="flex justify-center items-center font-semibold flex-wrap gap-4 px-5 py-5">
          <FormInput
            label={tableHeaderTitles[0]}
            name="customerName"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="text"
            value={passportDetails.name}
            onChange={(e) =>
              setPassportDetails({ ...passportDetails, name: e.target.value })
            }
            required
          />

          <FormInput
            label={tableHeaderTitles[1]}
            name="customerNationality"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="text"
            value={passportDetails.nationality}
            onChange={(e) =>
              setPassportDetails({
                ...passportDetails,
                nationality: e.target.value,
              })
            }
          />

          <FormInput
            label={tableHeaderTitles[2]}
            name="passportId"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="text"
            value={passportDetails.passportId}
            onChange={(e) =>
              setPassportDetails({
                ...passportDetails,
                passportId: e.target.value,
              })
            }
            required
          />

          <FormInput
            label={tableHeaderTitles[5]}
            name="servicePrice"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="number"
            value={passportDetails.servicePrice}
            onChange={(e) =>
              setPassportDetails({
                ...passportDetails,
                servicePrice: +e.target.value,
                total:
                  +e.target.value +
                  passportDetails.taxable +
                  passportDetails.taxRate,
                profit:
                  passportDetails.sales -
                  +e.target.value -
                  passportDetails.taxable -
                  passportDetails.taxRate,
              })
            }
            min={0}
            step={0.01}
          />

          <FormInput
            label={tableHeaderTitles[6]}
            name="taxable"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="number"
            value={passportDetails.taxable}
            onChange={(e) =>
              setPassportDetails({
                ...passportDetails,
                taxable: +e.target.value,
                total:
                  +e.target.value +
                  passportDetails.servicePrice +
                  passportDetails.taxRate,
                profit:
                  passportDetails.sales -
                  +e.target.value -
                  passportDetails.servicePrice -
                  passportDetails.taxRate,
              })
            }
            min={0}
            step={0.01}
          />

          <FormInput
            label={tableHeaderTitles[7]}
            name="taxRate"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="number"
            value={passportDetails.taxRate}
            onChange={(e) =>
              setPassportDetails({
                ...passportDetails,
                taxRate: +e.target.value,
                total:
                  +e.target.value +
                  passportDetails.taxable +
                  passportDetails.servicePrice,
                profit:
                  passportDetails.sales -
                  +e.target.value -
                  passportDetails.taxable -
                  passportDetails.servicePrice,
              })
            }
            min={0}
            step={0.01}
          />

          <FormInput
            label={tableHeaderTitles[8]}
            name="totalPayment"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="number"
            value={passportDetails.total}
            onChange={(e) =>
              setPassportDetails({
                ...passportDetails,
                total: +e.target.value,
                profit: passportDetails.sales - +e.target.value,
              })
            }
            min={0}
            step={0.01}
          />

          <FormInput
            label={tableHeaderTitles[9]}
            name="sales"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="number"
            value={passportDetails.sales}
            onChange={(e) =>
              setPassportDetails({
                ...passportDetails,
                sales: +e.target.value,
                profit: +e.target.value - passportDetails.total,
              })
            }
            min={0}
            step={0.01}
          />

          <FormInput
            label={tableHeaderTitles[10]}
            name="profit"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="number"
            value={passportDetails.profit}
            onChange={(e) =>
              setPassportDetails({
                ...passportDetails,
                profit: +e.target.value,
              })
            }
            min={0}
            step={0.01}
          />

          <FormInput
            label={tableHeaderTitles[11]}
            name="paymentDate"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="date"
            value={passportDetails.paymentDate}
            onChange={(e) =>
              setPassportDetails({
                ...passportDetails,
                paymentDate: e.target.value,
              })
            }
          />

          <label htmlFor="state" className={lableClassNamesStyles.default}>
            {tableHeaderTitles[3]}
          </label>
          <select
            name="state"
            className={inputClassNamesStyles.default}
            value={passportDetails.state}
            onChange={(e) =>
              setPassportDetails({ ...passportDetails, state: e.target.value })
            }
          >
            {Object.keys(passportState).map((name: string) => (
              <option key={name} value={name}>
                {passportState[name as keyof PassportState][0]}
              </option>
            ))}
          </select>

          <label htmlFor="service" className={lableClassNamesStyles.default}>
            {tableHeaderTitles[4]}
          </label>
          <select
            name="service"
            className={inputClassNamesStyles.default}
            value={passportDetails.service}
            onChange={(e) =>
              setPassportDetails({
                ...passportDetails,
                service: e.target.value,
              })
            }
          >
            {Object.keys(passportService).map((name: string) => (
              <option key={name} value={name}>
                {passportService[name as keyof PassportService]}
              </option>
            ))}
          </select>
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
          text={{ default: "حفظ الجواز", loading: "جارى الحفظ" }}
          isLoading={isLoading}
          icon={<RiSendPlaneFill className="ml-1" size={25} />}
        />
      </form>
    </div>
  );
};
