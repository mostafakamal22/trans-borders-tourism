import { CreditStates } from "./types";

export const ticketsTableHeaderTitles: string[] = [
  "Customer Name",
  "Type",
  "اسم الموظف",
  "الرسوم الغير خاضعه للضريبه",
  "الاجمالى قبل الضريبة",
  "ضريبة القيمة المضافة",
  "سعر البيع شامل الضريبة",
  "صافى الربح",
  "Supplier",
  "Date",
  "تعديل التذكرة",
  // "إضافة فاتورة",
  "مسح التذكرة",
];

export const creditStates: CreditStates = [
  "Paid Amount",
  "Remaining Amount",
  "Payment Method",
];
