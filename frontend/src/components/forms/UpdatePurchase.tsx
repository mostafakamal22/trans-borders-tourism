import dayjs from "dayjs";
import { useState, useEffect } from "react";
import {
  AiFillCloseCircle,
  AiFillMinusCircle,
  AiFillPlusCircle,
} from "react-icons/ai";
import { RiSendPlaneFill } from "react-icons/ri";
import FormButton from "../shared/FormButton";
import { FormInput } from "../shared/FormInput";
import {
  useGetOnePurchaseQuery,
  useUpdatePurchaseMutation,
} from "../../state/features/purchase/purchaseApiSlice";
import { motion } from "framer-motion";
import {
  closeBtnAnimationsOptions,
  modalAnimationOptions,
} from "../helpers/animationOptions";
import {
  inputClassNamesStyles,
  lableClassNamesStyles,
} from "../invoice/constants";
import { ReactComponent as PurchaseAlt } from "../../assets/icons/purchase-alt.svg";
import { IPurchaseType } from "../../../../backend/models/purchaseModel";
import { MainSpinner } from "../shared/MainSpinner";

export const UpdatePurchase = ({
  id,
  setIsOpen,
}: {
  id: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  //initialize state
  const initialPurchaseDetails = {
    date: dayjs().format("YYYY-MM-DD"),
    total: 0,
  };

  const initialPurchaseTypes: IPurchaseType[] = [
    {
      name: "",
      description: "",
      supplier: "",
      reference_number: "",
      cost: 0,
      tax: 0,
      total: 0,
    },
  ];

  // Data fetching
  const {
    data: foundPurchase,
    isLoading,
    error,
  } = useGetOnePurchaseQuery({ id });

  //state for Purchase Details
  const [purchaseDetails, setPurchaseDetails] = useState(
    initialPurchaseDetails
  );

  //state for purchaseTypes Details
  const [purchaseTypesDetails, setPurchaseTypesDetails] =
    useState<IPurchaseType[]>(initialPurchaseTypes);

  //state for items
  const [itemsCount, setItemsCount] = useState(1);

  const handleItemCount = (num: number) => {
    if (num < 0 && itemsCount === 1) return;

    setItemsCount(itemsCount + num);

    const newItems =
      num > 0
        ? [
            ...purchaseTypesDetails,
            {
              name: "",
              description: "",
              supplier: "",
              reference_number: "",
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

  const [updatePurchase, { isLoading: isUpdating }] =
    useUpdatePurchaseMutation();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const purchaseData = {
      id,
      purchaseTypes: [...purchaseTypesDetails],
      total: purchaseDetails.total,
      purchaseDate: purchaseDetails.date,
    };

    await updatePurchase(purchaseData);
  };

  // Initialize state after data is fetched
  useEffect(() => {
    if (foundPurchase) {
      //Purchase Details
      setPurchaseDetails({
        date: dayjs(foundPurchase?.date).format("YYYY-MM-DD"),
        total: foundPurchase?.total,
      });

      const purchaseTypesData: IPurchaseType[] = [
        ...foundPurchase.purchase_types.map((item: any) => {
          return {
            name: item?.name,
            description: item?.description,
            supplier: item?.supplier,
            reference_number: item?.reference_number,
            cost: item?.cost,
            tax: item?.tax,
            total: item?.total,
          };
        }),
      ];

      //PurchaseTypes Details
      setPurchaseTypesDetails(purchaseTypesData);
    }
  }, [foundPurchase]);

  useEffect(() => {
    //scroll page back to top when component first mount
    const yOffset = window.scrollY;
    window.scrollBy(0, -yOffset);
  }, []);

  //Show Error Message if could not fetch data
  if (error) {
    return (
      <div className="w-full">
        <h1 className="my-4 rounded border-l-4 border-red-600 bg-red-200 p-2 text-center text-base font-bold uppercase text-gray-800">
          Error happened, try refresh the page.
        </h1>
      </div>
    );
  }

  //Show spinner when Loading State is true
  if (!foundPurchase || isLoading)
    return (
      <div className="w-full">
        <MainSpinner isLoading={isLoading} />
      </div>
    );

  return (
    <div className="fixed inset-0 z-50  h-screen w-full overflow-y-auto overflow-x-hidden bg-black/75 scrollbar-thin scrollbar-track-transparent  scrollbar-thumb-gray-400 scrollbar-track-rounded-full md:inset-0">
      <motion.button
        {...closeBtnAnimationsOptions}
        className="fixed top-5 right-[5%] inline-flex items-center rounded border border-transparent bg-red-800 px-2  py-2 text-xs font-bold text-white shadow transition-all duration-300 ease-in-out hover:border-red-800
     hover:bg-white hover:text-red-800 sm:px-3 sm:text-sm"
        onClick={() => setIsOpen(false)}
        type="button"
      >
        <AiFillCloseCircle className="mr-1" size={20} />
        إغلاق
      </motion.button>
      <motion.div
        {...modalAnimationOptions}
        key={"modal"}
        className="mx-auto my-5 w-full max-w-5xl rounded bg-slate-50 p-6 shadow-lg shadow-black/30"
      >
        <h3 className="mb-10 flex items-center justify-center rounded bg-red-800 px-2 py-4 text-center text-xl font-bold text-white shadow ">
          <PurchaseAlt className="mr-2 h-16 w-16 drop-shadow" />
          <span>تعديل المشترى</span>
        </h3>

        <form onSubmit={handleSubmit}>
          <p className="my-4 rounded bg-red-800 p-2 text-lg font-bold text-white">
            [ تفــاصيل نوع المشترى الحالية ]
          </p>
          {purchaseTypesDetails.map((item, index) => (
            <div
              key={index}
              className="flex flex-wrap items-center justify-center gap-4 px-5 py-5  font-semibold"
            >
              <FormInput
                label="Supplier"
                name="itemSupplier"
                labeClassNames={lableClassNamesStyles.default}
                className={inputClassNamesStyles.default}
                type="text"
                value={item.supplier}
                onChange={(e) => {
                  const newArr = [...purchaseTypesDetails];
                  newArr[index].supplier = e.target.value;
                  setPurchaseTypesDetails(newArr);
                }}
              />

              <FormInput
                label="Reference Number"
                name="itemReferenceNumber"
                labeClassNames={lableClassNamesStyles.default}
                className={inputClassNamesStyles.default}
                type="text"
                value={item.reference_number}
                onChange={(e) => {
                  const newArr = [...purchaseTypesDetails];
                  newArr[index].reference_number = e.target.value;
                  setPurchaseTypesDetails(newArr);
                }}
              />

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

              <FormInput
                label="نوع المشتري"
                name="itemName"
                labeClassNames={lableClassNamesStyles.default}
                className={inputClassNamesStyles.default}
                type="text"
                value={item.name}
                onChange={(e) => {
                  const newArr = [...purchaseTypesDetails];
                  newArr[index].name = e.target.value;
                  setPurchaseTypesDetails(newArr);
                }}
              />

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
                className={`${inputClassNamesStyles.default} bg-slate-200`}
                type="number"
                value={item.total}
                disabled
                min={0}
                step={0.01}
              />
            </div>
          ))}

          <div className="flex justify-around">
            <button
              className="my-5 flex items-center rounded border bg-blue-800 px-2 py-2 text-xs font-bold text-white shadow transition-all duration-300 ease-in-out hover:border-blue-800
             hover:bg-white hover:text-blue-800 sm:px-3 sm:text-sm"
              onClick={() => handleItemCount(1)}
              type="button"
            >
              <AiFillPlusCircle className="mr-1" size={20} />
              إضافة نوع جديد
            </button>

            <button
              className="my-5 flex items-center rounded border bg-red-800 px-2 py-2 text-xs font-bold text-white shadow transition-all duration-300 ease-in-out hover:border-red-800
             hover:bg-white hover:text-red-800 sm:px-3 sm:text-sm"
              onClick={() => handleItemCount(-1)}
              type="button"
            >
              <AiFillMinusCircle className="mr-1" size={20} />
              حذف نوع مشترى
            </button>
          </div>

          <p className="my-4 rounded bg-red-800 p-2 text-lg font-bold text-white">
            [ تفــاصيل المشترى الحالية ]
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 px-5 py-5 font-semibold">
            <FormInput
              label="المبلغ الكــلى"
              name="totalPayment"
              labeClassNames={lableClassNamesStyles.default}
              className={`${inputClassNamesStyles.default} bg-slate-200`}
              type="number"
              value={purchaseDetails.total}
              disabled
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

          {/*Form Button */}
          <FormButton
            text={{ default: "حفظ التعديلات", loading: "جارى الحفظ" }}
            isLoading={isUpdating}
            icon={<RiSendPlaneFill className="mr-1" size={25} />}
          />
        </form>
      </motion.div>
    </div>
  );
};
