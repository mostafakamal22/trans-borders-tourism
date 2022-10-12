import { useState, useEffect } from "react";
import { FcPrivacy } from "react-icons/fc";
import { RiLoginCircleFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { UseResetStatus } from "../../hooks/UseResetStatus";
import {
  adminLogin,
  resetAdminAuthStatus,
} from "../../state/features/admin/auth/adminAuthSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../state/features/hooks/StateHooks";
import FormButton from "../shared/FormButton";
import MessagesContainer from "../shared/MessagesContainer";
import logo from "../../assets/imgs/trans-logo.png";

export default function AdminLogin() {
  const [formInputs, setFormInputs] = useState({
    email: "",
    password: "",
    msg: "",
  });

  const { email, password, msg } = formInputs;

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { info, isError, isSuccess, isLoading, message } = useAppSelector(
    (state) => state.adminAuth
  );

  useEffect(() => {
    if (isError) {
      setFormInputs({ ...formInputs, msg: message });
    }

    if (info) {
      setFormInputs({ ...formInputs, msg: "Login Succesfully" });
      navigate("/");
    }
  }, [isError, message, info, msg]);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    //set msg to none first
    setFormInputs({ ...formInputs, msg: "" });

    const adminData = JSON.stringify({
      email: email.trim(),
      password,
    });
    dispatch(adminLogin(adminData));
  };

  //clean up status (when mount and unmount)
  UseResetStatus(() => {
    dispatch(resetAdminAuthStatus());
  });

  UseResetStatus(() => {
    return () => {
      dispatch(resetAdminAuthStatus());
    };
  });

  return (
    <div className="block p-6 rounded shadow-lg shadow-black/20 bg-slate-50 max-w-md w-full m-auto">
      {/* <Logo /> */}
      <h3 className="flex justify-center items-center text-2xl text-red-800 font-bold text-center p-2 my-4 rounded shadow bg-red-200 border-x-4 border-red-800 select-none">
        <FcPrivacy size={45} />
        <span>تسجيل دخول الأدمن</span>
      </h3>

      <img className="mx-auto" src={logo} alt="logo" />

      <form className="mt-10" onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="w-full inline-block font-semibold mb-4 p-2 text-white rounded shadow bg-red-800"
          >
            عنوان البريد الإلكترونى
          </label>
          <input
            type="email"
            name="email"
            className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-red-800 focus:outline-none"
            defaultValue={email}
            onChange={(e) =>
              setFormInputs({ ...formInputs, email: e.target.value })
            }
            placeholder="أدخل البريد الإلكترونى الخاص بك"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="password"
            className="w-full inline-block font-semibold mb-4 p-2 text-white rounded shadow bg-red-800"
          >
            كلمة السر
          </label>
          <input
            type="password"
            name="password"
            className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-red-800 focus:outline-none"
            defaultValue={password}
            onChange={(e) =>
              setFormInputs({ ...formInputs, password: e.target.value })
            }
            placeholder="أدخل كلمة السر الخاصة بك"
            required
          />
        </div>

        {/*Request Status and Errors*/}
        {(isError || isSuccess) && (
          <MessagesContainer
            msg={msg}
            isSuccess={isSuccess}
            isError={isError}
          />
        )}

        {/*form button */}
        <FormButton
          text={{ loading: "جارى تسجيل الدخول", default: "تسجيل الدخول" }}
          isLoading={isLoading}
          icon={<RiLoginCircleFill className="mb-[-2px] ml-1" size={27} />}
        />
      </form>
    </div>
  );
}
