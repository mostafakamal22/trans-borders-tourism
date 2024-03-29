// import dayjs from "dayjs";
// import { useEffect, useState } from "react";
// import { FcCurrencyExchange } from "react-icons/fc";
// import { TiDelete } from "react-icons/ti";
// import { UseResetStatus } from "../../hooks/UseResetStatus";
// import { resetAdminAuthStatus } from "../../state/features/admin/auth/adminAuthSlice";
// import {
//   useAppDispatch,
//   useAppSelector,
// } from "../../state/features/hooks/StateHooks";
// import FormButton from "../shared/FormButton";
// import logo from "../../assets/imgs/trans-logo.png";
// import MessagesContainer from "../shared/MessagesContainer";
// import { PaginationTable } from "../shared/PaginationTable";
// import { MainSpinner } from "../shared/MainSpinner";
// import {
//   inputClassNamesStyles,
//   lableClassNamesStyles,
// } from "../forms/CreateInvoice";
// import {
//   deleteVisa,
//   resetVisasStatus,
// } from "../../state/features/visa/visaSlice";
// import {
//   createInvoice,
//   resetInvoicesStatus,
// } from "../../state/features/invoice/invoiceSlice";
// import { visaCalculations } from "../helpers/visaCalculations";
// import { UpdateVisa } from "../forms/UpdateVisa";
// import { PaymentMethods, paymentMethods } from "../forms/CreatePayment";
// import { creditStates } from "../ticket/Tickets";
// import { AiFillEdit, AiFillFileAdd } from "react-icons/ai";
// import { useSearchParams } from "react-router-dom";

// export const visaTableHeaderTitles = [
//   "مسح التأشيرة",
//   "إضافة فاتورة",
//   "تعديل التأشيرات",
//   "اسم الموظف",
//   "رقم الجواز",
//   "إسم العميل",
//   "Profit",
//   "Sales",
//   "Cost",
//   "Type",
//   "Sponsor",
//   "Supplier",
//   "Date",
// ];

// export const Visas = () => {
//   const { info } = useAppSelector((state) => state.adminAuth);
//   const { visasList } = useAppSelector((state) => state.visasData);
//   const invoiceData = useAppSelector((state) => state.invoiceData);

//   const dispatch = useAppDispatch();

//   //Is modal open
//   const [isOpen, setIsOpen] = useState(false);

//   //PurchaseID to Update
//   const [id, setId] = useState("");

//   //Table Row/Page State
//   const [tableRows, setTableRows] = useState(50);
//   const [rowPerPage, setRowPerPage] = useState(50);

//   //search Params
//   const [searchQuery, setSearchQuery] = useState<SearchQueries>({
//     day: "",
//     year: "",
//     month: "",
//     employee: "",
//     type: "",
//     supplier: "",
//     sponsor: "",
//     name: "",
//   });

//   const { year, day, month, employee, type, supplier, sponsor, name } =
//     searchQuery;

//   type SearchQueries = {
//     day: string | number;
//     year: string | number;
//     month: string | number;
//     employee: string;
//     type: string;
//     supplier: string;
//     sponsor: string;
//     name: string;
//   };

//   let availableSearchQueries: SearchQueries = {
//     year: +year,
//     month: +month,
//     day: +day,
//     employee: employee.trim().toLowerCase(),
//     type: type.trim().toLowerCase(),
//     supplier: supplier.trim().toLowerCase(),
//     sponsor: sponsor.trim().toLowerCase(),
//     name: name.trim().toLowerCase(),
//   };

//   for (const key in availableSearchQueries) {
//     if (!availableSearchQueries[key as keyof SearchQueries]) {
//       delete availableSearchQueries[key as keyof SearchQueries];
//     }
//   }

//   //filtered Visas
//   const filteredVisas: [] =
//     day || month || year || supplier || type || employee || sponsor || name
//       ? visasList.filter((visa: any) => {
//           const paymentDate = dayjs(visa.payment_date)
//             .format("DD/MM/YYYY")
//             .split("/");

//           const visaData: SearchQueries = {
//             year: +paymentDate[2],
//             month: +paymentDate[1],
//             day: +paymentDate[0],
//             type: visa.type?.trim().toLowerCase(),
//             employee: visa.employee?.trim().toLowerCase(),
//             supplier: visa.provider?.trim().toLowerCase(),
//             sponsor: visa.sponsor?.trim().toLowerCase(),
//             name: visa.customer_name?.trim().toLowerCase(),
//           };

//           if (
//             Object.keys(availableSearchQueries).every((key) =>
//               typeof visaData[key as keyof SearchQueries] === "string"
//                 ? visaData[key as keyof SearchQueries]
//                     ?.toString()
//                     .includes(
//                       availableSearchQueries[
//                         key as keyof SearchQueries
//                       ] as string
//                     )
//                 : visaData[key as keyof SearchQueries] ===
//                   (availableSearchQueries[key as keyof SearchQueries] as string)
//             )
//           )
//             return visa;
//         })
//       : visasList;

//   const sortedVisas = [...filteredVisas].sort((a: any, b: any) => {
//     if (dayjs(b.payment_date).valueOf() === dayjs(a.payment_date).valueOf()) {
//       return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();
//     }

//     return dayjs(b.payment_date).valueOf() - dayjs(a.payment_date).valueOf();
//   });

//   const { isLoading, isError, isSuccess, message } = useAppSelector(
//     (state) => state.visasData
//   );

//   const { netFares, profits, sales } = visaCalculations(filteredVisas);

//   //search message state
//   const [msg, setMsg] = useState("");

//   // handle Delete visa
//   const handleRemoving = (e: any, removedVisaID: string) => {
//     e.preventDefault();

//     //set msg to none first
//     setMsg("");
//     dispatch(resetInvoicesStatus());

//     //get admin token
//     const token = info.token;

//     //payload (admin token + id of the visa to delete)
//     const visaData = {
//       id: removedVisaID,
//       token,
//     };

//     dispatch(deleteVisa(visaData));
//   };

//   // handle Creating invoice
//   const handleAddInvoice = (e: React.SyntheticEvent, visa: any) => {
//     e.preventDefault();

//     //set msg to none first
//     setMsg("");
//     dispatch(resetVisasStatus());

//     const invoiceData = {
//       token: info.token,
//       ID: visa.passport_id,
//       customer: { name: visa.customer_name },
//       details: [
//         {
//           name: visa.type,
//           quantity: 1,
//           price: visa.sales,
//         },
//       ],
//       total: visa.sales,
//       date: visa.payment_date,
//       paidAmount: visa.paid_amount,
//       remainingAmount: visa.remaining_amount,
//       paymentMethod:
//         paymentMethods[visa.payment_method as keyof PaymentMethods],
//     };

//     dispatch(createInvoice(invoiceData));
//   };

//   useEffect(() => {
//     if (isError) {
//       setMsg(message);
//     }

//     if (invoiceData.isError) {
//       setMsg(invoiceData.message);
//     }

//     if (isSuccess && message) {
//       setMsg(message);
//     }

//     if (invoiceData.isSuccess && invoiceData.message) {
//       setMsg(invoiceData.message);
//     }
//   }, [isError, message, isSuccess, msg, invoiceData]);

//   //Define table data
//   const tableHeader = (
//     <tr className="border-b border-b-black">
//       {[...visaTableHeaderTitles].slice(0, 9).map((title) => (
//         <th
//           key={title}
//           scope="col"
//           className="max-w-[100px] p-1 text-center border-x border-x-black"
//         >
//           {title}
//         </th>
//       ))}

//       {[...creditStates].map((title) => (
//         <th
//           key={title}
//           scope="col"
//           className="max-w-[100px] p-1 text-center border-x border-x-black"
//         >
//           {title}
//         </th>
//       ))}
//       {[...visaTableHeaderTitles].slice(9).map((title) => (
//         <th
//           key={title}
//           scope="col"
//           className="max-w-[100px] p-1 text-center border-x border-x-black"
//         >
//           {title}
//         </th>
//       ))}
//       <th scope="col" className="p-1 text-center border-x border-x-black">
//         م
//       </th>
//     </tr>
//   );

//   const tableRow = (visa: any, index: number) => {
//     return (
//       <tr
//         key={visa._id}
//         className={`${
//           index % 2 === 0 ? "bg-white" : "bg-gray-100"
//         } border-b border-b-black`}
//       >
//         {/* Delete Visa */}
//         <th
//           scope="row"
//           className="p-2 text-gray-900  text-xs border-x text-center border-x-black"
//         >
//           <form
//             className="max-w-[150px] m-auto"
//             onSubmit={(event) => handleRemoving(event, visa._id)}
//           >
//             <FormButton
//               bgColor={["bg-red-600", "bg-red-700", "bg-red-800"]}
//               icon={<TiDelete size={20} />}
//             />
//           </form>
//         </th>

//         {/* Make Invoice */}
//         <th
//           scope="row"
//           className="p-1 text-gray-900 text-xs border-x text-center border-x-black"
//         >
//           <form
//             className="max-w-[150px] m-auto"
//             onSubmit={(event) => handleAddInvoice(event, visa)}
//           >
//             <FormButton
//               bgColor={["bg-orange-600", "bg-orange-700", "bg-orange-800"]}
//               icon={<AiFillFileAdd size={20} />}
//             />
//           </form>
//         </th>

//         {/*Update Visa*/}
//         <th
//           scope="row"
//           className="p-2  text-gray-900  border-x text-center border-x-black"
//         >
//           <button
//             className="w-full flex justify-center items-center font-bold text-xs bg-blue-800 text-white hover:bg-white px-3 py-2.5 border-transparent hover:text-blue-800 border hover:border-blue-800 rounded
//              transition-all ease-in-out duration-300"
//             onClick={() => {
//               setId(visa._id);
//               setIsOpen(true);
//             }}
//           >
//             <AiFillEdit size={20} />
//           </button>
//         </th>

//         {/*Visa Employee*/}
//         <th
//           scope="row"
//           className="p-2  text-gray-900  border-x text-center border-x-black"
//         >
//           {visa.employee ? visa.employee : "-"}
//         </th>

//         {/*passport ID*/}
//         <th
//           scope="row"
//           className="p-2  text-gray-900  border-x text-center border-x-black"
//         >
//           {visa.passport_id}
//         </th>

//         {/*Customer Name*/}
//         <th
//           scope="row"
//           className="p-2 bg-red-200 text-gray-900  border-x text-center border-x-black"
//         >
//           {visa.customer_name}
//         </th>

//         {/*Profit*/}
//         <th
//           scope="row"
//           className="p-2  text-gray-900  border-x text-center border-x-black"
//         >
//           {visa.profit}
//         </th>

//         {/*Sales*/}
//         <th
//           scope="row"
//           className="p-2  text-gray-900  border-x text-center border-x-black"
//         >
//           {visa.sales}
//         </th>

//         {/*Net Fare*/}
//         <th
//           scope="row"
//           className="p-2  text-gray-900  border-x text-center border-x-black"
//         >
//           {visa.net_fare}
//         </th>

//         {/*Paid Amount*/}
//         <th
//           scope="row"
//           className="p-1  text-gray-900  border-x text-center border-x-black"
//         >
//           {visa.paid_amount}
//         </th>

//         {/*Remaining Amount*/}
//         <th
//           scope="row"
//           className="p-1  text-gray-900  border-x text-center border-x-black"
//         >
//           {visa.remaining_amount}
//         </th>

//         {/*Payment Method*/}
//         <th
//           scope="row"
//           className="p-1  text-gray-900  border-x text-center border-x-black"
//         >
//           {visa.payment_method
//             ? paymentMethods[visa.payment_method as keyof PaymentMethods]
//             : "-"}
//         </th>

//         {/*Visa Type*/}
//         <th
//           scope="row"
//           className="p-2  text-gray-900  border-x text-center border-x-black"
//         >
//           {visa.type ? visa.type : "-"}
//         </th>

//         {/*Visa Sponsor*/}
//         <th
//           scope="row"
//           className="p-2  text-gray-900  border-x text-center border-x-black"
//         >
//           {visa.sponsor ? visa.sponsor : "-"}
//         </th>

//         {/*Visa Provider*/}
//         <th
//           scope="row"
//           className="p-2  text-gray-900  border-x text-center border-x-black"
//         >
//           {visa.provider ? visa.provider : "-"}
//         </th>

//         {/*Visa Date*/}
//         <th
//           scope="row"
//           className="p-2  text-gray-900  border-x text-center border-x-black"
//         >
//           {visa.payment_date
//             ? dayjs(visa.payment_date).format("DD/MM/YYYY")
//             : "-"}
//         </th>

//         {/*Visa NO*/}
//         <th
//           scope="row"
//           className="p-1  text-gray-90 border-x text-center border-x-black"
//         >
//           {sortedVisas.findIndex((p: any) => p._id === visa._id) + 1}
//         </th>
//       </tr>
//     );
//   };

//   //clean up status (when mount and unmount)
//   UseResetStatus(() => {
//     //scroll page back to top when component first mount
//     const yOffset = window.pageYOffset;
//     window.scrollBy(0, -yOffset);

//     dispatch(resetAdminAuthStatus());
//     dispatch(resetInvoicesStatus());
//     dispatch(resetVisasStatus());
//   });

//   UseResetStatus(() => {
//     return () => {
//       dispatch(resetAdminAuthStatus());
//       dispatch(resetInvoicesStatus());
//       dispatch(resetVisasStatus());
//     };
//   });

//   return (
//     <div className="min-h-[75vh] w-full mx-auto my-20 overflow-x-auto  p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
//       <img className="mx-auto" src={logo} alt="logo" />

//       <div className="flex justify-center items-center flex-wrap gap-4 my-5 p-4 bg-red-700 rounded-md">
//         <h4 className="basis-full flex justify-center items-center text-2xl my-4 p-3 text-center font-bold bg-red-200 text-gray-900 border-b-4 border-red-800 rounded shadow">
//           فلتـرة التأشيرات
//         </h4>

//         <form className="basis-full  flex flex-col flex-wrap  md:flex-row-reverse justify-center items-center gap-4 mx-auto font-semibold ">
//           <div className="flex justify-center items-center flex-col gap-2">
//             <label className={lableClassNamesStyles.default} htmlFor="year">
//               السنة
//             </label>
//             <input
//               type="number"
//               name="year"
//               className={inputClassNamesStyles.default}
//               value={year}
//               onChange={(e) =>
//                 setSearchQuery({
//                   ...searchQuery,
//                   year: e.target.value,
//                 })
//               }
//             />
//           </div>
//           <div className="flex justify-center items-center flex-col gap-2">
//             <label className={lableClassNamesStyles.default} htmlFor="month">
//               الشهر
//             </label>
//             <input
//               type="number"
//               name="month"
//               className={inputClassNamesStyles.default}
//               value={month}
//               onChange={(e) =>
//                 setSearchQuery({
//                   ...searchQuery,
//                   month: e.target.value,
//                 })
//               }
//             />
//           </div>

//           <div className="flex justify-center items-center flex-col gap-2">
//             <label className={lableClassNamesStyles.default} htmlFor="day">
//               اليوم
//             </label>
//             <input
//               type="number"
//               name="day"
//               className={inputClassNamesStyles.default}
//               value={day}
//               onChange={(e) =>
//                 setSearchQuery({
//                   ...searchQuery,
//                   day: e.target.value,
//                 })
//               }
//             />
//           </div>

//           <div className="flex justify-center items-center flex-col gap-2">
//             <label className={lableClassNamesStyles.default} htmlFor="name">
//               إسم العميل
//             </label>
//             <input
//               type="text"
//               name="name"
//               className={inputClassNamesStyles.default}
//               value={name}
//               onChange={(e) =>
//                 setSearchQuery({
//                   ...searchQuery,
//                   name: e.target.value,
//                 })
//               }
//             />
//           </div>

//           <div className="flex justify-center items-center flex-col gap-2">
//             <label className={lableClassNamesStyles.default} htmlFor="supplier">
//               Supplier
//             </label>
//             <input
//               type="text"
//               name="supplier"
//               className={inputClassNamesStyles.default}
//               value={supplier}
//               onChange={(e) =>
//                 setSearchQuery({
//                   ...searchQuery,
//                   supplier: e.target.value,
//                 })
//               }
//             />
//           </div>

//           <div className="flex justify-center items-center flex-col gap-2">
//             <label className={lableClassNamesStyles.default} htmlFor="type">
//               Type
//             </label>
//             <input
//               type="text"
//               name="type"
//               className={inputClassNamesStyles.default}
//               value={type}
//               onChange={(e) =>
//                 setSearchQuery({
//                   ...searchQuery,
//                   type: e.target.value,
//                 })
//               }
//             />
//           </div>

//           <div className="flex justify-center items-center flex-col gap-2">
//             <label className={lableClassNamesStyles.default} htmlFor="employee">
//               Employee
//             </label>
//             <input
//               type="text"
//               name="employee"
//               className={inputClassNamesStyles.default}
//               defaultValue={employee}
//               onChange={(e) =>
//                 setSearchQuery({
//                   ...searchQuery,
//                   employee: e.target.value,
//                 })
//               }
//             />
//           </div>

//           <div className="flex justify-center items-center flex-col gap-2">
//             <label className={lableClassNamesStyles.default} htmlFor="sponsor">
//               Sponsor
//             </label>
//             <input
//               type="text"
//               name="sponsor"
//               className={inputClassNamesStyles.default}
//               defaultValue={sponsor}
//               onChange={(e) =>
//                 setSearchQuery({
//                   ...searchQuery,
//                   sponsor: e.target.value,
//                 })
//               }
//             />
//           </div>
//         </form>
//         <h3 className="basis-full flex justify-center items-center flex-row-reverse text-2xl my-10 p-3 text-center font-bold bg-red-200 text-gray-900 border-b-4 border-red-800 rounded shadow">
//           <span>{" التأشيرات المحفوظة"}</span>
//           {!month && !year && (
//             <span className="bg-blue-500 p-1 rounded-md text-white mx-1">
//               {" الكلية "}
//             </span>
//           )}
//           {month && (
//             <span className="bg-rose-500 p-1 rounded-md text-white mx-1">
//               {" عن شهر " + month}
//             </span>
//           )}
//           {day && (
//             <span className="bg-rose-500 p-1 rounded-md text-white mx-1">
//               {" يوم " + day}
//             </span>
//           )}
//           {year && (
//             <span className="bg-amber-500 p-1 rounded-md text-white mx-1">
//               {" سنة " + year}
//             </span>
//           )}
//           {name && (
//             <span className="bg-gray-500 p-1 rounded-md text-white mx-1">
//               {name + " إسم العميل "}
//             </span>
//           )}
//           {supplier && (
//             <span className="bg-emerald-500 p-1 rounded-md text-white mx-1">
//               {" Supplier:- " + supplier}
//             </span>
//           )}

//           {type && (
//             <span className="bg-purple-500 p-1 rounded-md text-white mx-1">
//               {" Type:- " + type}
//             </span>
//           )}

//           {employee && (
//             <span className="bg-purple-500 p-1 rounded-md text-white mx-1">
//               {" Emplyee:- " + employee}
//             </span>
//           )}
//           {sponsor && (
//             <span className="bg-purple-500 p-1 rounded-md text-white mx-1">
//               {" Sponsor:- " + sponsor}
//             </span>
//           )}
//           <span>({filteredVisas.length})</span>
//           <span className="flex justify-center items-center mr-2">
//             <FcCurrencyExchange size={50} />
//           </span>
//         </h3>
//       </div>

//       <h4 className="flex justify-center items-center flex-row-reverse flex-wrap gap-2 text-2xl my-10 p-4 text-center font-bold bg-red-700 text-gray-900 rounded shadow">
//         <span className="bg-emerald-500 p-1 rounded-md text-white mx-1">
//           {" إجمالى التكلفة " + `[ ${netFares.toFixed(2)} ]`}
//         </span>

//         <span className="bg-lime-500 p-1 rounded-md text-white mx-1">
//           {" إجمالى سعر البيع " + `[ ${sales.toFixed(2)} ]`}
//         </span>

//         <span className="bg-fuchsia-500 p-1 rounded-md text-white mx-1">
//           {" إجمالى الربح " + `[ ${profits.toFixed(2)} ]`}
//         </span>
//       </h4>

//       {/*Request Status and Errors*/}
//       {(isError || (isSuccess && message)) && (
//         <MessagesContainer msg={msg} isSuccess={isSuccess} isError={isError} />
//       )}

//       {invoiceData.isError ||
//         (invoiceData.isSuccess && invoiceData.message && (
//           <MessagesContainer
//             msg={msg}
//             isSuccess={invoiceData.isSuccess}
//             isError={invoiceData.isError}
//           />
//         ))}

//       {/* Show Table Row/Page Control */}
//       {!isLoading && !invoiceData.isLoading && filteredVisas?.length > 0 && (
//         <div className="max-w-sm flex flex-row-reverse justify-center items-center flex-wrap my-10 mx-auto gap-2 text-sm font-semibold">
//           <label htmlFor="rowPerPage">عدد صفوف الجدول</label>
//           <input
//             className="max-w-[80px] p-2 bg-red-100 border border-red-500 text-center rounded focus:outline-none focus:border-blue-700"
//             type={"number"}
//             name="rowPerPage"
//             min={1}
//             max={filteredVisas.length}
//             value={tableRows}
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
//               setTableRows(+e.target.value);
//             }}
//           />

//           <button
//             className="bg-blue-800 px-4 py-2 text-white font-semibold border rounded hover:border-blue-700 hover:bg-white hover:text-blue-700 transition-all duration-75 ease-in-out"
//             type="button"
//             onClick={() => {
//               if (tableRows === 0) return;
//               setRowPerPage(tableRows);
//             }}
//           >
//             تم
//           </button>
//         </div>
//       )}

//       {/*Display Table All Data Needed*/}
//       {!isLoading && !invoiceData.isLoading && filteredVisas?.length > 0 && (
//         <PaginationTable
//           tableRow={tableRow}
//           tableHeader={tableHeader}
//           tableBodyData={sortedVisas}
//           rowsPerPage={rowPerPage}
//         />
//       )}

//       {/* if there is No Visas Records */}
//       {!year &&
//         !month &&
//         !day &&
//         !supplier &&
//         !employee &&
//         !type &&
//         !sponsor &&
//         !name &&
//         filteredVisas?.length === 0 &&
//         !isLoading &&
//         !invoiceData.isLoading && (
//           <div className="bg-yellow-200 text-gray-800 text-center font-bold my-4 py-4 px-2 border-l-4 border-yellow-600 rounded">
//             لا يوجد تأشيرات محفوظة الان, يرجى إضافة التأشيرات لعرضها.
//           </div>
//         )}

//       {/* if there is search query no Visa matches >>> No Search Found*/}
//       {(year ||
//         month ||
//         day ||
//         supplier ||
//         type ||
//         employee ||
//         sponsor ||
//         name) &&
//         filteredVisas?.length === 0 &&
//         !isLoading &&
//         !invoiceData.isLoading && (
//           <div className="bg-red-200 text-gray-800 text-center font-bold my-4 py-4 px-2 border-l-4 border-red-600 rounded">
//             لا يوجد نتائج تطابق هذا البحث, تأكد من البيانات التى أدخلتها وحاول
//             مجدداً
//           </div>
//         )}

//       {/* Show Update Visa Modal */}
//       {isOpen && <UpdateVisa setIsOpen={setIsOpen} id={id} />}

//       {/* Show spinner when Loading State is true */}
//       {(isLoading || invoiceData.isLoading) && (
//         <MainSpinner
//           isLoading={isLoading ? isLoading : invoiceData.isLoading}
//         />
//       )}
//     </div>
//   );
// };
