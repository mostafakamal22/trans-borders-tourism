import { isFulfilled, isRejectedWithValue } from "@reduxjs/toolkit";
import type { MiddlewareAPI, Middleware } from "@reduxjs/toolkit";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

/**
 * Show a (Success Or Error) toast for different api requests.
 */

//Not Showing a Toast For These Requests' Endpoints.
const toastBlackList: string[] = [
  "getAdmin",
  "refresh",
  "getPassports",
  "getInvoices",
  "getTickets",
  "getPurchases",
];

//Toast Messages
const toastMessages = {
  //Bad Request
  400: (
    <div className="flex flex-col items-center justify-center gap-2 font-Tajawal">
      <h3 className="text-base font-semibold   md:text-xl">طلب خاطئ!</h3>
      <p>يرجى التأكد من المدخلات وحاول مجدداً</p>
    </div>
  ),
  //Too Many Requests Error
  429: (
    <div className="flex flex-col items-center justify-center gap-2 font-Tajawal">
      <h3 className="text-base font-semibold   md:text-xl">
        لقد تخطيت عدد المحاولات المسموح بها!
      </h3>
      <p>حاول مجددا لاحقا</p>
    </div>
  ),
  //Server Error
  500: (
    <div className="flex flex-col items-center justify-center gap-2 font-Tajawal">
      <h3 className="text-base font-semibold   md:text-xl">خطأ من السيرفر!</h3>
      <p>حاول مجددا لاحقا</p>
    </div>
  ),

  //Unknown Error
  unknown: (
    <div className="flex flex-col items-center justify-center gap-2 font-Tajawal">
      <h3 className="text-base font-semibold   md:text-xl">خطأ غير معلوم!</h3>

      <p>حاول مجددا لاحقا</p>
    </div>
  ),
};

export const toastHandlingMiddlware: Middleware =
  (_api: MiddlewareAPI) => (next) => (action) => {
    const endpointName = action?.meta?.arg?.endpointName;

    const toastId = "loremIpsum";

    if (isRejectedWithValue(action)) {
      let message = null;

      if (action?.payload?.originalStatus === 400) {
        //Bad Request
        toast(toastMessages[400], {
          type: toast.TYPE.ERROR,
          toastId,
        });
      } else if (action?.payload?.originalStatus === 401) {
        //Cookie Expired While Logged IN Error.
        //Session Ended
        //Go To Login
        message = <SessionExpireMsg />;
        toast(message, {
          type: toast.TYPE.ERROR,
          toastId,
        });
      } else if (action?.payload?.originalStatus === 500) {
        //Server Error
        toast(toastMessages[500], {
          type: toast.TYPE.ERROR,
          toastId,
        });
      } else if (action?.payload?.originalStatus === 429) {
        //Too Many Requests Error
        toast(toastMessages[429], {
          type: toast.TYPE.ERROR,
          toastId,
        });
      } else if (action?.payload?.originalStatus === 403) {
        //Session Ended
        //Go To Login
        message = <SessionExpireMsg />;
        toast(message, {
          type: toast.TYPE.ERROR,
          toastId,
        });
      } else {
        //Unknown Errors
        toast(toastMessages["unknown"], {
          type: toast.TYPE.ERROR,
          toastId,
        });
      }
    }

    if (isFulfilled(action) && !toastBlackList.includes(endpointName)) {
      let message = (
        <h3 className="font-Tajawal text-base font-semibold  md:text-xl">
          تمت العملية بنجاح
        </h3>
      );

      if (endpointName === "login")
        message = (
          <h3 className="font-Tajawal text-base font-semibold  md:text-xl">
            مرحبا بك
          </h3>
        );

      if (endpointName === "sendLogout")
        message = (
          <h3 className="font-Tajawal text-base font-semibold  md:text-xl">
            تم تسجيل الخروج بنجاح
          </h3>
        );

      toast(message, {
        type: toast.TYPE.SUCCESS,
        toastId,
      });
    }

    return next(action);
  };

//Custom Message For Session Expiration Toast
const SessionExpireMsg = () => {
  const location = useLocation();
  const naviagate = useNavigate();

  useEffect(() => {
    //Navigate To Login Page
    naviagate("/login", {
      state: {
        from: location?.state?.from
          ? location?.state?.from
          : location?.pathname,
        isSessionEnded: true,
      },
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center gap-2 font-Tajawal">
      <h3 className="text-base font-semibold   md:text-xl">
        لقد إنتهت مدة تسجيل دخولك!
      </h3>
    </div>
  );
};
