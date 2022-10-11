import { RiAdminFill, RiLogoutCircleFill } from "react-icons/ri";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/imgs/trans-logo.png";
import { adminLogout } from "../../state/features/admin/auth/adminAuthSlice";
import { useAppDispatch } from "../../state/features/hooks/StateHooks";
import { adminsLogout } from "../../state/features/invoice/invoiceSlice";

export const Navbar = () => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(adminsLogout());
    dispatch(adminLogout());
  };

  return (
    <nav className="bg-slate-50 px-2 sm:px-4 py-2.5 sticky w-full z-20 top-0 left-0 shadow-md">
      <div className="container flex flex-wrap justify-between items-center mx-auto">
        <Link to="/" className="flex items-center">
          <img src={logo} className="mr-3 h-6 sm:h-16" alt="Trans Logo" />
        </Link>

        <div className="justify-between items-center w-full flex md:w-auto md:order-1">
          <ul className="flex items-center justify-center p-4 mt-4 md:flex-row md:space-x-8 md:mt-0 md:text-lg md:font-semibold ">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive ? "text-blue-700" : "text-black"
                }
                end
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/invoices"
                className={({ isActive }) =>
                  isActive ? "text-blue-700" : "text-black"
                }
                end
              >
                Invoices
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/invoices/create"
                className={({ isActive }) =>
                  isActive ? "text-blue-700" : "text-black"
                }
              >
                Add Invoice
              </NavLink>
            </li>

            <li>
              <Link
                to={"/profile"}
                className="flex font-bold text-xs sm:text-sm bg-green-800 text-white hover:bg-white  px-2 sm:px-3 py-2 hover:text-green-800 border hover:border-green-800 items-center rounded
         shadow transition-all ease-in-out duration-300"
              >
                <RiAdminFill size={20} />
              </Link>
            </li>

            <li>
              <button
                className="flex font-bold text-xs sm:text-sm bg-blue-800 text-white hover:bg-white  px-2 sm:px-3 py-2 hover:text-blue-800 border hover:border-blue-800 items-center rounded
         shadow transition-all ease-in-out duration-300"
              >
                EN
              </button>
            </li>

            <li>
              <button
                onClick={handleLogout}
                className="flex font-bold text-xs sm:text-sm bg-red-800 text-white hover:bg-white  px-2 sm:px-3 py-2 hover:text-red-800 border hover:border-red-800 items-center rounded
         shadow transition-all ease-in-out duration-300"
              >
                Logout
                <RiLogoutCircleFill className="ml-1" size={20} />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
