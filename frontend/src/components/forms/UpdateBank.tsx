// import dayjs from "dayjs";
// import { useEffect, useState } from "react";
// import { AiFillCloseCircle } from "react-icons/ai";
// import { FcPaid } from "react-icons/fc";
// import { RiSendPlaneFill } from "react-icons/ri";
// import { UseResetStatus } from "../../hooks/UseResetStatus";
// import { resetAdminAuthStatus } from "../../state/features/admin/auth/adminAuthSlice";
// import {
//   resetBanksStatus,
//   updateBank,
// } from "../../state/features/bank/bankSlice";
// import {
//   useAppDispatch,
//   useAppSelector,
// } from "../../state/features/hooks/StateHooks";
// import { bankTableHeaderTitles } from "../bank/Banks";
// import FormButton from "../shared/FormButton";
// import { FormInput } from "../shared/FormInput";
// import MessagesContainer from "../shared/MessagesContainer";
// import { inputClassNamesStyles, lableClassNamesStyles } from "./CreateInvoice";
// import logo from "../../assets/imgs/trans-logo.png";

// export const UpdateBank = ({
//   id,
//   setIsOpen,
// }: {
//   id: string;
//   setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }) => {
//   const { banksList } = useAppSelector((state) => state.banksData);
//   const bank = banksList.find((bank: any) => bank._id === id);

//   //state for Bank Details
//   const [bankDetails, setBankDetails] = useState({
//     name: bank.customer_name,
//     type: bank.type,
//     accountId: bank.account_id,
//     processNo: bank.process_no,
//     total: bank.total,
//     paymentDate: dayjs(bank.payment_date).format("YYYY-MM-DD"),
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
//       id,
//       name: bankDetails.name,
//       type: bankDetails.type,
//       processNo: +bankDetails.processNo,
//       total: +bankDetails.total,
//       accountId: bankDetails.accountId,
//       paymentDate: bankDetails.paymentDate,
//     };

//     dispatch(updateBank(bankData));
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
//     <div className="h-screen bg-gray-500/50 overflow-y-auto overflow-x-hidden fixed inset-0 z-50 w-full md:inset-0">
//       <button
//         className="fixed top-5 right-[10%] inline-flex font-bold text-xs sm:text-sm bg-red-800 text-white hover:bg-white  px-2 sm:px-3 py-2 border-transparent hover:text-red-800 border hover:border-red-800 items-center rounded
//          shadow transition-all ease-in-out duration-300"
//         onClick={() => setIsOpen(false)}
//         type="button"
//       >
//         <AiFillCloseCircle className="mr-1" size={20} />
//         إغلاق
//       </button>
//       <div className="max-w-6xl w-full mx-auto my-20 p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
//         <h3 className="flex justify-center items-center text-xl text-center font-bold px-2 py-4 mb-10 bg-red-200 border-b-4 border-red-800 rounded shadow ">
//           <FcPaid className="mr-1" size={50} />
//           <span>تعديل المعاملة البنكية </span>
//         </h3>

//         <img className="mx-auto" src={logo} alt="logo" />

//         <form onSubmit={handleSubmit}>
//           <p className="font-bold p-2 rounded text-lg text-white bg-red-800 my-4">
//             [التفاصيل الحالية]
//           </p>
//           <div className="flex justify-center items-center font-semibold flex-wrap gap-4 px-5 py-5">
//             <FormInput
//               label={bankTableHeaderTitles[3]}
//               name="customerName"
//               labeClassNames={lableClassNamesStyles.default}
//               className={inputClassNamesStyles.default}
//               type="text"
//               value={bankDetails.name}
//               onChange={(e) =>
//                 setBankDetails({ ...bankDetails, name: e.target.value })
//               }
//               required
//             />

//             <FormInput
//               label={bankTableHeaderTitles[2]}
//               name="accountId"
//               labeClassNames={lableClassNamesStyles.default}
//               className={inputClassNamesStyles.default}
//               type="text"
//               value={bankDetails.accountId}
//               onChange={(e) =>
//                 setBankDetails({ ...bankDetails, accountId: e.target.value })
//               }
//               required
//             />

//             <FormInput
//               label={bankTableHeaderTitles[6]}
//               name="processNO"
//               labeClassNames={lableClassNamesStyles.default}
//               className={inputClassNamesStyles.default}
//               type="text"
//               value={bankDetails.processNo}
//               onChange={(e) =>
//                 setBankDetails({ ...bankDetails, processNo: e.target.value })
//               }
//             />

//             <FormInput
//               label={bankTableHeaderTitles[4]}
//               name="processTotal"
//               labeClassNames={lableClassNamesStyles.default}
//               className={inputClassNamesStyles.default}
//               type="number"
//               value={bankDetails.total}
//               onChange={(e) =>
//                 setBankDetails({ ...bankDetails, total: +e.target.value })
//               }
//               min={0}
//               step={0.01}
//               required
//             />

//             <FormInput
//               label={bankTableHeaderTitles[5]}
//               name="bankType"
//               labeClassNames={lableClassNamesStyles.default}
//               className={inputClassNamesStyles.default}
//               type="text"
//               value={bankDetails.type}
//               onChange={(e) =>
//                 setBankDetails({ ...bankDetails, type: e.target.value })
//               }
//             />

//             <FormInput
//               label={bankTableHeaderTitles[8]}
//               name="paymentDate"
//               labeClassNames={lableClassNamesStyles.default}
//               className={inputClassNamesStyles.default}
//               type="date"
//               value={bankDetails.paymentDate}
//               onChange={(e) =>
//                 setBankDetails({
//                   ...bankDetails,
//                   paymentDate: e.target.value,
//                 })
//               }
//               required
//             />
//           </div>

//           {/*Request Status and Errors*/}
//           {(isError || isSuccess) && (
//             <MessagesContainer
//               msg={msg}
//               isSuccess={isSuccess}
//               isError={isError}
//             />
//           )}

//           {/*form button */}
//           <FormButton
//             text={{ default: "حفظ التعديلات", loading: "جارى الحفظ" }}
//             isLoading={isLoading}
//             icon={<RiSendPlaneFill className="ml-1" size={25} />}
//           />
//         </form>
//       </div>
//     </div>
//   );
// };
