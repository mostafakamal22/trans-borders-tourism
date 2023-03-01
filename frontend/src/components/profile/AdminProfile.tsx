import { FcVip } from "react-icons/fc";
import { RiArrowLeftLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../state/features/hooks/StateHooks";
import logo from "../../assets/imgs/trans-logo.png";
import { useGetAdminQuery } from "../../state/features/admin/auth/authApiSlice";
import jwt_decode, { JwtPayload } from "jwt-decode";
import { selectCurrentToken } from "../../state/features/admin/auth/authSlice";
import { MainSpinner } from "../shared/MainSpinner";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export interface JWTPaylaod extends JwtPayload {
  AdminInfo: { id: string; role: string };
}

export default function AdminProfile() {
  const token = useAppSelector(selectCurrentToken) as string;

  const { AdminInfo } = jwt_decode(token) as JWTPaylaod;
  const { id, role } = AdminInfo;

  const { data, isLoading } = useGetAdminQuery(id);

  useDocumentTitle("بيانات الحساب");

  if (isLoading) {
    return (
      <div className="mx-auto flex h-full w-full max-w-5xl items-center justify-center">
        <div className="w-full">
          <MainSpinner isLoading={isLoading} />
        </div>
      </div>
    );
  }

  return (
    <section className="w-full">
      <h3 className="mb-5 flex items-center justify-center rounded bg-red-800 px-2 py-4 text-center text-2xl font-bold italic text-white shadow">
        <FcVip className="ml-1 drop-shadow" size={50} />
        <span>بيانات الحساب</span>
      </h3>

      <img className="mx-auto max-h-40" src={logo} alt="logo" />

      <ul className="mt-3 ml-auto w-full max-w-[550px] rounded py-2 px-3">
        <li className="mb-2 flex items-center rounded  border-r-4 border-red-800 bg-red-200 p-3 shadow">
          <span className="mr-auto">
            <span className="rounded bg-pink-500 py-1 px-2 text-sm text-white">
              {data?.name}
            </span>
          </span>
          <span className="font-semibold">الاسم</span>
        </li>

        <li className="mb-2 flex items-center rounded  border-r-4 border-red-800 bg-red-200 p-3 shadow">
          <span className="mr-auto">
            <span className="rounded bg-green-500 py-1 px-2 text-sm text-white">
              {role}
            </span>
          </span>
          <span className="font-semibold">المنصب</span>
        </li>
        <li className="mb-2 flex items-center rounded  border-r-4 border-red-800 bg-red-200 p-3 shadow">
          <span className="mr-auto hover:text-yellow-800 hover:underline">
            {data?.email}
          </span>
          <span className="font-semibold">الايميل الخاص</span>
        </li>
      </ul>

      <div className="mt-6 flex items-center">
        <Link
          to={`/profile/update`}
          className="flex items-center rounded border bg-blue-700 px-2 py-2 text-xs font-bold text-white shadow transition-all duration-300 ease-in-out hover:border-blue-800
         hover:bg-white hover:text-blue-600 sm:px-3 sm:text-sm"
        >
          <RiArrowLeftLine className="mb-[-4px] mr-1" size={15} />
          تعديل الحساب
        </Link>
      </div>
    </section>
  );
}
