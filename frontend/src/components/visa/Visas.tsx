import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FcCurrencyExchange } from "react-icons/fc";
import { TiDelete, TiEdit } from "react-icons/ti";
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
import {
  createInvoice,
  resetInvoicesStatus,
} from "../../state/features/invoice/invoiceSlice";
import { visaCalculations } from "../helpers/visaCalculations";
import { UpdateVisa } from "../forms/UpdateVisa";

export const visaTableHeaderTitles = [
  "مسح",
  "إضافة فاتورة",
  "تعديل التأشيرات",
  "اسم الموظف",
  "رقم الجواز",
  "إسم العميل",
  "Profit",
  "Sales",
  "Cost",
  "Type",
  "Supplier",
  "Date",
];

export const Visas = () => {
  const { info } = useAppSelector((state) => state.adminAuth);
  const { visasList } = useAppSelector((state) => state.visasData);
  const invoiceData = useAppSelector((state) => state.invoiceData);

  const dispatch = useAppDispatch();

  //Is modal open
  const [isOpen, setIsOpen] = useState(false);

  //PurchaseID to Update
  const [id, setId] = useState("");

  //search Params
  const [searchQuery, setSearchQuery] = useState({
    year: "",
    month: "",
    employee: "",
    type: "",
    supplier: "",
  });

  const { year, month, employee, type, supplier } = searchQuery;

  type SearchQueries = {
    year: string;
    month: string | number;
    employee: string;
    type: string;
    supplier: string;
  };

  let availableSearchQueries: SearchQueries = {
    ...searchQuery,
    month: +month,
  };

  for (const key in availableSearchQueries) {
    if (!availableSearchQueries[key as keyof SearchQueries]) {
      delete availableSearchQueries[key as keyof SearchQueries];
    }
  }

  //filtered Visas
  const filteredVisas: [] =
    month || year || supplier || type || employee
      ? visasList.filter((visa: any) => {
          const paymentDate = dayjs(visa.payment_date)
            .format("DD/MM/YYYY")
            .split("/");

          const visaData: SearchQueries = {
            year: paymentDate[2],
            month: +paymentDate[1],
            type: visa.type,
            employee: visa.employee,
            supplier: visa.provider,
          };

          if (
            Object.keys(availableSearchQueries).every(
              (key) =>
                visaData[key as keyof SearchQueries] ===
                availableSearchQueries[key as keyof SearchQueries]
            )
          )
            return visa;
        })
      : visasList;

  const sortedVisas = [...filteredVisas].sort((a: any, b: any) => {
    if (dayjs(b.payment_date).valueOf() === dayjs(a.payment_date).valueOf()) {
      return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();
    }

    return dayjs(b.payment_date).valueOf() - dayjs(a.payment_date).valueOf();
  });

  const { isLoading, isError, isSuccess, message } = useAppSelector(
    (state) => state.visasData
  );

  const { netFares, profits, sales } = visaCalculations(filteredVisas);

  //search message state
  const [msg, setMsg] = useState("");

  // handle Delete visa
  const handleRemoving = (e: any, removedVisaID: string) => {
    e.preventDefault();

    //set msg to none first
    setMsg("");
    dispatch(resetInvoicesStatus());

    //get admin token
    const token = info.token;

    //payload (admin token + id of the visa to delete)
    const visaData = {
      id: removedVisaID,
      token,
    };

    dispatch(deleteVisa(visaData));
  };

  // handle Creating invoice
  const handleAddInvoice = (
    e: React.SyntheticEvent,
    customerName: string,
    passportId: string,
    visaType: string,
    paymentDate: string,
    visaSales: number
  ) => {
    e.preventDefault();

    //set msg to none first
    setMsg("");
    dispatch(resetVisasStatus());

    const invoiceData = {
      token: info.token,
      ID: passportId,
      customer: { name: customerName },
      details: [
        {
          name: visaType,
          quantity: 1,
          price: visaSales,
        },
      ],
      total: visaSales,
      subtotal: 0,
      date: paymentDate,
      taxDue: 0,
      taxRate: 0,
      taxable: 0,
    };

    dispatch(createInvoice(invoiceData));
  };

  useEffect(() => {
    if (isError) {
      setMsg(message);
    }

    if (invoiceData.isError) {
      setMsg(invoiceData.message);
    }

    if (isSuccess && message) {
      setMsg(message);
    }

    if (invoiceData.isSuccess && invoiceData.message) {
      setMsg(invoiceData.message);
    }
  }, [isError, message, isSuccess, msg, invoiceData]);

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
      <th scope="col" className="p-1 text-center border-x border-x-black">
        م
      </th>
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
          className="p-2 text-gray-900  text-xs border-x text-center border-x-black"
        >
          <form
            className="max-w-[150px] m-auto"
            onSubmit={(event) => handleRemoving(event, visa._id)}
          >
            <FormButton
              text={{ default: "مسح" }}
              bgColor={["bg-red-600", "bg-red-700", "bg-red-800"]}
              icon={<TiDelete className="mb-[-2px]" size={25} />}
            />
          </form>
        </th>

        {/* Make Invoice */}
        <th
          scope="row"
          className="p-1 text-gray-900 text-xs border-x text-center border-x-black"
        >
          <form
            className="max-w-[150px] m-auto"
            onSubmit={(event) =>
              handleAddInvoice(
                event,
                visa.customer_name,
                visa.passport_id,
                visa.type,
                visa.payment_date,
                visa.sales
              )
            }
          >
            <FormButton
              text={{ default: "إضافة" }}
              bgColor={["bg-orange-600", "bg-orange-700", "bg-orange-800"]}
              icon={<TiEdit className="mr-1 mb-1" size={25} />}
            />
          </form>
        </th>

        {/*Update Visa*/}
        <th
          scope="row"
          className="p-2  text-gray-900  border-x text-center border-x-black"
        >
          <button
            className="inline-flex font-bold text-xs bg-blue-800 text-white hover:bg-white px-2 py-2 border-transparent hover:text-blue-800 border hover:border-blue-800 items-center rounded
             transition-all ease-in-out duration-300"
            onClick={() => {
              setId(visa._id);
              setIsOpen(true);
            }}
          >
            تعديل
          </button>
        </th>

        {/*Visa Employee*/}
        <th
          scope="row"
          className="p-2  text-gray-900  border-x text-center border-x-black"
        >
          {visa.employee ? visa.employee : "-"}
        </th>

        {/*passport ID*/}
        <th
          scope="row"
          className="p-2  text-gray-900  border-x text-center border-x-black"
        >
          {visa.passport_id}
        </th>

        {/*Customer Name*/}
        <th
          scope="row"
          className="p-2 bg-red-200 text-gray-900  border-x text-center border-x-black"
        >
          {visa.customer_name}
        </th>

        {/*Profit*/}
        <th
          scope="row"
          className="p-2  text-gray-900  border-x text-center border-x-black"
        >
          {visa.profit}
        </th>

        {/*Sales*/}
        <th
          scope="row"
          className="p-2  text-gray-900  border-x text-center border-x-black"
        >
          {visa.sales}
        </th>

        {/*Net Fare*/}
        <th
          scope="row"
          className="p-2  text-gray-900  border-x text-center border-x-black"
        >
          {visa.net_fare}
        </th>

        {/*Visa Type*/}
        <th
          scope="row"
          className="p-2  text-gray-900  border-x text-center border-x-black"
        >
          {visa.type ? visa.type : "-"}
        </th>

        {/*Visa Provider*/}
        <th
          scope="row"
          className="p-2  text-gray-900  border-x text-center border-x-black"
        >
          {visa.provider ? visa.provider : "-"}
        </th>

        {/*Visa Date*/}
        <th
          scope="row"
          className="p-2  text-gray-900  border-x text-center border-x-black"
        >
          {visa.payment_date
            ? dayjs(visa.payment_date).format("DD/MM/YYYY")
            : "-"}
        </th>

        {/*Visa NO*/}
        <th
          scope="row"
          className="p-1  text-gray-90 border-x text-center border-x-black"
        >
          {sortedVisas.findIndex((p: any) => p._id === visa._id) + 1}
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
    dispatch(resetInvoicesStatus());
    dispatch(resetVisasStatus());
  });

  UseResetStatus(() => {
    return () => {
      dispatch(resetAdminAuthStatus());
      dispatch(resetInvoicesStatus());
      dispatch(resetVisasStatus());
    };
  });

  return (
    <div className="max-w-7xl min-h-[75vh] w-full mx-auto my-20 overflow-x-auto  p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
      <img className="mx-auto" src={logo} alt="logo" />

      <div className="flex justify-center items-center flex-wrap gap-4 my-5 p-4 bg-red-700 rounded-md">
        <h4 className="basis-full flex justify-center items-center text-2xl my-4 p-3 text-center font-bold bg-red-200 text-gray-900 border-b-4 border-red-800 rounded shadow">
          فلتـرة التأشيرات
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
              value={year}
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
              value={month}
              onChange={(e) =>
                setSearchQuery({
                  ...searchQuery,
                  month: e.target.value,
                })
              }
            />
          </div>

          <div className="flex justify-center items-center flex-col gap-2">
            <label className={lableClassNamesStyles.default} htmlFor="supplier">
              Supplier
            </label>
            <input
              type="text"
              name="supplier"
              className={inputClassNamesStyles.default}
              value={supplier}
              onChange={(e) =>
                setSearchQuery({
                  ...searchQuery,
                  supplier: e.target.value,
                })
              }
            />
          </div>

          <div className="flex justify-center items-center flex-col gap-2">
            <label className={lableClassNamesStyles.default} htmlFor="type">
              Type
            </label>
            <input
              type="text"
              name="type"
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

          <div className="flex justify-center items-center flex-col gap-2">
            <label className={lableClassNamesStyles.default} htmlFor="employee">
              Employee
            </label>
            <input
              type="text"
              name="employee"
              className={inputClassNamesStyles.default}
              defaultValue={employee}
              onChange={(e) =>
                setSearchQuery({
                  ...searchQuery,
                  employee: e.target.value,
                })
              }
            />
          </div>
        </form>
        <h3 className="basis-full flex justify-center items-center flex-row-reverse text-2xl my-10 p-3 text-center font-bold bg-red-200 text-gray-900 border-b-4 border-red-800 rounded shadow">
          <span>{" التأشيرات المحفوظة"}</span>
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

          {supplier && (
            <span className="bg-emerald-500 p-1 rounded-md text-white mx-1">
              {" Supplier:- " + supplier}
            </span>
          )}

          {type && (
            <span className="bg-purple-500 p-1 rounded-md text-white mx-1">
              {" Type:- " + type}
            </span>
          )}

          {employee && (
            <span className="bg-purple-500 p-1 rounded-md text-white mx-1">
              {" Emplyee:- " + employee}
            </span>
          )}

          <span>({filteredVisas.length})</span>
          <span className="flex justify-center items-center mr-2">
            <FcCurrencyExchange size={50} />
          </span>
        </h3>
      </div>

      <h4 className="flex justify-center items-center flex-row-reverse flex-wrap gap-2 text-2xl my-10 p-4 text-center font-bold bg-red-700 text-gray-900 rounded shadow">
        <span className="bg-emerald-500 p-1 rounded-md text-white mx-1">
          {" إجمالى التكلفة " + `[ ${netFares.toFixed(2)} ]`}
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

      {invoiceData.isError ||
        (invoiceData.isSuccess && invoiceData.message && (
          <MessagesContainer
            msg={msg}
            isSuccess={invoiceData.isSuccess}
            isError={invoiceData.isError}
          />
        ))}

      {/*Display Table All Data Needed*/}
      {!isLoading && !invoiceData.isLoading && filteredVisas?.length > 0 && (
        <PaginationTable
          tableRow={tableRow}
          tableHeader={tableHeader}
          tableBodyData={sortedVisas}
          rowsPerPage={10}
        />
      )}

      {/* if there is No Visas Records */}
      {!year &&
        !month &&
        !supplier &&
        !employee &&
        !type &&
        filteredVisas?.length === 0 &&
        !isLoading &&
        !invoiceData.isLoading && (
          <div className="bg-yellow-200 text-gray-800 text-center font-bold my-4 py-4 px-2 border-l-4 border-yellow-600 rounded">
            لا يوجد تأشيرات محفوظة الان, يرجى إضافة التأشيرات لعرضها.
          </div>
        )}

      {/* if there is search query no Visa matches >>> No Search Found*/}
      {(year || month || supplier || type || employee) &&
        filteredVisas?.length === 0 &&
        !isLoading &&
        !invoiceData.isLoading && (
          <div className="bg-red-200 text-gray-800 text-center font-bold my-4 py-4 px-2 border-l-4 border-red-600 rounded">
            لا يوجد نتائج تطابق هذا البحث, تأكد من البيانات التى أدخلتها وحاول
            مجدداً
          </div>
        )}

      {/* Show Update Visa Modal */}
      {isOpen && <UpdateVisa setIsOpen={setIsOpen} id={id} />}

      {/* Show spinner when Loading State is true */}
      {(isLoading || invoiceData.isLoading) && (
        <MainSpinner
          isLoading={isLoading ? isLoading : invoiceData.isLoading}
        />
      )}
    </div>
  );
};
