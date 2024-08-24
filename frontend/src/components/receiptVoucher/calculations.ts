import { IReceiptVoucherDocument } from "../../../../backend/models/receiptVoucherModel";

//Calculate ReceiptVouchers' totals of [cost, sales and profits]
export const receiptVouchersCalculations = (
  receiptVouchers: IReceiptVoucherDocument[]
) => {
  let totalValues = {
    totals: 0,
  };

  receiptVouchers.map((receiptVoucher) => {
    totalValues.totals += receiptVoucher?.amount || 0;
  });

  return totalValues;
};
