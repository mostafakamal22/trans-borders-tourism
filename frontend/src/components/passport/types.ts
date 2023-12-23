import { IPassportDocument } from "../../../../backend/models/passportModel";
import { TotalMonthValues } from "./calculations";

export type PassportSearchQueries = {
  year: number | string;
  month: number | string;
  day: number | string;
  state: { value: PassportStateQueries; checked: boolean }[];
  service: { value: PassportServiceQueries; checked: boolean }[];
  nationality: string;
};

export type PassportState = {
  accepted: string[];
  rejected: string[];
  refunded: string[];
  delivered: string[];
};

const passportStateQueries = [
  "accepted",
  "rejected",
  "refunded",
  "delivered",
] as const;

export type PassportStateQueries = (typeof passportStateQueries)[number];

export type PassportService = {
  "30days": "٣٠يوم";
  "60days": "٦٠يوم";
  "90days": "٩٠يوم";
  extend_permission: "تمديد إذن دخول";
  cancel_permission: "إلغاء إذن دخول";
  cancel_resedency: "إلغاء إقامة";
  report_request: "طلب كشف كفيل ومكفولين";
  renew_resedency: "تجديد إقامة";
  temp_shutdown_with_escape: "إغلاق مؤقت مع بلاغ هروب";
  change_situation: "تعديل وضع";
};

const passportServiceQueries = [
  "30days",
  "60days",
  "90days",
  "extend_permission",
  "cancel_permission",
  "report_request",
  "renew_resedency",
  "cancel_resedency",
  "temp_shutdown_with_escape",
  "change_situation",
] as const;

export type PassportServiceQueries = (typeof passportServiceQueries)[number];

export type FilterProps = {
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterOpen: boolean;
  setSearchQuery: React.Dispatch<React.SetStateAction<PassportSearchQueries>>;
  searchQuery: PassportSearchQueries;
  setTableRows: React.Dispatch<React.SetStateAction<number>>;
  tableRows: number;
};

export type FilterSummaryProps = {
  searchQuery: PassportSearchQueries;
  stateArr: string[];
  serviceArr: string[];
  count: number;
  setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterOpen: boolean;
};

export type PassportsChartsCalculations = (passports: IPassportDocument[]) => {
  totalMonthValues: number[];
  totalForEveryService: number[];
  totalLastThreeValues: {
    [x: number]: TotalMonthValues;
  };
  topNationalities: (string | number)[][];
};
