import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { FcSalesPerformance } from "react-icons/fc";
import { TiDelete } from "react-icons/ti";
import { Link } from "react-router-dom";
import logo from "../../assets/imgs/trans-logo.png";
import { UseResetStatus } from "../../hooks/UseResetStatus";
import { resetAdminAuthStatus } from "../../state/features/admin/auth/adminAuthSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../state/features/hooks/StateHooks";
import { resetInvoicesStatus } from "../../state/features/invoice/invoiceSlice";
import {
  deletePurchase,
  resetPurchasesStatus,
} from "../../state/features/purchase/purchaseSlice";
import {
  inputClassNamesStyles,
  lableClassNamesStyles,
} from "../forms/CreateInvoice";
import { UpdatePurchase } from "../forms/UpdatePurchase";
import { purchaseCalculations } from "../helpers/purchaseCalculations";
import FormButton from "../shared/FormButton";
import { MainSpinner } from "../shared/MainSpinner";
import MessagesContainer from "../shared/MessagesContainer";
import { PaginationTable } from "../shared/PaginationTable";

export const purchaseTableHeaderTitles = [
  "مسح المشترى",
  "عرض سند الصرف",
  "تعديل المشترى",
  "المبلغ الكلى",
  "Supplier",
  "شرح المشترى",
  "نوع المشترى",
  "تاريخ المشترى",
];

export const Purchases = () => {
  const { info } = useAppSelector((state) => state.adminAuth);
  const { purchasesList } = useAppSelector((state) => state.purchasesData);

  const dispatch = useAppDispatch();

  //Table Row/Page State
  const [tableRows, setTableRows] = useState(50);
  const [rowPerPage, setRowPerPage] = useState(50);

  //search Params
  const [searchQuery, setSearchQuery] = useState<SearchQueries>({
    day: "",
    year: "",
    month: "",
    supplier: "",
    type: "",
  });

  const { year, month, day, supplier, type } = searchQuery;

  type SearchQueries = {
    day: string | number;
    year: string | number;
    month: string | number;
    supplier: string;
    type: string;
  };

  let availableSearchQueries: SearchQueries = {
    year: +year,
    month: +month,
    day: +day,
    supplier: supplier.trim().toLowerCase(),
    type: type.trim().toLowerCase(),
  };

  for (const key in availableSearchQueries) {
    if (!availableSearchQueries[key as keyof SearchQueries]) {
      delete availableSearchQueries[key as keyof SearchQueries];
    }
  }

  //Is modal open
  const [isOpen, setIsOpen] = useState(false);

  //PurchaseID to Update
  const [id, setId] = useState("");

  //filtered Purchases
  const filteredPurchases: [] =
    day || month || year || supplier || type
      ? purchasesList.filter((purchase: any) => {
          const purchaseDate = dayjs(purchase.date)
            .format("DD/MM/YYYY")
            .split("/");

          const purchaseData: SearchQueries = {
            year: +purchaseDate[2],
            month: +purchaseDate[1],
            day: +purchaseDate[0],
            supplier: purchase?.purchase_types[0]?.supplier
              ?.trim()
              .toLowerCase(),
            type: purchase?.purchase_types[0]?.name?.trim().toLowerCase(),
          };

          if (
            Object.keys(availableSearchQueries).every((key) =>
              typeof purchaseData[key as keyof SearchQueries] === "string"
                ? purchaseData[key as keyof SearchQueries]
                    ?.toString()
                    .includes(
                      availableSearchQueries[
                        key as keyof SearchQueries
                      ] as string
                    )
                : purchaseData[key as keyof SearchQueries] ===
                  availableSearchQueries[key as keyof SearchQueries]
            )
          ) {
            return purchase;
          }
        })
      : purchasesList;

  const sortedPurchases = [...filteredPurchases].sort((a: any, b: any) => {
    if (dayjs(b.date).valueOf() === dayjs(a.date).valueOf()) {
      return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();
    }

    return dayjs(b.date).valueOf() - dayjs(a.date).valueOf();
  });

  const { isLoading, isError, isSuccess, message } = useAppSelector(
    (state) => state.purchasesData
  );

  //search message state
  const [msg, setMsg] = useState("");

  //Get Totals
  const { totals } = purchaseCalculations(filteredPurchases);

  // handle Delete Purchase
  const handleRemoving = (e: any, removedPurchaseID: string) => {
    e.preventDefault();

    //set msg to none first
    setMsg("");

    //get admin token
    const token = info.token;

    //payload (admin token + id of the Purchase to delete)
    const purchaseData = {
      id: removedPurchaseID,
      token,
    };

    dispatch(deletePurchase(purchaseData));
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
      {purchaseTableHeaderTitles.map((title) => (
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

  const tableRow = (purchase: any, index: number) => {
    return (
      <tr
        key={purchase._id}
        className={`${
          index % 2 === 0 ? "bg-white" : "bg-gray-100"
        } border-b border-b-black`}
      >
        {/* Delete Purchase */}
        <th
          scope="row"
          className="p-2 text-gray-900 text-xs border-x text-center border-x-black"
        >
          <form
            className="max-w-[150px] m-auto"
            onSubmit={(event) => handleRemoving(event, purchase._id)}
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
          <Link
            to={`/purchases/${purchase._id}`}
            className="inline-flex font-bold text-xs bg-orange-800 text-white hover:bg-white px-2 py-2 border-transparent hover:text-orange-800 border hover:border-orange-800 items-center rounded
             transition-all ease-in-out duration-300"
          >
            سند الصرف
          </Link>
        </th>

        {/*Update Purchase*/}
        <th
          scope="row"
          className="p-2  text-gray-900  border-x text-center border-x-black"
        >
          <button
            className="w-full flex justify-center items-center font-bold text-xs bg-blue-800 text-white hover:bg-white px-3 py-2.5 border-transparent hover:text-blue-800 border hover:border-blue-800 rounded
            transition-all ease-in-out duration-300"
            onClick={() => {
              setId(purchase._id);
              setIsOpen(true);
            }}
          >
            <AiFillEdit size={20} />
          </button>
        </th>

        {/*Purchase Total*/}
        <th
          scope="row"
          className="p-2  text-gray-900  border-x text-center border-x-black"
        >
          {purchase.total}
        </th>

        {/*Purchase Supplier*/}
        <th
          scope="row"
          className="p-2  text-gray-900  border-x text-center border-x-black"
        >
          {purchase.purchase_types.map(
            (type: { supplier: string }, index: number) => (
              <span
                key={index}
                className="flex flex-row-reverse justify-center items-center gap-1 my-1 p-1 bg-purple-400 rounded"
              >
                <span>{type.supplier ? type.supplier : "-"}</span>
              </span>
            )
          )}
        </th>

        {/*Purchase Description*/}
        <th
          scope="row"
          className="p-2  text-gray-900  border-x text-center border-x-black"
        >
          {purchase.purchase_types.map(
            (type: { description: string }, index: number) => (
              <span
                key={index}
                className="flex flex-row-reverse justify-center items-center gap-1 my-1 p-1 bg-purple-400 rounded"
              >
                <span>{type.description ? type.description : "-"}</span>
              </span>
            )
          )}
        </th>

        {/*Purchase Types*/}
        <th
          scope="row"
          className="p-2  text-gray-900  border-x text-center border-x-black"
        >
          {purchase.purchase_types.map(
            (type: { name: string; total: number }, index: number) => (
              <span
                key={index}
                className="flex flex-row-reverse justify-center items-center gap-1 my-1 p-1 bg-amber-400 rounded"
              >
                {type.name}
              </span>
            )
          )}
        </th>

        {/*Purchase Date*/}
        <th
          scope="row"
          className="p-2  text-gray-900  border-x text-center border-x-black"
        >
          {dayjs(purchase.date).format("DD/MM/YYYY")}
        </th>

        {/*Purchase NO*/}
        <th
          scope="row"
          className="p-1  text-gray-90 border-x text-center border-x-black"
        >
          {sortedPurchases.findIndex((p: any) => p._id === purchase._id) + 1}
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
    dispatch(resetPurchasesStatus());
    dispatch(resetInvoicesStatus());
  });

  UseResetStatus(() => {
    return () => {
      dispatch(resetAdminAuthStatus());
      dispatch(resetPurchasesStatus());
      dispatch(resetInvoicesStatus());
    };
  });

  return (
    <div className="max-w-7xl min-h-[75vh] w-full mx-auto my-20 overflow-x-auto  p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
      <img className="mx-auto" src={logo} alt="logo" />

      <div className="flex justify-center items-center flex-wrap gap-4 my-5 p-4 bg-red-700 rounded-md">
        <h4 className="basis-full flex justify-center items-center text-2xl my-4 p-3 text-center font-bold bg-red-200 text-gray-900 border-b-4 border-red-800 rounded shadow">
          فلتــرة المشتــريات
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
        </form>

        <h3 className="basis-full flex justify-center items-center flex-row-reverse flex-wrap text-2xl my-5 p-3 text-center font-bold bg-red-200 text-gray-900 border-b-4 border-red-800 rounded shadow">
          <span>{" المشتــريات المحفوظة"}</span>
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
          {supplier && (
            <span className="bg-amber-500 p-1 rounded-md text-white mx-1">
              {" Supplier:- " + supplier}
            </span>
          )}
          {type && (
            <span className="bg-amber-500 p-1 rounded-md text-white mx-1">
              {" Type:- " + type}
            </span>
          )}
          <span>({filteredPurchases.length})</span>
          <span className="flex justify-center items-center mr-2">
            <FcSalesPerformance size={50} />
          </span>
        </h3>
      </div>

      <h4 className="flex justify-center items-center flex-row-reverse flex-wrap gap-2 text-2xl my-10 p-4 text-center font-bold bg-red-700 text-gray-900 rounded shadow">
        <span className="bg-emerald-500 p-1 rounded-md text-white mx-1">
          {" إجمالى المشتــريات " + `[ ${totals.toFixed(2)} ]`}
        </span>
      </h4>

      {/*Request Status and Errors*/}
      {(isError || (isSuccess && message)) && (
        <MessagesContainer msg={msg} isSuccess={isSuccess} isError={isError} />
      )}

      {/* Show Table Row/Page Control */}
      {!isLoading && filteredPurchases?.length > 0 && (
        <div className="max-w-sm flex flex-row-reverse justify-center items-center flex-wrap my-10 mx-auto gap-2 text-sm font-semibold">
          <label htmlFor="rowPerPage">عدد صفوف الجدول</label>
          <input
            className="max-w-[80px] p-2 bg-red-100 border border-red-500 text-center rounded focus:outline-none focus:border-blue-700"
            type={"number"}
            name="rowPerPage"
            min={1}
            max={filteredPurchases.length}
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
      {!isLoading && filteredPurchases?.length > 0 && (
        <PaginationTable
          tableRow={tableRow}
          tableHeader={tableHeader}
          tableBodyData={sortedPurchases}
          rowsPerPage={rowPerPage}
        />
      )}

      {/* if there is No Purchases Records */}
      {!year &&
        !month &&
        !day &&
        !supplier &&
        !type &&
        filteredPurchases?.length === 0 &&
        !isLoading && (
          <div className="bg-yellow-200 text-gray-800 text-center font-bold my-4 py-4 px-2 border-l-4 border-yellow-600 rounded">
            لا يوجد مشتــريات محفوظة الان , يرجى إضافة المشتــريات لعرضها.
          </div>
        )}

      {/* if there is search query no Purchase matches >>> No Search Found*/}
      {(year || month || day || supplier || type) &&
        filteredPurchases?.length === 0 &&
        !isLoading && (
          <div className="bg-red-200 text-gray-800 text-center font-bold my-4 py-4 px-2 border-l-4 border-red-600 rounded">
            لا يوجد نتائج تطابق هذا البحث, تأكد من البيانات التى أدخلتها وحاول
            مجدداً
          </div>
        )}

      {/* Show update Purchase Modal */}
      {isOpen && <UpdatePurchase setIsOpen={setIsOpen} id={id} />}

      {/* Show spinner when Loading State is true */}
      {isLoading && <MainSpinner isLoading={isLoading} />}
    </div>
  );
};
