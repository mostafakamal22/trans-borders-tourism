import { useEffect, useRef } from "react";
import { AiFillPrinter } from "react-icons/ai";
import ReactToPrint from "react-to-print";
import logo from "../../assets/imgs/trans-logo.png";

export const CreateVoucher = () => {
  const componentRef = useRef<HTMLDivElement>(null);
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
            <p className="max-w-[150px] p-2 flex justify-center items-center border-2 border-black">
              <input className="bg-transparent text-center" type="text" />
            </p>
          </div>

          <div className="flex flex-col justify-center items-center w-[400px] mx-auto">
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
            <p>+975 556620879 موبيل</p>
            <p>+975 507597677 موبيل </p>

            <p className="flex flex-col justify-center items-end text-xl mt-5">
              <span>
                No. <span>[{"   "}]</span>
              </span>

              <span>
                {" "}
                DATE
                <span className=" p-1 rounded-sm">
                  <input className="text-center" type="text" />
                </span>
                التاريخ
              </span>
            </p>
          </div>
        </div>

        <div
          style={{ printColorAdjust: "exact" }}
          className="bg-red-700 p-2 mt-5 text-white  font-semibold underline underline-offset-2 rounded"
        >
          <div className="flex items-center my-5">
            <p className="text-left">Paid To Mr or M/s</p>
            <input
              className="mx-auto w-[60%] text-xl text-black bg-red-200 p-2 text-center rounded"
              type="text"
            />
            <p>يصرف إلى السيد /السادة</p>
          </div>

          <div className="flex items-center my-5">
            <p className="text-left">The Sum of Dhs</p>
            <input
              className="mx-auto text-xl text-black text-center bg-red-200 p-2 rounded"
              type="text"
            />
            <p>مبلغ وقدرة درهم</p>
          </div>

          <div className="flex items-center my-5">
            <p className="text-left">Cash / Cheque NO</p>

            <input
              className="w-[200px] h-[40px] mx-auto text-xl text-black text-center bg-red-200 p-2 rounded"
              type="text"
            />

            <p>نقدا / شيك رقم</p>

            <p className="text-left">Bank</p>
            <input
              className="w-[200px] h-[40px] mx-auto text-xl text-black text-center bg-red-200 p-2 rounded"
              type="text"
            />
            <p>بنك</p>

            <p className="text-left">Date</p>
            <input
              className="w-[200px] h-[40px] mx-auto text-xl text-black text-center bg-red-200 p-2 rounded"
              type="text"
            />
            <p>التاريخ</p>
          </div>

          <div className="flex items-center my-5">
            <p className="text-left">Being</p>
            <input
              className="mx-auto w-[70%] text-xl text-black bg-red-200 p-2 text-center rounded"
              type="text"
            />
            <p>وذلك عن</p>
          </div>
        </div>

        <div className="flex items-center mt-20 font-semibold">
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
