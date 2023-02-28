import { Outlet } from "react-router-dom";

export const PublicLayout = () => {
  return (
    <div className="min-h-screen flex mx-2">
      <Outlet />
    </div>
  );
};
