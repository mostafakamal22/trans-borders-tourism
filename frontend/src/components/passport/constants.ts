import { PassportState, PassportService } from "./types";

export const passportTableHeaderTitles: string[] = [
  "إسم العميل",
  "الجنسية",
  "رقم الجواز",
  "الوضعية",
  "الخدمة",
  "الرسوم الغير خاضعه للضريبه",
  "ضريبة رسوم الخدمة",
  "رسوم الخدمة",
  "الاجمالى قبل الضريبة",
  "ضريبة القيمة المضافة",
  "سعر البيع شامل الضريبة",
  "صافى الربح",
  "تاريخ الدفع",
  "Payment Method",
  "تعديل الجواز",
  "إضافة فاتورة",
  "مسح الجواز",
];

export const passportState: PassportState = {
  accepted: ["تمت الموافقة", "bg-green-200"],
  rejected: ["مرفوض", "bg-red-200"],
  refunded: ["تم إسترداد الرسوم", "bg-blue-200"],
  delivered: ["تم التسليم للعميل", "bg-yellow-200"],
};

export const passportService: PassportService = {
  "30days": "٣٠يوم",
  "60days": "٦٠يوم",
  "90days": "٩٠يوم",
  extend_permission: "تمديد إذن دخول",
  cancel_permission: "إلغاء إذن دخول",
  report_request: "طلب كشف كفيل ومكفولين",
  renew_resedency: "تجديد إقامة",
  cancel_resedency: "إلغاء إقامة",
  temp_shutdown_with_escape: "إغلاق مؤقت مع بلاغ هروب",
  change_situation: "تعديل وضع",
};

const passportServiceTranslation: Record<string, string> = {
  "٣٠يوم": "One month visa",
  "٦٠يوم": "Two month visa",
  "٩٠يوم": "Three month visa",
  "تمديد إذن دخول": "Extend Entry Permit",
  "إلغاء إذن دخول": "Cancel Entry Permit",
  "طلب كشف كفيل ومكفولين": "Sponsor And Dependents Report",
  "تجديد إقامة": "Renew Residency",
  "إلغاء إقامة": "Cancel Residency",
  "إغلاق مؤقت مع بلاغ هروب": "Temporary Closure With Absconding Report",
  "تعديل وضع": "Change Status",
};

export function getPassportServiceInEnglish(desc: string): string {
  // Desc could include part of the service description, so we need to find the key that is included in desc
  const serviceKey = Object.keys(passportServiceTranslation).find((key) =>
    desc.includes(key),
  );
  if (serviceKey) {
    return passportServiceTranslation[serviceKey];
  } else {
    return desc; // Return the original description if no match is found
  }
}
