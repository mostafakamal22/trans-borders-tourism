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
            <p>Tel: 045782747</p>
            <p>Mobile: +971 556620879</p>
            <p>Mobile: +971 507597677</p>
            <p className="max-w-[150px] flex justify-between items-center mt-4">
              <span>Dhs درهم</span>
              <span>Fils فلس</span>
            </p>
            <p className="max-w-[150px]  flex items-center border-2 border-black">
              <span className="p-2 border-r-2 border-black">
                {Math.floor(purchase.total)}
              </span>
              <span className=" p-2 ml-auto">
                {(purchase.total % 1).toFixed(2).split(".")[1]}
              </span>
            </p>
          </div>

          <div className="flex flex-col justify-center items-center w-[400px]  mx-auto">
            <img className="max-h-[100%] h-[130px]" src={logo} alt="TbT Logo" />
            <p className="flex flex-col justify-center items-center p-3 text-2xl font-bold border-2 border-black mt-4">
              <span>سند صرف</span>
              <span>Payment Voucher</span>
            </p>
          </div>

          <div className="max-w-[300px] text-right">
            <p className="text-blue-700 text-2xl font-bold underline underline-offset-4">
              عبر الحدود للسياحة ش.ذ.م.م
            </p>
            <p>171511 ص.ب.ا </p>
            <p> دبى أ.ع.م </p>
            <p> 045782747 تليفون</p>
            <p>+975 556620879 موبيل </p>
            <p>+975 507597677 موبيل </p>

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

        <div
          style={{ printColorAdjust: "exact" }}
          className="bg-red-700 p-2 mt-5 text-white  font-semibold underline underline-offset-2 rounded"
        >
          <div className="flex items-center p-2 my-5">
            <p className="text-left">Paid To Mr or M/s</p>
            <p
              style={{ printColorAdjust: "exact" }}
              className="w-[60%] mx-auto text-xl text-black bg-red-200 p-2 rounded"
            >
              {purchase.purchase_types[0].supplier}
            </p>
            <p>يصرف إلى السيد /السادة</p>
          </div>

          <div className="flex items-center p-2 my-5">
            <p className="text-left">The Sum of Dhs</p>
            <p
              style={{ printColorAdjust: "exact" }}
              className="mx-auto text-xl text-black bg-red-200 p-2 rounded"
            >
              {purchase.total.toFixed(2)}
            </p>
            <p>مبلغ وقدرة درهم</p>
          </div>

          <div className="flex items-center p-2 my-5">
            <p className="text-left">Cash / Cheque NO</p>
            <p
              style={{ printColorAdjust: "exact" }}
              className="w-[200px] h-[40px] mx-auto text-xl text-black bg-red-200 p-2 rounded"
            ></p>
            <p>نقدا / شيك رقم</p>

            <p className="text-left font-semibold">Bank</p>
            <p
              style={{ printColorAdjust: "exact" }}
              className="w-[200px] h-[40px] mx-auto text-xl text-black bg-red-200 p-2 rounded"
            ></p>
            <p>بنك</p>

            <p className="text-left">Date</p>
            <p
              style={{ printColorAdjust: "exact" }}
              className="mx-auto text-xl text-black bg-red-200 p-2 rounded"
            >
              {purchase.date ? dayjs(purchase.date).format("DD/MM/YYYY") : "-"}
            </p>
            <p>التاريخ</p>
          </div>

          <div className="flex items-center p-2 my-5">
            <p className="text-left">Being</p>
            <p className="w-[70%] h-[40px] mx-auto text-xl text-black bg-red-200 p-2 rounded"></p>
            <p>وذلك عن</p>
          </div>
        </div>

        <div className="flex items-center mt-10 font-semibold">
          <p className="text-left flex flex-col">
            <span>Prepared By</span>
            <span>تم التحضير</span>
          </p>
          <p className="mx-auto flex flex-col">
            <span>Approved By</span>
            <span>المفوض</span>
          </p>
          <p className="text-right flex flex-col">
            <span>Received By</span>
            <span>المستلم</span>
          </p>
        </div>
      </div>
    </>
  );
};
