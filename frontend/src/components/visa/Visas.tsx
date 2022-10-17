import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FcCurrencyExchange } from "react-icons/fc";
import { TiDelete } from "react-icons/ti";
import { UseResetStatus } from "../../hooks/UseResetStatus";
import { resetAdminAuthStatus } from "../../state/features/admin/auth/adminAuthSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../state/features/hooks/StateHooks";
import FormButton from "../shared/FormButton";
import logo from "../../assets/imgs/trans-logo.png";
import MessagesContainer from "../shared/MessagesContainer";
import { PaginationTable } from "../shared/PaginationTable";
import { MainSpinner } from "../shared/MainSpinner";
import {
  inputClassNamesStyles,
  lableClassNamesStyles,
} from "../forms/CreateInvoice";
import {
  deleteVisa,
  resetVisasStatus,
} from "../../state/features/visa/visaSlice";

export const visaTableHeaderTitles = [
  "مسح التأشيرة",
  "حالة التأشيرة",
  "رقم التليفون",
  "رقم الجواز",
  "إسم العميل",
  "صافى الربح",
  "سعر البيع",
  "تكلفة التأشيرة",
  "نوع التأشيرة",
  "الإصدار",
  "مورد التأشيرة",
  "التاريخ",
];

export const Visas = () => {
  const { info } = useAppSelector((state) => state.adminAuth);
  const { visasList } = useAppSelector((state) => state.visasData);
  const dispatch = useAppDispatch();

  //search Params
  const [searchQuery, setSearchQuery] = useState({
    year: "",
    month: "",
  });

  const { year, month } = searchQuery;

  //filtered Visas
  const filteredVisas: [] =
    month || year
      ? visasList.filter((visa: any) => {
          const paymentDate = dayjs(visa.payment_date)
            .format("DD/MM/YYYY")
            .split("/");
          const yearOfVisa = paymentDate[2];
          const monthOfVisa = paymentDate[1];

          if (yearOfVisa === year && +monthOfVisa === +month) return visa;
        })
      : visasList;

  const { isLoading, isError, isSuccess, message } = useAppSelector(
    (state) => state.visasData
  );

  //search message state
  const [msg, setMsg] = useState("");

  // handle Delete visa
  const handleRemoving = (e: any, removedVisaID: string) => {
    e.preventDefault();

    //get admin token
    const token = info.token;

    //payload (admin token + id of the visa to delete)
    const visaData = {
      id: removedVisaID,
      token,
    };

    dispatch(deleteVisa(visaData));
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
      {visaTableHeaderTitles.map((title) => (
        <th
          key={title}
          scope="col"
          className="py-3 px-3 text-center border-x border-x-black"
        >
          {title}
        </th>
      ))}
    </tr>
  );

  const tableRow = (visa: any, index: number) => {
    return (
      <tr
        key={visa._id}
        className={`${
          index % 2 === 0 ? "bg-white" : "bg-gray-100"
        } border-b border-b-black`}
      >
        {/* Delete Visa */}
        <th
          scope="row"
          className="p-2 text-gray-900 whitespace-nowrap text-xs border-x text-center border-x-black"
        >
          <form
            className="max-w-[150px] m-auto"
            onSubmit={(event) => handleRemoving(event, visa._id)}
          >
            <FormButton
              text={{ default: "مسح التأشيرة" }}
              bgColor={["bg-red-600", "bg-red-700", "bg-red-800"]}
              icon={<TiDelete className="mb-[-2px]" size={25} />}
            />
          </form>
        </th>

        {/*Visa State*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x text-center border-x-black"
        >
          {visa.state}
        </th>

        {/*Customer Number*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x text-center border-x-black"
        >
          {visa.customer_number}
        </th>

        {/*passport ID*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x text-center border-x-black"
        >
          {visa.passport_id}
        </th>

        {/*Customer Name*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x text-center border-x-black"
        >
          {visa.customer_name}
        </th>

        {/*Profit*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x text-center border-x-black"
        >
          {visa.profit}
        </th>

        {/*Sales*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x text-center border-x-black"
        >
          {visa.sales}
        </th>

        {/*Net Fare*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x text-center border-x-black"
        >
          {visa.net_fare}
        </th>

        {/*Visa Type*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x text-center border-x-black"
        >
          {visa.type}
        </th>

        {/*Visa Version*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x text-center border-x-black"
        >
          {visa.version}
        </th>

        {/*Visa Provider*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x text-center border-x-black"
        >
          {visa.provider}
        </th>

        {/*Payment Date*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x text-center border-x-black"
        >
          {dayjs(visa.payment_date).format("DD/MM/YYYY")}
        </th>
      </tr>
    );
  };

  //clean up status (when mount and unmount)
  UseResetStatus(() => {
    dispatch(resetAdminAuthStatus());
    dispatch(resetVisasStatus());
  });

  UseResetStatus(() => {
    return () => {
      dispatch(resetAdminAuthStatus());
      dispatch(resetVisasStatus());
    };
  });

  return (
    <div className="max-w-7xl min-h-[75vh] w-full mx-auto my-20 overflow-x-auto  p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
      <img className="mx-auto" src={logo} alt="logo" />

      <div className="flex  justify-center items-center flex-wrap  gap-4 m-6 p-4 bg-red-700 rounded-md ">
        <h4 className="basis-full flex justify-center items-center text-2xl my-4 p-3 text-center font-bold bg-red-200 text-gray-900 border-b-4 border-red-800 rounded shadow">
          عرض التأشـيرات بالشهــر و السنــة
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
        </form>
      </div>
      <h3 className="flex justify-center items-center text-2xl my-10 p-3 text-center font-bold bg-red-200 text-gray-900 border-b-4 border-red-800 rounded shadow">
        <span className="flex justify-center items-center mr-2">
          <FcCurrencyExchange size={50} />
        </span>
        ({filteredVisas.length}) التأشيرات المحفوظة{" "}
        {!month && !year && "الكلية"}
        {month && " عن شهر " + month}
        {year && " سنة " + year}
      </h3>

      {/*Request Status and Errors*/}
      {(isError || (isSuccess && message)) && (
        <MessagesContainer msg={msg} isSuccess={isSuccess} isError={isError} />
      )}

      {/*Display Table All Data Needed*/}
      {!isLoading && filteredVisas?.length > 0 && (
        <PaginationTable
          tableRow={tableRow}
          tableHeader={tableHeader}
          tableBodyData={[...filteredVisas].reverse()}
          rowsPerPage={10}
        />
      )}

      {/* if there is No Visas Records */}
      {!year && !month && filteredVisas?.length === 0 && !isLoading && (
        <div className="bg-yellow-200 text-gray-800 text-center font-bold my-4 py-4 px-2 border-l-4 border-yellow-600 rounded">
          لا يوجد تأشيرات محفوظة الان, يرجى إضافة التأشيرات لعرضها.
        </div>
      )}

      {/* if there is search query no passport matches >>> No Search Found*/}
      {(year || month) && filteredVisas?.length === 0 && !isLoading && (
        <div className="bg-red-200 text-gray-800 text-center font-bold my-4 py-4 px-2 border-l-4 border-red-600 rounded">
          لا يوجد نتائج تطابق هذا البحث, تأكد من الشهر و السنة وحاول مجدداً
        </div>
      )}

      {/* Show spinner when Loading State is true */}
      {isLoading && <MainSpinner isLoading={isLoading} />}
    </div>
  );
};
