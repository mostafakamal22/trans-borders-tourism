import { FcHome } from "react-icons/fc";
import { Link } from "react-router-dom";
import { FcFile, FcBookmark } from "react-icons/fc";
export const Home = () => {
  return (
    <div className="max-w-4xl w-full  p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
      <h2 className="flex justify-center items-center text-gray-800 mb-4 text-2xl font-bold px-2 py-4 my-4 rounded shadow bg-blue-200 border-b-4 border-blue-800">
        <span className="flex justify-center items-center mr-2">
          <FcHome size={50} />
        </span>
        Home Page
      </h2>

      <div className="flex justify-center  items-center  gap-16 p-3 font-semibold">
        <Link
          className="flex justify-center items-center flex-col px-3 py-6 gap-4 rounded shadow-md shadow-black/30"
          to={"/invoices"}
        >
          <span>Show Invoices</span>
          <FcBookmark size={40} />
        </Link>

        <Link
          className="flex justify-center items-center flex-col px-3 py-6 gap-4 rounded shadow-md shadow-black/30"
          to={"/invoices/create"}
        >
          <span>Add Invoice</span>
          <FcFile size={40} />
        </Link>
      </div>
    </div>
  );
};
