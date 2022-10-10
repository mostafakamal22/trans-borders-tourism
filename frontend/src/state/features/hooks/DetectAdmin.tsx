import { useEffect } from "react";
import { getAdmin } from "../admin/auth/adminAuthSlice";
import { useAppDispatch, useAppSelector } from "./StateHooks";

export default function UseDetectAdmin() {
  const { info } = useAppSelector((state) => state.adminAuth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (info) {
      const adminData = {
        token: info.token,
        id: info.id,
      };

      dispatch(getAdmin(adminData));
    }
  }, []);

  return info;
}
