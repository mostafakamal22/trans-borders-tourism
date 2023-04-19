import { useRef } from "react";
import { AiFillPrinter } from "react-icons/ai";
import ReactToPrint from "react-to-print";
import logo from "../../assets/imgs/trans-logo.png";
import { useScroll } from "../../hooks/useScroll";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { paymentVoucherCompanyInfos } from "../purchase/constants";

export const CreateVoucher = () => {
  const componentRef = useRef<HTMLDivElement>(null);

  useScroll("createPaymentVoucher");
  useDocumentTitle("ضافة سند جديد");

  return (
    <>
      <ReactToPrint
        trigger={() => (
          <button
            className="fixed top-[15vh] left-4 z-10 my-5 inline-flex items-center rounded border bg-red-200 px-2 py-2 text-xs font-bold text-red-800 shadow transition-all duration-300 ease-in-out hover:border-red-800 hover:bg-white
          hover:text-red-800 print:hidden sm:px-3 sm:text-sm"
          >
            <AiFillPrinter className="mr-1" size={20} />
            طباعة السند
          </button>
        )}
        content={() => componentRef.current}
      />
      <div
        id="createPaymentVoucher"
        ref={componentRef}
        className="mx-auto my-20 min-h-[75vh] w-full max-w-6xl overflow-x-auto rounded  border border-black p-10  print:my-0 print:flex print:min-h-screen print:flex-col print:justify-between print:shadow-none"
      >
        <div className="flex items-center">
          <div className="max-w-[300px] text-left">
            <p className="text-2xl font-bold text-blue-700 underline underline-offset-4">
              {paymentVoucherCompanyInfos.name[0]}
            </p>
            <p>{paymentVoucherCompanyInfos.postal[0]}</p>
            <p>{paymentVoucherCompanyInfos.address[0]}</p>
            <p>{paymentVoucherCompanyInfos.tel[0]}</p>
            <p>{paymentVoucherCompanyInfos.mobile_1[0]}</p>
            <p>{paymentVoucherCompanyInfos.mobile_2[0]}</p>

            <p className="mt-4 flex max-w-[150px] items-center justify-between">
              <span>Dhs درهم</span>
              <span>Fils فلس</span>
            </p>
            <p className="flex max-w-[150px] items-center justify-center border-2 border-black p-2">
              <input className="bg-transparent text-center" type="text" />
            </p>
          </div>

          <div className="mx-auto flex w-[400px] flex-col items-center justify-center">
            <img className="max-h-[100%]" src={logo} alt="TBT Logo" />
            <p className="mt-4 flex flex-col items-center justify-center border-2 border-black p-3 text-2xl font-bold">
              <span>سند صرف</span>
              <span>Payment Voucher</span>
            </p>
          </div>

          <div className="max-w-[300px] text-right">
            <p className="text-2xl font-bold text-blue-700 underline underline-offset-4">
              {paymentVoucherCompanyInfos.name[1]}
            </p>
            <p>{paymentVoucherCompanyInfos.postal[1]}</p>
            <p>{paymentVoucherCompanyInfos.address[1]}</p>
            <p>{paymentVoucherCompanyInfos.tel[1]}</p>
            <p>{paymentVoucherCompanyInfos.mobile_1[1]}</p>
            <p>{paymentVoucherCompanyInfos.mobile_2[1]}</p>

            <p className="mt-5 flex flex-col items-end  justify-center">
              <span>
                No. <span>[{"   "}]</span>
              </span>

              <span>
                DATE
                <span className="rounded-sm p-1 text-sm">
                  <input className="max-w-[90px] text-center" type="text" />
                </span>
                التاريخ
              </span>
            </p>
          </div>
        </div>

        <div
          style={{ printColorAdjust: "exact" }}
          className="mt-5 rounded bg-red-200  p-2 font-semibold underline underline-offset-4"
        >
          <div className="my-5 flex items-center">
            <p className="text-left">Paid To Mr or M/s</p>
            <input
              className="mx-auto w-[60%] rounded bg-slate-50 p-2 text-center text-xl"
              type="text"
            />
            <p>يصرف إلى السيد /السادة</p>
          </div>

          <div className="my-5 flex items-center">
            <p className="text-left">The Sum of Dhs</p>
            <input
              className="mx-auto rounded bg-slate-50 p-2 text-center text-xl"
              type="text"
            />
            <p>مبلغ وقدرة درهم</p>
          </div>

          <div className="my-5 flex items-center gap-1">
            <p className="text-left print:text-sm">Cash / Cheque NO</p>

            <input
              className="mx-auto h-[40px] w-[170px] rounded bg-slate-50 p-2 text-center text-sm"
              type="text"
            />

            <p className="print:text-sm">نقدا / شيك رقم</p>

            <p className="text-left print:text-sm">Bank</p>
            <input
              className="mx-auto h-[40px] w-[170px] rounded bg-slate-50 p-2 text-center text-sm"
              type="text"
            />
            <p className="print:text-sm">بنك</p>

            <p className="text-left print:text-sm">Date</p>
            <input
              className="mx-auto h-[40px] w-[150px] rounded bg-slate-50 p-2 text-center text-sm"
              type="text"
            />
            <p className="print:text-sm">التاريخ</p>
          </div>

          <div className="my-5 flex items-center">
            <p className="text-left">Being</p>
            <input
              className="mx-auto w-[70%] rounded bg-slate-50 p-2 text-center text-xl"
              type="text"
            />
            <p>وذلك عن</p>
          </div>
        </div>

        <div className="mt-20 flex items-center font-semibold">
          <p className="flex flex-col text-left">
            <span>Prepared By</span>
            <span>تم التحضير</span>
          </p>
          <p className="mx-auto flex flex-col">
            <span>Approved By</span>
            <span>المفوض</span>
          </p>
          <p className="flex flex-col text-right">
            <span>Received By</span>
            <span>المستلم</span>
          </p>
        </div>
      </div>
    </>
  );
};
