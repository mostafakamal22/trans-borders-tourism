import { FcVip } from "react-icons/fc";
import { RiArrowRightLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import {
  useAppDispatch,
  useAppSelector,
} from "../../state/features/hooks/StateHooks";
import { useEffect } from "react";
import { getAllInvoices } from "../../state/features/invoice/invoiceSlice";

export default function AdminProfile() {
  const { info } = useAppSelector((state) => state.adminAuth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllInvoices({ token: info.token }));
  }, []);

  return (
    <div className="max-w-4xl w-full  p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
      <h2 className="flex items-center text-gray-800 mb-4 text-2xl font-bold px-2 py-4 my-4 rounded shadow bg-red-200 border-b-4 border-red-800">
        <span className="flex justify-center items-center mr-2">
          <FcVip size={50} />
        </span>
        {info.name}
      </h2>

      <ul className="w-full max-w-[550px] py-2 px-3 mt-3 rounded">
        <li className="flex items-center p-3 mb-2  border-r-4 border-red-800 rounded shadow bg-red-200">
          <span className="font-semibold">Position</span>
          <span className="ml-auto">
            <span className="bg-green-500 py-1 px-2 rounded text-white text-sm">
              {info.role}
            </span>
          </span>
        </li>
        <li className="flex items-center p-3 mb-2  border-r-4 border-red-800 rounded shadow bg-red-200">
          <span className="font-semibold">Email Address</span>
          <span className="ml-auto hover:underline hover:text-yellow-800">
            {info.email}
          </span>
        </li>
      </ul>

      <div className="flex justify-end items-center mt-6">
        <Link
          to={`/profile/update`}
          className="inline-flex font-bold text-xs sm:text-sm bg-blue-700 text-white hover:bg-white px-2 sm:px-3 py-2 hover:text-blue-600 border hover:border-blue-800 items-center rounded
         shadow transition-all ease-in-out duration-300"
        >
          Update Profile
          <RiArrowRightLine className="mb-[-4px] ml-1 font-bold" size={15} />
        </Link>
      </div>
    </div>
  );
}
