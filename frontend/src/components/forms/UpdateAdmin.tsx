import React, { useState } from "react";
import { useEffect } from "react";
import { AiFillSlackCircle } from "react-icons/ai";
import { FcDoughnutChart, FcInfo } from "react-icons/fc";
import {
  resetAdminAuthStatus,
  updateAdmin,
} from "../../state/features/admin/auth/adminAuthSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../state/features/hooks/StateHooks";
import FormButton from "../shared/FormButton";
import MessagesContainer from "../shared/MessagesContainer";
import logo from "../../assets/imgs/trans-logo.png";
import { UseResetStatus } from "../../hooks/UseResetStatus";
import { resetInvoicesStatus } from "../../state/features/invoice/invoiceSlice";

export default function UpdateAdmin() {
  const dispatch = useAppDispatch();
  const { info, isError, isSuccess, isLoading, message } = useAppSelector(
    (state) => state.adminAuth
  );

  const [formInputs, setFormInputs] = useState({
    email: info && info.email,
    oldPassword: "",
    password: "",
    repeatedPassword: "",
    msg: "",
  });

  const { email, oldPassword, repeatedPassword, password, msg } = formInputs;

  useEffect(() => {
    if (isError) {
      setFormInputs({ ...formInputs, msg: message });
    }

    if (isSuccess) {
      setFormInputs({
        ...formInputs,
        msg: message,
      });
    }
  }, [isError, message, msg, isSuccess]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    //set msg to none first
    setFormInputs({ ...formInputs, msg: "" });

    const adminData = {
      email: email.trim(),
      token: info.token,
      id: info.id,
      password,
      repeatedPassword,
      oldPassword,
    };
    dispatch(updateAdmin(adminData));
  };

  //clean up status (when mount and unmount)
  UseResetStatus(() => {
    dispatch(resetAdminAuthStatus());
    dispatch(resetInvoicesStatus());
  });

  UseResetStatus(() => {
    return () => {
      dispatch(resetAdminAuthStatus());
      dispatch(resetInvoicesStatus());
    };
  });
  return (
    <div className="max-w-5xl w-full mx-auto my-20 p-6 bg-slate-50 rounded shadow-lg shadow-black/30 ">
      <h3 className="flex justify-center items-center text-2xl italic font-bold text-center px-2 py-4 mb-10 rounded shadow bg-red-200 border-b-4 border-red-800">
        <FcDoughnutChart className="ml-1" size={50} />
        <span>تعديل بيانات الحساب</span>
      </h3>

      <img className="mx-auto" src={logo} alt="logo" />

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="w-full inline-block font-semibold mb-4 p-2 text-white rounded shadow bg-red-800"
          >
            Email address
          </label>
          <input
            type="email"
            name="email"
            className="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-red-800 focus:outline-none"
            defaultValue={email}
            onChange={(e) =>
              setFormInputs({ ...formInputs, email: e.target.value })
            }
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="oldPassword"
            className="w-full inline-block font-semibold mb-4 p-2 text-white rounded shadow bg-red-800"
          >
            Old Password
          </label>
          <span className="flex items-center flex-col md:flex-row gap-2 text-sm md:text-base  text-blue-700 mb-2 font-medium">
            <FcInfo size={27} />
            <span>
              إذا لم ترغب فى تغيير كلمة السر القديمة ,فعليك بتكرارها فى الثلاث
              خانات القادمة
            </span>
          </span>
          <input
            type="password"
            name="oldPassword"
            className="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-red-800 focus:outline-none"
            defaultValue={oldPassword}
            onChange={(e) =>
              setFormInputs({ ...formInputs, oldPassword: e.target.value })
            }
            placeholder="Enter your old Password"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="w-full inline-block font-semibold mb-4 p-2 text-white rounded shadow bg-red-800"
          >
            New Password
          </label>
          <input
            type="password"
            name="password"
            className="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-red-800 focus:outline-none"
            defaultValue={password}
            onChange={(e) =>
              setFormInputs({ ...formInputs, password: e.target.value })
            }
            placeholder="Enter New Password"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="repeatedPassword"
            className="w-full inline-block font-semibold mb-4 p-2 text-white rounded shadow bg-red-800"
          >
            Repeat New Password
          </label>
          <input
            type="password"
            name="repeatedPassword"
            className="block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-red-800 focus:outline-none"
            defaultValue={repeatedPassword}
            onChange={(e) =>
              setFormInputs({
                ...formInputs,
                repeatedPassword: e.target.value,
              })
            }
            placeholder="Repeat New Password"
            required
          />
        </div>

        {/*Request Status and Errors*/}
        {(isError || isSuccess) && msg && (
          <MessagesContainer
            msg={msg}
            isSuccess={isSuccess}
            isError={isError}
          />
        )}

        {/*form button */}
        <FormButton
          text={{ loading: "جارى التعديل", default: "تعديل البيانات" }}
          isLoading={isLoading}
          icon={<AiFillSlackCircle className="ml-1" size={25} />}
        />
      </form>
    </div>
  );
}
