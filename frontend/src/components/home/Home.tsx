import {
  FcBusiness,
  FcCurrencyExchange,
  FcDebt,
  FcFeedback,
  FcHome,
  FcInvite,
  FcMoneyTransfer,
  FcPuzzle,
  FcSalesPerformance,
  FcTemplate,
  FcTrademark,
} from "react-icons/fc";
import { Link } from "react-router-dom";
import { FcFile, FcBookmark } from "react-icons/fc";
import logo from "../../assets/imgs/trans-logo.png";
import {
  useAppDispatch,
  useAppSelector,
} from "../../state/features/hooks/StateHooks";
import { getAllInvoices } from "../../state/features/invoice/invoiceSlice";

import { ReactElement, useEffect } from "react";
import { MainSpinner } from "../shared/MainSpinner";
import { getAllPassports } from "../../state/features/passport/passportSlice";
import { getAllVisas } from "../../state/features/visa/visaSlice";
import { getAllPayments } from "../../state/features/payment/paymentSlice";
import { getAllTickets } from "../../state/features/ticket/ticketSlice";
import { getAllPurchases } from "../../state/features/purchase/purchaseSlice";

type MainHeadings = string[];

type MainPagesLinks = [string, string, ReactElement][][];

const mainPageLinks: MainPagesLinks = [
  [
    ["عرض الفواتير", "/invoices", <FcBookmark size={50} />],
    ["إضافة فاتورة", "/invoices/create", <FcFile size={50} />],
  ],

  [
    ["عرض  المبيعات", "/visas", <FcCurrencyExchange size={50} />],
    ["إضافة المبيعات", "/visas/create", <FcDebt size={50} />],
  ],
  [
    ["عرض الجوازات", "/passports", <FcBusiness size={50} />],
    ["إضافة الجوازات", "/passports/create", <FcTemplate size={50} />],
  ],
  [
    ["عرض المصروفات", "/payments", <FcMoneyTransfer size={50} />],
    ["إضافة المصروفات", "/payments/create", <FcInvite size={50} />],
  ],

  [
    ["عرض التذاكـر", "/tickets", <FcTrademark size={50} />],
    ["إضافة التذاكـر", "/tickets/create", <FcPuzzle size={50} />],
  ],
  [
    ["عرض المشتريات", "/purchases", <FcSalesPerformance size={50} />],
    ["إضافة المشتريات", "/purchases/create", <FcFeedback size={50} />],
  ],
];

const mainHeadings: MainHeadings = [
  "الفواتير",
  "المبيعات",
  "الجوازات",
  "المصروفات",
  "التذاكـر",
  "المشتريات",
];

export const Home = () => {
  const { info } = useAppSelector((state) => state.adminAuth);

  const dispatch = useAppDispatch();

  useEffect(() => {
    //scroll page back to top when component first mount
    const yOffset = window.pageYOffset;
    window.scrollBy(0, -yOffset);

    //Then Fetch App Data
    dispatch(getAllInvoices({ token: info.token }));
    dispatch(getAllPassports({ token: info.token }));
    dispatch(getAllVisas({ token: info.token }));
    dispatch(getAllPayments({ token: info.token }));
    dispatch(getAllTickets({ token: info.token }));
    dispatch(getAllPurchases({ token: info.token }));
  }, []);

  const invoiceData = useAppSelector((state) => state.invoiceData);
  const passportsData = useAppSelector((state) => state.passportsData);
  const visasData = useAppSelector((state) => state.visasData);
  const paymentsData = useAppSelector((state) => state.paymentsData);
  const ticketsData = useAppSelector((state) => state.ticketsData);
  const purchasesData = useAppSelector((state) => state.purchasesData);

  //Loading Spinner After Login Waiting Until App data is Fetched.
  if (
    invoiceData.isLoading ||
    passportsData.isLoading ||
    visasData.isLoading ||
    paymentsData.isLoading ||
    ticketsData.isLoading ||
    purchasesData.isLoading
  )
    return (
      <div className="mx-5 h-min-screen">
        <div className="max-w-5xl w-full h-full flex justify-center items-center mx-auto my-10 p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
          <div className="flex justify-center items-center">
            <MainSpinner
              isLoading={
                invoiceData.isLoading ||
                passportsData.isLoading ||
                visasData.isLoading ||
                paymentsData.isLoading ||
                ticketsData.isLoading ||
                purchasesData.isLoading
              }
            />
          </div>
        </div>
      </div>
    );

  return (
    <div className="max-w-5xl w-full min-h-[75vh] mx-auto overflow-x-auto my-20 p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
      <h2 className="flex justify-center items-center text-gray-800 mb-4 text-2xl font-bold px-2 py-4 my-4 rounded shadow bg-red-200 border-b-4 border-red-800">
        <span className="flex justify-center items-center mr-2">
          <FcHome size={50} />
        </span>
        الصفحة الرئيسية
      </h2>

      <img className="mx-auto" src={logo} alt="logo" />

      <div className="flex flex-col md:flex-row md:flex-wrap justify-center items-center gap-16 p-3 font-semibold">
        {mainPageLinks.map((link: any, index: number) => (
          <div
            key={index}
            className="basis-full flex justify-center items-center flex-wrap gap-3"
          >
            <h1 className="basis-full p-2 mb-2 bg-red-800 text-white text-2xl rounded">
              {mainHeadings[index]}
            </h1>

            <Link
              className="min-w-[250px] flex justify-center items-center flex-col px-3 py-6 gap-4 rounded shadow-md shadow-black/30 hover:bg-red-200 transition-all duration-100 ease-in-out"
              to={link[0][1]}
            >
              <span>{link[0][0]}</span>
              {link[0][2]}
            </Link>

            <Link
              className="min-w-[250px] flex justify-center items-center flex-col px-3 py-6 gap-4 rounded shadow-md shadow-black/30 hover:bg-red-200 transition-all duration-100 ease-in-out"
              to={link[1][1]}
            >
              <span>{link[1][0]}</span>
              {link[1][2]}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
