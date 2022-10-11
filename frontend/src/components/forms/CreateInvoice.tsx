import { useState, useEffect } from "react";
import { FcElectroDevices } from "react-icons/fc";
import { RiSendPlaneFill } from "react-icons/ri";
import {
  useAppDispatch,
  useAppSelector,
} from "../../state/features/hooks/StateHooks";
import { createInvoice } from "../../state/features/invoice/invoiceSlice";
import FormButton from "../shared/FormButton";
import MessagesContainer from "../shared/MessagesContainer";

export const CreateInvoice = () => {
  //state for Customer Details
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    ID: "",
    number: "",
  });

  //state for invoice Details
  const [invoiceDetails, setInvoieceDetails] = useState({
    date: "",
    dueDate: "",
    subtotal: 0,
    total: 0,
    taxRate: 0,
    taxDue: 0,
    taxable: 0,
    other: " ",
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

  return (
    <div className="max-w-5xl w-full p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
      <h3 className="flex justify-center items-center text-xl text-center font-bold px-2 py-4 mb-10 bg-red-200 border-b-4 border-red-800 rounded shadow ">
        <FcElectroDevices className="mr-1" size={50} />
        <span>Add New Invoice</span>
      </h3>
      <form onSubmit={handleSubmit}>
        <p className="flex font-bold px-2 py-4 text-lg">Customer Details:-</p>
        <div className="flex justify-center items-center font-semibold flex-wrap gap-4 px-5 py-5">
          <label
            className="basis-full sm:basis-[50%] text-md  my-2 sm:my-0 mx-2 p-2 sm:border-r-4 rounded shadow bg-red-200 border-red-800"
            htmlFor="customerName"
          >
            Customer Name
          </label>

          <input
            className="basis-full  sm:basis-1/3  px-3 py-1.5 mx-4 text-base font-normal text-gray-700 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out  focus:text-gray-700 focus:bg-white focus:border-red-800 focus:outline-none"
            type="text"
            name="customerName"
            defaultValue={customerDetails.name}
            onChange={(e) =>
              setCustomerDetails({ ...customerDetails, name: e.target.value })
            }
            required
          />

          <label
            className="basis-full sm:basis-[50%] text-md  my-2 sm:my-0 mx-2 p-2 sm:border-r-4 rounded shadow bg-red-200 border-red-800"
            htmlFor="customerID"
          >
            Customer ID
          </label>

          <input
            className="basis-full  sm:basis-1/3  px-3 py-1.5 mx-4 text-base font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out  focus:text-gray-700 focus:bg-white focus:border-red-600 focus:outline-none"
            type="text"
            name="customerID"
            defaultValue={customerDetails.ID}
            onChange={(e) =>
              setCustomerDetails({ ...customerDetails, ID: e.target.value })
            }
            required
          />

          <label
            className="basis-full sm:basis-[50%] text-md  my-2 sm:my-0 mx-2 p-2 sm:border-r-4 rounded shadow bg-red-200 border-red-800"
            htmlFor="customerMobile"
          >
            Customer Mobile
          </label>

          <input
            className="basis-full  sm:basis-1/3  px-3 py-1.5 mx-4 text-base font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out  focus:text-gray-700 focus:bg-white focus:border-red-600 focus:outline-none"
            type="text"
            name="customerMobile"
            defaultValue={customerDetails.number}
            onChange={(e) =>
              setCustomerDetails({ ...customerDetails, number: e.target.value })
            }
            required
          />
        </div>

        <p className="flex font-bold px-2 py-4 text-lg">Items Details:-</p>
        {itemsDetails.map((item, index) => (
          <div
            key={index}
            className="flex  items-center font-semibold  gap-4 px-5 py-5"
          >
            <label
              className="text-md  my-2 sm:my-0 mx-2 p-2 sm:border-r-4 rounded shadow bg-red-200 border-red-800"
              htmlFor="itemName"
            >
              Item Name
            </label>

            <input
              className="px-2 py-1.5 mx-2 text-base font-normal text-gray-700 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out  focus:text-gray-700 focus:bg-white focus:border-red-800 focus:outline-none"
              type="text"
              name="itemName"
              defaultValue={item.name}
              onChange={(e) => {
                const newArr = [...itemsDetails];
                newArr[index].name = e.target.value;
                setItemsDetails(newArr);
              }}
              required
            />

            <label
              className="text-md  my-2 sm:my-0 mx-2 p-2 sm:border-r-4 rounded shadow bg-red-200 border-red-800"
              htmlFor="itemPrice"
            >
              Item Price
            </label>

            <input
              className="px-2 py-1.5 mx-2 text-base font-normal text-gray-700 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out  focus:text-gray-700 focus:bg-white focus:border-red-800 focus:outline-none"
              type="number"
              name="itemPrice"
              defaultValue={item.price}
              onChange={(e) => {
                const newArr = [...itemsDetails];
                newArr[index].price = +e.target.value;
                setItemsDetails(newArr);
              }}
              min={0}
              required
            />

            <label
              className="text-md  my-2 sm:my-0 mx-2 p-2 sm:border-r-4 rounded shadow bg-red-200 border-red-800"
              htmlFor="itemQuantity"
            >
              Item Quantity
            </label>

            <input
              className="px-2 py-1.5 mx-2 text-base font-normal text-gray-700 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out  focus:text-gray-700 focus:bg-white focus:border-red-800 focus:outline-none"
              type="number"
              name="itemQuantity"
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

        <button onClick={() => handleItemCount(1)} type="button">
          Add Item
        </button>

        <button onClick={() => handleItemCount(-1)} type="button">
          Remove Item
        </button>

        <p className="flex font-bold px-2 py-4 text-lg">Invoice Details:-</p>
        <div className="flex justify-center items-center font-semibold flex-wrap gap-4 px-5 py-5">
          <label
            className="basis-full sm:basis-[50%] text-md  my-2 sm:my-0 mx-2 p-2 sm:border-r-4 rounded shadow bg-red-200 border-red-800"
            htmlFor="date"
          >
            Date
          </label>

          <input
            className="basis-full  sm:basis-1/3  px-3 py-1.5 mx-4 text-base font-normal text-gray-700 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out  focus:text-gray-700 focus:bg-white focus:border-red-800 focus:outline-none"
            type="date"
            name="date"
            defaultValue={invoiceDetails.date}
            onChange={(e) =>
              setInvoieceDetails({ ...invoiceDetails, date: e.target.value })
            }
            required
          />

          <label
            className="basis-full sm:basis-[50%] text-md  my-2 sm:my-0 mx-2 p-2 sm:border-r-4 rounded shadow bg-red-200 border-red-800"
            htmlFor="due_date"
          >
            Due Date
          </label>

          <input
            className="basis-full  sm:basis-1/3  px-3 py-1.5 mx-4 text-base font-normal text-gray-700 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out  focus:text-gray-700 focus:bg-white focus:border-red-800 focus:outline-none"
            type="date"
            name="due_date"
            defaultValue={invoiceDetails.dueDate}
            onChange={(e) =>
              setInvoieceDetails({ ...invoiceDetails, dueDate: e.target.value })
            }
            required
          />
        </div>
        <div className="flex justify-center items-center font-semibold flex-wrap gap-4 px-5 py-5">
          <label
            className="basis-full sm:basis-[50%] text-md  my-2 sm:my-0 mx-2 p-2 sm:border-r-4 rounded shadow bg-red-200 border-red-800"
            htmlFor="subtotal"
          >
            SubTotal
          </label>

          <input
            className="basis-full  sm:basis-1/3  px-3 py-1.5 mx-4 text-base font-normal text-gray-700 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out  focus:text-gray-700 focus:bg-white focus:border-red-800 focus:outline-none"
            type="number"
            name="subtotal"
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
          <label
            className="basis-full sm:basis-[50%] text-md  my-2 sm:my-0 mx-2 p-2 sm:border-r-4 rounded shadow bg-red-200 border-red-800"
            htmlFor="taxable"
          >
            taxable
          </label>

          <input
            className="basis-full  sm:basis-1/3  px-3 py-1.5 mx-4 text-base font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out  focus:text-gray-700 focus:bg-white focus:border-red-600 focus:outline-none"
            type="number"
            name="taxable"
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

          <label
            className="basis-full sm:basis-[50%] text-md  my-2 sm:my-0 mx-2 p-2 sm:border-r-4 rounded shadow bg-red-200 border-red-800"
            htmlFor="tax_rate"
          >
            tax rate
          </label>

          <input
            className="basis-full  sm:basis-1/3  px-3 py-1.5 mx-4 text-base font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out  focus:text-gray-700 focus:bg-white focus:border-red-600 focus:outline-none"
            type="number"
            name="tax_rate"
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

          <label
            className="basis-full sm:basis-[50%] text-md  my-2 sm:my-0 mx-2 p-2 sm:border-r-4 rounded shadow bg-red-200 border-red-800"
            htmlFor="tax_due"
          >
            Tax Due
          </label>

          <input
            className="basis-full  sm:basis-1/3  px-3 py-1.5 mx-4 text-base font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out  focus:text-gray-700 focus:bg-white focus:border-red-600 focus:outline-none"
            type="number"
            name="tax due"
            defaultValue={invoiceDetails.taxDue}
            onChange={(e) =>
              setInvoieceDetails({ ...invoiceDetails, taxDue: +e.target.value })
            }
            step="0.01"
            min={0}
            required
          />

          <label
            className="basis-full sm:basis-[50%] text-md  my-2 sm:my-0 mx-2 p-2 sm:border-r-4 rounded shadow bg-red-200 border-red-800"
            htmlFor="Total"
          >
            Total
          </label>

          <input
            className="basis-full  sm:basis-1/3  px-3 py-1.5 mx-4 text-base font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out  focus:text-gray-700 focus:bg-white focus:border-red-600 focus:outline-none"
            type="number"
            name="Total"
            defaultValue={invoiceDetails.total}
            onChange={(e) =>
              setInvoieceDetails({ ...invoiceDetails, total: +e.target.value })
            }
            step="0.01"
            min={0}
            required
          />

          <label
            className="basis-full sm:basis-[50%] text-md  my-2 sm:my-0 mx-2 p-2 sm:border-r-4 rounded shadow bg-red-200 border-red-800"
            htmlFor="other"
          >
            Other Comments
          </label>

          <textarea
            className="basis-full  sm:basis-1/3  px-3 py-1.5 mx-4 text-base font-normal text-gray-700  bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out  focus:text-gray-700 focus:bg-white focus:border-red-600 focus:outline-none"
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
          text={{ default: "Save Invoice", loading: "Processing" }}
          isLoading={isLoading}
          icon={<RiSendPlaneFill className="ml-1" size={25} />}
        />
      </form>
    </div>
  );
};
