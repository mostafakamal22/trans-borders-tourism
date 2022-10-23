import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FcBusiness } from "react-icons/fc";
import { TiDelete } from "react-icons/ti";
import { UseResetStatus } from "../../hooks/UseResetStatus";
import { resetAdminAuthStatus } from "../../state/features/admin/auth/adminAuthSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../state/features/hooks/StateHooks";
import {
  deletePassport,
  resetPassportsStatus,
} from "../../state/features/passport/passportSlice";
import FormButton from "../shared/FormButton";
import logo from "../../assets/imgs/trans-logo.png";
import MessagesContainer from "../shared/MessagesContainer";
import { PaginationTable } from "../shared/PaginationTable";
import { MainSpinner } from "../shared/MainSpinner";
import {
  inputClassNamesStyles,
  lableClassNamesStyles,
} from "../forms/CreateInvoice";
import { passportsCalculations } from "../helpers/passportCalculations";
import { UpdatePassport } from "../forms/UpdatePassport";

export const tableHeaderTitles = [
  "إسم العميل",
  "الجنسية",
  "رقم الجواز",
  "الوضعية",
  "الخدمة",
  "الرسوم",
  "رسوم الخدمة",
  "ضريبة رسوم الخدمة",
  "إجمالى التكلفة",
  "سعر البيع",
  "صافى الربح",
  "تاريخ الدفع",
  "تعديل الجواز",
  "مسح الجواز",
];

export type PassportState = {
  accepted: string[];
  rejected: string[];
  refunded: string[];
  delivered: string[];
};

export type PassportService = {
  "30days": "٣٠يوم";
  "90days": "٩٠يوم";
  extend_permission: "تمديد إذن دخول";
  report_request: "طلب كشف كفيل ومكفولين";
  renew_resedency: "تجديد إقامة";
  temp_shutdown_with_escape: "إغلاق مؤقت مع بلاغ هروب";
  change_situation: "تعديل وضع";
};

export const passportState: PassportState = {
  accepted: ["تمت الموافقة", "bg-green-200"],
  rejected: ["مرفوض", "bg-red-200"],
  refunded: ["تم إسترداد الرسوم", "bg-blue-200"],
  delivered: ["تم التسليم للعميل", "bg-yellow-200"],
};

export const passportService: PassportService = {
  "30days": "٣٠يوم",
  "90days": "٩٠يوم",
  extend_permission: "تمديد إذن دخول",
  report_request: "طلب كشف كفيل ومكفولين",
  renew_resedency: "تجديد إقامة",
  temp_shutdown_with_escape: "إغلاق مؤقت مع بلاغ هروب",
  change_situation: "تعديل وضع",
};

export const Passports = () => {
  const { info } = useAppSelector((state) => state.adminAuth);
  const { passportsList } = useAppSelector((state) => state.passportsData);
  const dispatch = useAppDispatch();

  //search Params
  const [searchQuery, setSearchQuery] = useState({
    year: "",
    month: "",
    state: "",
  });

  //Is modal open
  const [isOpen, setIsOpen] = useState(false);

  //PassportID to Update
  const [id, setId] = useState("");

  const { year, month, state } = searchQuery;

  //filtered Passports
  const filteredPassports: [] =
    month || year || state
      ? passportsList.filter((passport: any) => {
          const paymentDate = dayjs(passport.payment_date)
            .format("DD/MM/YYYY")
            .split("/");
          const yearOfPassport = paymentDate[2];
          const monthOfPassport = paymentDate[1];
          const passportState = passport.state;

          if (!state && year && month) {
            if (yearOfPassport === year && +monthOfPassport === +month)
              return passport;
          } else if (state && year && month) {
            if (
              yearOfPassport === year &&
              +monthOfPassport === +month &&
              passportState === state
            )
              return passport;
          } else if (state && !year && !month) {
            if (passportState === state) return passport;
          }
        })
      : passportsList;

  const { totals, servicePrices, taxRates, taxables, profits, sales } =
    passportsCalculations(filteredPassports);

  const { isLoading, isError, isSuccess, message } = useAppSelector(
    (state) => state.passportsData
  );

  //search message state
  const [msg, setMsg] = useState("");

  // handle Delete Passport
  const handleRemoving = (e: any, removedPassportID: string) => {
    e.preventDefault();

    //get admin token
    const token = info.token;

    //payload (admin token + id of the passport to delete)
    const passportData = {
      id: removedPassportID,
      token,
    };

    dispatch(deletePassport(passportData));
  };

  useEffect(() => {
    if (isError) {
      setMsg(message);
    }

    if (isSuccess && message) {
      setMsg(message);
    }
  }, [isError, message, isSuccess, msg]);

  //Define table data
  const tableHeader = (
    <tr className="border-b border-b-black">
      {[...tableHeaderTitles].reverse().map((title) => (
        <th
          key={title}
          scope="col"
          className="p-1 text-center border-x border-x-black"
        >
          {title}
        </th>
      ))}
      <th scope="col" className="p-1 text-center border-x border-x-black">
        م
      </th>
    </tr>
  );

  const tableRow = (passport: any, index: number) => {
    return (
      <tr
        key={passport._id}
        className={`${
          index % 2 === 0 ? "bg-white" : "bg-gray-100"
        } border-b border-b-black`}
      >
        {/* Delete passport */}
        <th
          scope="row"
          className="p-1 text-gray-900 border-x text-center border-x-black"
        >
          <form
            className="max-w-[50px] m-auto"
            onSubmit={(event) => handleRemoving(event, passport._id)}
          >
            <FormButton
              text={{ default: "حذف" }}
              bgColor={["bg-red-600", "bg-red-700", "bg-red-800"]}
              icon={<TiDelete className="mb-[-2px]" size={25} />}
            />
          </form>
        </th>

        {/* Update Passport */}
        <th
          scope="row"
          className="p-1 text-gray-900 border-x text-center border-x-black"
        >
          <button
            className="inline-flex font-bold text-xs bg-blue-800 text-white hover:bg-white px-2 py-2 border-transparent hover:text-blue-800 border hover:border-blue-800 items-center rounded
           transition-all ease-in-out duration-300"
            onClick={() => {
              setId(passport._id);
              setIsOpen(true);
            }}
          >
            تعديل
          </button>
        </th>

        {/*Payment Date*/}
        <th
          scope="row"
          className="p-1  text-gray-900 border-x text-center border-x-black"
        >
          {dayjs(passport.payment_date).format("DD/MM/YYYY") === "10/10/1970"
            ? "-"
            : dayjs(passport.payment_date).format("DD/MM/YYYY")}
        </th>

        {/*Profit*/}
        <th
          scope="row"
          className="p-1  text-gray-900  border-x text-center border-x-black"
        >
          {passport.profit}
        </th>

        {/*Sales*/}
        <th
          scope="row"
          className="p-1  text-gray-900  border-x text-center border-x-black"
        >
          {passport.sales}
        </th>

        {/*Total Payment*/}
        <th
          scope="row"
          className="p-1  text-gray-900  border-x text-center border-x-black"
        >
          {passport.total}
        </th>

        {/*Service Tax Rate*/}
        <th
          scope="row"
          className="p-1  text-gray-900  border-x text-center border-x-black"
        >
          {passport.tax_rate}
        </th>

        {/*Service Taxable*/}
        <th
          scope="row"
          className="p-1  text-gray-900  border-x text-center border-x-black"
        >
          {passport.taxable}
        </th>

        {/*Service Price*/}
        <th
          scope="row"
          className="p-1  text-gray-900  border-x text-center border-x-black"
        >
          {passport.service_price}
        </th>

        {/*passport Service*/}
        <th
          scope="row"
          className="max-w-[90px] p-1 text-gray-900  border-x text-center border-x-black"
        >
          {passportService[passport.service as keyof PassportService]}
        </th>

        {/*passport State*/}
        <th
          scope="row"
          className={`${
            passportState[passport.state as keyof PassportState][1]
          } p-1 text-gray-900  border-x text-center border-x-black`}
        >
          {passportState[passport.state as keyof PassportState][0]}
        </th>

        {/*passport ID*/}
        <th
          scope="row"
          className="p-1  text-gray-900  border-x text-center border-x-black"
        >
          {passport.passport_id}
        </th>

        {/*Customer Nationality*/}
        <th
          scope="row"
          className="p-1  text-gray-900 border-x text-center border-x-black"
        >
          {passport.customer_nationality}
        </th>

        {/*Customer Name*/}
        <th
          scope="row"
          className="p-1  text-gray-900 bg-red-200 border-x text-center border-x-black"
        >
          {passport.customer_name}
        </th>

        {/*passport NO*/}
        <th
          scope="row"
          className="p-1  text-gray-90 border-x text-center border-x-black"
        >
          {[...filteredPassports]
            .reverse()
            .findIndex((p: any) => p._id === passport._id) + 1}
        </th>
      </tr>
    );
  };

  //clean up status (when mount and unmount)
  UseResetStatus(() => {
    dispatch(resetAdminAuthStatus());
    dispatch(resetPassportsStatus());
  });

  UseResetStatus(() => {
    return () => {
      dispatch(resetAdminAuthStatus());
      dispatch(resetPassportsStatus());
    };
  });

  return (
    <div className="max-w-[1300px] min-h-[75vh] w-full mx-auto my-20 overflow-x-auto  p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
      <img className="mx-auto" src={logo} alt="logo" />

      <div className="flex  justify-center items-center flex-wrap  gap-4 m-6 p-4 bg-red-700 rounded-md ">
        <h4 className="basis-full flex justify-center items-center text-2xl my-4 p-3 text-center font-bold bg-red-200 text-gray-900 border-b-4 border-red-800 rounded shadow">
          عرض الجـــوازات بالشهــر و السنــة
        </h4>
        <form className="basis-full md:basis-[35%] flex flex-col justify-center gap-2 mx-auto font-semibold ">
          <label className={lableClassNamesStyles.default} htmlFor="year">
            ادخل السنة
          </label>
          <input
            type="text"
            name="year"
            className={inputClassNamesStyles.default}
            defaultValue={year}
            onChange={(e) =>
              setSearchQuery({
                ...searchQuery,
                year: e.target.value,
              })
            }
            required
          />

          <label className={lableClassNamesStyles.default} htmlFor="month">
            ادخل الشهر
          </label>
          <input
            type="text"
            name="month"
            className={inputClassNamesStyles.default}
            defaultValue={month}
            onChange={(e) =>
              setSearchQuery({
                ...searchQuery,
                month: e.target.value,
              })
            }
            required
          />
          <label className={lableClassNamesStyles.default} htmlFor="state">
            اختر الوضعية
          </label>
          <select
            name="state"
            className="my-2 p-2 rounded text-right"
            value={state}
            onChange={(e) =>
              setSearchQuery({ ...searchQuery, state: e.target.value })
            }
          >
            <option className="bg-red-200 text-right" value={""}>
              كــل الوضعيات
            </option>
            <option value={"accepted"}>تمت الموافقة</option>
            <option value={"rejected"}>مرفوض</option>
            <option value={"refunded"}>تم استرداد الرسوم</option>
            <option value={"delivered"}>تم التسليم للعميل</option>
          </select>
        </form>
      </div>
      <h3 className="flex justify-center items-center flex-row-reverse text-2xl my-10 p-3 text-center font-bold bg-red-200 text-gray-900 border-b-4 border-red-800 rounded shadow">
        <span>{" الجوازات المحفوظة"}</span>
        {!month && !year && (
          <span className="bg-blue-500 p-1 rounded-md text-white mx-1">
            {" الكلية "}
          </span>
        )}
        {month && (
          <span className="bg-rose-500 p-1 rounded-md text-white mx-1">
            {" عن شهر " + month}
          </span>
        )}
        {year && (
          <span className="bg-amber-500 p-1 rounded-md text-white mx-1">
            {" سنة " + year}
          </span>
        )}
        {state && (
          <span className="bg-emerald-500 p-1 rounded-md text-white mx-1">
            {" والوضعية " + passportState[state as keyof PassportState][0]}
          </span>
        )}
        <span>({filteredPassports.length})</span>

        <span className="flex justify-center items-center mr-2">
          <FcBusiness size={50} />
        </span>
      </h3>

      <h4 className="flex justify-center items-center flex-row-reverse flex-wrap gap-2 text-2xl my-10 p-3 text-center font-bold bg-red-200 text-gray-900 border-b-4 border-red-800 rounded shadow">
        <span className="bg-blue-500 p-1 rounded-md text-white mx-1">
          {" إجمالى الرسوم " + `[ ${servicePrices.toFixed(2)} ]`}
        </span>

        <span className="bg-rose-500 p-1 rounded-md text-white mx-1">
          {" إجمالى رسوم الخدمة " + `[ ${taxables.toFixed(2)} ]`}
        </span>

        <span className="bg-amber-500 p-1 rounded-md text-white mx-1">
          {" إجمالى ضريبة رسوم الخدمة " + `[ ${taxRates.toFixed(2)} ]`}
        </span>

        <span className="bg-emerald-500 p-1 rounded-md text-white mx-1">
          {" إجمالى التكلفة " + `[ ${totals.toFixed(2)} ]`}
        </span>

        <span className="bg-lime-500 p-1 rounded-md text-white mx-1">
          {" إجمالى سعر البيع " + `[ ${sales.toFixed(2)} ]`}
        </span>

        <span className="bg-fuchsia-500 p-1 rounded-md text-white mx-1">
          {" إجمالى الربح " + `[ ${profits.toFixed(2)} ]`}
        </span>
      </h4>

      {/*Request Status and Errors*/}
      {(isError || (isSuccess && message)) && (
        <MessagesContainer msg={msg} isSuccess={isSuccess} isError={isError} />
      )}

      {/*Display Table All Data Needed*/}
      {!isLoading && filteredPassports?.length > 0 && (
        <PaginationTable
          tableRow={tableRow}
          tableHeader={tableHeader}
          tableBodyData={[...filteredPassports].reverse()}
          rowsPerPage={10}
        />
      )}

      {/* if there is No Passports Records */}
      {!year &&
        !month &&
        !state &&
        filteredPassports?.length === 0 &&
        !isLoading && (
          <div className="bg-yellow-200 text-gray-800 text-center font-bold my-4 py-4 px-2 border-l-4 border-yellow-600 rounded">
            لا يوجد جوازات محفوظة الان, يرجى إضافة الجوازات لعرضها.
          </div>
        )}

      {/* if there is search query no passport matches >>> No Search Found*/}
      {(year || month || state) &&
        filteredPassports?.length === 0 &&
        !isLoading && (
          <div className="bg-red-200 text-gray-800 text-center font-bold my-4 py-4 px-2 border-l-4 border-red-600 rounded">
            لا يوجد نتائج تطابق هذا البحث, تأكد من الشهر و السنة وحاول مجدداً
          </div>
        )}

      {/* Show update Passport Modal */}
      {isOpen && <UpdatePassport setIsOpen={setIsOpen} id={id} />}

      {/* Show spinner when Loading State is true */}
      {isLoading && <MainSpinner isLoading={isLoading} />}
    </div>
  );
};
