import { useEffect, useState } from "react";
import FormButton from "../shared/FormButton";
import {
  inputClassNamesStyles,
  lableClassNamesStyles,
} from "../invoice/constants";
import { FcTemplate } from "react-icons/fc";
import { FormInput } from "../shared/FormInput";
import { RiSendPlaneFill } from "react-icons/ri";
import {
  passportService,
  passportState,
  passportTableHeaderTitles,
} from "../passport/constants";
import { PassportService, PassportState } from "../passport/types";
import { useCreatePassportMutation } from "../../state/features/passport/passportsApiSlice";
import { useScroll } from "../../hooks/useScroll";
import useDocumentTitle from "../../hooks/useDocumentTitle";

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
    taxable: 53,
    taxRate: 2.65,
    total: 0,
    sales: 0,
    profit: 0,
  });

  const [createPassport, { isSuccess, isLoading }] =
    useCreatePassportMutation();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const passportData = {
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

    await createPassport(passportData);
  };

  useEffect(() => {
    if (isSuccess) {
      //Set Passport Inputs To Default
      setPassportDetails({
        name: "",
        nationality: "",
        state: "accepted",
        service: "30days",
        passportId: "",
        paymentDate: "",
        servicePrice: 0,
        taxable: 53,
        taxRate: 2.65,
        total: 0,
        sales: 0,
        profit: 0,
      });
    }
  }, [isSuccess]);

  useScroll("createPassport");
  useDocumentTitle("إضافة جواز جديد");

  return (
    <section id="createPassport" className="w-full">
      <h3 className="mb-10 flex items-center justify-center rounded bg-red-800 px-2 py-4 text-center text-xl font-bold text-white shadow ">
        <FcTemplate className="mr-1 drop-shadow" size={50} />
        <span>إضافة جواز جديد</span>
      </h3>

      <form onSubmit={handleSubmit}>
        <p className="my-4 rounded bg-red-800 p-2 text-lg font-bold text-white">
          [ بيانات الجواز ]
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
                total:
                  +e.target.value +
                  passportDetails.taxable +
                  passportDetails.taxRate,
                sales:
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
            label={passportTableHeaderTitles[6]}
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

                sales:
                  passportDetails.service === "change_situation"
                    ? +e.target.value +
                      passportDetails.taxRate +
                      passportDetails.servicePrice
                    : 0,
                profit: 0,
              })
            }
            min={0}
            step={0.01}
          />

          <FormInput
            label={passportTableHeaderTitles[7]}
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
                sales:
                  passportDetails.service === "change_situation"
                    ? +e.target.value +
                      passportDetails.taxable +
                      passportDetails.servicePrice
                    : 0,
                profit: 0,
              })
            }
            min={0}
            step={0.01}
          />

          <FormInput
            label={passportTableHeaderTitles[8]}
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
            label={passportTableHeaderTitles[9]}
            name="sales"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="number"
            value={passportDetails.sales}
            onChange={(e) =>
              setPassportDetails({
                ...passportDetails,
                sales: +e.target.value,
                profit: +(+e.target.value - passportDetails.total).toFixed(2),
              })
            }
            min={0}
            step={0.01}
          />

          <FormInput
            label={passportTableHeaderTitles[10]}
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
            label={passportTableHeaderTitles[11]}
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

          <select
            name="state"
            id="state"
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
          text={{ default: "حفظ الجواز", loading: "جارى الحفظ" }}
          isLoading={isLoading}
          icon={<RiSendPlaneFill className="ml-1" size={25} />}
        />
      </form>
    </section>
  );
};
