import { FcHome } from "react-icons/fc";
import { Link } from "react-router-dom";
import { FcFile, FcBookmark } from "react-icons/fc";
import logo from "../../assets/imgs/trans-logo.png";
import {
  useAppDispatch,
  useAppSelector,
} from "../../state/features/hooks/StateHooks";
import { getAllInvoices } from "../../state/features/invoice/invoiceSlice";

import { useEffect } from "react";
import { MainSpinner } from "../shared/MainSpinner";

export const Home = () => {
  const { info } = useAppSelector((state) => state.adminAuth);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllInvoices({ token: info.token }));
  }, []);

  const { isLoading } = useAppSelector((state) => state.invoiceData);

  //Loading Spinner After Login Waiting Until Invoice data is Fetched.
  if (isLoading)
    return (
      <div className="mx-5 h-min-screen">
        <div className="max-w-5xl w-full h-full flex justify-center items-center mx-auto my-10 p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
          <div className="flex justify-center items-center">
            <MainSpinner isLoading={isLoading} />
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

      <div className="flex flex-col md:flex-row justify-center items-center gap-16 p-3 font-semibold">
        <Link
          className="min-w-[250px] flex justify-center items-center flex-col px-3 py-6 gap-4 rounded shadow-md shadow-black/30 hover:bg-red-200 transition-all duration-100 ease-in-out"
          to={"/invoices"}
        >
          <span>عرض الفواتير</span>
          <FcBookmark size={50} />
        </Link>

        <Link
          className="min-w-[250px] flex justify-center items-center flex-col px-3 py-6 gap-4 rounded shadow-md shadow-black/30 hover:bg-red-200 transition-all duration-100 ease-in-out"
          to={"/invoices/create"}
        >
          <span>إضافة فاتورة</span>
          <FcFile size={50} />
        </Link>
      </div>
    </div>
  );
};
