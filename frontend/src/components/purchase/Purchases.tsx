import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FcSalesPerformance } from "react-icons/fc";
import { TiDelete } from "react-icons/ti";
import logo from "../../assets/imgs/trans-logo.png";
import { UseResetStatus } from "../../hooks/UseResetStatus";
import { resetAdminAuthStatus } from "../../state/features/admin/auth/adminAuthSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../state/features/hooks/StateHooks";
import {
  deletePurchase,
  resetPurchasesStatus,
} from "../../state/features/purchase/purchaseSlice";
import {
  inputClassNamesStyles,
  lableClassNamesStyles,
} from "../forms/CreateInvoice";
import { PurchaseTypes, purchaseTypes } from "../forms/CreatePurchase";
import { UpdatePurchase } from "../forms/UpdatePurchase";
import { purchaseCalculations } from "../helpers/purchaseCalculations";
import FormButton from "../shared/FormButton";
import { MainSpinner } from "../shared/MainSpinner";
import MessagesContainer from "../shared/MessagesContainer";
import { PaginationTable } from "../shared/PaginationTable";

export const purchaseTableHeaderTitles = [
  "مسح المشترى",
  "تعديل المشترى",
  "المبلغ الكلى",
  "نوع المشترى",
  "تاريخ المشترى",
];

export const Purchases = () => {
  const { info } = useAppSelector((state) => state.adminAuth);
  const { purchasesList } = useAppSelector((state) => state.purchasesData);
  const dispatch = useAppDispatch();

  //search Params
  const [searchQuery, setSearchQuery] = useState({
    year: "",
    month: "",
  });

  const { year, month } = searchQuery;

  //Is modal open
  const [isOpen, setIsOpen] = useState(false);

  //PurchaseID to Update
  const [id, setId] = useState("");

  //filtered Purchases
  const filteredPurchases: [] =
    month || year
      ? purchasesList.filter((purchase: any) => {
          const purchaseDate = dayjs(purchase.date)
            .format("DD/MM/YYYY")
            .split("/");
          const yearOfPurchase = purchaseDate[2];
          const monthOfPurchase = purchaseDate[1];

          if (yearOfPurchase === year && +monthOfPurchase === +month)
            return purchase;
        })
      : purchasesList;

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
              text={{ default: "مسح المشتـرى" }}
              bgColor={["bg-red-600", "bg-red-700", "bg-red-800"]}
              icon={<TiDelete className="mb-[-2px]" size={25} />}
            />
          </form>
        </th>

        {/*Update Purchase*/}
        <th
          scope="row"
          className="p-2  text-gray-900  border-x text-center border-x-black"
        >
          <button
            className="inline-flex font-bold text-xs bg-blue-800 text-white hover:bg-white px-2 py-2 border-transparent hover:text-blue-800 border hover:border-blue-800 items-center rounded
             transition-all ease-in-out duration-300"
            onClick={() => {
              setId(purchase._id);
              setIsOpen(true);
            }}
          >
            تعديل
          </button>
        </th>

        {/*Purchase Total*/}
        <th
          scope="row"
          className="p-2  text-gray-900  border-x text-center border-x-black"
        >
          {purchase.total}
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
                <span>{purchaseTypes[type.name as keyof PurchaseTypes]}</span>
                <span>{type.total + " <== "}</span>
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
          {[...filteredPurchases]
            .reverse()
            .findIndex((p: any) => p._id === purchase._id) + 1}
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
  });

  UseResetStatus(() => {
    return () => {
      dispatch(resetAdminAuthStatus());
      dispatch(resetPurchasesStatus());
    };
  });

  return (
    <div className="max-w-7xl min-h-[75vh] w-full mx-auto my-20 overflow-x-auto  p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
      <img className="mx-auto" src={logo} alt="logo" />

      <div className="flex justify-center items-center flex-wrap gap-4 my-5 p-4 bg-red-700 rounded-md">
        <h4 className="basis-full flex justify-center items-center text-2xl my-4 p-3 text-center font-bold bg-red-200 text-gray-900 border-b-4 border-red-800 rounded shadow">
          فلتــرة المشتــرى
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
          {year && (
            <span className="bg-amber-500 p-1 rounded-md text-white mx-1">
              {" سنة " + year}
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

      {/*Display Table All Data Needed*/}
      {!isLoading && filteredPurchases?.length > 0 && (
        <PaginationTable
          tableRow={tableRow}
          tableHeader={tableHeader}
          tableBodyData={[...filteredPurchases].reverse()}
          rowsPerPage={10}
        />
      )}

      {/* if there is No Purchases Records */}
      {!year && !month && filteredPurchases?.length === 0 && !isLoading && (
        <div className="bg-yellow-200 text-gray-800 text-center font-bold my-4 py-4 px-2 border-l-4 border-yellow-600 rounded">
          لا يوجد مشتــريات محفوظة الان , يرجى إضافة المشتــريات لعرضها.
        </div>
      )}

      {/* if there is search query no Purchase matches >>> No Search Found*/}
      {(year || month) && filteredPurchases?.length === 0 && !isLoading && (
        <div className="bg-red-200 text-gray-800 text-center font-bold my-4 py-4 px-2 border-l-4 border-red-600 rounded">
          لا يوجد نتائج تطابق هذا البحث, تأكد من الشهر و السنة وحاول مجدداً
        </div>
      )}

      {/* Show update Purchase Modal */}
      {isOpen && <UpdatePurchase setIsOpen={setIsOpen} id={id} />}

      {/* Show spinner when Loading State is true */}
      {isLoading && <MainSpinner isLoading={isLoading} />}
    </div>
  );
};
