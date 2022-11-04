import dayjs from "dayjs";
import { useState, useEffect } from "react";
import {
  AiFillCloseCircle,
  AiFillMinusCircle,
  AiFillPlusCircle,
} from "react-icons/ai";
import { FcFeedback } from "react-icons/fc";
import { RiSendPlaneFill } from "react-icons/ri";
import { UseResetStatus } from "../../hooks/UseResetStatus";
import { resetAdminAuthStatus } from "../../state/features/admin/auth/adminAuthSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../state/features/hooks/StateHooks";
import FormButton from "../shared/FormButton";
import { FormInput } from "../shared/FormInput";
import MessagesContainer from "../shared/MessagesContainer";
import { inputClassNamesStyles, lableClassNamesStyles } from "./CreateInvoice";
import {
  PurchaseSuppliers,
  purchaseSuppliers,
  PurchaseTypes,
  purchaseTypes,
} from "./CreatePurchase";
import logo from "../../assets/imgs/trans-logo.png";
import {
  resetPurchasesStatus,
  updatePurchase,
} from "../../state/features/purchase/purchaseSlice";

export const UpdatePurchase = ({
  id,
  setIsOpen,
}: {
  id: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { purchasesList } = useAppSelector((state) => state.purchasesData);
  const purchase = purchasesList.find((purchase: any) => purchase._id === id);

  //state for Purchase Details
  const [purchaseDetails, setPurchaseDetails] = useState({
    date: dayjs(purchase.date).format("YYYY-MM-DD"),
    total: purchase.total,
  });

  const purchaseTypesData = [
    ...purchase.purchase_types.map((item: any) => {
      return {
        name: item.name,
        description: item.description,
        supplier: item.supplier,
        cost: item.cost,
        tax: item.tax,
        total: item.total,
      };
    }),
  ];

  //state for purchaseTypes Details
  const [purchaseTypesDetails, setPurchaseTypesDetails] =
    useState(purchaseTypesData);

  //state for items
  const [itemsCount, setItemsCount] = useState(1);

  //state for alert messages
  const [msg, setMsg] = useState("");

  const { info } = useAppSelector((state) => state.adminAuth);
  const { isError, isSuccess, isLoading, message } = useAppSelector(
    (state) => state.purchasesData
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isError) {
      setMsg(message);
    }

    if (isSuccess) {
      setMsg(message);
    }
  }, [isError, isSuccess, message, info, msg]);

  const handleItemCount = (num: number) => {
    if (num < 0 && itemsCount === 1) return;

    setItemsCount(itemsCount + num);

    const newItems =
      num > 0
        ? [
            ...purchaseTypesDetails,
            {
              name: "tickets",
              description: "",
              supplier: "none",
              cost: 0,
              tax: 0,
              total: 0,
            },
          ]
        : purchaseTypesDetails.splice(0, purchaseTypesDetails.length - 1);

    setPurchaseTypesDetails(newItems);

    const newTotal = newItems.reduce((prev, curr) => prev + curr.total, 0);
    setPurchaseDetails({ ...purchaseDetails, total: newTotal });
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    //set msg to none first
    setMsg("");

    const purchaseData = {
      token: info.token,
      id,
      purchaseTypes: [...purchaseTypesDetails],
      total: purchaseDetails.total,
      purchaseDate: purchaseDetails.date,
    };

    dispatch(updatePurchase(purchaseData));
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
    <div className="h-screen bg-gray-500/50 overflow-y-auto overflow-x-hidden fixed inset-0 z-50 w-full md:inset-0">
      <button
        className="fixed top-5 right-[10%] inline-flex font-bold text-xs sm:text-sm bg-red-800 text-white hover:bg-white  px-2 sm:px-3 py-2 border-transparent hover:text-red-800 border hover:border-red-800 items-center rounded
       shadow transition-all ease-in-out duration-300"
        onClick={() => setIsOpen(false)}
        type="button"
      >
        <AiFillCloseCircle className="mr-1" size={20} />
        إغلاق
      </button>

      <div className="max-w-6xl w-full mx-auto my-20 p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
        <h3 className="flex justify-center items-center text-xl text-center font-bold px-2 py-4 mb-10 bg-red-200 border-b-4 border-red-800 rounded shadow ">
          <FcFeedback className="mr-1" size={50} />
          <span>تعديل مشترى</span>
        </h3>

        <img className="mx-auto" src={logo} alt="logo" />

        <form onSubmit={handleSubmit}>
          <p className="font-bold p-2 rounded text-lg text-white bg-red-800 my-4">
            [ تفــاصيل نوع المشترى الحالية ]
          </p>
          {purchaseTypesDetails.map((item, index) => (
            <div
              key={index}
              className="flex flex-wrap items-center font-semibold  gap-4 px-5 py-5"
            >
              <label
                htmlFor="itemName"
                className={lableClassNamesStyles.default}
              >
                نوع المشترى
              </label>
              <select
                name="itemName"
                className={inputClassNamesStyles.default}
                value={item.name}
                onChange={(e) => {
                  const newArr = [...purchaseTypesDetails];
                  newArr[index].name = e.target.value;
                  setPurchaseTypesDetails(newArr);
                }}
              >
                {Object.keys(purchaseTypes).map((name: string) => (
                  <option key={name} value={name}>
                    {purchaseTypes[name as keyof PurchaseTypes]}
                  </option>
                ))}
              </select>

              <FormInput
                label="شرح المشتري"
                name="itemDescription"
                labeClassNames={lableClassNamesStyles.default}
                className={inputClassNamesStyles.default}
                type="text"
                value={item.description}
                onChange={(e) => {
                  const newArr = [...purchaseTypesDetails];
                  newArr[index].description = e.target.value;
                  setPurchaseTypesDetails(newArr);
                }}
              />

              <label
                htmlFor="itemSupplier"
                className={lableClassNamesStyles.default}
              >
                Supplier
              </label>
              <select
                name="itemSupplier"
                className={inputClassNamesStyles.default}
                value={item.supplier}
                onChange={(e) => {
                  const newArr = [...purchaseTypesDetails];
                  newArr[index].supplier = e.target.value;
                  setPurchaseTypesDetails(newArr);
                }}
              >
                {Object.keys(purchaseSuppliers).map((supplier: string) => (
                  <option key={supplier} value={supplier}>
                    {purchaseSuppliers[supplier as keyof PurchaseSuppliers]}
                  </option>
                ))}
              </select>

              <FormInput
                label="المبلغ قبل الضريبة"
                name="itemTotal"
                labeClassNames={lableClassNamesStyles.default}
                className={inputClassNamesStyles.default}
                type="number"
                value={item.cost}
                onChange={(e) => {
                  const newArr = [...purchaseTypesDetails];
                  newArr[index].cost = +e.target.value;
                  newArr[index].total = +e.target.value + newArr[index].tax;
                  setPurchaseTypesDetails(newArr);

                  const newTotal = purchaseTypesDetails.reduce(
                    (prev, curr) => prev + curr.total,
                    0
                  );
                  setPurchaseDetails({
                    ...purchaseDetails,
                    total: +newTotal.toFixed(2),
                  });
                }}
                min={0}
                step={0.01}
              />

              <FormInput
                label="الضريبة"
                name="itemTotal"
                labeClassNames={lableClassNamesStyles.default}
                className={inputClassNamesStyles.default}
                type="number"
                value={item.tax}
                onChange={(e) => {
                  const newArr = [...purchaseTypesDetails];
                  newArr[index].tax = +e.target.value;
                  newArr[index].total = newArr[index].cost + +e.target.value;
                  setPurchaseTypesDetails(newArr);

                  const newTotal = purchaseTypesDetails.reduce(
                    (prev, curr) => prev + curr.total,
                    0
                  );
                  setPurchaseDetails({
                    ...purchaseDetails,
                    total: +newTotal.toFixed(2),
                  });
                }}
                min={0}
                step={0.01}
              />

              <FormInput
                label="الاجمالى بعد الضريبة"
                name="itemTotal"
                labeClassNames={lableClassNamesStyles.default}
                className={inputClassNamesStyles.default}
                type="number"
                value={item.total}
                onChange={(e) => {
                  const newArr = [...purchaseTypesDetails];
                  newArr[index].total = +e.target.value;
                  setPurchaseTypesDetails(newArr);

                  const newTotal = purchaseTypesDetails.reduce(
                    (prev, curr) => prev + curr.total,
                    0
                  );
                  setPurchaseDetails({
                    ...purchaseDetails,
                    total: +newTotal.toFixed(2),
                  });
                }}
                min={0}
                step={0.01}
              />
            </div>
          ))}

          <div className="flex justify-around">
            <button
              className="inline-flex font-bold text-xs sm:text-sm bg-blue-800 text-white hover:bg-white my-5 px-2 sm:px-3 py-2 hover:text-blue-800 border hover:border-blue-800 items-center rounded
         shadow transition-all ease-in-out duration-300"
              onClick={() => handleItemCount(1)}
              type="button"
            >
              <AiFillPlusCircle className="mr-1" size={20} />
              إضافة نوع جديد
            </button>

            <button
              className="inline-flex font-bold text-xs sm:text-sm bg-red-800 text-white hover:bg-white my-5 px-2 sm:px-3 py-2 hover:text-red-800 border hover:border-red-800 items-center rounded
         shadow transition-all ease-in-out duration-300"
              onClick={() => handleItemCount(-1)}
              type="button"
            >
              <AiFillMinusCircle className="mr-1" size={20} />
              حذف نوع مشترى
            </button>
          </div>

          <p className="font-bold p-2 rounded text-lg text-white bg-red-800 my-4">
            [ تفــاصيل المشترى الحالية ]
          </p>
          <div className="flex justify-center items-center font-semibold flex-wrap gap-4 px-5 py-5">
            <FormInput
              label="المبلغ الكــلى"
              name="totalPayment"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="number"
              value={purchaseDetails.total}
              onChange={(e) =>
                setPurchaseDetails({
                  ...purchaseDetails,
                  total: +e.target.value,
                })
              }
              min={0}
              step={0.01}
              required
            />

            <FormInput
              label="تــاريـخ المشترى"
              name="paymentDate"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="date"
              value={purchaseDetails.date}
              onChange={(e) =>
                setPurchaseDetails({ ...purchaseDetails, date: e.target.value })
              }
              required
            />
          </div>

          {/*Request Status and Errors*/}
          {(isError || isSuccess) && (
            <MessagesContainer
              msg={msg}
              isSuccess={isSuccess}
              isError={isError}
            />
          )}

          {/*form button */}
          <FormButton
            text={{ default: "حفظ التعديلات", loading: "جارى الحفظ" }}
            isLoading={isLoading}
            icon={<RiSendPlaneFill className="mr-1" size={25} />}
          />
        </form>
      </div>
    </div>
  );
};
