import dayjs from "dayjs";
import { Fragment, useEffect, useState } from "react";
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
import {
  createInvoice,
  resetInvoicesStatus,
} from "../../state/features/invoice/invoiceSlice";
import { AiFillEdit, AiFillFileAdd } from "react-icons/ai";

export const tableHeaderTitles = [
  "إسم العميل",
  "الجنسية",
  "رقم الجواز",
  "الوضعية",
  "الخدمة",
  "الرسوم الغير خاضعه للضريبه",
  "رسوم الخدمة",
  "ضريبة رسوم الخدمة",
  "إجمالى التكلفة",
  "سعر البيع",
  "صافى الربح",
  "تاريخ الدفع",
  "تعديل الجواز",
  "إضافة فاتورة",
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
  "60days": "٦٠يوم";
  "90days": "٩٠يوم";
  extend_permission: "تمديد إذن دخول";
  cancel_permission: "إلغاء إذن دخول";
  cancel_resedency: "إلغاء إقامة";
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
  "60days": "٦٠يوم",
  "90days": "٩٠يوم",
  extend_permission: "تمديد إذن دخول",
  cancel_permission: "إلغاء إذن دخول",
  report_request: "طلب كشف كفيل ومكفولين",
  renew_resedency: "تجديد إقامة",
  cancel_resedency: "إلغاء إقامة",
  temp_shutdown_with_escape: "إغلاق مؤقت مع بلاغ هروب",
  change_situation: "تعديل وضع",
};

export const Passports = () => {
  const { info } = useAppSelector((state) => state.adminAuth);
  const { passportsList } = useAppSelector((state) => state.passportsData);
  const invoiceData = useAppSelector((state) => state.invoiceData);

  const dispatch = useAppDispatch();

  //search Params
  const [searchQuery, setSearchQuery] = useState<SearchQueries>({
    year: "",
    month: "",
    day: "",
    nationality: "",
    state: [
      { value: "accepted", checked: false },
      { value: "rejected", checked: false },
      { value: "refunded", checked: false },
      { value: "delivered", checked: false },
    ],
    service: [
      { value: "30days", checked: false },
      { value: "60days", checked: false },
      { value: "90days", checked: false },
      { value: "extend_permission", checked: false },
      { value: "cancel_permission", checked: false },
      { value: "report_request", checked: false },
      { value: "renew_resedency", checked: false },
      { value: "cancel_resedency", checked: false },
      { value: "temp_shutdown_with_escape", checked: false },
      { value: "change_situation", checked: false },
    ],
  });

  //Is modal open
  const [isOpen, setIsOpen] = useState(false);

  //PassportID to Update
  const [id, setId] = useState("");

  //Table Row/Page State
  const [tableRows, setTableRows] = useState(50);
  const [rowPerPage, setRowPerPage] = useState(50);

  const { year, month, day, state, service, nationality } = searchQuery;

  type SearchQueries = {
    year: number | string;
    month: number | string;
    day: number | string;
    state?: { value: string; checked: boolean }[];
    service?: { value: string; checked: boolean }[];
    nationality: string;
  };

  let availableSearchQueries: SearchQueries = {
    year: +year,
    month: +month,
    day: +day,
    nationality: nationality.trim().toLowerCase(),
  };

  const stateArr: string[] = [];
  const serviceArr: string[] = [];

  state?.map((s: { value: string; checked: boolean }) => {
    s.checked && stateArr.push(s.value);
  });

  service?.map((s: { value: string; checked: boolean }) => {
    s.checked && serviceArr.push(s.value);
  });

  for (const key in availableSearchQueries) {
    if (!availableSearchQueries[key as keyof SearchQueries]) {
      delete availableSearchQueries[key as keyof SearchQueries];
    }
  }

  //filtered Passports
  const filteredPassports: [] =
    month || year || day || state || service || nationality
      ? passportsList.filter((passport: any) => {
          const paymentDate = dayjs(passport.payment_date)
            .format("DD/MM/YYYY")
            .split("/");

          const passportData: SearchQueries = {
            year: +paymentDate[2],
            month: +paymentDate[1],
            day: +paymentDate[0],
            state: passport.state,
            service: passport.service,
            nationality: passport.customer_nationality.trim().toLowerCase(),
          };

          const comparedQueriesWithPassport = Object.keys(
            availableSearchQueries
          ).every((key) =>
            typeof passportData[key as keyof SearchQueries] === "string"
              ? passportData[key as keyof SearchQueries]
                  ?.toString()
                  .includes(
                    availableSearchQueries[key as keyof SearchQueries] as string
                  )
              : passportData[key as keyof SearchQueries] ===
                availableSearchQueries[key as keyof SearchQueries]
          );

          if (
            comparedQueriesWithPassport &&
            (stateArr
              ?.join(" ")
              ?.includes(
                passportData["state" as keyof SearchQueries] as string
              ) ||
              stateArr.join() === "") &&
            (serviceArr
              ?.join(" ")
              ?.includes(
                passportData["service" as keyof SearchQueries] as string
              ) ||
              serviceArr.join() === "")
          )
            return passport;
        })
      : passportsList;

  const sortedPassports = [...filteredPassports].sort((a: any, b: any) => {
    if (dayjs(b.payment_date).valueOf() === dayjs(a.payment_date).valueOf()) {
      return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();
    }

    return dayjs(b.payment_date).valueOf() - dayjs(a.payment_date).valueOf();
  });

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

    //set msg to none first
    setMsg("");
    dispatch(resetInvoicesStatus());

    //get admin token
    const token = info.token;

    //payload (admin token + id of the passport to delete)
    const passportData = {
      id: removedPassportID,
      token,
    };

    dispatch(deletePassport(passportData));
  };

  // handle Creating invoice
  const handleAddInvoice = (
    e: React.SyntheticEvent,
    customerName: string,
    ID: string,
    passport_service: string,
    paymentDate: string,
    passportSales: number
  ) => {
    e.preventDefault();

    //set msg to none first
    setMsg("");
    dispatch(resetPassportsStatus());

    const invoiceData = {
      token: info.token,
      ID: ID,
      customer: { name: customerName },
      details: [
        {
          name:
            passport_service === "90days" ||
            passport_service === "60days" ||
            passport_service === "30days"
              ? " فيزا " + passportService[passport_service]
              : passportService[passport_service as keyof PassportService],
          quantity: 1,
          price: passportSales,
        },
      ],
      total: passportSales,
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
      {[...tableHeaderTitles].reverse().map((title) => (
        <th
          key={title}
          scope="col"
          className="max-w-[100px] p-1 text-center border-x border-x-black"
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
              bgColor={["bg-red-600", "bg-red-700", "bg-red-800"]}
              icon={<TiDelete size={20} />}
            />
          </form>
        </th>

        {/* Make Invoice */}
        <th
          scope="row"
          className="p-1 text-gray-900 border-x text-center border-x-black"
        >
          <form
            className="max-w-[50px] m-auto"
            onSubmit={(event) =>
              handleAddInvoice(
                event,
                passport.customer_name,
                passport.ID,
                passport.service,
                passport.payment_date,
                passport.sales
              )
            }
          >
            <FormButton
              bgColor={["bg-orange-600", "bg-orange-700", "bg-orange-800"]}
              icon={<AiFillFileAdd size={20} />}
            />
          </form>
        </th>

        {/* Update Passport */}
        <th
          scope="row"
          className="p-1 text-gray-900 border-x text-center border-x-black"
        >
          <button
            className="w-full flex justify-center items-center font-bold text-xs bg-blue-800 text-white hover:bg-white px-3 py-2.5 border-transparent hover:text-blue-800 border hover:border-blue-800 rounded
            transition-all ease-in-out duration-300"
            onClick={() => {
              setId(passport._id);
              setIsOpen(true);
            }}
          >
            <AiFillEdit size={20} />
          </button>
        </th>

        {/*Payment Date*/}
        <th
          scope="row"
          className="p-1  text-gray-900 border-x text-center border-x-black"
        >
          {passport.payment_date
            ? dayjs(passport.payment_date).format("DD/MM/YYYY")
            : "-"}
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
          {sortedPassports.findIndex((p: any) => p._id === passport._id) + 1}
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
    dispatch(resetPassportsStatus());
    dispatch(resetInvoicesStatus());
  });

  UseResetStatus(() => {
    return () => {
      dispatch(resetAdminAuthStatus());
      dispatch(resetPassportsStatus());
      dispatch(resetInvoicesStatus());
    };
  });

  return (
    <div className="min-h-[75vh] w-full mx-auto my-20 overflow-x-auto  p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
      <img className="mx-auto" src={logo} alt="logo" />

      <div className="flex  justify-center items-center flex-wrap gap-4 my-5 p-4 bg-red-700 rounded-md ">
        <h4 className="basis-full flex justify-center items-center text-2xl my-4 p-3 text-center font-bold bg-red-200 text-gray-900 border-b-4 border-red-800 rounded shadow">
          فلتــرة الجـــوازات
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
              defaultValue={day}
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
              htmlFor="nationality"
            >
              الجنسية
            </label>
            <input
              type="text"
              name="nationality"
              className={inputClassNamesStyles.default}
              defaultValue={nationality}
              onChange={(e) =>
                setSearchQuery({
                  ...searchQuery,
                  nationality: e.target.value,
                })
              }
            />
          </div>

          <div className="basis-full flex justify-center items-center flex-col gap-2">
            <p className={lableClassNamesStyles.default}>الوضعية</p>

            <div className="flex flex-row-reverse items-center justify-center flex-wrap gap-2">
              {state?.map(
                (item: { value: string; checked: boolean }, index: number) => (
                  <Fragment key={item.value}>
                    <label className="text-white" htmlFor={item.value}>
                      {passportState[item.value as keyof PassportState][0]}
                    </label>

                    <input
                      type="checkbox"
                      id={item.value}
                      name={item.value}
                      value={item.value}
                      checked={item.checked}
                      onChange={() =>
                        setSearchQuery({
                          ...searchQuery,
                          state: state.map(
                            (
                              i: { value: string; checked: boolean },
                              indx: number
                            ) => {
                              return {
                                value: i.value,
                                checked:
                                  index === indx ? !i.checked : i.checked,
                              };
                            }
                          ),
                        })
                      }
                    />
                  </Fragment>
                )
              )}
            </div>
          </div>

          <div className="basis-full flex justify-center items-center flex-col gap-2">
            <p className={lableClassNamesStyles.default}>الخدمة</p>

            <div className="flex flex-row-reverse items-center justify-center flex-wrap gap-2">
              {service?.map(
                (item: { value: string; checked: boolean }, index: number) => (
                  <Fragment key={item.value}>
                    <label className="text-white" htmlFor={item.value}>
                      {passportService[item.value as keyof PassportService]}
                    </label>

                    <input
                      type="checkbox"
                      id={item.value}
                      name={item.value}
                      value={item.value}
                      checked={item.checked}
                      onChange={() =>
                        setSearchQuery({
                          ...searchQuery,
                          service: service.map(
                            (
                              i: { value: string; checked: boolean },
                              indx: number
                            ) => {
                              return {
                                value: i.value,
                                checked:
                                  index === indx ? !i.checked : i.checked,
                              };
                            }
                          ),
                        })
                      }
                    />
                  </Fragment>
                )
              )}
            </div>
          </div>
        </form>

        <h3 className="basis-full flex justify-center items-center flex-row-reverse flex-wrap text-2xl my-5 p-3 text-center font-bold bg-red-200 text-gray-900 border-b-4 border-red-800 rounded shadow">
          <span>{" الجوازات المحفوظة"}</span>
          {!month && !day && !year && (
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
          {state && (
            <span className="bg-emerald-500 p-1 rounded-md text-white mx-1">
              {" والوضعية " +
                (stateArr.join() === ""
                  ? "[كــل الوضعيات]"
                  : stateArr.map(
                      (state: string) =>
                        ` ${passportState[state as keyof PassportState][0]} `
                    ))}
            </span>
          )}

          {service && (
            <span className="bg-purple-500 p-1 rounded-md text-white mx-1">
              {" و الخدمة " +
                (serviceArr.join() === ""
                  ? "[كــل الخدمـات]"
                  : serviceArr.map(
                      (state: string) =>
                        ` ${passportService[state as keyof PassportService]} `
                    ))}
            </span>
          )}

          {nationality && (
            <span className="bg-pink-500 p-1 rounded-md text-white mx-1">
              {" و الجنسية " + nationality}
            </span>
          )}
          <span>({filteredPassports.length})</span>

          <span className="flex justify-center items-center mr-2">
            <FcBusiness size={50} />
          </span>
        </h3>
      </div>

      <h4 className="flex justify-center items-center flex-row-reverse flex-wrap gap-2 text-2xl my-10 p-4 text-center font-bold bg-red-700 text-gray-900 rounded shadow">
        <span className="bg-blue-500 p-1 rounded-md text-white mx-1">
          {" إجمالى الرسوم الغير خاضعه للضريبه " +
            `[ ${servicePrices.toFixed(2)} ]`}
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
      {isError ||
        (isSuccess && message && (
          <MessagesContainer
            msg={msg}
            isSuccess={isSuccess || invoiceData.isSuccess}
            isError={isError || invoiceData.isError}
          />
        ))}

      {invoiceData.isError ||
        (invoiceData.isSuccess && invoiceData.message && (
          <MessagesContainer
            msg={msg}
            isSuccess={invoiceData.isSuccess}
            isError={invoiceData.isError}
          />
        ))}

      {/* Show Table Row/Page Control */}
      {!isLoading &&
        !invoiceData.isLoading &&
        filteredPassports?.length > 0 && (
          <div className="max-w-sm flex flex-row-reverse justify-center items-center flex-wrap my-10 mx-auto gap-2 text-sm font-semibold">
            <label htmlFor="rowPerPage">عدد صفوف الجدول</label>
            <input
              className="max-w-[80px] p-2 bg-red-100 border border-red-500 text-center rounded focus:outline-none focus:border-blue-700"
              type={"number"}
              name="rowPerPage"
              min={1}
              max={filteredPassports.length}
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
      {!isLoading &&
        !invoiceData.isLoading &&
        filteredPassports?.length > 0 && (
          <PaginationTable
            tableRow={tableRow}
            tableHeader={tableHeader}
            tableBodyData={sortedPassports}
            rowsPerPage={rowPerPage}
          />
        )}

      {/* if there is No Passports Records */}
      {!year &&
        !month &&
        !day &&
        state?.length === 0 &&
        service?.length === 0 &&
        !nationality &&
        filteredPassports?.length === 0 &&
        !isLoading &&
        !invoiceData.isLoading && (
          <div className="bg-yellow-200 text-gray-800 text-center font-bold my-4 py-4 px-2 border-l-4 border-yellow-600 rounded">
            لا يوجد جوازات محفوظة الان, يرجى إضافة الجوازات لعرضها.
          </div>
        )}

      {/* if there is search query no passport matches >>> No Search Found*/}
      {(year || month || day || state || service || nationality) &&
        filteredPassports?.length === 0 &&
        !isLoading &&
        !invoiceData.isLoading && (
          <div className="bg-red-200 text-gray-800 text-center font-bold my-4 py-4 px-2 border-l-4 border-red-600 rounded">
            لا يوجد نتائج تطابق هذا البحث, تأكد من البيانات التى ادخلتها و حاول
            مجدداً
          </div>
        )}

      {/* Show update Passport Modal */}
      {isOpen && <UpdatePassport setIsOpen={setIsOpen} id={id} />}

      {/* Show spinner when Loading State is true */}
      {(isLoading || invoiceData.isLoading) && (
        <MainSpinner
          isLoading={isLoading ? isLoading : invoiceData.isLoading}
        />
      )}
    </div>
  );
};
