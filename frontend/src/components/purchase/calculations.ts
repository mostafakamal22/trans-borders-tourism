import { IPurchaseDocument } from "../../../../backend/models/purchaseModel";

//Calculate Purchases' totals of [cost, sales and profits]
export const purchasesCalculations = (purchases: IPurchaseDocument[]) => {
  let totalValues = {
    totals: 0,
  };

  purchases.map((purchase) => {
    totalValues.totals += purchase?.total || 0;
  });

  return totalValues;
};
