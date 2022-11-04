import { useRef, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../state/features/hooks/StateHooks";
import logo from "../../assets/imgs/trans-logo.png";
import ReactToPrint from "react-to-print";
import { AiFillPrinter } from "react-icons/ai";
import dayjs from "dayjs";

export const PaymentVoucher = () => {
  const { purchasesList } = useAppSelector((state) => state.purchasesData);
  const purchaseID = useParams().id;
  const purchase = purchasesList.find(
    (purchase: any) => purchase._id === purchaseID
  );

  const componentRef = useRef<HTMLDivElement>(null);

  if (!purchase)
    return (
      <>
        <Navigate to={"not-found"} />
      </>
    );

  //scroll page back to top when component first mount
  useEffect(() => {
    const yOffset = window.pageYOffset;
    window.scrollBy(0, -yOffset);
  }, []);

  return (
    <>
      <ReactToPrint
        trigger={() => (
          <button
            className="print:hidden fixed top-[50vh] right-2 z-10 inline-flex font-bold text-xs sm:text-sm bg-red-800 text-white hover:bg-white my-5 px-2 sm:px-3 py-2 hover:text-red-800 border hover:border-red-800 items-center rounded
            shadow transition-all ease-in-out duration-300"
          >
            <AiFillPrinter className="mr-1" size={20} />
            طباعة السند
          </button>
        )}
        content={() => componentRef.current}
      />
      <div
        ref={componentRef}
        className="max-w-6xl min-h-[75vh] w-full mx-auto my-20 overflow-x-auto  p-6 bg-slate-50 rounded shadow-lg shadow-black/30 print:shadow-none print:my-0"
      >
        <div className="flex items-center">
          <div className="max-w-[300px] text-left">
            <p className="text-blue-700 text-2xl font-bold underline underline-offset-4">
              TRANS BORDERS TOURISM L.L.C
            </p>
            <p>P.O.Box: 171511</p>
            <p>DUBAI U.A.E </p>
            <p>Tel: +971 42678094</p>
            <p>Fax: +971 42677095</p>
            <p className="max-w-[150px] flex justify-between items-center mt-4">
              <span>Dhs درهم</span>
              <span>Fils فلس</span>
            </p>
            <p className="max-w-[150px]  flex items-center border-2 border-black">
              <span className="p-2 border-r-2 border-black">
                {Math.floor(purchase.total)}
              </span>
              <span className=" p-2 ml-auto">
                {(purchase.total % 1).toFixed(2)}
              </span>
            </p>
          </div>

          <div className="self-start max-h-[100%] w-[250px]  mx-auto">
            <img src={logo} alt="TbT Logo" />
            <p className="flex flex-col justify-center items-center p-3 text-2xl font-bold border-2 border-black mt-4">
              <span>سند صرف</span>
              <span>Purchase Voucher</span>
            </p>
          </div>

          <div className="max-w-[300px] text-right">
            <p className="text-blue-700 text-2xl font-bold underline underline-offset-4">
              عبر الحدود للسباحة ش.ذ.م.م
            </p>
            <p>171511 ص.ب.ا </p>
            <p> دبى أ.ع.م </p>
            <p>+975 42678094 تليفون </p>
            <p>+975 42677095 فاكس </p>

            <p className="flex flex-col justify-center items-end text-xl mt-5">
              <span>
                No.{" "}
                <span
                  style={{ printColorAdjust: "exact" }}
                  className="bg-red-100 p-1 rounded-sm"
                >
                  [
                  {"0" +
                    [...purchasesList].findIndex(
                      (p: any) => p._id === purchase._id
                    )}
                  ]
                </span>
              </span>

              <span>
                {" "}
                DATE التاريخ
                <span
                  style={{ printColorAdjust: "exact" }}
                  className="bg-red-100 p-1 rounded-sm"
                >
                  {purchase.date
                    ? dayjs(purchase.date).format("DD/MM/YYYY")
                    : "-"}
                </span>
              </span>
            </p>
          </div>
        </div>

        {/* <div className="mt-5">
          <h2
            style={{ printColorAdjust: "exact" }}
            className="text-white font-bold text-xl p-1 bg-red-800 print:!bg-red-800 mb-4"
          >
            Bill To
          </h2>

          <p className="text-left">Name:-</p>
          <p className="text-left">Mobile:-</p>
        </div> */}
      </div>
    </>
  );
};
