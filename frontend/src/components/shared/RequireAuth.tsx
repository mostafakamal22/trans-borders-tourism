import { useLocation, Navigate, Outlet } from "react-router-dom";
import { selectCurrentToken } from "../../state/features/admin/auth/authSlice";
import { useAppSelector } from "../../state/features/hooks/StateHooks";

export const RequireAuth = () => {
  const token = useAppSelector(selectCurrentToken);
  const location = useLocation();

  return token ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location.pathname }} replace />
  );
};
