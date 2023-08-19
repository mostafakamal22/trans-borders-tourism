import { useEffect, useState } from "react";
import {
  useGetBillsQuery,
  useUpdateBillMutation,
} from "../../state/features/bill/billApiSlice";
import {
  IBillCustomer,
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
import { ReactComponent as BillAlt } from "../../assets/icons/invoice-alt.svg";
import { motion } from "framer-motion";
import FormButton from "../shared/FormButton";
import { RiSendPlaneFill } from "react-icons/ri";

export const UpdateBill = ({
  id,
  setIsOpen,
}: {
  id: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { bill: foundBill } = useGetBillsQuery(
    {},
    {
      selectFromResult: ({ data }) => ({
        bill: data?.docs.find((bill) => bill.id === id),
      }),
    }
  );

  if (!foundBill) {
    setIsOpen(false);
    return null;
  }

  const billStringify = JSON.stringify(foundBill);
  const bill = JSON.parse(billStringify);

  //state for Customer Details
  const [customerDetails, setCustomerDetails] = useState<IBillCustomer>({
    name: bill?.customer?.name,
  });

  //state for bill Details
  const [billDetails, setBillDetails] = useState({
    date: bill?.date ? dayjs(bill?.date).format("YYYY-MM-DD") : "",
    subtotal: bill?.subtotal,
    total: bill?.total,
    taxRate: bill?.tax_rate || 0,
    taxDue: bill?.tax_due || 0,
    taxable: bill?.taxable || 0,
    other: bill?.other,
  });

  //state for items Details
  const [itemsDetails, setItemsDetails] = useState<IBillProduct[]>(
    bill.details
  );

  //state for Passport type
  const [passportDetails, setPassportDetails] = useState(() => {
    const passportDetail = bill.details.find(
      (detail: IBillProduct) => detail.type === "Passport"
    );

    return {
      name: passportDetail ? passportDetail?.data?.name : "",
      nationality: passportDetail ? passportDetail?.data?.nationality : "",
      state: passportDetail ? passportDetail?.data?.state : "accepted",
      service: passportDetail
        ? (passportDetail?.data?.service as string)
        : "30days",
      passportId: passportDetail ? passportDetail?.data?.passportId : "",
      paymentDate: passportDetail ? passportDetail?.data?.paymentDate : "",
      servicePrice: passportDetail ? passportDetail?.data?.servicePrice : 0,
      taxable: passportDetail ? passportDetail?.data?.taxable : 53,
      taxRate: passportDetail ? passportDetail?.data?.taxRate : 2.65,
      total: passportDetail ? passportDetail?.data?.total : 0,
      sales: passportDetail ? passportDetail?.data?.sales : 0,
      profit: passportDetail ? passportDetail?.data?.profit : 0,
    };
  });

  //state for Ticket Details
  const [ticketsDetails, setTicketsDetails] = useState(() => {
    const ticketDetail = bill.details.find(
      (detail: IBillProduct) => detail.type === "Ticket"
    );
    return {
      name: ticketDetail ? ticketDetail?.data?.name : "",
      type: ticketDetail ? ticketDetail?.data?.type : "",
      employee: ticketDetail ? ticketDetail?.data?.employee : "",
      supplier: ticketDetail ? ticketDetail?.data?.supplier : "",
      paymentDate: ticketDetail ? ticketDetail?.data?.paymentDate : "",
      paymentMethod: ticketDetail ? ticketDetail?.data?.paymentMethod : "cash",
      cost: ticketDetail ? ticketDetail?.data?.cost : 0,
      sales: ticketDetail ? ticketDetail?.data?.sales : 0,
      profit: ticketDetail ? ticketDetail?.data?.profit : 0,
      paidAmount: ticketDetail ? ticketDetail?.data?.paidAmount : 0,
      remainingAmount: ticketDetail ? ticketDetail?.data?.remainingAmount : 0,
    };
  });

  //state for items
  const [itemsCount, setItemsCount] = useState(1);

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
  };

  const [updateBill, { isLoading }] = useUpdateBillMutation();

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
            ? ticketsDetails.type
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
                ...ticketsDetails,
                name: customerDetails.name,
                paymentDate: billDetails.date,
              }
            : null,
      })),
    ];

    const billData = {
      id,
      customer: { ...customerDetails },
      details: [...details],
      total: billDetails.total,
      date: billDetails.date,
      other: billDetails.other,
    };

    await updateBill(billData);
  };

  useEffect(() => {
    //scroll page back to top when component first mount
    const yOffset = window.scrollY;
    window.scrollBy(0, -yOffset);
  }, []);

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
                    className={`${inputClassNamesStyles.default} bg-slate-200`}
                    type="number"
                    value={passportDetails.taxable}
                    disabled
                    min={0}
                    step={0.01}
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
                    value={ticketsDetails.type}
                    onChange={(e) =>
                      setTicketsDetails({
                        ...ticketsDetails,
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
                    value={ticketsDetails.employee}
                    onChange={(e) =>
                      setTicketsDetails({
                        ...ticketsDetails,
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
                    value={ticketsDetails.cost}
                    onChange={(e) =>
                      setTicketsDetails({
                        ...ticketsDetails,
                        cost: +e.target.value,
                        sales: 0,
                        profit: 0,
                      })
                    }
                    min={0}
                    step={0.01}
                  />

                  <FormInput
                    label={ticketsTableHeaderTitles[4]}
                    name="sales"
                    labeClassNames={lableClassNamesStyles.default}
                    className={inputClassNamesStyles.default}
                    type="number"
                    value={ticketsDetails.sales}
                    onChange={(e) => {
                      setTicketsDetails({
                        ...ticketsDetails,
                        sales: +e.target.value,
                        profit: +e.target.value - ticketsDetails.cost,
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
                    label={ticketsTableHeaderTitles[5]}
                    name="profit"
                    labeClassNames={lableClassNamesStyles.default}
                    className={`${inputClassNamesStyles.default} bg-slate-200`}
                    type="number"
                    value={ticketsDetails.profit}
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
                    value={ticketsDetails.paidAmount}
                    onChange={(e) =>
                      setTicketsDetails({
                        ...ticketsDetails,
                        paidAmount: +e.target.value,
                        remainingAmount: ticketsDetails.sales - +e.target.value,
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
                    value={ticketsDetails.remainingAmount}
                    disabled
                    min={0}
                    step={0.01}
                  />

                  <select
                    name="paymentMethod"
                    id="paymentMethod"
                    className={inputClassNamesStyles.default}
                    value={ticketsDetails.paymentMethod}
                    onChange={(e) =>
                      setTicketsDetails({
                        ...ticketsDetails,
                        paymentMethod: e.target.value,
                      })
                    }
                  >
                    {Object.keys(paymentMethods).map((method: string) => (
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
                  </label>

                  <FormInput
                    label={ticketsTableHeaderTitles[6]}
                    name="supplier"
                    labeClassNames={lableClassNamesStyles.default}
                    className={inputClassNamesStyles.default}
                    type="text"
                    value={ticketsDetails.supplier}
                    onChange={(e) =>
                      setTicketsDetails({
                        ...ticketsDetails,
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
            isLoading={isLoading}
            icon={<RiSendPlaneFill className="ml-1" size={25} />}
          />
        </form>
      </motion.div>
    </div>
  );
};
