import dayjs from "dayjs";
import { useEffect, useState } from "react";
import logo from "../../assets/imgs/trans-logo.png";
import { AiFillEdit } from "react-icons/ai";
import { FcPaid } from "react-icons/fc";
import { TiDelete } from "react-icons/ti";
import { UseResetStatus } from "../../hooks/UseResetStatus";
import { resetAdminAuthStatus } from "../../state/features/admin/auth/adminAuthSlice";
import {
  deleteBank,
  resetBanksStatus,
} from "../../state/features/bank/bankSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../state/features/hooks/StateHooks";
import {
  inputClassNamesStyles,
  lableClassNamesStyles,
} from "../forms/CreateInvoice";
import FormButton from "../shared/FormButton";
import { MainSpinner } from "../shared/MainSpinner";
import MessagesContainer from "../shared/MessagesContainer";
import { PaginationTable } from "../shared/PaginationTable";
import { UpdateBank } from "../forms/UpdateBank";
import { banksCalculations } from "../helpers/bankCalculations";

export const bankTableHeaderTitles = [
  "مسح المعاملة",
  "تعديل المعاملة",
  "رقم حساب العميل",
  "اسم العميل",
  "المبلغ",
  "نوع المعاملة",
  "رقم العملية",
  "توقيت المعاملة",
  "تاريخ المعاملة",
];

export const Banks = () => {
  const { info } = useAppSelector((state) => state.adminAuth);
  const { banksList } = useAppSelector((state) => state.banksData);
  const dispatch = useAppDispatch();

  //Table Row/Page State
  const [tableRows, setTableRows] = useState(50);
  const [rowPerPage, setRowPerPage] = useState(50);

  //search Params
  const [searchQuery, setSearchQuery] = useState<SearchQueries>({
    day: "",
    year: "",
    month: "",
    type: "",
  });

  const { year, month, day, type } = searchQuery;

  type SearchQueries = {
    day: string | number;
    year: string | number;
    month: string | number;
    type: string;
  };

  let availableSearchQueries: SearchQueries = {
    year: +year,
    month: +month,
    day: +day,
    type: type.trim().toLowerCase(),
  };

  for (const key in availableSearchQueries) {
    if (!availableSearchQueries[key as keyof SearchQueries]) {
      delete availableSearchQueries[key as keyof SearchQueries];
    }
  }

  //Is modal open
  const [isOpen, setIsOpen] = useState(false);

  //BankID to Update
  const [id, setId] = useState("");

  //filtered Banks
  const filteredBanks: [] =
    day || month || year || type
      ? banksList.filter((bank: any) => {
          const paymentDate = dayjs(bank.payment_date)
            .format("DD/MM/YYYY")
            .split("/");

          const bankData: SearchQueries = {
            year: +paymentDate[2],
            month: +paymentDate[1],
            day: +paymentDate[0],
            type: bank?.type.trim().toLowerCase(),
          };

          if (
            Object.keys(availableSearchQueries).every((key) =>
              typeof bankData[key as keyof SearchQueries] === "string"
                ? bankData[key as keyof SearchQueries]
                    ?.toString()
                    .includes(
                      availableSearchQueries[
                        key as keyof SearchQueries
                      ] as string
                    )
                : bankData[key as keyof SearchQueries] ===
                  availableSearchQueries[key as keyof SearchQueries]
            )
          )
            return bank;
        })
      : banksList;

  const sortedBanks = [...filteredBanks].sort((a: any, b: any) => {
    if (dayjs(b.date).valueOf() === dayjs(a.date).valueOf()) {
      return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();
    }

    return dayjs(b.date).valueOf() - dayjs(a.date).valueOf();
  });

  //Get Totals
  const { totals } = banksCalculations(filteredBanks);

  const { isLoading, isError, isSuccess, message } = useAppSelector(
    (state) => state.banksData
  );

  //search message state
  const [msg, setMsg] = useState("");

  // handle Delete Bank
  const handleRemoving = (e: any, removedBankID: string) => {
    e.preventDefault();

    //get admin token
    const token = info.token;

    //payload (admin token + id of the Bank to delete)
    const bankData = {
      id: removedBankID,
      token,
    };

    dispatch(deleteBank(bankData));
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
      {bankTableHeaderTitles.map((title) => (
        <th
          key={title}
          scope="col"
          className="py-3 px-3 text-center border-x border-x-black"
        >
          {title}
        </th>
      ))}
      <th scope="col" className="p-1 text-center border-x border-x-black">
        م
      </th>
    </tr>
  );

  const tableRow = (bank: any, index: number) => {
    return (
      <tr
        key={bank._id}
        className={`${
          index % 2 === 0 ? "bg-white" : "bg-gray-100"
        } border-b border-b-black`}
      >
        {/* Delete Bank */}
        <th
          scope="row"
          className="p-2 text-gray-900 text-xs border-x text-center border-x-black"
        >
          <form
            className="max-w-[150px] m-auto"
            onSubmit={(event) => handleRemoving(event, bank._id)}
          >
            <FormButton
              bgColor={["bg-red-600", "bg-red-700", "bg-red-800"]}
              icon={<TiDelete className="mb-[-2px]" size={25} />}
            />
          </form>
        </th>

        {/*Update Bank*/}
        <th
          scope="row"
          className="p-2  text-gray-900  border-x text-center border-x-black"
        >
          <button
            className="max-w-[150px] mx-auto w-full flex justify-center items-center font-bold text-xs bg-blue-800 text-white hover:bg-white px-3 py-2.5 border-transparent hover:text-blue-800 border hover:border-blue-800 rounded
              transition-all ease-in-out duration-300"
            onClick={() => {
              setId(bank._id);
              setIsOpen(true);
            }}
          >
            <AiFillEdit size={20} />
          </button>
        </th>

        {/*Customer Account ID*/}
        <th
          scope="row"
          className="p-2  text-gray-900  border-x text-center border-x-black"
        >
          {bank.account_id}
        </th>

        {/*Customer Name*/}
        <th
          scope="row"
          className="p-2 bg-red-200  text-gray-900  border-x text-center border-x-black"
        >
          {bank.customer_name}
        </th>

        {/*Process Total*/}
        <th
          scope="row"
          className="p-2  text-gray-900  border-x text-center border-x-black"
        >
          {bank.total}
        </th>

        {/*Bank Type*/}
        <th
          scope="row"
          className="p-2  text-gray-900  border-x text-center border-x-black"
        >
          {bank.type ? bank.type : ""}
        </th>

        {/*Process No*/}
        <th
          scope="row"
          className="p-2  text-gray-900  border-x text-center border-x-black"
        >
          {bank.process_no ? bank.process_no : ""}
        </th>

        {/*Payment Time*/}
        <th
          scope="row"
          className="p-2  text-gray-900  border-x text-center border-x-black"
        >
          {dayjs(bank.createdAt).format("h:mm:ss A")}
        </th>

        {/*Payment Date*/}
        <th
          scope="row"
          className="p-2  text-gray-900  border-x text-center border-x-black"
        >
          {dayjs(bank.payment_date).format("DD/MM/YYYY")}
        </th>

        {/*Bank NO*/}
        <th
          scope="row"
          className="p-1  text-gray-90 border-x text-center border-x-black"
        >
          {sortedBanks.findIndex((p: any) => p._id === bank._id) + 1}
        </th>
      </tr>
    );
  };

  //clean up status (when mount and unmount)
  UseResetStatus(() => {
    //scroll page back to top when component first mount
    const yOffset = window.pageYOffset;
    window.scrollBy(0, -yOffset);

    dispatch(resetAdminAuthStatus());
    dispatch(resetBanksStatus());
  });

  UseResetStatus(() => {
    return () => {
      dispatch(resetAdminAuthStatus());
      dispatch(resetBanksStatus());
    };
  });

  return (
    <div className="max-w-7xl min-h-[75vh] w-full mx-auto my-20 overflow-x-auto  p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
      <img className="mx-auto" src={logo} alt="logo" />

      <div className="flex justify-center items-center flex-wrap gap-4 my-5 p-4 bg-red-700 rounded-md">
        <h4 className="basis-full flex justify-center items-center text-2xl my-4 p-3 text-center font-bold bg-red-200 text-gray-900 border-b-4 border-red-800 rounded shadow">
          فلتــرة المعاملات البنكية
        </h4>
        <form className="basis-full  flex flex-col flex-wrap  md:flex-row-reverse justify-center items-center gap-4 mx-auto font-semibold ">
          <div className="flex justify-center items-center flex-col gap-2">
            <label className={lableClassNamesStyles.default} htmlFor="year">
              السنة
            </label>
            <input
              type="number"
              name="year"
              className={inputClassNamesStyles.default}
              defaultValue={year}
              onChange={(e) =>
                setSearchQuery({
                  ...searchQuery,
                  year: e.target.value,
                })
              }
            />
          </div>

          <div className="flex justify-center items-center flex-col gap-2">
            <label className={lableClassNamesStyles.default} htmlFor="month">
              الشهر
            </label>
            <input
              type="number"
              name="month"
              className={inputClassNamesStyles.default}
              defaultValue={month}
              onChange={(e) =>
                setSearchQuery({
                  ...searchQuery,
                  month: e.target.value,
                })
              }
            />
          </div>

          <div className="flex justify-center items-center flex-col gap-2">
            <label className={lableClassNamesStyles.default} htmlFor="day">
              اليوم
            </label>
            <input
              type="number"
              name="day"
              className={inputClassNamesStyles.default}
              value={day}
              onChange={(e) =>
                setSearchQuery({
                  ...searchQuery,
                  day: e.target.value,
                })
              }
            />
          </div>

          <div className="flex justify-center items-center flex-col gap-2">
            <label
              className={lableClassNamesStyles.default}
              htmlFor="processType"
            >
              نوع المعاملة
            </label>
            <input
              type="text"
              name="processType"
              className={inputClassNamesStyles.default}
              value={type}
              onChange={(e) =>
                setSearchQuery({
                  ...searchQuery,
                  type: e.target.value,
                })
              }
            />
          </div>
        </form>

        <h3 className="basis-full flex justify-center items-center flex-row-reverse flex-wrap text-2xl my-5 p-3 text-center font-bold bg-red-200 text-gray-900 border-b-4 border-red-800 rounded shadow">
          <span>{" المعاملات البنكية المحفوظة"}</span>
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
          {day && (
            <span className="bg-rose-500 p-1 rounded-md text-white mx-1">
              {" يوم " + day}
            </span>
          )}
          {year && (
            <span className="bg-amber-500 p-1 rounded-md text-white mx-1">
              {" سنة " + year}
            </span>
          )}
          {type && (
            <span className="bg-amber-500 p-1 rounded-md text-white mx-1">
              {type + " نوع المعاملة "}
            </span>
          )}

          <span>({filteredBanks.length})</span>
          <span className="flex justify-center items-center mr-2">
            <FcPaid size={50} />
          </span>
        </h3>
      </div>

      <h4 className="flex justify-center items-center flex-row-reverse flex-wrap gap-2 text-2xl my-10 p-4 text-center font-bold bg-red-700 text-gray-900 rounded shadow">
        <span className="bg-emerald-500 p-1 rounded-md text-white mx-1">
          {" إجمالى المعاملات البنكية " + `[ ${totals.toFixed(2)} ]`}
        </span>
      </h4>

      {/*Request Status and Errors*/}
      {(isError || (isSuccess && message)) && (
        <MessagesContainer msg={msg} isSuccess={isSuccess} isError={isError} />
      )}

      {/* Show Table Row/Page Control */}
      {!isLoading && filteredBanks?.length > 0 && (
        <div className="max-w-sm flex flex-row-reverse justify-center items-center flex-wrap my-10 mx-auto gap-2 text-sm font-semibold">
          <label htmlFor="rowPerPage">عدد صفوف الجدول</label>
          <input
            className="max-w-[80px] p-2 bg-red-100 border border-red-500 text-center rounded focus:outline-none focus:border-blue-700"
            type={"number"}
            name="rowPerPage"
            min={1}
            max={filteredBanks.length}
            value={tableRows}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTableRows(+e.target.value);
            }}
          />

          <button
            className="bg-blue-800 px-4 py-2 text-white font-semibold border rounded hover:border-blue-700 hover:bg-white hover:text-blue-700 transition-all duration-75 ease-in-out"
            type="button"
            onClick={() => {
              if (tableRows === 0) return;
              setRowPerPage(tableRows);
            }}
          >
            تم
          </button>
        </div>
      )}

      {/*Display Table All Data Needed*/}
      {!isLoading && filteredBanks?.length > 0 && (
        <PaginationTable
          tableRow={tableRow}
          tableHeader={tableHeader}
          tableBodyData={sortedBanks}
          rowsPerPage={rowPerPage}
        />
      )}

      {/* if there is No Banks Records */}
      {!year &&
        !month &&
        !day &&
        !type &&
        filteredBanks?.length === 0 &&
        !isLoading && (
          <div className="bg-yellow-200 text-gray-800 text-center font-bold my-4 py-4 px-2 border-l-4 border-yellow-600 rounded">
            لا يوجد معاملات محفوظة الان, يرجى إضافة المعاملات لعرضها.
          </div>
        )}

      {/* if there is search query no Bank matches >>> No Search Found*/}
      {(year || month || day || type) &&
        filteredBanks?.length === 0 &&
        !isLoading && (
          <div className="bg-red-200 text-gray-800 text-center font-bold my-4 py-4 px-2 border-l-4 border-red-600 rounded">
            لا يوجد نتائج تطابق هذا البحث, تأكد من الشهر و السنة وحاول مجدداً
          </div>
        )}

      {/* Show update Bank Modal */}
      {isOpen && <UpdateBank setIsOpen={setIsOpen} id={id} />}

      {/* Show spinner when Loading State is true */}
      {isLoading && <MainSpinner isLoading={isLoading} />}
    </div>
  );
};
