import { useState, useEffect } from "react";
import { useCreatePurchaseMutation } from "../../state/features/purchase/purchaseApiSlice";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import {
  inputClassNamesStyles,
  lableClassNamesStyles,
} from "../invoice/constants";
import { FormInput } from "../shared/FormInput";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import FormButton from "../shared/FormButton";
import { RiSendPlaneFill } from "react-icons/ri";
import { useScroll } from "../../hooks/useScroll";
import { ReactComponent as PurchaseAlt } from "../../assets/icons/purchase-alt.svg";

export const CreatePurchase = () => {
  //state for Purchase Details
  const [purchaseDetails, setPurchaseDetails] = useState({
    date: "",
    total: 0,
  });

  //state for purchaseTypes Details
  const [purchaseTypesDetails, setPurchaseTypesDetails] = useState([
    {
      name: "",
      description: "",
      supplier: "",
      reference_number: "",
      cost: 0,
      tax: 0,
      total: 0,
    },
  ]);

  //state for items
  const [itemsCount, setItemsCount] = useState(1);

  const [createPurchase, { isSuccess, isLoading }] =
    useCreatePurchaseMutation();

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

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const purchaseData = {
      purchaseTypes: [...purchaseTypesDetails],
      total: purchaseDetails.total,
      purchaseDate: purchaseDetails.date,
    };

    await createPurchase(purchaseData);
  };

  useEffect(() => {
    if (isSuccess) {
      //Set Purchase Inputs To Default
      setPurchaseDetails({
        date: "",
        total: 0,
      });

      setPurchaseTypesDetails([
        {
          name: "",
          description: "",
          supplier: "",
          reference_number: "",
          cost: 0,
          tax: 0,
          total: 0,
        },
      ]);
    }
  }, [isSuccess]);

  useScroll("createPurchase");
  useDocumentTitle("إضافة مشترى جديدة");

  return (
    <section id="createTicket" className="w-full">
      <h3 className="mb-10 flex items-center justify-center rounded bg-red-800 px-2 py-4 text-center text-xl font-bold text-white shadow ">
        <PurchaseAlt className="mr-2 h-16 w-16 drop-shadow" />
        <span>إضافة مشترى جديدة</span>
      </h3>

      <form onSubmit={handleSubmit}>
        <p className="my-4 rounded bg-red-800 p-2 text-lg font-bold text-white">
          [ تفــاصيل نوع المشترى ]
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
            className="my-5 flex items-center rounded border bg-blue-800 px-2 py-2 text-xs font-bold text-white shadow transition-all duration-300 ease-in-out hover:border-blue-800
             hover:bg-white hover:text-blue-800 sm:px-3 sm:text-sm"
            onClick={() => handleItemCount(1)}
            type="button"
          >
            <AiFillPlusCircle className="mr-1" size={20} />
            إضافة نوع جديد
          </button>

          <button
            className="my-5 flex items-center rounded border bg-blue-800 px-2 py-2 text-xs font-bold text-white shadow transition-all duration-300 ease-in-out hover:border-blue-800
             hover:bg-white hover:text-blue-800 sm:px-3 sm:text-sm"
            onClick={() => handleItemCount(-1)}
            type="button"
          >
            <AiFillMinusCircle className="mr-1" size={20} />
            حذف نوع مشترى
          </button>
        </div>

        <p className="my-4 rounded bg-red-800 p-2 text-lg font-bold text-white">
          [ تفــاصيل المشترى ]
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 px-5 py-5 font-semibold">
          <FormInput
            label="المبلغ الكــلى"
            name="totalPayment"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="number"
            value={purchaseDetails.total}
            onChange={(e) =>
              setPurchaseDetails({ ...purchaseDetails, total: +e.target.value })
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

        {/*Form Button */}
        <FormButton
          text={{ default: "حفظ المشترى", loading: "جارى الحفظ" }}
          isLoading={isLoading}
          icon={<RiSendPlaneFill className="mr-1" size={25} />}
        />
      </form>
    </section>
  );
};
