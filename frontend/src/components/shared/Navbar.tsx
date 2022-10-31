import { RiAdminFill, RiLogoutCircleFill } from "react-icons/ri";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/imgs/trans-logo.png";
import { adminLogout } from "../../state/features/admin/auth/adminAuthSlice";
import { useAppDispatch } from "../../state/features/hooks/StateHooks";
import { adminsLogout } from "../../state/features/invoice/invoiceSlice";
import { useEffect } from "react";
import { passportsLogout } from "../../state/features/passport/passportSlice";
import { visasLogout } from "../../state/features/visa/visaSlice";
import { paymentsLogout } from "../../state/features/payment/paymentSlice";
import { ticketsLogout } from "../../state/features/ticket/ticketSlice";

const navbarLinks = [
  ["الرئيسية", "/"],
  ["الفواتير", "/invoices"],
  ["إضافة فاتورة", "/invoices/create"],
  ["الجوازات", "/passports"],
  [" إضافة جوازات", "/passports/create"],
  ["التأشيرات", "/visas"],
  ["إضافة التأشيرات", "/visas/create"],
  ["المصروفات", "/payments"],
  ["إضافة المصروفات", "/payments/create"],
  ["التذاكر", "/tickets"],
  ["إضافة التذاكر", "/tickets/create"],
];

export const Navbar = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const navbar = document.getElementsByTagName("nav")[0];
    const navList = document.querySelector("nav  ul");

    const changeNavPaddingAtScroll = () => {
      if (window.scrollY && navbar?.classList.contains("py-2.5")) {
        navbar?.classList.remove("py-2.5");
        navList?.classList.remove("p-4");
      }

      if (!window.scrollY && !navbar?.classList.contains("py-2.5")) {
        navbar?.classList.add("py-2.5");
        navList?.classList.add("p-4");
      }
    };

    window.addEventListener("scroll", changeNavPaddingAtScroll);

    return () => {
      window.removeEventListener("scroll", changeNavPaddingAtScroll);
    };
  }, []);

  const handleLogout = () => {
    dispatch(adminsLogout());
    dispatch(adminLogout());
    dispatch(passportsLogout());
    dispatch(visasLogout());
    dispatch(paymentsLogout());
    dispatch(ticketsLogout());
  };

  return (
    <nav className="bg-slate-50 px-2 sm:px-4 py-2.5 sticky w-full z-20 top-0 left-0 shadow-md transition-all duration-300 ease-in-out">
      <div className=" flex flex-wrap justify-between items-center ">
        <Link to="/" className=" items-center m-auto hidden sm:flex">
          <img src={logo} className="md:mr-3 h-16" alt="Trans Logo" />
        </Link>

        <div className="justify-between items-center w-full flex md:w-auto">
          <ul className="w-full flex items-center justify-center gap-4 flex-wrap p-4 my-1 md:text-base md:font-semibold transition-all duration-300 ease-in-out">
            {navbarLinks.map((link: any, index: number) => (
              <li key={index}>
                <NavLink
                  to={link[1]}
                  className={({ isActive }) =>
                    isActive ? "text-blue-700" : "text-black"
                  }
                  end
                >
                  {link[0]}
                </NavLink>
              </li>
            ))}

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
                onClick={handleLogout}
                className="flex font-bold text-xs sm:text-sm bg-red-800 text-white hover:bg-white  px-2 sm:px-3 py-2 hover:text-red-800 border hover:border-red-800 items-center rounded
         shadow transition-all ease-in-out duration-300"
              >
                <RiLogoutCircleFill className="mr-1" size={20} />
                تسجيل الخروج
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
