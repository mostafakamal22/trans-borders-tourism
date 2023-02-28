// import { useEffect, useState } from "react";
// import logo from "../../assets/imgs/trans-logo.png";
// import { FcPaid } from "react-icons/fc";
// import {
//   useAppDispatch,
//   useAppSelector,
// } from "../../state/features/hooks/StateHooks";
// import { FormInput } from "../shared/FormInput";
// import FormButton from "../shared/FormButton";
// import { RiSendPlaneFill } from "react-icons/ri";
// import { bankTableHeaderTitles } from "../bank/Banks";

// export const CreateBank = () => {
//   //state for Bank Details
//   const [bankDetails, setBankDetails] = useState({
//     name: "",
//     type: "",
//     accountId: "",
//     paymentDate: "",
//     processNo: "",
//     total: 0,
//   });

//   //state for alert messages
//   const [msg, setMsg] = useState("");

//   const { info } = useAppSelector((state) => state.adminAuth);
//   const { isError, isSuccess, isLoading, message } = useAppSelector(
//     (state) => state.banksData
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

//     const bankData = {
//       token: info.token,
//       name: bankDetails.name,
//       type: bankDetails.type,
//       processNo: +bankDetails.processNo,
//       total: +bankDetails.total,
//       accountId: bankDetails.accountId,
//       paymentDate: bankDetails.paymentDate,
//     };

//     dispatch(createBank(bankData));
//   };

//   //clean up status (when mount and unmount)
//   UseResetStatus(() => {
//     //scroll page back to top when component first mount
//     const yOffset = window.pageYOffset;
//     window.scrollBy(0, -yOffset);

//     dispatch(resetAdminAuthStatus());
//     dispatch(resetBanksStatus());
//   });

//   UseResetStatus(() => {
//     return () => {
//       dispatch(resetAdminAuthStatus());
//       dispatch(resetBanksStatus());
//     };
//   });

//   return (
//     <div className="mx-auto my-20 w-full max-w-6xl rounded bg-slate-50 p-6 shadow-lg shadow-black/30">
//       <h3 className="mb-10 flex items-center justify-center rounded border-b-4 border-red-800 bg-red-200 px-2 py-4 text-center text-xl font-bold shadow ">
//         <FcPaid className="mr-1" size={50} />
//         <span>إضافة معاملة بنكية جديدة</span>
//       </h3>

//       <img className="mx-auto" src={logo} alt="logo" />

//       <form onSubmit={handleSubmit}>
//         <p className="my-4 rounded bg-red-800 p-2 text-lg font-bold text-white">
//           [ التفاصيل ]
//         </p>
//         <div className="flex flex-wrap items-center justify-center gap-4 px-5 py-5 font-semibold">
//           <FormInput
//             label={bankTableHeaderTitles[3]}
//             name="customerName"
//             labeClassNames={lableClassNamesStyles.default}
//             className={inputClassNamesStyles.default}
//             type="text"
//             value={bankDetails.name}
//             onChange={(e) =>
//               setBankDetails({ ...bankDetails, name: e.target.value })
//             }
//             required
//           />

//           <FormInput
//             label={bankTableHeaderTitles[2]}
//             name="accountId"
//             labeClassNames={lableClassNamesStyles.default}
//             className={inputClassNamesStyles.default}
//             type="text"
//             value={bankDetails.accountId}
//             onChange={(e) =>
//               setBankDetails({ ...bankDetails, accountId: e.target.value })
//             }
//             required
//           />

//           <FormInput
//             label={bankTableHeaderTitles[6]}
//             name="processNO"
//             labeClassNames={lableClassNamesStyles.default}
//             className={inputClassNamesStyles.default}
//             type="text"
//             value={bankDetails.processNo}
//             onChange={(e) =>
//               setBankDetails({ ...bankDetails, processNo: e.target.value })
//             }
//           />

//           <FormInput
//             label={bankTableHeaderTitles[4]}
//             name="processTotal"
//             labeClassNames={lableClassNamesStyles.default}
//             className={inputClassNamesStyles.default}
//             type="number"
//             value={bankDetails.total}
//             onChange={(e) =>
//               setBankDetails({ ...bankDetails, total: +e.target.value })
//             }
//             min={0}
//             step={0.01}
//             required
//           />

//           <FormInput
//             label={bankTableHeaderTitles[5]}
//             name="bankType"
//             labeClassNames={lableClassNamesStyles.default}
//             className={inputClassNamesStyles.default}
//             type="text"
//             value={bankDetails.type}
//             onChange={(e) =>
//               setBankDetails({ ...bankDetails, type: e.target.value })
//             }
//           />

//           <FormInput
//             label={bankTableHeaderTitles[8]}
//             name="paymentDate"
//             labeClassNames={lableClassNamesStyles.default}
//             className={inputClassNamesStyles.default}
//             type="date"
//             value={bankDetails.paymentDate}
//             onChange={(e) =>
//               setBankDetails({
//                 ...bankDetails,
//                 paymentDate: e.target.value,
//               })
//             }
//             required
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
//           text={{ default: "حفظ المعاملة", loading: "جارى الحفظ" }}
//           isLoading={isLoading}
//           icon={<RiSendPlaneFill className="ml-1" size={25} />}
//         />
//       </form>
//     </div>
//   );
// };
