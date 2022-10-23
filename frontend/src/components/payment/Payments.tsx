import {
  useAppDispatch,
  useAppSelector,
} from "../../state/features/hooks/StateHooks";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  deletePayment,
  resetPaymentsStatus,
} from "../../state/features/payment/paymentSlice";
import FormButton from "../shared/FormButton";
import { TiDelete } from "react-icons/ti";
import { UseResetStatus } from "../../hooks/UseResetStatus";
import { resetAdminAuthStatus } from "../../state/features/admin/auth/adminAuthSlice";
import logo from "../../assets/imgs/trans-logo.png";
import {
  inputClassNamesStyles,
  lableClassNamesStyles,
} from "../forms/CreateInvoice";
import { FcMoneyTransfer } from "react-icons/fc";
import MessagesContainer from "../shared/MessagesContainer";
import { PaginationTable } from "../shared/PaginationTable";
import { MainSpinner } from "../shared/MainSpinner";

export const paymentTableHeaderTitles = [
  "مسح المصروف",
  "المبلغ الكلى",
  "نوع المصروف",
  "تاريخ المصروف",
];

export const Payments = () => {
  const { info } = useAppSelector((state) => state.adminAuth);
  const { paymentsList } = useAppSelector((state) => state.paymentsData);
  const dispatch = useAppDispatch();

  //search Params
  const [searchQuery, setSearchQuery] = useState({
    year: "",
    month: "",
  });

  const { year, month } = searchQuery;

  //filtered Payemnts
  const filteredPayments: [] =
    month || year
      ? paymentsList.filter((payment: any) => {
          const paymentDate = dayjs(payment.date)
            .format("DD/MM/YYYY")
            .split("/");
          const yearOfPayment = paymentDate[2];
          const monthOfPayment = paymentDate[1];

          if (yearOfPayment === year && +monthOfPayment === +month)
            return payment;
        })
      : paymentsList;

  const { isLoading, isError, isSuccess, message } = useAppSelector(
    (state) => state.paymentsData
  );

  //search message state
  const [msg, setMsg] = useState("");

  // handle Delete payment
  const handleRemoving = (e: any, removedPaymentID: string) => {
    e.preventDefault();

    //get admin token
    const token = info.token;

    //payload (admin token + id of the payment to delete)
    const paymentData = {
      id: removedPaymentID,
      token,
    };

    dispatch(deletePayment(paymentData));
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
      {paymentTableHeaderTitles.map((title) => (
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

  const tableRow = (payment: any, index: number) => {
    return (
      <tr
        key={payment._id}
        className={`${
          index % 2 === 0 ? "bg-white" : "bg-gray-100"
        } border-b border-b-black`}
      >
        {/* Delete payment */}
        <th
          scope="row"
          className="p-2 text-gray-900 whitespace-nowrap text-xs border-x text-center border-x-black"
        >
          <form
            className="max-w-[150px] m-auto"
            onSubmit={(event) => handleRemoving(event, payment._id)}
          >
            <FormButton
              text={{ default: "مسح المصــروف" }}
              bgColor={["bg-red-600", "bg-red-700", "bg-red-800"]}
              icon={<TiDelete className="mb-[-2px]" size={25} />}
            />
          </form>
        </th>

        {/*Payment Total*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x text-center border-x-black"
        >
          {payment.total}
        </th>

        {/*Payment Types*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x text-center border-x-black"
        >
          {payment.payment_types.map(
            (type: { name: string; total: number }, index: number) => (
              <span
                key={index}
                className="flex flex-row-reverse justify-center items-center gap-1 my-1 bg-amber-400 rounded"
              >
                <span>{type.name}</span>
                <span>{type.total + " <== "}</span>
              </span>
            )
          )}
        </th>

        {/*Payment Date*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x text-center border-x-black"
        >
          {dayjs(payment.date).format("DD/MM/YYYY")}
        </th>
      </tr>
    );
  };

  //clean up status (when mount and unmount)
  UseResetStatus(() => {
    dispatch(resetAdminAuthStatus());
    dispatch(resetPaymentsStatus());
  });

  UseResetStatus(() => {
    return () => {
      dispatch(resetAdminAuthStatus());
      dispatch(resetPaymentsStatus());
    };
  });

  return (
    <div className="max-w-7xl min-h-[75vh] w-full mx-auto my-20 overflow-x-auto  p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
      <img className="mx-auto" src={logo} alt="logo" />

      <div className="flex  justify-center items-center flex-wrap  gap-4 m-6 p-4 bg-red-700 rounded-md ">
        <h4 className="basis-full flex justify-center items-center text-2xl my-4 p-3 text-center font-bold bg-red-200 text-gray-900 border-b-4 border-red-800 rounded shadow">
          عرض المصــروفات بالشهــر و السنــة
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
      <h3 className="flex justify-center items-center flex-row-reverse text-2xl my-10 p-3 text-center font-bold bg-red-200 text-gray-900 border-b-4 border-red-800 rounded shadow">
        <span>{" المصــروفات المحفوظة"}</span>
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

        <span>({filteredPayments.length})</span>
        <span className="flex justify-center items-center mr-2">
          <FcMoneyTransfer size={50} />
        </span>
      </h3>

      {/*Request Status and Errors*/}
      {(isError || (isSuccess && message)) && (
        <MessagesContainer msg={msg} isSuccess={isSuccess} isError={isError} />
      )}

      {/*Display Table All Data Needed*/}
      {!isLoading && filteredPayments?.length > 0 && (
        <PaginationTable
          tableRow={tableRow}
          tableHeader={tableHeader}
          tableBodyData={[...filteredPayments].reverse()}
          rowsPerPage={10}
        />
      )}

      {/* if there is No Payments Records */}
      {!year && !month && filteredPayments?.length === 0 && !isLoading && (
        <div className="bg-yellow-200 text-gray-800 text-center font-bold my-4 py-4 px-2 border-l-4 border-yellow-600 rounded">
          لا يوجد مصــروفات محفوظة الان, يرجى إضافة المصــروفات لعرضها.
        </div>
      )}

      {/* if there is search query no payment matches >>> No Search Found*/}
      {(year || month) && filteredPayments?.length === 0 && !isLoading && (
        <div className="bg-red-200 text-gray-800 text-center font-bold my-4 py-4 px-2 border-l-4 border-red-600 rounded">
          لا يوجد نتائج تطابق هذا البحث, تأكد من الشهر و السنة وحاول مجدداً
        </div>
      )}

      {/* Show spinner when Loading State is true */}
      {isLoading && <MainSpinner isLoading={isLoading} />}
    </div>
  );
};