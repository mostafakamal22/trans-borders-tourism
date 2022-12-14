import { AiFillHome } from "react-icons/ai";
import { Link } from "react-router-dom";
import { ReactComponent as NotFoundSVG } from "../../assets/imgs/Trans-404.svg";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen w-full flex justify-center items-center p-10 md:px-20 md:py-10">
      <div className="max-w-5xl w-full flex flex-col justify-center items-center p-6 bg-amber-50 rounded shadow-lg shadow-black/30 border-y-4 border-red-800">
        <h2 className="text-2xl md:text-3xl text-center font-bold text-blue-900 mb-3">
          !عفواً , هذة الصفحة غير موجودة
        </h2>

        <NotFoundSVG />

        <Link
          to="/"
          className="flex font-bold text-xs sm:text-sm bg-blue-800 text-white hover:bg-white my-5 px-2 sm:px-4 py-4 hover:text-blue-800 border hover:border-blue-800 items-center rounded
         shadow transition-all ease-in-out duration-300"
        >
          <AiFillHome className="mr-1" size={20} />
          إذهب للصفحة الرئيسية
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
