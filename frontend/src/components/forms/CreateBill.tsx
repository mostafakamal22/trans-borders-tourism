import { useState, useEffect } from "react";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { ReactComponent as BillAlt } from "../../assets/icons/invoice-alt.svg";
import { RiSendPlaneFill } from "react-icons/ri";
import FormButton from "../shared/FormButton";
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
import useDocumentTitle from "../../hooks/useDocumentTitle";
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
  const [itemsDetails, setItemsDetails] = useState<IBillProduct[]>([
    {
      type: "Passport",
      desc: "",
      price: 0,
      quantity: 1,
    },
  ]);

  //state for Passport type
  const [passportDetails, setPassportDetails] = useState({
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
  });

  //state for Ticket Details
  const [ticketDetails, setTicketDetails] = useState({
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
  });

  //state for items
  const [itemsCount, setItemsCount] = useState(1);

  const [createBill, { isLoading, isSuccess }] = useCreateBillMutation();

  const handleItemCount = async (num: number) => {
    if (num < 0 && itemsCount === 1) return;

    setItemsCount(itemsCount + num);

    const newItems =
      num > 0
        ? [
            ...itemsDetails,
            {
              type: "Other",
              desc: "",
              price: 0,
              quantity: 1,
            } as IBillProduct,
          ]
        : itemsDetails.splice(0, itemsDetails.length - 1);

    setItemsDetails(newItems);

    const newTotal = newItems.reduce(
      (prev, curr) => prev + curr.price * curr.quantity,
      0
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
            ? passportDetails.service === "90days" ||
              passportDetails.service === "60days" ||
              passportDetails.service === "30days"
              ? " فيزا " + passportService[passportDetails.service]
              : passportService[
                  passportDetails.service as keyof PassportService
                ]
            : item.type === "Ticket"
            ? ticketDetails.type
            : item.desc,
        data:
          item.type === "Passport"
            ? {
                ...passportDetails,
                name: customerDetails.name,
                paymentDate: billDetails.date,
              }
            : item.type === "Ticket"
            ? {
                ...ticketDetails,
                name: customerDetails.name,
                paymentDate: billDetails.date,
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
        },
      ]);
      setPassportDetails({
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
      });

      //Set Ticket Inputs To Default
      setTicketDetails({
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
      });
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
                const newArr = [...itemsDetails];
                newArr[index].type = e.target.value as
                  | "Passport"
                  | "Ticket"
                  | "Other";
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
                      0
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
                      0
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
                  label={passportTableHeaderTitles[1]}
                  name="customerNationality"
                  labeClassNames={lableClassNamesStyles.default}
                  className={inputClassNamesStyles.default}
                  type="text"
                  value={passportDetails.nationality}
                  onChange={(e) =>
                    setPassportDetails({
                      ...passportDetails,
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
                  value={passportDetails.passportId}
                  onChange={(e) =>
                    setPassportDetails({
                      ...passportDetails,
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
                  value={passportDetails.servicePrice}
                  onChange={(e) => {
                    setPassportDetails({
                      ...passportDetails,
                      servicePrice: +e.target.value,
                      sales:
                        passportDetails.service === "change_situation"
                          ? +e.target.value +
                            passportDetails.taxRate +
                            passportDetails.taxable
                          : 0,
                      total:
                        passportDetails.service === "change_situation"
                          ? +e.target.value +
                            passportDetails.taxRate +
                            passportDetails.taxable
                          : 0,
                      profit: 0,
                    });

                    const newArr = [...itemsDetails];
                    newArr[index].price =
                      passportDetails.service === "change_situation"
                        ? +e.target.value +
                          passportDetails.taxRate +
                          passportDetails.taxable
                        : newArr[index].price;

                    setItemsDetails(newArr);

                    const newTotal = itemsDetails.reduce(
                      (prev, curr) => prev + curr.price * curr.quantity,
                      0
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
                  value={passportDetails.taxable}
                  min={0}
                  step={0.01}
                  onChange={(e) => {
                    setPassportDetails({
                      ...passportDetails,
                      taxable: +e.target.value,
                      taxRate: +(+e.target.value * 0.05).toFixed(2),
                      total: calculatePassportTotal({
                        sales: passportDetails.sales,
                        servicePrice: passportDetails.servicePrice,
                      }),
                      profit: +calculatePassportProfit({
                        sales: passportDetails.sales,
                        servicePrice: passportDetails.servicePrice,
                        taxable: +e.target.value,
                      }),
                    });

                    const newArr = [...itemsDetails];

                    setItemsDetails(newArr);

                    const newTotal = itemsDetails.reduce(
                      (prev, curr) => prev + curr.price * curr.quantity,
                      0
                    );

                    setBillDetails({
                      ...billDetails,
                      total: +newTotal.toFixed(2),
                    });
                  }}
                />

                <FormInput
                  label={passportTableHeaderTitles[6]}
                  name="taxRate"
                  labeClassNames={lableClassNamesStyles.default}
                  className={`${inputClassNamesStyles.default} bg-slate-200`}
                  type="number"
                  value={passportDetails.taxRate}
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
                  value={passportDetails.total}
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
                  value={passportDetails.sales}
                  onChange={(e) => {
                    setPassportDetails({
                      ...passportDetails,
                      total: calculatePassportTotal({
                        sales: +e.target.value,
                        servicePrice: passportDetails.servicePrice,
                      }),
                      sales: +e.target.value,
                      profit: +calculatePassportProfit({
                        sales: +e.target.value,
                        servicePrice: passportDetails.servicePrice,
                        taxable: passportDetails.taxable,
                      }),
                    });

                    const newArr = [...itemsDetails];
                    (newArr[index].price = +e.target.value),
                      setItemsDetails(newArr);

                    const newTotal = itemsDetails.reduce(
                      (prev, curr) => prev + curr.price * curr.quantity,
                      0
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
                  label={passportTableHeaderTitles[11]}
                  name="profit"
                  labeClassNames={lableClassNamesStyles.default}
                  className={`${inputClassNamesStyles.default} bg-slate-200`}
                  type="number"
                  value={passportDetails.profit}
                  disabled
                  min={0}
                  step={0.01}
                />

                <select
                  name="state"
                  id="state"
                  className={inputClassNamesStyles.default}
                  value={passportDetails.state}
                  onChange={(e) =>
                    setPassportDetails({
                      ...passportDetails,
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
                  value={passportDetails.service}
                  onChange={(e) =>
                    setPassportDetails({
                      ...passportDetails,
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
                  label={ticketsTableHeaderTitles[1]}
                  name="type"
                  labeClassNames={lableClassNamesStyles.default}
                  className={inputClassNamesStyles.default}
                  type="text"
                  value={ticketDetails.type}
                  onChange={(e) =>
                    setTicketDetails({
                      ...ticketDetails,
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
                  value={ticketDetails.employee}
                  onChange={(e) =>
                    setTicketDetails({
                      ...ticketDetails,
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
                  value={ticketDetails.cost}
                  onChange={(e) =>
                    setTicketDetails({
                      ...ticketDetails,
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
                  value={ticketDetails.total}
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
                  value={ticketDetails.taxable}
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
                  value={ticketDetails.sales}
                  onChange={(e) => {
                    setTicketDetails({
                      ...ticketDetails,
                      sales: +e.target.value,
                      total: calculateTicketTotal({
                        sales: +e.target.value,
                        cost: ticketDetails.cost,
                      }),
                      taxable: calculateTicketTax({
                        sales: +e.target.value,
                        cost: ticketDetails.cost,
                      }),
                      profit: +calculateTicketProfit({
                        sales: +e.target.value,
                        cost: ticketDetails.cost,
                      }),
                      paidAmount: +e.target.value,
                      remainingAmount: 0,
                    });

                    const newArr = [...itemsDetails];
                    (newArr[index].price = +e.target.value),
                      setItemsDetails(newArr);

                    const newTotal = itemsDetails.reduce(
                      (prev, curr) => prev + curr.price * curr.quantity,
                      0
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
                  label={ticketsTableHeaderTitles[7]}
                  name="profit"
                  labeClassNames={lableClassNamesStyles.default}
                  className={`${inputClassNamesStyles.default} bg-slate-200`}
                  type="number"
                  value={ticketDetails.profit}
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
                  value={ticketDetails.paidAmount}
                  onChange={(e) =>
                    setTicketDetails({
                      ...ticketDetails,
                      paidAmount: +e.target.value,
                      remainingAmount: ticketDetails.sales - +e.target.value,
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
                  value={ticketDetails.remainingAmount}
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
                  value={ticketDetails.supplier}
                  onChange={(e) =>
                    setTicketDetails({
                      ...ticketDetails,
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
              setTicketDetails({
                ...ticketDetails,
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
          text={{ default: "حفظ الفاتورة", loading: "جارى الحفظ" }}
          isLoading={isLoading}
          icon={<RiSendPlaneFill className="ml-1" size={25} />}
        />
      </form>
    </section>
  );
}
