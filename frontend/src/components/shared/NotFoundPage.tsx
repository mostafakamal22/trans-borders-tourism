import { AiFillHome } from "react-icons/ai";
import { Link } from "react-router-dom";
import NotFoundSVG from "../../assets/imgs/Trans-404.svg?react";
import useDocumentTitle from "../../hooks/useDocumentTitle";

const NotFoundPage = () => {
  useDocumentTitle("الصفحة غير موجودة");
  return (
    <div className="flex min-h-screen w-full items-center justify-center  p-10 ">
      <div className="flex  w-full max-w-5xl flex-col items-center justify-center  rounded border-y-4 border-red-800 bg-amber-50 p-6 shadow-lg shadow-black/30">
        <h2 className="mb-3 text-center text-2xl font-bold text-blue-900 md:text-3xl">
          !عفواً , هذة الصفحة غير موجودة
        </h2>

        <NotFoundSVG />

        <Link
          to="/home"
          className="my-5 flex items-center rounded border bg-blue-800 px-2 py-4 text-xs font-bold text-white shadow transition-all duration-300 ease-in-out hover:border-blue-800
         hover:bg-white hover:text-blue-800 sm:px-4 sm:text-sm"
        >
          <AiFillHome className="mr-1" size={20} />
          إذهب للصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
