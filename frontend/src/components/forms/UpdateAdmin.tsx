import React, { useState, useEffect } from "react";
import { AiFillSlackCircle } from "react-icons/ai";
import { FcDoughnutChart, FcInfo } from "react-icons/fc";
import { useAppSelector } from "../../state/features/hooks/StateHooks";
import FormButton from "../shared/FormButton";
import { selectCurrentToken } from "../../state/features/admin/auth/authSlice";
import { JWTPaylaod } from "../profile/AdminProfile";
import {
  useGetAdminQuery,
  useUpdateAdminMutation,
} from "../../state/features/admin/auth/authApiSlice";
import jwt_decode from "jwt-decode";
import { MainSpinner } from "../shared/MainSpinner";
import { useScroll } from "../../hooks/useScroll";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export default function UpdateAdmin() {
  const token = useAppSelector(selectCurrentToken) as string;

  const { AdminInfo } = jwt_decode(token) as JWTPaylaod;
  const { id } = AdminInfo;

  const { data, isLoading, isFetching } = useGetAdminQuery(id);

  const [updateAdmin, { isLoading: isUpdating }] = useUpdateAdminMutation();

  const [formInputs, setFormInputs] = useState({
    email: "",
    oldPassword: "",
    password: "",
    repeatedPassword: "",
  });

  const { email, oldPassword, repeatedPassword, password } = formInputs;

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const adminData = {
      email: email.trim() as string,
      id,
      password,
      repeatedPassword,
      oldPassword,
    };
    await updateAdmin(adminData);
  };

  useEffect(() => {
    if (data) {
      setFormInputs({
        ...formInputs,
        email: data.email,
      });
    }
  }, [data]);

  useScroll("updateAdmin");
  useDocumentTitle("تعديل بيانات الحساب");

  if (isLoading || isFetching) {
    return (
      <div className="mx-auto flex h-full w-full max-w-5xl items-center justify-center">
        <div className="w-full">
          <MainSpinner isLoading={isLoading} />
        </div>
      </div>
    );
  }

  return (
    <section id="updateAdmin" className="w-full">
      <h3 className="mb-10 flex items-center justify-center rounded bg-red-800 px-2 py-4 text-center text-2xl font-bold italic text-white shadow">
        <FcDoughnutChart className="ml-1 drop-shadow" size={50} />
        <span>تعديل بيانات الحساب</span>
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label
            htmlFor="email"
            className="mb-4 inline-block w-full rounded bg-red-800 p-2 font-semibold text-white shadow"
          >
            البريد الإلكترونى
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
            placeholder="البريد الإلكترونى"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="oldPassword"
            className="mb-4 inline-block w-full rounded bg-red-800 p-2 font-semibold text-white shadow"
          >
            كلمة السر القديمة
          </label>
          <span className="mb-2 flex flex-col items-center gap-2 text-sm font-medium  text-blue-700 md:flex-row-reverse md:text-base">
            <FcInfo size={27} />
            <span>
              إذا لم ترغب فى تغيير كلمة السر القديمة ,فعليك بتكرارها فى الثلاث
              خانات القادمة
            </span>
          </span>
          <input
            type="password"
            name="oldPassword"
            id="oldPassword"
            className="m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out placeholder:text-right focus:border-red-800 focus:bg-white focus:text-gray-700 focus:outline-none"
            value={oldPassword}
            onChange={(e) =>
              setFormInputs({ ...formInputs, oldPassword: e.target.value })
            }
            placeholder="كلمة السر القديمة"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="mb-4 inline-block w-full rounded bg-red-800 p-2 font-semibold text-white shadow"
          >
            كلمة السر الجديدة
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
            placeholder="كلمة السر الجديدة"
            required
          />
        </div>

        <div className="mb-10">
          <label
            htmlFor="repeatedPassword"
            className="mb-4 inline-block w-full rounded bg-red-800 p-2 font-semibold text-white shadow"
          >
            تأكيد كلمة السر الجديدة
          </label>
          <input
            type="password"
            name="repeatedPassword"
            id="repeatedPassword"
            className="m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 transition ease-in-out placeholder:text-right focus:border-red-800 focus:bg-white focus:text-gray-700 focus:outline-none"
            value={repeatedPassword}
            onChange={(e) =>
              setFormInputs({
                ...formInputs,
                repeatedPassword: e.target.value,
              })
            }
            placeholder="تأكيد كلمة السر الجديدة"
            required
          />
        </div>

        {/*Form Button */}
        <FormButton
          text={{ loading: "جارى التعديل", default: "تعديل البيانات" }}
          isLoading={isUpdating}
          icon={<AiFillSlackCircle className="ml-1" size={25} />}
        />
      </form>
    </section>
  );
}
