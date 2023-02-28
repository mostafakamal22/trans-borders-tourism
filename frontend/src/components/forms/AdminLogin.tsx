import { useEffect, useState } from "react";
import { FcPrivacy } from "react-icons/fc";
import { RiLoginCircleFill } from "react-icons/ri";
import { useLocation, useNavigate } from "react-router-dom";
import FormButton from "../shared/FormButton";
import logo from "../../assets/imgs/trans-logo.png";
import { useLoginMutation } from "../../state/features/admin/auth/authApiSlice";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export default function AdminLogin() {
  const [login, { isLoading, isSuccess }] = useLoginMutation();

  const navigate = useNavigate();
  const location = useLocation();
  const isSessionEnded = location?.state?.isSessionEnded;

  const [formInputs, setFormInputs] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formInputs;

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    await login({ email, password });
  };

  useEffect(() => {
    if (isSuccess) {
      location?.state?.from
        ? navigate(`${location?.state?.from}`, { replace: true })
        : navigate("/home", { replace: true });
    }
  }, [isSuccess]);

  useDocumentTitle("تسجيل دخول الأدمن");

  return (
    <div className="m-auto block w-full max-w-md rounded bg-slate-50 p-6 shadow-lg shadow-black/20">
      <img className="mx-auto" src={logo} alt="logo" />

      <h3 className="my-4 flex select-none items-center justify-center rounded border-x-4 border-red-800 bg-red-200 p-2 text-center text-2xl font-bold text-red-800 shadow">
        <FcPrivacy size={45} />
        <span>تسجيل دخول الأدمن</span>
      </h3>

      {/* Session Ended Message */}
      {isSessionEnded && (
        <div className="flex flex-col items-center justify-center gap-2 rounded  border-x-4 border-red-800 bg-green-200 p-4 text-center font-semibold text-slate-700">
          <h2>!عفواً, برجاء تسجيل الدخول</h2>
        </div>
      )}

      <form className="mt-10 " onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="mb-4 inline-block w-full rounded bg-red-800 p-2 font-semibold text-white shadow"
          >
            عنوان البريد الإلكترونى
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out placeholder:text-right focus:border-red-800 focus:bg-white focus:text-gray-700 focus:outline-none"
            value={email}
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
            className="mb-4 inline-block w-full rounded bg-red-800 p-2 font-semibold text-white shadow"
          >
            كلمة السر
          </label>
          <input
            type="password"
            name="password"
            id="password"
            className="m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out placeholder:text-right focus:border-red-800 focus:bg-white focus:text-gray-700 focus:outline-none"
            value={password}
            onChange={(e) =>
              setFormInputs({ ...formInputs, password: e.target.value })
            }
            placeholder="أدخل كلمة السر الخاصة بك"
            required
          />
        </div>

        {/*Form Button */}
        <FormButton
          text={{ loading: "جارى تسجيل الدخول", default: "تسجيل الدخول" }}
          isLoading={isLoading}
          icon={<RiLoginCircleFill className="mb-[-2px] ml-1" size={27} />}
        />
      </form>
    </div>
  );
}
