import { Outlet } from "react-router-dom";
import { SideNavbar } from "./SideNavbar";

export const MainLayout = () => {
  return (
    <div className="flex h-screen flex-row-reverse overflow-hidden">
      <SideNavbar />
      <div className="m-3 flex w-full items-start overflow-scroll rounded bg-slate-50 px-6 py-10 shadow-lg  shadow-black/30 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400  scrollbar-track-rounded-full">
        <Outlet />
      </div>
    </div>
  );
};
