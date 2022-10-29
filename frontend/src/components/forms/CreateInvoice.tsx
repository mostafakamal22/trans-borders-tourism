import { useState, useEffect } from "react";
import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";
import { FcDocument } from "react-icons/fc";
import { RiSendPlaneFill } from "react-icons/ri";
import {
  useAppDispatch,
  useAppSelector,
} from "../../state/features/hooks/StateHooks";
import {
  createInvoice,
  resetInvoicesStatus,
} from "../../state/features/invoice/invoiceSlice";
import FormButton from "../shared/FormButton";
import MessagesContainer from "../shared/MessagesContainer";
import logo from "../../assets/imgs/trans-logo.png";
import { resetAdminAuthStatus } from "../../state/features/admin/auth/adminAuthSlice";
import { UseResetStatus } from "../../hooks/UseResetStatus";
import { FormInput } from "../shared/FormInput";

export const lableClassNamesStyles: { default: string; threeCol: string } = {
  default:
    "basis-full sm:basis-[50%] text-md  my-2 sm:my-0 mx-2 p-2  rounded shadow bg-red-200 border-red-800",
  threeCol:
    "text-md  my-2 sm:my-0 mx-2 p-2  rounded shadow bg-red-200 border-red-800",
};

export const inputClassNamesStyles: { default: string; threeCol: string } = {
  default:
    "basis-full  sm:basis-1/3  px-3 py-1.5 mx-4 text-base font-normal text-gray-700 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out  focus:text-gray-700 focus:bg-white focus:border-red-800 focus:outline-none",
  threeCol:
    "px-2 py-1.5 mx-2 text-base font-normal text-gray-700 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out  focus:text-gray-700 focus:bg-white focus:border-red-800 focus:outline-none",
};

export const CreateInvoice = () => {
  //state for Customer Details
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    ID: "",
    number: "",
  });

  //state for invoice Details
  const [invoiceDetails, setInvoieceDetails] = useState({
    ID: "",
    date: "",
    dueDate: "",
    subtotal: 0,
    total: 0,
    taxRate: 0,
    taxDue: 0,
    taxable: 0,
    other: "",
  });

  //state for items Details
  const [itemsDetails, setItemsDetails] = useState([
    {
      name: "",
      price: 0,
      quantity: 0,
    },
  ]);

  //state for items
  const [itemsCount, setItemsCount] = useState(1);

  //state for alert messages
  const [msg, setMsg] = useState("");

  const { info } = useAppSelector((state) => state.adminAuth);
  const { isError, isSuccess, isLoading, message } = useAppSelector(
    (state) => state.invoiceData
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
              quantity: 0,
            },
          ]
        : itemsDetails.splice(0, itemsDetails.length - 1);

    setItemsDetails(newItems);
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    //set msg to none first
    setMsg("");

    const invoiceData = {
      token: info.token,
      ID: invoiceDetails.ID,
      customer: { ...customerDetails },
      details: [...itemsDetails],
      total: invoiceDetails.total,
      subtotal: invoiceDetails.subtotal,
      date: invoiceDetails.date,
      dueDate: invoiceDetails.dueDate,
      taxDue: invoiceDetails.taxDue,
      taxRate: invoiceDetails.taxRate,
      taxable: invoiceDetails.taxable,
      other: invoiceDetails.other,
    };

    dispatch(createInvoice(invoiceData));
  };

  //clean up status (when mount and unmount)
  UseResetStatus(() => {
    dispatch(resetAdminAuthStatus());
    dispatch(resetInvoicesStatus());
  });

  UseResetStatus(() => {
    return () => {
      dispatch(resetAdminAuthStatus());
      dispatch(resetInvoicesStatus());
    };
  });

  return (
    <div className="max-w-6xl w-full mx-auto my-20 p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
      <h3 className="flex justify-center items-center text-xl text-center font-bold px-2 py-4 mb-10 bg-red-200 border-b-4 border-red-800 rounded shadow ">
        <FcDocument className="mr-1" size={50} />
        <span>إضافة فاتورة جديدة</span>
      </h3>

      <img className="mx-auto" src={logo} alt="logo" />

      <form onSubmit={handleSubmit}>
        <p className="font-bold p-2 rounded text-lg text-white bg-red-800 my-4">
          [ Customer Details ]
        </p>
        <div className="flex justify-center items-center font-semibold flex-wrap gap-4 px-5 py-5">
          <FormInput
            label="Customer Name"
            name="customerName"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="text"
            defaultValue={customerDetails.name}
            onChange={(e) =>
              setCustomerDetails({ ...customerDetails, name: e.target.value })
            }
          />

          <FormInput
            label="Customer ID"
            name="customerID"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="text"
            defaultValue={customerDetails.ID}
            onChange={(e) =>
              setCustomerDetails({ ...customerDetails, ID: e.target.value })
            }
          />

          <FormInput
            label="Customer Mobile"
            name="customerMobile"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="text"
            defaultValue={customerDetails.number}
            onChange={(e) =>
              setCustomerDetails({ ...customerDetails, number: e.target.value })
            }
          />
        </div>

        <p className="font-bold p-2 rounded text-lg text-white bg-red-800 my-4">
          [ Items Details ]
        </p>
        {itemsDetails.map((item, index) => (
          <div
            key={index}
            className="flex flex-wrap md:flex-nowrap items-center font-semibold  gap-4 px-5 py-5"
          >
            <FormInput
              label="Item Name"
              name="itemName"
              labeClassNames={lableClassNamesStyles.threeCol}
              className={inputClassNamesStyles.threeCol}
              type="text"
              defaultValue={item.name}
              onChange={(e) => {
                const newArr = [...itemsDetails];
                newArr[index].name = e.target.value;
                setItemsDetails(newArr);
              }}
            />

            <FormInput
              label="Item Price"
              name="itemPrice"
              labeClassNames={lableClassNamesStyles.threeCol}
              className={inputClassNamesStyles.threeCol}
              type="number"
              defaultValue={item.price}
              onChange={(e) => {
                const newArr = [...itemsDetails];
                newArr[index].price = +e.target.value;
                setItemsDetails(newArr);
              }}
              min={0}
              required
            />

            <FormInput
              label="Item Quantity"
              name="itemQuantity"
              labeClassNames={lableClassNamesStyles.threeCol}
              className={inputClassNamesStyles.threeCol}
              type="number"
              defaultValue={item.quantity}
              onChange={(e) => {
                const newArr = [...itemsDetails];
                newArr[index].quantity = +e.target.value;
                setItemsDetails(newArr);
              }}
              min={0}
              required
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
            Add Item
            <AiFillPlusCircle className="ml-1" size={20} />
          </button>

          <button
            className="inline-flex font-bold text-xs sm:text-sm bg-red-800 text-white hover:bg-white my-5 px-2 sm:px-3 py-2 hover:text-red-800 border hover:border-red-800 items-center rounded
         shadow transition-all ease-in-out duration-300"
            onClick={() => handleItemCount(-1)}
            type="button"
          >
            Remove Item
            <AiFillMinusCircle className="ml-1" size={20} />
          </button>
        </div>

        <p className="font-bold p-2 rounded text-lg text-white bg-red-800 my-4">
          [ Invoice Details ]
        </p>
        <div className="flex justify-center items-center font-semibold flex-wrap gap-4 px-5 py-5">
          <FormInput
            label="Invoice #"
            name="invoiceID"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="text"
            defaultValue={invoiceDetails.ID}
            onChange={(e) =>
              setInvoieceDetails({ ...invoiceDetails, ID: e.target.value })
            }
          />

          <FormInput
            label="Date"
            name="invoiceDate"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="date"
            defaultValue={invoiceDetails.date}
            onChange={(e) =>
              setInvoieceDetails({ ...invoiceDetails, date: e.target.value })
            }
          />

          <FormInput
            label="Due Date"
            name="invoiceDueDate"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="date"
            defaultValue={invoiceDetails.dueDate}
            onChange={(e) =>
              setInvoieceDetails({ ...invoiceDetails, dueDate: e.target.value })
            }
          />
        </div>
        <div className="flex justify-center items-center font-semibold flex-wrap gap-4 px-5 py-5">
          <FormInput
            label="SubTotal"
            name="invoiceSubTotal"
            labeClassNames={lableClassNamesStyles.default}
            className={inputClassNamesStyles.default}
            type="number"
            defaultValue={invoiceDetails.subtotal}
            onChange={(e) =>
              setInvoieceDetails({
                ...invoiceDetails,
                subtotal: +e.target.value,
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
            defaultValue={invoiceDetails.taxable}
            onChange={(e) =>
              setInvoieceDetails({
                ...invoiceDetails,
                taxable: +e.target.value,
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
            defaultValue={invoiceDetails.taxRate}
            onChange={(e) =>
              setInvoieceDetails({
                ...invoiceDetails,
                taxRate: +e.target.value,
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
            defaultValue={invoiceDetails.taxDue}
            onChange={(e) =>
              setInvoieceDetails({ ...invoiceDetails, taxDue: +e.target.value })
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
            defaultValue={invoiceDetails.total}
            onChange={(e) =>
              setInvoieceDetails({ ...invoiceDetails, total: +e.target.value })
            }
            step="0.01"
            min={0}
            required
          />

          <label className={lableClassNamesStyles.default} htmlFor="other">
            Other Comments
          </label>

          <textarea
            className={inputClassNamesStyles.default}
            name="other"
            defaultValue={invoiceDetails.other}
            onChange={(e) =>
              setInvoieceDetails({ ...invoiceDetails, other: e.target.value })
            }
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
          text={{ default: "حفظ الفاتورة", loading: "جارى الحفظ" }}
          isLoading={isLoading}
          icon={<RiSendPlaneFill className="ml-1" size={25} />}
        />
      </form>
    </div>
  );
};
