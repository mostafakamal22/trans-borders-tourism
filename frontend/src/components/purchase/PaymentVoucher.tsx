import { useEffect, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { AiFillPrinter } from "react-icons/ai";
import { useGetOnePurchaseQuery } from "../../state/features/purchase/purchaseApiSlice";
import { useScroll } from "../../hooks/useScroll";
import { paymentVoucherCompanyInfos } from "./constants";
import logo from "../../assets/imgs/trans-logo.png";
import ReactToPrint from "react-to-print";
import dayjs from "dayjs";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import DataFetchingSpinner from "../shared/DataFetchingSpinner";
import DataFetchingErrorMessage from "../shared/DataFetchingErrorMessage";

export default function PaymentVoucher() {
  // Initial state
  const initialPurchaseDetails = {
    supplier: "",
    referenceNumber: "",
    total: 0,
    paymentDate: "",
  };

  //state for purchase Details
  const [purchaseDetails, setPurchaseDetails] = useState(
    initialPurchaseDetails
  );

  const purchaseID = useParams()?.id || "";

  //Data fetching
  const {
    data: purchase,
    isLoading,
    error,
  } = useGetOnePurchaseQuery({ id: purchaseID });

  const componentRef = useRef<HTMLDivElement>(null);

  useScroll("showPaymentVoucher");
  useDocumentTitle("عرض السند");

  // Initialize state after data is fetched
  useEffect(() => {
    if (purchase) {
      //Pupurchase Details
      setPurchaseDetails({
        supplier: purchase?.purchase_types[0]?.supplier || "",
        referenceNumber:
          (purchase?.purchase_types[0]?.reference_number as string) || "",
        total: purchase?.purchase_types[0]?.total || 0,
        paymentDate: purchase?.date
          ? dayjs(purchase?.date).format("YYYY-MM-DD")
          : "",
      });
    }
  }, [purchase]);

  //Show Error Message if could not fetch data
  if (error) {
    if ("originalStatus" in error && error.originalStatus === 404)
      return <Navigate to={"/not-found"} />;
    return <DataFetchingErrorMessage />;
  }

  //Show spinner when Loading State is true
  if (!purchase || isLoading) return <DataFetchingSpinner />;

  const { supplier, referenceNumber, total, paymentDate } = purchaseDetails;

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
        id="showPaymentVoucher"
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
            <p className="flex  max-w-[150px] items-center border-2 border-black">
              <span className="border-r-2 border-black p-2">
                {Math.floor(total)}
              </span>
              <span className=" ml-auto p-2">
                {(total % 1).toFixed(2).split(".")[1]}
              </span>
            </p>
          </div>

          <div className="mx-auto flex w-[400px] flex-col items-center  justify-center">
            <img className="max-h-[100%]" src={logo} alt="TbT Logo" />
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

            <p className="mt-5 flex flex-col items-end justify-center text-xl">
              <span>
                No.{" "}
                <span
                  style={{ printColorAdjust: "exact" }}
                  className="rounded-sm bg-red-100 p-1"
                >
                  [
                  {paymentDate
                    ? dayjs(paymentDate).format(
                        `YYYYMMDD-${dayjs(
                          purchase?.createdAt as string
                        ).hour()}`
                      )
                    : dayjs(purchase?.createdAt as string).format(
                        `YYYYMMDD-${dayjs(
                          purchase?.createdAt as string
                        ).hour()}`
                      )}
                  ]
                </span>
              </span>

              <span>
                {" "}
                DATE التاريخ
                <span
                  style={{ printColorAdjust: "exact" }}
                  className="rounded-sm bg-red-100 p-1"
                >
                  {paymentDate
                    ? dayjs(purchase.date).format("DD/MM/YYYY")
                    : "-"}
                </span>
              </span>
            </p>
          </div>
        </div>

        <div
          style={{ printColorAdjust: "exact" }}
          className="mt-5 rounded bg-red-200  p-2 font-semibold underline underline-offset-4"
        >
          <div className="my-5 flex items-center p-2">
            <p className="text-left">Paid To Mr or M/s</p>
            <p
              style={{ printColorAdjust: "exact" }}
              className="mx-auto w-[60%] rounded  bg-slate-50 p-2 text-xl"
            >
              {supplier}
            </p>
            <p>يصرف إلى السيد /السادة</p>
          </div>

          <div className="my-5 flex  items-center p-2">
            <p className="text-left">The Sum of Dhs</p>
            <p
              style={{ printColorAdjust: "exact" }}
              className="mx-auto rounded  bg-slate-50 p-2 text-xl"
            >
              {total?.toFixed(2)}
            </p>
            <p>مبلغ وقدرة درهم</p>
          </div>

          <div className="my-5 flex items-center gap-1 p-2">
            <p className="text-left">Cash / Cheque NO</p>
            <p
              style={{ printColorAdjust: "exact" }}
              className="mx-auto h-[40px] w-[200px] rounded  bg-slate-50 p-2 text-xl"
            ></p>
            <p>نقدا / شيك رقم</p>

            <p className="text-left font-semibold">Bank</p>
            <p
              style={{ printColorAdjust: "exact" }}
              className="mx-auto h-[40px] w-[200px] rounded  bg-slate-50 p-2 text-xl"
            >
              {referenceNumber}
            </p>
            <p>بنك</p>

            <p className="text-left">Date</p>
            <p
              style={{ printColorAdjust: "exact" }}
              className="mx-auto rounded  bg-slate-50 p-2 text-xl"
            >
              {paymentDate ? dayjs(purchase.date).format("DD/MM/YYYY") : "-"}
            </p>
            <p>التاريخ</p>
          </div>

          <div className="my-5 flex items-center p-2">
            <p className="text-left">Being</p>
            <p className="mx-auto h-[40px] w-[70%] rounded  bg-slate-50 p-2 text-xl"></p>
            <p>وذلك عن</p>
          </div>
        </div>

        <div className="mt-10 flex items-center font-semibold">
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
}
