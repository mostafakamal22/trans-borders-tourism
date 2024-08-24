import { IPaymentVoucherDocument } from "../../../../backend/models/paymentVoucherModel";

//Calculate PaymentVouchers' totals of [cost, sales and profits]
export const paymentVouchersCalculations = (
  paymentVouchers: IPaymentVoucherDocument[]
) => {
  let totalValues = {
    totals: 0,
  };

  paymentVouchers.map((paymentVoucher) => {
    totalValues.totals += paymentVoucher?.amount || 0;
  });

  return totalValues;
};
