import { useState, useEffect } from "react";
import { ReactComponent as PassportAlt } from "../../assets/icons/passport-alt.svg";
import { RiSendPlaneFill } from "react-icons/ri";
import {
  passportService,
  passportState,
  passportTableHeaderTitles,
} from "../passport/constants";
import { PassportService, PassportState } from "../passport/types";
import FormButton from "../shared/FormButton";
import { FormInput } from "../shared/FormInput";
import {
  inputClassNamesStyles,
  lableClassNamesStyles,
} from "../invoice/constants";
import { AiFillCloseCircle } from "react-icons/ai";
import dayjs from "dayjs";
import {
  useGetPassportsQuery,
  useUpdatePassportMutation,
} from "../../state/features/passport/passportsApiSlice";
import { motion } from "framer-motion";
import {
  closeBtnAnimationsOptions,
  modalAnimationOptions,
} from "../helpers/animationOptions";
import {
  calculatePassportProfit,
  calculatePassportTotal,
} from "./CreatePassport";

export const UpdatePassport = ({
  id,
  setIsOpen,
}: {
  id: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { passport } = useGetPassportsQuery(
    {},
    {
      selectFromResult: ({ data }) => ({
        passport: data?.docs.find((passport) => passport.id === id),
      }),
    }
  );

  if (!passport) {
    setIsOpen(false);
    return null;
  }

  //state for passport Details
  const [passportDetails, setPassportDetails] = useState({
    name: passport?.customer_name,
    nationality: passport?.customer_nationality,
    state: passport?.state,
    service: passport?.service,
    passportId: passport?.passport_id,
    paymentDate: passport?.payment_date
      ? dayjs(passport?.payment_date).format("YYYY-MM-DD")
      : "",
    servicePrice: passport?.service_price,
    taxable: passport?.taxable,
    taxRate: passport?.tax_rate,
    total: passport?.total,
    sales: passport?.sales,
    profit: passport?.profit,
  });

  const [updatePassport, { isLoading }] = useUpdatePassportMutation();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const passportData = {
      id,
      name: passportDetails.name.trim(),
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

    await updatePassport(passportData);
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
          <PassportAlt className="mr-1 h-16 w-16 drop-shadow" />
          <span> تعديل بيانات الجواز</span>
        </h3>

        <form onSubmit={handleSubmit}>
          <p className="my-4 rounded bg-red-800 p-2 text-lg font-bold text-white">
            [ بيانات الجواز الحالية ]
          </p>
          <div className="mb-10 flex flex-wrap items-center justify-center gap-4 px-5 py-5 font-semibold">
            <FormInput
              label={passportTableHeaderTitles[0]}
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
              label={passportTableHeaderTitles[1]}
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
              label={passportTableHeaderTitles[2]}
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
              label={passportTableHeaderTitles[5]}
              name="servicePrice"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="number"
              value={passportDetails.servicePrice}
              onChange={(e) =>
                setPassportDetails({
                  ...passportDetails,
                  servicePrice: +e.target.value,
                  sales:
                    passportDetails.service === "change_situation"
                      ? +e.target.value +
                        passportDetails.taxRate +
                        passportDetails.taxable
                      : 0,
                  total:
                    passportDetails.service === "change_situation"
                      ? +e.target.value +
                        passportDetails.taxRate +
                        passportDetails.taxable
                      : 0,
                  profit: 0,
                })
              }
              min={0}
              step={0.01}
            />

            <FormInput
              label={passportTableHeaderTitles[7]}
              name="taxable"
              labeClassNames={lableClassNamesStyles.default}
              className={`${inputClassNamesStyles.default} bg-slate-200`}
              type="number"
              value={passportDetails.taxable}
              disabled
              min={0}
              step={0.01}
            />

            <FormInput
              label={passportTableHeaderTitles[6]}
              name="taxRate"
              labeClassNames={lableClassNamesStyles.default}
              className={`${inputClassNamesStyles.default} bg-slate-200`}
              type="number"
              value={passportDetails.taxRate}
              disabled
              min={0}
              step={0.01}
            />

            <FormInput
              label={passportTableHeaderTitles[8]}
              name="totalPayment"
              labeClassNames={lableClassNamesStyles.default}
              className={`${inputClassNamesStyles.default} bg-slate-200`}
              type="number"
              value={passportDetails.total}
              disabled
              min={0}
              step={0.01}
            />

            <FormInput
              label={passportTableHeaderTitles[10]}
              name="sales"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="number"
              value={passportDetails.sales}
              onChange={(e) =>
                setPassportDetails({
                  ...passportDetails,
                  total: calculatePassportTotal({
                    sales: +e.target.value,
                    servicePrice: passportDetails.servicePrice,
                  }),
                  sales: +e.target.value,
                  profit: +calculatePassportProfit({
                    sales: +e.target.value,
                    servicePrice: passportDetails.servicePrice,
                  }),
                })
              }
              min={0}
              step={0.01}
            />

            <FormInput
              label={passportTableHeaderTitles[11]}
              name="profit"
              labeClassNames={lableClassNamesStyles.default}
              className={`${inputClassNamesStyles.default} bg-slate-200`}
              type="number"
              value={passportDetails.profit}
              disabled
              min={0}
              step={0.01}
            />

            <FormInput
              label={passportTableHeaderTitles[12]}
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
              required
            />

            <select
              name="state"
              id="state"
              className={inputClassNamesStyles.default}
              value={passportDetails.state}
              onChange={(e) =>
                setPassportDetails({
                  ...passportDetails,
                  state: e.target.value,
                })
              }
            >
              {Object.keys(passportState).map((name: string) => (
                <option key={name} value={name}>
                  {passportState[name as keyof PassportState][0]}
                </option>
              ))}
            </select>
            <label htmlFor="state" className={lableClassNamesStyles.default}>
              {passportTableHeaderTitles[3]}
            </label>

            <select
              name="service"
              id="service"
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
            <label htmlFor="service" className={lableClassNamesStyles.default}>
              {passportTableHeaderTitles[4]}
            </label>
          </div>

          {/*Form Button */}
          <FormButton
            text={{ default: "حفظ التعديلات", loading: "جارى الحفظ" }}
            isLoading={isLoading}
            icon={<RiSendPlaneFill className="ml-1" size={25} />}
          />
        </form>
      </motion.div>
    </div>
  );
};
