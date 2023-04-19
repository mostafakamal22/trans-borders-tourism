import { useEffect, useState } from "react";
import { HiMenu, HiMenuAlt3 } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { RiLogoutBoxFill, RiSettings4Line } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import {
  AiOutlineUser,
  AiOutlineHeart,
  AiFillDashboard,
  AiFillProject,
  AiFillBell,
  AiFillSchedule,
  AiFillShopping,
} from "react-icons/ai";
import { FiMessageSquare, FiFolder, FiShoppingCart } from "react-icons/fi";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "../../state/features/admin/auth/authApiSlice";
import SmallSpinner from "./SmallSpinner";
import { BsGearFill, BsPlus } from "react-icons/bs";
import logo from "../../assets/imgs/trans-logo.png";

type MenuItem = {
  name: string;
  link: string;
  icon: React.ReactElement;
  margin?: boolean;
};

type MenuType<I> = I[];

const menus: MenuType<MenuItem> = [
  { name: "الرئيسية", link: "/home", icon: <MdDashboard size={20} /> },
  { name: "بيانات الحساب", link: "/profile", icon: <BsGearFill size={20} /> },
  // { name: "analytics", link: "/", icon: TbReportAnalytics , margin: true},

  {
    name: "الفواتير",
    link: "/invoices",
    icon: <AiFillBell size={20} />,
    margin: true,
  },
  {
    name: "إضافة فاتورة",
    link: "/invoices/create",
    icon: <BsPlus size={20} />,
  },
  {
    name: "الجوازات",
    link: "/passports",
    icon: <AiFillProject size={20} />,
    margin: true,
  },
  {
    name: "إضافة جواز",
    link: "/passports/create",
    icon: <BsPlus size={20} />,
  },
  {
    name: "التذاكر",
    link: "/tickets",
    icon: <AiFillSchedule size={20} />,
    margin: true,
  },
  {
    name: "إضافة التذاكر",
    link: "/tickets/create",
    icon: <BsPlus size={20} />,
  },

  {
    name: "المشتريات",
    link: "/purchases",
    icon: <AiFillShopping size={20} />,
    margin: true,
  },

  {
    name: "إضافة المشتريات",
    link: "/purchases/create",
    icon: <BsPlus size={20} />,
  },
  {
    name: "إضافة سند",
    link: "/purchases/create/voucher",
    icon: <BsPlus size={20} />,
  },

  // { name: "File Manager", link: "/", icon: FiFolder },
  // { name: "Cart", link: "/", icon: FiShoppingCart },
  // { name: "Saved", link: "/", icon: AiOutlineHeart, margin: true },
  // { name: "Setting", link: "/", icon: RiSettings4Line },
  // { name: "analytics", link: "/", icon: TbReportAnalytics, margin: true },
  // { name: "File Manager", link: "/", icon: FiFolder },
  // { name: "Cart", link: "/", icon: FiShoppingCart },
  // { name: "analytics", link: "/", icon: TbReportAnalytics, margin: true },
  // { name: "File Manager", link: "/", icon: FiFolder },
  // { name: "Cart", link: "/", icon: FiShoppingCart },
];

export const SideNavbar = () => {
  const [sendLogout, { isLoading, isSuccess }] = useSendLogoutMutation();

  const navigate = useNavigate();
  const location = useLocation();

  //For Toggling Navbar
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (isSuccess) navigate("/login", { state: { from: location.pathname } });
  }, [isSuccess, navigate]);

  return (
    <aside
      className={`min-h-screen overflow-y-auto overflow-x-hidden bg-slate-50 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 scrollbar-corner-slate-700 scrollbar-track-rounded-full scrollbar-w-0 ${
        open ? "w-52" : "w-16"
      }  px-4 font-semibold text-black duration-500`}
      role={"navigation"}
    >
      <div className="flex  justify-end py-3">
        <HiMenu
          size={26}
          className="cursor-pointer focus:bg-gray-100 hover:bg-gray-100"
          onClick={() => setOpen(!open)}
        />
      </div>

      <img
        className={`${
          !open ? "opacity-0" : "opacity-100"
        } mb-2 h-8 transition-all`}
        src={logo}
        alt="logo"
      />

      <div className="relative mt-2 flex flex-col gap-1">
        {menus?.map((menu, i) => (
          <NavLink
            to={menu?.link}
            key={i}
            className={({ isActive }) =>
              isActive
                ? `${menu?.margin && "mt-2"}  ${!open && "justify-center"}  
              
            flex flex-row-reverse items-center   rounded-md  bg-red-200 p-2 text-xs  hover:bg-red-200`
                : `${menu?.margin && "mt-2"}  ${!open && "justify-center"} 
              
             flex flex-row-reverse items-center truncate rounded-md p-2 text-xs  hover:bg-red-200`
            }
            title={menu?.name}
            end
          >
            <span
              className={`whitespace-pre duration-500 ${
                open ? "ml-2" : "ml-0"
              }`}
            >
              {menu?.icon}
            </span>
            <h2
              style={{
                transitionDelay: `${i + 3}00ms`,
              }}
              className={`whitespace-pre duration-500 ${
                !open && "translate-x-28 overflow-hidden opacity-0"
              }`}
            >
              {menu?.name}
            </h2>
          </NavLink>
        ))}

        {/* LogoutButton */}
        <button
          className=" mt-3 flex cursor-pointer flex-row-reverse items-center justify-center rounded-md bg-red-700   p-2 text-xs text-white  disabled:cursor-not-allowed hover:opacity-80"
          title={"تسجيل الخروج"}
          onClick={() => sendLogout()}
          disabled={isLoading}
        >
          <span
            className={`whitespace-pre duration-500 ${open ? "ml-2" : "ml-0"}`}
          >
            <RiLogoutBoxFill size={20} />
          </span>

          <h2
            style={{
              transitionDelay: `${3}00ms`,
            }}
            className={`whitespace-pre duration-500 ${
              !open && "translate-x-28 overflow-hidden opacity-0"
            }`}
          >
            {!isLoading ? "تسجيل الخروج" : <SmallSpinner />}
          </h2>
        </button>
      </div>
    </aside>
  );
};
