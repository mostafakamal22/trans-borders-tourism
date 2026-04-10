import { useState, useEffect } from "react";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { RiSendPlaneFill } from "react-icons/ri";
import { FormInput } from "../shared/FormInput";
import {
  BillData,
  useCreateBillMutation,
} from "../../state/features/bill/billApiSlice";
import {
  inputClassNamesStyles,
  lableClassNamesStyles,
} from "../invoice/constants";
import { useScroll } from "../../hooks/useScroll";
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
import {
  calculatePassportProfit,
  calculatePassportTotal,
} from "./CreatePassport";
import { PassportService, PassportState } from "../passport/types";
import { paymentMethods } from "../payment/constants";
import { PaymentMethods } from "../payment/types";
import { ticketsTableHeaderTitles } from "../ticket/constants";
import {
  calculateTicketProfit,
  calculateTicketTax,
  calculateTicketTotal,
} from "./CreateTicket";
import BillAlt from "../../assets/icons/invoice-alt.svg?react";
import FormButton from "../shared/FormButton";
import useDocumentTitle from "../../hooks/useDocumentTitle";

export default function CreateBill() {
  //state for Customer Details
  const [customerDetails, setCustomerDetails] = useState<IBillCustomer>({
    name: "",
  });

  //state for bill Details
  const [billDetails, setBillDetails] = useState({
    date: "",
    subtotal: 0,
    total: 0,
    taxRate: 0,
    taxDue: 0,
    taxable: 0,
    paymentMethod: "cash",
    other: "",
  });

  //state for items Details
  const [itemsDetails, setItemsDetails] = useState<
    (IBillProduct & {
      data?: {
        name?: string;
        nationality?: string;
        state?: string;
        service?: string;
        passportId?: string;
        paymentDate?: string;
        servicePrice?: number;
        taxable?: number;
        taxRate?: number;
        total?: number;
        sales?: number;
        profit?: number;
        type?: string;
        employee?: string;
        supplier?: string;
        paymentMethod?: string;
        cost?: number;
        paidAmount?: number;
        remainingAmount?: number;
      };
    })[]
  >([
    {
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
    },
  ]);

  //state for items
  const [itemsCount, setItemsCount] = useState(1);

  const [createBill, { isLoading, isSuccess }] = useCreateBillMutation();

  // Helper function to update item by index
  // const updateItemByIndex = (index: number, updates: any) => {
  //   const newItems = [...itemsDetails];
  //   newItems[index] = { ...newItems[index], ...updates };
  //   setItemsDetails(newItems);
  // };

  // Helper function to update item's data property by index
  const updateItemDataByIndex = (index: number, dataUpdates: any) => {
    const newItems = [...itemsDetails];
    newItems[index] = {
      ...newItems[index],
      data: { ...newItems[index].data, ...dataUpdates },
    };
    setItemsDetails(newItems);
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

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const details: (IBillProduct & { data?: any })[] = [
      ...itemsDetails.map((item) => ({
        ...item,
        desc:
          item.type === "Passport"
            ? item.data?.service === "90days" ||
              item.data?.service === "60days" ||
              item.data?.service === "30days"
              ? " فيزا " +
                passportService[item.data.service as keyof PassportService]
              : passportService[item.data?.service as keyof PassportService]
            : item.type === "Ticket"
            ? item.data?.type
            : item.desc,
        data:
          item.type === "Passport"
            ? {
                ...item.data,
                paymentDate: billDetails.date,
                paymentMethod: billDetails.paymentMethod,
              }
            : item.type === "Ticket"
            ? {
                ...item.data,
                paymentDate: billDetails.date,
                paymentMethod: billDetails.paymentMethod,
              }
            : null,
      })),
    ];

    const billData: BillData = {
      customer: { ...customerDetails },
      details: [...details],
      total: billDetails.total,
      date: billDetails.date,
      paymentMethod:
        billDetails.paymentMethod as IBillDocument["payment_method"],
      other: billDetails.other,
    };

    await createBill(billData);
  };

  useEffect(() => {
    if (isSuccess) {
      setCustomerDetails({
        name: "",
      });

      setBillDetails({
        date: "",
        subtotal: 0,
        total: 0,
        taxRate: 0,
        taxDue: 0,
        taxable: 0,
        paymentMethod: "cash",
        other: "",
      });

      setItemsDetails([
        {
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
        },
      ]);
      setItemsCount(1);
    }
  }, [isSuccess]);

  const paymentMethodsOptions = Object.keys(paymentMethods)
    .filter((pm) => pm !== "later")
    .map((method: string) => (
      <option key={method} value={method}>
        {paymentMethods[method as keyof PaymentMethods]}
      </option>
    ));

  useScroll("createBill");
  useDocumentTitle("إضافة فاتورة جديدة");

  return (
    <section id="createBill" className="w-full">
      <h3 className="mb-10 flex items-center justify-center rounded bg-red-800 px-2 py-4 text-center text-xl font-bold text-white shadow ">
        <BillAlt className="mr-1 h-16 w-16 drop-shadow" />
        <span>إضافة فاتورة جديدة</span>
      </h3>

      <form onSubmit={handleSubmit}>
        <p className="my-4 rounded bg-red-800 p-2 text-lg font-bold text-white">
          [ بيانات العميل ]
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 px-5 py-5 font-semibold">
          <FormInput
            label="الفاتورة للسيد/السيدة"
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
          [ تفاصيل الفاتورة ]
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
                        +billDetails.taxDue.toFixed(2) +
                        +billDetails.taxRate.toFixed(2) +
                        +billDetails.taxable.toFixed(2),
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
                    updateItemDataByIndex(index, { passportId: e.target.value })
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
                    const newServicePrice = +e.target.value;
                    const isChangeSituation =
                      item.data?.service === "change_situation";
                    const newSales = isChangeSituation
                      ? newServicePrice +
                        (item.data?.taxRate || 0) +
                        (item.data?.taxable || 0)
                      : 0;

                    const newArr = [...itemsDetails];
                    newArr[index] = {
                      ...newArr[index],
                      price: isChangeSituation ? newSales : newArr[index].price,
                      data: {
                        ...newArr[index].data,
                        servicePrice: newServicePrice,
                        sales: newSales,
                        total: newSales,
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
                    const newTaxable = +e.target.value;
                    const newTaxRate = +(newTaxable * 0.05).toFixed(2);
                    const newTotal = calculatePassportTotal({
                      sales: item.data?.sales || 0,
                      servicePrice: item.data?.servicePrice || 0,
                    });
                    const newProfit = +calculatePassportProfit({
                      sales: item.data?.sales || 0,
                      servicePrice: item.data?.servicePrice || 0,
                      taxable: newTaxable,
                    });

                    const newArr = [...itemsDetails];
                    newArr[index] = {
                      ...newArr[index],
                      data: {
                        ...newArr[index].data,
                        taxable: newTaxable,
                        taxRate: newTaxRate,
                        total: newTotal,
                        profit: newProfit,
                      },
                    };
                    setItemsDetails(newArr);

                    const newTotal2 = newArr.reduce(
                      (prev, curr) => prev + curr.price * curr.quantity,
                      0,
                    );

                    setBillDetails({
                      ...billDetails,
                      total: +newTotal2.toFixed(2),
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
                    const newSales = +e.target.value;
                    const newTotal = calculatePassportTotal({
                      sales: newSales,
                      servicePrice: item.data?.servicePrice || 0,
                    });
                    const newProfit = +calculatePassportProfit({
                      sales: newSales,
                      servicePrice: item.data?.servicePrice || 0,
                      taxable: item.data?.taxable || 0,
                    });

                    const newArr = [...itemsDetails];
                    newArr[index] = {
                      ...newArr[index],
                      price: newSales,
                      data: {
                        ...newArr[index].data,
                        sales: newSales,
                        total: newTotal,
                        profit: newProfit,
                      },
                    };
                    setItemsDetails(newArr);

                    const newTotal2 = newArr.reduce(
                      (prev, curr) => prev + curr.price * curr.quantity,
                      0,
                    );

                    setBillDetails({
                      ...billDetails,
                      total: +newTotal2.toFixed(2),
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
                    updateItemDataByIndex(index, { state: e.target.value })
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
                    updateItemDataByIndex(index, { service: e.target.value })
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
                    updateItemDataByIndex(index, { type: e.target.value })
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
                    updateItemDataByIndex(index, { employee: e.target.value })
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
                    const newSales = +e.target.value;
                    const newTotal = calculateTicketTotal({
                      sales: newSales,
                      cost: item.data?.cost || 0,
                    });
                    const newTaxable = calculateTicketTax({
                      sales: newSales,
                      cost: item.data?.cost || 0,
                    });
                    const newProfit = +calculateTicketProfit({
                      sales: newSales,
                      cost: item.data?.cost || 0,
                    });

                    const newArr = [...itemsDetails];
                    newArr[index] = {
                      ...newArr[index],
                      price: newSales,
                      data: {
                        ...newArr[index].data,
                        sales: newSales,
                        total: newTotal,
                        taxable: newTaxable,
                        profit: newProfit,
                        paidAmount: newSales,
                        remainingAmount: 0,
                      },
                    };
                    setItemsDetails(newArr);

                    const newTotal2 = newArr.reduce(
                      (prev, curr) => prev + curr.price * curr.quantity,
                      0,
                    );

                    setBillDetails({
                      ...billDetails,
                      total: +newTotal2.toFixed(2),
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
                    updateItemDataByIndex(index, { supplier: e.target.value })
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
          [ بيانات الفاتورة ]
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
          {/* <FormInput
            label="SubTotal"
            name="billSubTotal"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="number"
            value={billDetails.subtotal}
            onChange={(e) =>
              setBillDetails({
                ...billDetails,
                subtotal: +e.target.value,
                total:
                  +e.target.value +
                  +billDetails.taxDue.toFixed(2) +
                  +billDetails.taxRate.toFixed(2) +
                  +billDetails.taxable.toFixed(2),
              })
            }
            step="0.01"
            min={0}
            required
          />

          <FormInput
            label="Taxable"
            name="billTaxable"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="number"
            value={billDetails.taxable}
            onChange={(e) =>
              setBillDetails({
                ...billDetails,
                taxable: +e.target.value,
                total:
                  +e.target.value +
                  +billDetails.taxDue.toFixed(2) +
                  +billDetails.taxRate.toFixed(2) +
                  +billDetails.subtotal.toFixed(2),
              })
            }
            step="0.01"
            min={0}
            required
          />

          <FormInput
            label="Tax Rate"
            name="billTaxRate"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="number"
            value={billDetails.taxRate}
            onChange={(e) =>
              setBillDetails({
                ...billDetails,
                taxRate: +e.target.value,
                total:
                  +e.target.value +
                  +billDetails.taxDue.toFixed(2) +
                  +billDetails.subtotal.toFixed(2) +
                  +billDetails.taxable.toFixed(2),
              })
            }
            step="0.01"
            min={0}
            required
          />

          <FormInput
            label="Tax Due"
            name="billTaxDue"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="number"
            value={billDetails.taxDue}
            onChange={(e) =>
              setBillDetails({
                ...billDetails,
                taxDue: +e.target.value,
                total:
                  +e.target.value +
                  +billDetails.subtotal.toFixed(2) +
                  +billDetails.taxRate.toFixed(2) +
                  +billDetails.taxable.toFixed(2),
              })
            }
            step="0.01"
            min={0}
            required
          /> */}

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
              // setTicketDetails({
              //   ...ticketDetails,
              //   paymentMethod: e.target.value,
              // });
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
          text={{ default: "حفظ الفاتورة", loading: "جارى الحفظ" }}
          isLoading={isLoading}
          icon={<RiSendPlaneFill className="ml-1" size={25} />}
        />
      </form>
    </section>
  );
}
