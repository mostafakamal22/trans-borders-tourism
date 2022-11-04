import React from "react";
import {
  AiFillAccountBook,
  AiFillBell,
  AiFillCalendar,
  AiFillHome,
  AiFillProject,
  AiFillSchedule,
  AiFillShopping,
} from "react-icons/ai";
import { BsPlus, BsGearFill } from "react-icons/bs";
import { RiLogoutBoxFill } from "react-icons/ri";
import { NavLink } from "react-router-dom";
import { adminLogout } from "../../state/features/admin/auth/adminAuthSlice";
import { useAppDispatch } from "../../state/features/hooks/StateHooks";
import { adminsLogout } from "../../state/features/invoice/invoiceSlice";
import { passportsLogout } from "../../state/features/passport/passportSlice";
import { paymentsLogout } from "../../state/features/payment/paymentSlice";
import { purchasesLogout } from "../../state/features/purchase/purchaseSlice";
import { ticketsLogout } from "../../state/features/ticket/ticketSlice";
import { visasLogout } from "../../state/features/visa/visaSlice";

type NavbarLinks = [string, string, React.ReactElement][];

const navbarLinks: NavbarLinks = [
  ["الرئيسية", "/", <AiFillHome size={20} />],
  ["الفواتير", "/invoices", <AiFillBell size={20} />],
  ["إضافة فاتورة", "/invoices/create", <BsPlus size={20} />],
  ["الجوازات", "/passports", <AiFillProject size={20} />],
  [" إضافة جوازات", "/passports/create", <BsPlus size={20} />],
  ["المبيعات", "/visas", <AiFillCalendar size={20} />],
  ["إضافة المبيعات", "/visas/create", <BsPlus size={20} />],
  ["المصروفات", "/payments", <AiFillAccountBook size={20} />],
  ["إضافة المصروفات", "/payments/create", <BsPlus size={20} />],
  ["التذاكر", "/tickets", <AiFillSchedule size={20} />],
  ["إضافة التذاكر", "/tickets/create", <BsPlus size={20} />],
  ["المشتريات", "/purchases", <AiFillShopping size={20} />],
  ["إضافة المشتريات", "/purchases/create", <BsPlus size={20} />],
  ["إضافة سند", "/voucher/create", <BsPlus size={20} />],
];

const SideBar = () => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(adminsLogout());
    dispatch(adminLogout());
    dispatch(passportsLogout());
    dispatch(visasLogout());
    dispatch(paymentsLogout());
    dispatch(ticketsLogout());
    dispatch(purchasesLogout());
  };

  return (
    <nav className="bg-slate-50 px-2 sm:px-4 py-2.5 sticky w-full z-20 top-0 left-0 flex justify-center  items-center gap-4 flex-wrap text-xs shadow-md transition-all duration-300 ease-in-out">
      <SideBarIcon
        link={navbarLinks[0][1]}
        text={navbarLinks[0][0]}
        icon={navbarLinks[0][2]}
      />
      <Divider />

      {navbarLinks.slice(1).map((navlink: any, index: number) => (
        <React.Fragment key={navlink[1]}>
          <SideBarIcon
            key={index}
            link={navlink[1]}
            text={navlink[0]}
            icon={navlink[2]}
          />
          {index % 2 !== 0 && <Divider />}
        </React.Fragment>
      ))}

      <SideBarIcon
        link={"/profile"}
        text={"تعديل الحساب"}
        icon={<BsGearFill size={20} />}
      />
      <div className="max-w-[50px] flex flex-col justify-center items-center">
        <button onClick={handleLogout} className="sidebar-icon group">
          <RiLogoutBoxFill size={20} />
        </button>
        <span className="font-semibold">تسجيل الخروج</span>
      </div>
    </nav>
  );
};

const SideBarIcon = ({
  icon,
  text,
  link,
}: {
  icon: React.ReactElement;
  text: string;
  link: string;
}) => (
  <div className="max-w-[50px] flex flex-col justify-center items-center">
    <div className="sidebar-icon group">
      <NavLink
        to={link}
        className={({ isActive }) =>
          isActive ? "realtive text-black" : "relative"
        }
        end
      >
        {icon}
        {/* sidebar-tooltip group-hover:scale-100 */}
      </NavLink>
    </div>
    <span className="font-semibold">{text}</span>
  </div>
);

const Divider = () => <hr className="sidebar-hr" />;

export default SideBar;
