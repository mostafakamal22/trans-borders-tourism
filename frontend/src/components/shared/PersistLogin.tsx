import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useRefreshMutation } from "../../state/features/admin/auth/authApiSlice";
import { useAppSelector } from "../../state/features/hooks/StateHooks";
import { selectCurrentToken } from "../../state/features/admin/auth/authSlice";
import { MainSpinner } from "./MainSpinner";

const PersistLogin = () => {
  const token = useAppSelector(selectCurrentToken);
  const effectRan = useRef(false);

  const location = useLocation();

  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError }] =
    useRefreshMutation();

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== "development") {
      // React 18 Strict Mode

      const verifyRefreshToken = async () => {
        try {
          await refresh().unwrap();
          setTrueSuccess(true);
        } catch (_err) {}
      };

      if (!token) verifyRefreshToken();
    }

    return () => {
      effectRan.current = true;
    };

    // eslint-disable-next-line
  }, []);

  let content = null;
  if (isLoading) {
    content = (
      <div className="mx-auto flex h-full max-h-screen w-full items-center justify-center p-2">
        <div className="h-full w-full bg-slate-50">
          <MainSpinner
            spinnerHeight="calc(100vh - 16px)"
            isLoading={isLoading}
          />
        </div>
      </div>
    );
  } else if (isError) {
    content = (
      <Navigate
        to={"/login"}
        state={{ from: location?.pathname, isSessionEnded: true }}
      />
    );
  } else if (isSuccess && trueSuccess) {
    content = <Outlet />;
  } else if (token && isUninitialized) {
    content = <Outlet />;
  }

  return content;
};

export default PersistLogin;
