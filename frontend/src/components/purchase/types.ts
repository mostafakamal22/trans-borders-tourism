import { IPurchaseDocument } from "../../../../backend/models/purchaseModel";
import { TotalMonthValues } from "../invoice/calculations";

export type PurchaseSearchQueries = {
  year: number | string;
  month: number | string;
  day: number | string;
  type: string;
  supplier: string;
};

// export type PurchaseState = {
//   accepted: string[];
//   rejected: string[];
//   refunded: string[];
//   delivered: string[];
// };

// const purchaseStateQueries = [
//   "accepted",
//   "rejected",
//   "refunded",
//   "delivered",
// ] as const;

// export type PurchaseStateQueries = (typeof purchaseStateQueries)[number];

// export type PurchaseService = {
//   "30days": "٣٠يوم";
//   "60days": "٦٠يوم";
//   "90days": "٩٠يوم";
//   extend_permission: "تمديد إذن دخول";
//   cancel_permission: "إلغاء إذن دخول";
//   cancel_resedency: "إلغاء إقامة";
//   report_request: "طلب كشف كفيل ومكفولين";
//   renew_resedency: "تجديد إقامة";
//   temp_shutdown_with_escape: "إغلاق مؤقت مع بلاغ هروب";
//   change_situation: "تعديل وضع";
// };

// const purchaseServiceQueries = [
//   "30days",
//   "60days",
//   "90days",
//   "extend_permission",
//   "cancel_permission",
//   "report_request",
//   "renew_resedency",
//   "cancel_resedency",
//   "temp_shutdown_with_escape",
//   "change_situation",
// ] as const;

// export type PurchaseServiceQueries = (typeof purchaseServiceQueries)[number];

export type FilterProps = {
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterOpen: boolean;
  setSearchQuery: React.Dispatch<React.SetStateAction<PurchaseSearchQueries>>;
  searchQuery: PurchaseSearchQueries;
  setTableRows: React.Dispatch<React.SetStateAction<number>>;
  tableRows: number;
};

export type FilterSummaryProps = {
  searchQuery: PurchaseSearchQueries;
  count: number;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterOpen: boolean;
};

// export type PurchasesChartsCalculations = (purchases: IPurchaseDocument[]) => {
//   totalMonthValues: number[];
//   totalForEveryService: number[];
//   totalLastThreeValues: {
//     [x: number]: TotalMonthValues;
//   };
//   topNationalities: (string | number)[][];
// };
