// import { useEffect, useState } from "react";
// import { FcDebt } from "react-icons/fc";
// import { UseResetStatus } from "../../hooks/UseResetStatus";
// import { resetAdminAuthStatus } from "../../state/features/admin/auth/adminAuthSlice";
// import {
//   useAppDispatch,
//   useAppSelector,
// } from "../../state/features/hooks/StateHooks";
// import {
//   createVisa,
//   resetVisasStatus,
// } from "../../state/features/visa/visaSlice";
// import { FormInput } from "../shared/FormInput";
// import { visaTableHeaderTitles } from "../visa/Visas";
// import { inputClassNamesStyles, lableClassNamesStyles } from "./CreateInvoice";
// import logo from "../../assets/imgs/trans-logo.png";
// import MessagesContainer from "../shared/MessagesContainer";
// import FormButton from "../shared/FormButton";
// import { RiSendPlaneFill } from "react-icons/ri";
// import { PaymentMethods, paymentMethods } from "./CreatePayment";

// export const CreateVisa = () => {
//   //state for Visa Details
//   const [visaDetails, setVisaDetails] = useState({
//     name: "",
//     provider: "",
//     sponsor: "",
//     type: "",
//     employee: "",
//     passportId: "",
//     paymentDate: "",
//     paymentMethod: "cash",
//     netFare: 0,
//     sales: 0,
//     profit: 0,
//     paidAmount: 0,
//     remainingAmount: 0,
//   });

//   //state for alert messages
//   const [msg, setMsg] = useState("");

//   const { info } = useAppSelector((state) => state.adminAuth);
//   const { isError, isSuccess, isLoading, message } = useAppSelector(
//     (state) => state.visasData
//   );

//   const dispatch = useAppDispatch();

//   useEffect(() => {
//     if (isError) {
//       setMsg(message);
//     }

//     if (isSuccess) {
//       setMsg(message);
//     }
//   }, [isError, isSuccess, message, info, msg]);

//   const handleSubmit = async (e: React.SyntheticEvent) => {
//     e.preventDefault();
//     //set msg to none first
//     setMsg("");

//     const visaData = {
//       token: info.token,
//       name: visaDetails.name,
//       provider: visaDetails.provider,
//       sponsor: visaDetails.sponsor,
//       type: visaDetails.type,
//       employee: visaDetails.employee,
//       passportId: visaDetails.passportId,
//       paymentDate: visaDetails.paymentDate,
//       netFare: visaDetails.netFare,
//       sales: visaDetails.sales,
//       profit: visaDetails.profit,
//       paymentMethod: visaDetails.paymentMethod,
//       paidAmount: visaDetails.paidAmount,
//       remainingAmount: visaDetails.remainingAmount,
//     };

//     dispatch(createVisa(visaData));
//   };

//   //clean up status (when mount and unmount)
//   UseResetStatus(() => {
//     //scroll page back to top when component first mount
//     const yOffset = window.pageYOffset;
//     window.scrollBy(0, -yOffset);

//     dispatch(resetAdminAuthStatus());
//     dispatch(resetVisasStatus());
//   });

//   UseResetStatus(() => {
//     return () => {
//       dispatch(resetAdminAuthStatus());
//       dispatch(resetVisasStatus());
//     };
//   });

//   return (
//     <div className="max-w-6xl w-full mx-auto my-20 p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
//       <h3 className="flex justify-center items-center text-xl text-center font-bold px-2 py-4 mb-10 bg-red-200 border-b-4 border-red-800 rounded shadow ">
//         <FcDebt className="mr-1" size={50} />
//         <span>إضافة تأشيرة جديدة</span>
//       </h3>

//       <img className="mx-auto" src={logo} alt="logo" />

//       <form onSubmit={handleSubmit}>
//         <p className="font-bold p-2 rounded text-lg text-white bg-red-800 my-4">
//           [ التفاصيل ]
//         </p>
//         <div className="flex justify-center items-center font-semibold flex-wrap gap-4 px-5 py-5">
//           <FormInput
//             label={visaTableHeaderTitles[5]}
//             name="customerName"
//             labeClassNames={lableClassNamesStyles.default}
//             className={inputClassNamesStyles.default}
//             type="text"
//             value={visaDetails.name}
//             onChange={(e) =>
//               setVisaDetails({ ...visaDetails, name: e.target.value })
//             }
//             required
//           />

//           <FormInput
//             label={visaTableHeaderTitles[4]}
//             name="passportId"
//             labeClassNames={lableClassNamesStyles.default}
//             className={inputClassNamesStyles.default}
//             type="text"
//             value={visaDetails.passportId}
//             onChange={(e) =>
//               setVisaDetails({ ...visaDetails, passportId: e.target.value })
//             }
//             required
//           />

//           <FormInput
//             label={visaTableHeaderTitles[11]}
//             name="VisaProvider"
//             labeClassNames={lableClassNamesStyles.default}
//             className={inputClassNamesStyles.default}
//             type="text"
//             value={visaDetails.provider}
//             onChange={(e) =>
//               setVisaDetails({ ...visaDetails, provider: e.target.value })
//             }
//           />

//           <FormInput
//             label={visaTableHeaderTitles[10]}
//             name="VisaSponsor"
//             labeClassNames={lableClassNamesStyles.default}
//             className={inputClassNamesStyles.default}
//             type="text"
//             value={visaDetails.sponsor}
//             onChange={(e) =>
//               setVisaDetails({ ...visaDetails, sponsor: e.target.value })
//             }
//           />

//           <FormInput
//             label={visaTableHeaderTitles[9]}
//             name="VisaType"
//             labeClassNames={lableClassNamesStyles.default}
//             className={inputClassNamesStyles.default}
//             type="text"
//             value={visaDetails.type}
//             onChange={(e) =>
//               setVisaDetails({ ...visaDetails, type: e.target.value })
//             }
//           />

//           <FormInput
//             label={visaTableHeaderTitles[3]}
//             name="employee"
//             labeClassNames={lableClassNamesStyles.default}
//             className={inputClassNamesStyles.default}
//             type="text"
//             value={visaDetails.employee}
//             onChange={(e) =>
//               setVisaDetails({ ...visaDetails, employee: e.target.value })
//             }
//           />

//           <FormInput
//             label={visaTableHeaderTitles[8]}
//             name="netFare"
//             labeClassNames={lableClassNamesStyles.default}
//             className={inputClassNamesStyles.default}
//             type="number"
//             value={visaDetails.netFare}
//             onChange={(e) =>
//               setVisaDetails({
//                 ...visaDetails,
//                 netFare: +e.target.value,
//                 profit: visaDetails.sales - +e.target.value,
//               })
//             }
//             min={0}
//             step={0.01}
//           />

//           <FormInput
//             label={visaTableHeaderTitles[7]}
//             name="sales"
//             labeClassNames={lableClassNamesStyles.default}
//             className={inputClassNamesStyles.default}
//             type="number"
//             value={visaDetails.sales}
//             onChange={(e) =>
//               setVisaDetails({
//                 ...visaDetails,
//                 sales: +e.target.value,
//                 profit: +e.target.value - visaDetails.netFare,
//               })
//             }
//             min={0}
//             step={0.01}
//           />

//           <FormInput
//             label={visaTableHeaderTitles[6]}
//             name="totalPayment"
//             labeClassNames={lableClassNamesStyles.default}
//             className={inputClassNamesStyles.default}
//             type="number"
//             value={visaDetails.profit}
//             onChange={(e) =>
//               setVisaDetails({
//                 ...visaDetails,
//                 profit: +e.target.value,
//               })
//             }
//             min={0}
//             step={0.01}
//           />

//           <FormInput
//             label={"Paid Amount"}
//             name="paidAmount"
//             labeClassNames={lableClassNamesStyles.default}
//             className={inputClassNamesStyles.default}
//             type="number"
//             value={visaDetails.paidAmount}
//             onChange={(e) =>
//               setVisaDetails({
//                 ...visaDetails,
//                 paidAmount: +e.target.value,
//                 remainingAmount: visaDetails.sales - +e.target.value,
//               })
//             }
//             min={0}
//             step={0.01}
//           />

//           <FormInput
//             label={"Remaining Amount"}
//             name="remainingAmount"
//             labeClassNames={lableClassNamesStyles.default}
//             className={inputClassNamesStyles.default}
//             type="number"
//             value={visaDetails.remainingAmount}
//             onChange={(e) =>
//               setVisaDetails({
//                 ...visaDetails,
//                 remainingAmount: +e.target.value,
//               })
//             }
//             min={0}
//             step={0.01}
//           />

//           <label
//             htmlFor="paymentMethod"
//             className={lableClassNamesStyles.default}
//           >
//             {"Payment Method"}
//           </label>
//           <select
//             name="paymentMethod"
//             className={inputClassNamesStyles.default}
//             value={visaDetails.paymentMethod}
//             onChange={(e) =>
//               setVisaDetails({
//                 ...visaDetails,
//                 paymentMethod: e.target.value,
//               })
//             }
//           >
//             {Object.keys(paymentMethods).map((method: string) => (
//               <option key={method} value={method}>
//                 {paymentMethods[method as keyof PaymentMethods]}
//               </option>
//             ))}
//           </select>

//           <FormInput
//             label={visaTableHeaderTitles[12]}
//             name="paymentDate"
//             labeClassNames={lableClassNamesStyles.default}
//             className={inputClassNamesStyles.default}
//             type="date"
//             value={visaDetails.paymentDate}
//             onChange={(e) =>
//               setVisaDetails({
//                 ...visaDetails,
//                 paymentDate: e.target.value,
//               })
//             }
//           />
//         </div>

//         {/*Request Status and Errors*/}
//         {(isError || isSuccess) && (
//           <MessagesContainer
//             msg={msg}
//             isSuccess={isSuccess}
//             isError={isError}
//           />
//         )}

//         {/*form button */}
//         <FormButton
//           text={{ default: "حفظ التأشيرة", loading: "جارى الحفظ" }}
//           isLoading={isLoading}
//           icon={<RiSendPlaneFill className="ml-1" size={25} />}
//         />
//       </form>
//     </div>
//   );
// };
