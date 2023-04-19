import { IPaymentDocument } from "../../../../backend/models/paymentModel";

//Calculate Payments' totals of [cost, sales and profits]
export const paymentsCalculations = (payments: IPaymentDocument[]) => {
  let totalValues = {
    totals: 0,
  };

  payments.map((payment) => {
    totalValues.totals += payment?.total || 0;
  });

  return totalValues;
};
