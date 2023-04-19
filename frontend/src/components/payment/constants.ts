import { PaymentMethods, PaymentTypes } from "./types";

export const paymentTableHeaderTitles = [
  "مسح المصروف",
  "تعديل المصروف",
  "المبلغ الكلى",
  "شرح المصـروف",
  "طريقة دفع المصـروف",
  "نوع المصروف",
  "تاريخ المصروف",
];

export const paymentTypes: PaymentTypes = {
  bank_payments: "مصاريف بنكية",
  papers: "مصاريف أدوات مكتبية",
  office: "مصاريف مكتب",
  rent: "إيجارات",
  transportation: "مصاريف انتقالات",
  water_and_electricity: "مصاريف مياة وكهرباء",
  Commission: "مصاريف عمولات",
  payrolls: "رواتب",
  consultations: "مصاريف استشارات",
  marketing: "مصاريف تسويق",
  end_of_service: "مصاريف نهايه الخدمه",
  destroyed_devices: "مصاريف اهلاك اصول ثابته",
  other: "مصاريف أخرى",
};

export const paymentMethods: PaymentMethods = {
  bank: "بنكى",
  cash: "نقدى",
  credit: "credit",
  later: "اجل",
};
