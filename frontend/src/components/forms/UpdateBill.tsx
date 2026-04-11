import { useEffect, useState } from "react";
import {
  useGetOneBillQuery,
  useUpdateBillMutation,
} from "../../state/features/bill/billApiSlice";
import {
  IBillCustomer,
  IBillDocument,
  IBillProduct,
} from "../../../../backend/models/billModel";
import {
  passportService,
  passportState,
  passportTableHeaderTitles,
} from "../passport/constants";
import { PassportService, PassportState } from "../passport/types";
import { FormInput } from "../shared/FormInput";
import {
  inputClassNamesStyles,
  lableClassNamesStyles,
} from "../invoice/constants";
import {
  AiFillCloseCircle,
  AiFillMinusCircle,
  AiFillPlusCircle,
} from "react-icons/ai";
import { ticketsTableHeaderTitles } from "../ticket/constants";
import { paymentMethods } from "../payment/constants";
import { PaymentMethods } from "../payment/types";
import {
  calculatePassportProfit,
  calculatePassportTotal,
} from "./CreatePassport";
import dayjs from "dayjs";
import {
  closeBtnAnimationsOptions,
  modalAnimationOptions,
} from "../helpers/animationOptions";
import { motion } from "framer-motion";
import { RiSendPlaneFill } from "react-icons/ri";
import DataFetchingErrorMessage from "../shared/DataFetchingErrorMessage";
import DataFetchingSpinner from "../shared/DataFetchingSpinner";
import {
  calculateTicketProfit,
  calculateTicketTax,
  calculateTicketTotal,
} from "./CreateTicket";
import FormButton from "../shared/FormButton";
import BillAlt from "../../assets/icons/invoice-alt.svg?react";

export const UpdateBill = ({
  id,
  setIsOpen,
}: {
  id: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // Initial state
  const initialCustomerDetails = { name: "" };

  const initialBillDetails = {
    date: "",
    subtotal: 0,
    total: 0,
    taxRate: 0,
    taxDue: 0,
    taxable: 0,
    paymentMethod: "cash",
    other: "",
  };

  const initialItemsDetails: IBillProduct[] = [];

  // const initialPassportDetails = {
  //   name: "",
  //   nationality: "",
  //   state: "accepted",
  //   service: "30days",
  //   passportId: "",
  //   paymentDate: "",
  //   servicePrice: 0,
  //   taxable: 53,
  //   taxRate: 2.65,
  //   total: 0,
  //   sales: 0,
  //   profit: 0,
  // };

  // const initialTicketDetails = {
  //   name: "",
  //   type: "",
  //   employee: "",
  //   supplier: "",
  //   paymentDate: "",
  //   paymentMethod: "cash",
  //   cost: 0,
  //   total: 0,
  //   taxable: 0,
  //   sales: 0,
  //   profit: 0,
  //   paidAmount: 0,
  //   remainingAmount: 0,
  // };

  // Data fetching
  const { data: foundBill, isLoading, error } = useGetOneBillQuery({ id });

  // State for Customer Details
  const [customerDetails, setCustomerDetails] = useState<IBillCustomer>(
    initialCustomerDetails,
  );

  // State for Bill Details
  const [billDetails, setBillDetails] = useState(initialBillDetails);

  // State for Items Details
  const [itemsDetails, setItemsDetails] =
    useState<IBillProduct[]>(initialItemsDetails);

  //state for items
  const [itemsCount, setItemsCount] = useState(1);

  // Helper function to update item data by index
  const updateItemDataByIndex = (index: number, dataUpdates: any) => {
    const newArr = [...itemsDetails];
    if (!newArr[index].data) {
      newArr[index].data = {};
    }
    newArr[index].data = { ...newArr[index].data, ...dataUpdates };
    setItemsDetails(newArr);
  };

  const handleItemCount = async (num: number) => {
    if (num < 0 && itemsCount === 1) return;

    setItemsCount(itemsCount + num);

    let newItem: any;

    // Determine what type to add based on the last item
    const lastItem = itemsDetails[itemsDetails.length - 1];
    const typeToAdd = lastItem?.type || "Other";

    if (typeToAdd === "Passport") {
      newItem = {
        type: "Passport",
        desc: "",
        price: 0,
        quantity: 1,
        data: {
          name: "",
          nationality: "",
          state: "accepted",
          service: "30days",
          passportId: "",
          paymentDate: "",
          servicePrice: 0,
          taxable: 53,
          taxRate: 2.65,
          total: 0,
          sales: 0,
          profit: 0,
        },
      };
    } else if (typeToAdd === "Ticket") {
      newItem = {
        type: "Ticket",
        desc: "",
        price: 0,
        quantity: 1,
        data: {
          name: "",
          type: "",
          employee: "",
          supplier: "",
          paymentDate: "",
          paymentMethod: "cash",
          cost: 0,
          total: 0,
          taxable: 0,
          sales: 0,
          profit: 0,
          paidAmount: 0,
          remainingAmount: 0,
        },
      };
    } else {
      newItem = {
        type: "Other",
        desc: "",
        price: 0,
        quantity: 1,
      };
    }

    const newItems =
      num > 0
        ? [...itemsDetails, newItem]
        : itemsDetails.slice(0, itemsDetails.length - 1);

    setItemsDetails(newItems);

    const newTotal = newItems.reduce(
      (prev, curr) => prev + curr.price * curr.quantity,
      0,
    );

    setBillDetails({
      ...billDetails,
      total: +newTotal.toFixed(2),
    });
  };

  const [updateBill, { isLoading: isUpdating }] = useUpdateBillMutation();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const details: (IBillProduct & { data?: any })[] = [
      ...itemsDetails.map((item) => {
        const itemData = item.data || {};

        // Remove unwanted refs based on type
        let cleanedItem;

        if (item.type === "Passport") {
          const { ticket_ref, ...rest } = item as any;
          cleanedItem = rest;
        } else if (item.type === "Ticket") {
          const { passport_ref, ...rest } = item as any;
          cleanedItem = rest;
        } else {
          // Other service type, remove both refs if they exist
          const { passport_ref, ticket_ref, ...rest } = item as any;
          cleanedItem = rest;
        }

        return {
          ...cleanedItem,
          desc:
            item.type === "Passport"
              ? itemData.service === "90days" ||
                itemData.service === "60days" ||
                itemData.service === "30days"
                ? " فيزا " +
                  passportService[itemData.service as keyof PassportService]
                : passportService[itemData.service as keyof PassportService]
              : item.type === "Ticket"
              ? itemData.type
              : item.desc,
          data:
            item.type === "Passport" || item.type === "Ticket"
              ? {
                  ...itemData,
                  paymentDate: billDetails.date,
                  paymentMethod: billDetails.paymentMethod,
                }
              : null,
        };
      }),
    ];

    const billData: Partial<IBillDocument> = {
      id,
      customer: { ...customerDetails },
      details: [...details],
      total: billDetails.total,
      date: billDetails.date,
      payment_method:
        billDetails.paymentMethod as IBillDocument["payment_method"],
      other: billDetails.other,
    };

    await updateBill(billData);
  };

  //Initialize state after data is fetched
  useEffect(() => {
    if (foundBill) {
      //Make a deep copy of the bill object
      const billStringify = JSON.stringify(foundBill);
      const bill = JSON.parse(billStringify);

      //Customer Details
      setCustomerDetails({
        name: bill?.customer?.name,
      });

      //bill Details
      setBillDetails({
        date: bill?.date ? dayjs(bill?.date).format("YYYY-MM-DD") : "",
        subtotal: bill?.subtotal,
        total: bill?.total,
        taxRate: bill?.tax_rate || 0,
        taxDue: bill?.tax_due || 0,
        taxable: bill?.taxable || 0,
        paymentMethod: bill?.payment_method || "cash",
        other: bill?.other,
      });

      //items Details - with proper data initialization
      const itemsWithData = bill.details.map((item: any) => ({
        ...item,
        data: item.data || {},
      }));
      setItemsDetails(itemsWithData);
      setItemsCount(itemsWithData.length);
    }
  }, [foundBill]);

  useEffect(() => {
    //scroll page back to top when component first mount
    const yOffset = window.scrollY;
    window.scrollBy(0, -yOffset);
  }, []);

  //Show Error Message if could not fetch data
  if (error) {
    return <DataFetchingErrorMessage />;
  }

  //Show spinner when Loading State is true
  if (!foundBill || isLoading) return <DataFetchingSpinner />;

  const paymentMethodsOptions = Object.keys(paymentMethods)
    .filter((pm) => pm !== "later")
    .map((method: string) => (
      <option key={method} value={method}>
        {paymentMethods[method as keyof PaymentMethods]}
      </option>
    ));

  return (
    <div className="fixed inset-0 z-50  h-screen w-full overflow-y-auto overflow-x-hidden bg-black/75 scrollbar-thin scrollbar-track-transparent  scrollbar-thumb-gray-400 scrollbar-track-rounded-full md:inset-0">
      <motion.button
        {...closeBtnAnimationsOptions}
        className="fixed right-[5%] top-5 inline-flex items-center rounded border border-transparent bg-red-800 px-2  py-2 text-xs font-bold text-white shadow transition-all duration-300 ease-in-out hover:border-red-800
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
          <BillAlt className="mr-1 h-16 w-16 drop-shadow" />
          <span>تعديل الفاتورة</span>
        </h3>

        <form onSubmit={handleSubmit}>
          <p className="my-4 rounded bg-red-800 p-2 text-lg font-bold text-white">
            [ بيانات العميل ]
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 px-5 py-5 font-semibold">
            <FormInput
              label="إسم العميل"
              name="customerName"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="text"
              value={customerDetails.name}
              onChange={(e) =>
                setCustomerDetails({ ...customerDetails, name: e.target.value })
              }
              required
            />
          </div>

          <p className="my-4 rounded bg-red-800 p-2 text-lg font-bold text-white">
            [ تفاصيل الفاتورة الحالية]
          </p>
          {itemsDetails.map((item, index) => (
            <div
              key={index}
              className="flex flex-wrap items-center justify-center gap-4 border-b-4 border-red-700 px-5 py-5 font-semibold"
            >
              <select
                name={`itemType${index}`}
                id={`itemType${index}`}
                className={inputClassNamesStyles.default}
                value={item.type}
                onChange={(e) => {
                  const newType = e.target.value as
                    | "Passport"
                    | "Ticket"
                    | "Other";
                  const newArr = [...itemsDetails];
                  newArr[index].type = newType;

                  // Reset data based on new type
                  if (newType === "Passport") {
                    newArr[index].data = {
                      name: "",
                      nationality: "",
                      state: "accepted",
                      service: "30days",
                      passportId: "",
                      paymentDate: "",
                      servicePrice: 0,
                      taxable: 53,
                      taxRate: 2.65,
                      total: 0,
                      sales: 0,
                      profit: 0,
                    };
                  } else if (newType === "Ticket") {
                    newArr[index].data = {
                      name: "",
                      type: "",
                      employee: "",
                      supplier: "",
                      paymentDate: "",
                      paymentMethod: "cash",
                      cost: 0,
                      total: 0,
                      taxable: 0,
                      sales: 0,
                      profit: 0,
                      paidAmount: 0,
                      remainingAmount: 0,
                    };
                  } else {
                    newArr[index].data = undefined;
                  }
                  newArr[index].price = 0;
                  setItemsDetails(newArr);
                }}
              >
                {["Passport", "Ticket", "Other"].map((name: string) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>

              <label
                htmlFor={`itemType${index}`}
                className={lableClassNamesStyles.default}
              >
                {"نوع الخدمة"}
              </label>

              {itemsDetails[index].type === "Other" && (
                <>
                  <FormInput
                    label="وصف الخدمة"
                    name={`itemName${index}`}
                    labeClassNames={lableClassNamesStyles.default}
                    className={inputClassNamesStyles.default}
                    type="text"
                    value={item.desc}
                    onChange={(e) => {
                      const newArr = [...itemsDetails];
                      newArr[index].desc = e.target.value;
                      setItemsDetails(newArr);
                    }}
                  />

                  <FormInput
                    label="الكمية"
                    name={`itemQuantity${index}`}
                    labeClassNames={lableClassNamesStyles.default}
                    className={inputClassNamesStyles.default}
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      const newArr = [...itemsDetails];
                      newArr[index].quantity = +e.target.value;
                      setItemsDetails(newArr);

                      const newSubTotal = itemsDetails.reduce(
                        (prev, curr) => prev + curr.price * curr.quantity,
                        0,
                      );
                      setBillDetails({
                        ...billDetails,
                        subtotal: +newSubTotal.toFixed(2),
                        total:
                          +newSubTotal.toFixed(2) +
                          +billDetails.taxDue?.toFixed(2) +
                          +billDetails.taxRate?.toFixed(2) +
                          +billDetails.taxable?.toFixed(2),
                      });
                    }}
                    min={1}
                    required
                  />

                  <FormInput
                    label="سعر الخدمة"
                    name={`itemPrice${index}`}
                    labeClassNames={lableClassNamesStyles.default}
                    className={inputClassNamesStyles.default}
                    type="number"
                    value={item.price}
                    onChange={(e) => {
                      const newArr = [...itemsDetails];
                      newArr[index].price = +e.target.value;
                      setItemsDetails(newArr);

                      const newTotal = itemsDetails.reduce(
                        (prev, curr) => prev + curr.price * curr.quantity,
                        0,
                      );
                      setBillDetails({
                        ...billDetails,

                        total: +newTotal.toFixed(2),
                      });
                    }}
                    min={0}
                    step={0.01}
                    required
                  />
                </>
              )}

              {item.type === "Passport" && (
                <>
                  <FormInput
                    label={passportTableHeaderTitles[0]}
                    name="customerName"
                    labeClassNames={lableClassNamesStyles.default}
                    className={inputClassNamesStyles.default}
                    type="text"
                    value={item.data?.name || ""}
                    onChange={(e) =>
                      updateItemDataByIndex(index, {
                        name: e.target.value,
                      })
                    }
                    required
                  />
                  <FormInput
                    label={passportTableHeaderTitles[1]}
                    name="customerNationality"
                    labeClassNames={lableClassNamesStyles.default}
                    className={inputClassNamesStyles.default}
                    type="text"
                    value={item.data?.nationality || ""}
                    onChange={(e) =>
                      updateItemDataByIndex(index, {
                        nationality: e.target.value,
                      })
                    }
                  />

                  <FormInput
                    label={passportTableHeaderTitles[2]}
                    name="passportId"
                    labeClassNames={lableClassNamesStyles.default}
                    className={inputClassNamesStyles.default}
                    type="text"
                    value={item.data?.passportId || ""}
                    onChange={(e) =>
                      updateItemDataByIndex(index, {
                        passportId: e.target.value,
                      })
                    }
                    required
                  />

                  <FormInput
                    label={passportTableHeaderTitles[5]}
                    name="servicePrice"
                    labeClassNames={lableClassNamesStyles.default}
                    className={inputClassNamesStyles.default}
                    type="number"
                    value={item.data?.servicePrice || 0}
                    onChange={(e) => {
                      const priceValue = +e.target.value;
                      const isChangeSituation =
                        item.data?.service === "change_situation";
                      const newPrice = isChangeSituation
                        ? priceValue +
                          (item.data?.taxRate || 0) +
                          (item.data?.taxable || 0)
                        : 0;

                      const newArr = [...itemsDetails];
                      newArr[index] = {
                        ...newArr[index],
                        price: newPrice,
                        data: {
                          ...newArr[index].data,
                          servicePrice: priceValue,
                          sales: newPrice,
                          total: newPrice,
                          profit: 0,
                        },
                      };
                      setItemsDetails(newArr);

                      const newTotal = newArr.reduce(
                        (prev, curr) => prev + curr.price * curr.quantity,
                        0,
                      );

                      setBillDetails({
                        ...billDetails,
                        total: +newTotal.toFixed(2),
                      });
                    }}
                    min={0}
                    step={0.01}
                  />

                  <FormInput
                    label={passportTableHeaderTitles[7]}
                    name="taxable"
                    labeClassNames={lableClassNamesStyles.default}
                    className={`${inputClassNamesStyles.default}`}
                    type="number"
                    value={item.data?.taxable || 0}
                    min={0}
                    step={0.01}
                    onChange={(e) => {
                      const taxableValue = +e.target.value;
                      const newTaxRate = +(taxableValue * 0.05).toFixed(2);
                      const newTotal = calculatePassportTotal({
                        sales: item.data?.sales || 0,
                        servicePrice: item.data?.servicePrice || 0,
                      });
                      const newProfit = +calculatePassportProfit({
                        sales: item.data?.sales || 0,
                        servicePrice: item.data?.servicePrice || 0,
                        taxable: taxableValue,
                      });

                      const newArr = [...itemsDetails];
                      newArr[index] = {
                        ...newArr[index],
                        data: {
                          ...newArr[index].data,
                          taxable: taxableValue,
                          taxRate: newTaxRate,
                          total: newTotal,
                          profit: newProfit,
                        },
                      };
                      setItemsDetails(newArr);

                      const billTotal = newArr.reduce(
                        (prev, curr) => prev + curr.price * curr.quantity,
                        0,
                      );

                      setBillDetails({
                        ...billDetails,
                        total: +billTotal.toFixed(2),
                      });
                    }}
                  />

                  <FormInput
                    label={passportTableHeaderTitles[6]}
                    name="taxRate"
                    labeClassNames={lableClassNamesStyles.default}
                    className={`${inputClassNamesStyles.default} bg-slate-200`}
                    type="number"
                    value={item.data?.taxRate || 0}
                    disabled
                    min={0}
                    step={0.01}
                  />

                  <FormInput
                    label={passportTableHeaderTitles[8]}
                    name="totalPayment"
                    labeClassNames={lableClassNamesStyles.default}
                    className={`${inputClassNamesStyles.default} bg-slate-200`}
                    type="number"
                    value={item.data?.total || 0}
                    disabled
                    min={0}
                    step={0.01}
                  />

                  <FormInput
                    label={passportTableHeaderTitles[10]}
                    name="sales"
                    labeClassNames={lableClassNamesStyles.default}
                    className={inputClassNamesStyles.default}
                    type="number"
                    value={item.data?.sales || 0}
                    onChange={(e) => {
                      const salesValue = +e.target.value;
                      const newTotal = calculatePassportTotal({
                        sales: salesValue,
                        servicePrice: item.data?.servicePrice || 0,
                      });
                      const newProfit = +calculatePassportProfit({
                        sales: salesValue,
                        servicePrice: item.data?.servicePrice || 0,
                        taxable: item.data?.taxable || 0,
                      });

                      const newArr = [...itemsDetails];
                      newArr[index] = {
                        ...newArr[index],
                        price: salesValue,
                        data: {
                          ...newArr[index].data,
                          sales: salesValue,
                          total: newTotal,
                          profit: newProfit,
                        },
                      };
                      setItemsDetails(newArr);

                      const billTotal = newArr.reduce(
                        (prev, curr) => prev + curr.price * curr.quantity,
                        0,
                      );

                      setBillDetails({
                        ...billDetails,
                        total: +billTotal.toFixed(2),
                      });
                    }}
                    min={0}
                    step={0.01}
                  />

                  <FormInput
                    label={passportTableHeaderTitles[11]}
                    name="profit"
                    labeClassNames={lableClassNamesStyles.default}
                    className={`${inputClassNamesStyles.default} bg-slate-200`}
                    type="number"
                    value={item.data?.profit || 0}
                    disabled
                    min={0}
                    step={0.01}
                  />

                  <select
                    name="state"
                    id="state"
                    className={inputClassNamesStyles.default}
                    value={item.data?.state || "accepted"}
                    onChange={(e) =>
                      updateItemDataByIndex(index, {
                        state: e.target.value,
                      })
                    }
                  >
                    {Object.keys(passportState).map((name: string) => (
                      <option key={name} value={name}>
                        {passportState[name as keyof PassportState][0]}
                      </option>
                    ))}
                  </select>

                  <label
                    htmlFor="state"
                    className={lableClassNamesStyles.default}
                  >
                    {passportTableHeaderTitles[3]}
                  </label>

                  <select
                    name="service"
                    id="service"
                    className={inputClassNamesStyles.default}
                    value={item.data?.service || "30days"}
                    onChange={(e) =>
                      updateItemDataByIndex(index, {
                        service: e.target.value,
                      })
                    }
                  >
                    {Object.keys(passportService).map((name: string) => (
                      <option key={name} value={name}>
                        {passportService[name as keyof PassportService]}
                      </option>
                    ))}
                  </select>
                  <label
                    htmlFor="service"
                    className={lableClassNamesStyles.default}
                  >
                    {passportTableHeaderTitles[4]}
                  </label>
                </>
              )}

              {item.type === "Ticket" && (
                <>
                  <FormInput
                    label={ticketsTableHeaderTitles[0]}
                    name="customerName"
                    labeClassNames={lableClassNamesStyles.default}
                    className={inputClassNamesStyles.default}
                    type="text"
                    value={item.data?.name || ""}
                    onChange={(e) =>
                      updateItemDataByIndex(index, { name: e.target.value })
                    }
                    required
                  />

                  <FormInput
                    label={ticketsTableHeaderTitles[1]}
                    name="type"
                    labeClassNames={lableClassNamesStyles.default}
                    className={inputClassNamesStyles.default}
                    type="text"
                    value={item.data?.type || ""}
                    onChange={(e) =>
                      updateItemDataByIndex(index, {
                        type: e.target.value,
                      })
                    }
                  />

                  <FormInput
                    label={ticketsTableHeaderTitles[2]}
                    name="اسم الموظف"
                    labeClassNames={lableClassNamesStyles.default}
                    className={inputClassNamesStyles.default}
                    type="text"
                    value={item.data?.employee || ""}
                    onChange={(e) =>
                      updateItemDataByIndex(index, {
                        employee: e.target.value,
                      })
                    }
                  />

                  <FormInput
                    label={ticketsTableHeaderTitles[3]}
                    name="cost"
                    labeClassNames={lableClassNamesStyles.default}
                    className={inputClassNamesStyles.default}
                    type="number"
                    value={item.data?.cost || 0}
                    onChange={(e) =>
                      updateItemDataByIndex(index, {
                        cost: +e.target.value,
                        total: 0,
                        taxable: 0,
                        sales: 0,
                        profit: 0,
                      })
                    }
                    min={0}
                    step={0.01}
                  />

                  <FormInput
                    label={ticketsTableHeaderTitles[4]}
                    name="total"
                    labeClassNames={lableClassNamesStyles.default}
                    className={`${inputClassNamesStyles.default} bg-slate-200`}
                    type="number"
                    value={item.data?.total || 0}
                    disabled
                    min={0}
                    step={0.01}
                  />

                  <FormInput
                    label={ticketsTableHeaderTitles[5]}
                    name="taxable"
                    labeClassNames={lableClassNamesStyles.default}
                    className={`${inputClassNamesStyles.default} bg-slate-200`}
                    type="number"
                    value={item.data?.taxable || 0}
                    disabled
                    min={0}
                    step={0.01}
                  />

                  <FormInput
                    label={ticketsTableHeaderTitles[6]}
                    name="sales"
                    labeClassNames={lableClassNamesStyles.default}
                    className={inputClassNamesStyles.default}
                    type="number"
                    value={item.data?.sales || 0}
                    onChange={(e) => {
                      const salesValue = +e.target.value;
                      const newTotal = calculateTicketTotal({
                        sales: salesValue,
                        cost: item.data?.cost || 0,
                      });
                      const newTaxable = calculateTicketTax({
                        sales: salesValue,
                        cost: item.data?.cost || 0,
                      });
                      const newProfit = +calculateTicketProfit({
                        sales: salesValue,
                        cost: item.data?.cost || 0,
                      });

                      const newArr = [...itemsDetails];
                      newArr[index] = {
                        ...newArr[index],
                        price: salesValue,
                        data: {
                          ...newArr[index].data,
                          sales: salesValue,
                          total: newTotal,
                          taxable: newTaxable,
                          profit: newProfit,
                          paidAmount: salesValue,
                          remainingAmount: 0,
                        },
                      };
                      setItemsDetails(newArr);

                      const billTotal = newArr.reduce(
                        (prev, curr) => prev + curr.price * curr.quantity,
                        0,
                      );

                      setBillDetails({
                        ...billDetails,
                        total: +billTotal.toFixed(2),
                      });
                    }}
                    min={0}
                    step={0.01}
                  />

                  <FormInput
                    label={ticketsTableHeaderTitles[7]}
                    name="profit"
                    labeClassNames={lableClassNamesStyles.default}
                    className={`${inputClassNamesStyles.default} bg-slate-200`}
                    type="number"
                    value={item.data?.profit || 0}
                    disabled
                    min={0}
                    step={0.01}
                  />

                  <FormInput
                    label={"Paid Amount"}
                    name="paidAmount"
                    labeClassNames={lableClassNamesStyles.default}
                    className={inputClassNamesStyles.default}
                    type="number"
                    value={item.data?.paidAmount || 0}
                    onChange={(e) =>
                      updateItemDataByIndex(index, {
                        paidAmount: +e.target.value,
                        remainingAmount:
                          (item.data?.sales || 0) - +e.target.value,
                      })
                    }
                    min={0}
                    step={0.01}
                  />

                  <FormInput
                    label={"Remaining Amount"}
                    name="remainingAmount"
                    labeClassNames={lableClassNamesStyles.default}
                    className={`${inputClassNamesStyles.default} bg-slate-200`}
                    type="number"
                    value={item.data?.remainingAmount || 0}
                    disabled
                    min={0}
                    step={0.01}
                  />

                  {/* <select
                                  name="paymentMethod"
                                  id="paymentMethod"
                                  className={inputClassNamesStyles.default}
                                  value={ticketDetails.paymentMethod}
                                  onChange={(e) =>
                                    setTicketDetails({
                                      ...ticketDetails,
                                      paymentMethod: e.target.value,
                                    })
                                  }
                                >
                                  {Object.keys(paymentMethods)
                                    .filter((pm) => pm !== "later")
                                    .map((method: string) => (
                                      <option key={method} value={method}>
                                        {paymentMethods[method as keyof PaymentMethods]}
                                      </option>
                                    ))}
                                </select>
                
                                <label
                                  htmlFor="paymentMethod"
                                  className={lableClassNamesStyles.default}
                                >
                                  {"Payment Method"}
                                </label> */}

                  <FormInput
                    label={ticketsTableHeaderTitles[8]}
                    name="supplier"
                    labeClassNames={lableClassNamesStyles.default}
                    className={inputClassNamesStyles.default}
                    type="text"
                    value={item.data?.supplier || ""}
                    onChange={(e) =>
                      updateItemDataByIndex(index, {
                        supplier: e.target.value,
                      })
                    }
                  />
                </>
              )}
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
              إضافة نوع
            </button>

            <button
              className="my-5 flex items-center rounded border bg-red-800 px-2 py-2 text-xs font-bold text-white shadow transition-all duration-300 ease-in-out hover:border-red-800
         hover:bg-white hover:text-red-800 sm:px-3 sm:text-sm"
              onClick={() => handleItemCount(-1)}
              type="button"
            >
              <AiFillMinusCircle className="mr-1" size={20} />
              حذف نوع
            </button>
          </div>

          <p className="my-4 rounded bg-red-800 p-2 text-lg font-bold text-white">
            [ بيانات الفاتورة الحالية ]
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 px-5 py-5 font-semibold">
            <FormInput
              label="تاريخ الفاتورة"
              name="billDate"
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="date"
              value={billDetails.date}
              onChange={(e) =>
                setBillDetails({ ...billDetails, date: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-10 flex flex-wrap items-center justify-center gap-4 px-5 py-5 font-semibold">
            <FormInput
              label="Total"
              name="billTotal"
              labeClassNames={lableClassNamesStyles.default}
              className={`${inputClassNamesStyles.default} bg-slate-200`}
              type="number"
              value={billDetails.total}
              disabled
              step="0.01"
              min={0}
              required
            />

            <select
              name="paymentMethod"
              id="paymentMethod"
              className={inputClassNamesStyles.default}
              value={billDetails.paymentMethod}
              onChange={(e) => {
                setBillDetails({
                  ...billDetails,
                  paymentMethod: e.target.value,
                });
              }}
            >
              {paymentMethodsOptions}
            </select>

            <label
              htmlFor="paymentMethod"
              className={lableClassNamesStyles.default}
            >
              {"Payment Method"}
            </label>

            <textarea
              className={inputClassNamesStyles.default}
              name="other"
              id="other"
              value={billDetails.other}
              onChange={(e) =>
                setBillDetails({ ...billDetails, other: e.target.value })
              }
            />
            <label className={lableClassNamesStyles.default} htmlFor="other">
              Other Comments
            </label>
          </div>

          {/*form button */}
          <FormButton
            text={{ default: "تعديل الفاتورة", loading: "جارى الحفظ" }}
            isLoading={isUpdating}
            icon={<RiSendPlaneFill className="ml-1" size={25} />}
          />
        </form>
      </motion.div>
    </div>
  );
};
