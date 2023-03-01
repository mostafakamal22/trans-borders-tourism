import { useState, useEffect } from "react";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { FcDocument } from "react-icons/fc";
import { RiSendPlaneFill } from "react-icons/ri";
import FormButton from "../shared/FormButton";
import { FormInput } from "../shared/FormInput";
import {
  InvoiceData,
  useCreateInvoiceMutation,
} from "../../state/features/invoice/invoiceApiSlice";
import {
  inputClassNamesStyles,
  lableClassNamesStyles,
} from "../invoice/constants";
import { useScroll } from "../../hooks/useScroll";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { ICustomer, IProduct } from "../../../../backend/models/invoiceModel";

export const CreateInvoice = () => {
  //state for Customer Details
  const [customerDetails, setCustomerDetails] = useState<ICustomer>({
    name: "",
    number: "",
  });

  //state for invoice Details
  const [invoiceDetails, setInvoieceDetails] = useState({
    ID: "",
    date: "",
    subtotal: 0,
    total: 0,
    taxRate: 0,
    taxDue: 0,
    taxable: 0,
    other: "",
  });

  //state for items Details
  const [itemsDetails, setItemsDetails] = useState<IProduct[]>([
    {
      name: "",
      price: 0,
      quantity: 1,
    },
  ]);

  //state for items
  const [itemsCount, setItemsCount] = useState(1);

  const [createInvoice, { isLoading, isSuccess }] = useCreateInvoiceMutation();

  const handleItemCount = async (num: number) => {
    if (num < 0 && itemsCount === 1) return;

    setItemsCount(itemsCount + num);

    const newItems =
      num > 0
        ? [
            ...itemsDetails,
            {
              name: "",
              price: 0,
              quantity: 1,
            },
          ]
        : itemsDetails.splice(0, itemsDetails.length - 1);

    setItemsDetails(newItems);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    const invoiceData: InvoiceData = {
      ID: invoiceDetails.ID,
      customer: { ...customerDetails },
      details: [...itemsDetails],
      total: invoiceDetails.total,
      subtotal: invoiceDetails.subtotal,
      date: invoiceDetails.date,
      taxDue: invoiceDetails.taxDue,
      taxRate: invoiceDetails.taxRate,
      taxable: invoiceDetails.taxable,
      other: invoiceDetails.other,
    };

    await createInvoice(invoiceData);
  };

  useEffect(() => {
    if (isSuccess) {
      setCustomerDetails({
        name: "",
        number: "",
      });

      setInvoieceDetails({
        ID: "",
        date: "",
        subtotal: 0,
        total: 0,
        taxRate: 0,
        taxDue: 0,
        taxable: 0,
        other: "",
      });

      setItemsDetails([
        {
          name: "",
          price: 0,
          quantity: 1,
        },
      ]);
    }
  }, [isSuccess]);

  useScroll("createInvoice");
  useDocumentTitle("إضافة فاتورة جديدة");

  return (
    <section id="createInvoice" className="w-full">
      <h3 className="mb-10 flex items-center justify-center rounded bg-red-800 px-2 py-4 text-center text-xl font-bold text-white shadow ">
        <FcDocument className="mr-1 drop-shadow" size={50} />
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
          />

          <FormInput
            label="رقم العميل"
            name="customerMobile"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="text"
            value={customerDetails.number}
            onChange={(e) =>
              setCustomerDetails({ ...customerDetails, number: e.target.value })
            }
          />
        </div>

        <p className="my-4 rounded bg-red-800 p-2 text-lg font-bold text-white">
          [ تفاصيل الفاتورة ]
        </p>
        {itemsDetails.map((item, index) => (
          <div
            key={index}
            className="flex flex-wrap items-center justify-center gap-4 px-5 py-5  font-semibold"
          >
            <FormInput
              label="نوع الخدمة"
              name={`itemName${index}`}
              labeClassNames={lableClassNamesStyles.default}
              className={inputClassNamesStyles.default}
              type="text"
              value={item.name}
              onChange={(e) => {
                const newArr = [...itemsDetails];
                newArr[index].name = e.target.value;
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
                setInvoieceDetails({
                  ...invoiceDetails,
                  subtotal: +newSubTotal.toFixed(2),
                  total:
                    +newSubTotal.toFixed(2) +
                    +invoiceDetails.taxDue.toFixed(2) +
                    +invoiceDetails.taxRate.toFixed(2) +
                    +invoiceDetails.taxable.toFixed(2),
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

                const newSubTotal = itemsDetails.reduce(
                  (prev, curr) => prev + curr.price * curr.quantity,
                  0
                );
                setInvoieceDetails({
                  ...invoiceDetails,
                  subtotal: +newSubTotal.toFixed(2),
                  total:
                    +newSubTotal.toFixed(2) +
                    +invoiceDetails.taxDue.toFixed(2) +
                    +invoiceDetails.taxRate.toFixed(2) +
                    +invoiceDetails.taxable.toFixed(2),
                });
              }}
              min={0}
              step={0.01}
              required
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
            label="رقم الجواز"
            name="PassportID"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="text"
            value={invoiceDetails.ID}
            onChange={(e) =>
              setInvoieceDetails({ ...invoiceDetails, ID: e.target.value })
            }
          />

          <FormInput
            label="تاريخ الفاتورة"
            name="invoiceDate"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="date"
            value={invoiceDetails.date}
            onChange={(e) =>
              setInvoieceDetails({ ...invoiceDetails, date: e.target.value })
            }
          />
        </div>
        <div className="mb-10 flex flex-wrap items-center justify-center gap-4 px-5 py-5 font-semibold">
          <FormInput
            label="SubTotal"
            name="invoiceSubTotal"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="number"
            value={invoiceDetails.subtotal}
            onChange={(e) =>
              setInvoieceDetails({
                ...invoiceDetails,
                subtotal: +e.target.value,
                total:
                  +e.target.value +
                  +invoiceDetails.taxDue.toFixed(2) +
                  +invoiceDetails.taxRate.toFixed(2) +
                  +invoiceDetails.taxable.toFixed(2),
              })
            }
            step="0.01"
            min={0}
            required
          />

          <FormInput
            label="Taxable"
            name="invoiceTaxable"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="number"
            value={invoiceDetails.taxable}
            onChange={(e) =>
              setInvoieceDetails({
                ...invoiceDetails,
                taxable: +e.target.value,
                total:
                  +e.target.value +
                  +invoiceDetails.taxDue.toFixed(2) +
                  +invoiceDetails.taxRate.toFixed(2) +
                  +invoiceDetails.subtotal.toFixed(2),
              })
            }
            step="0.01"
            min={0}
            required
          />

          <FormInput
            label="Tax Rate"
            name="invoiceTaxRate"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="number"
            value={invoiceDetails.taxRate}
            onChange={(e) =>
              setInvoieceDetails({
                ...invoiceDetails,
                taxRate: +e.target.value,
                total:
                  +e.target.value +
                  +invoiceDetails.taxDue.toFixed(2) +
                  +invoiceDetails.subtotal.toFixed(2) +
                  +invoiceDetails.taxable.toFixed(2),
              })
            }
            step="0.01"
            min={0}
            required
          />

          <FormInput
            label="Tax Due"
            name="invoiceTaxDue"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="number"
            value={invoiceDetails.taxDue}
            onChange={(e) =>
              setInvoieceDetails({
                ...invoiceDetails,
                taxDue: +e.target.value,
                total:
                  +e.target.value +
                  +invoiceDetails.subtotal.toFixed(2) +
                  +invoiceDetails.taxRate.toFixed(2) +
                  +invoiceDetails.taxable.toFixed(2),
              })
            }
            step="0.01"
            min={0}
            required
          />

          <FormInput
            label="Total"
            name="invoiceTotal"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="number"
            value={invoiceDetails.total}
            onChange={(e) =>
              setInvoieceDetails({ ...invoiceDetails, total: +e.target.value })
            }
            step="0.01"
            min={0}
            required
          />

          <textarea
            className={inputClassNamesStyles.default}
            name="other"
            id="other"
            value={invoiceDetails.other}
            onChange={(e) =>
              setInvoieceDetails({ ...invoiceDetails, other: e.target.value })
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
};
