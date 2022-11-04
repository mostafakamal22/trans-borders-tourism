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

          <div className="self-start max-h-[100%] w-[250px]  mx-auto">
            <img src={logo} alt="TbT Logo" />
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
            <p> 045782747 موبيل </p>
            <p>+975 556620879 تليفون </p>
            <p>+975 507597677 تليفون </p>

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

        <div className="flex items-center my-5 mt-10 underline underline-offset-2">
          <p className="text-left font-semibold">Paid To Mr or M/s</p>
          <input
            className="mx-auto text-xl  p-1 text-center w-[50%]"
            type="text"
          />
          <p>يصرف إلى السيد /السادة</p>
        </div>

        <div className="flex items-center my-5 underline underline-offset-2">
          <p className="text-left font-semibold">The Sum of Dhs</p>
          <input
            className="mx-auto text-xl  p-1 text-center w-[50%]"
            type="text"
          />
          <p>مبلغ وقدرة درهم</p>
        </div>

        <div className="flex items-center gap-2 my-5  underline underline-offset-2">
          <p className="text-left font-semibold">Cash / Cheque NO</p>
          <p className="mx-auto text-xl">
            <input className="text-center" type="text" />
          </p>
          <p>نقدا / شيك رقم</p>

          <p className="text-left font-semibold">Bank</p>
          <p className="mx-auto text-xl">
            {" "}
            <input className="text-center" type="text" />
          </p>
          <p>بنك</p>

          <p className="text-left font-semibold">Date</p>
          <input className="text-center" type="text" />
          <p>التاريخ</p>
        </div>

        <div className="flex items-center my-5  underline underline-offset-2">
          <p className="text-left font-semibold">Being</p>
          <input
            className="mx-auto text-xl  p-1 text-center w-[50%]"
            type="text"
          />
          <p>وذلك من</p>
        </div>

        <div className="flex items-center mt-20  font-semibold">
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
