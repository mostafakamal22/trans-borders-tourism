import { CompanyInfos } from "./types";

export const lableClassNamesStyles: { default: string; threeCol: string } = {
  default:
    "basis-full sm:basis-1/2 w-full text-md  my-2 sm:my-0 mx-2 p-2  rounded shadow bg-red-200 border-red-800",
  threeCol:
    "basis-full sm:basis-1/6 text-md  my-2 sm:my-0 mx-2 p-2  rounded shadow bg-red-200 border-red-800",
};

export const inputClassNamesStyles: { default: string; threeCol: string } = {
  default:
    "basis-full  sm:basis-1/3  px-3 py-1.5 mx-4 text-base font-normal text-gray-700 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out  focus:text-gray-700 focus:bg-white focus:border-red-800 focus:outline-none",
  threeCol:
    "basis-full sm:basis-1/6 px-2 py-1.5 mx-2 text-base font-normal text-gray-700 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out  focus:text-gray-700 focus:bg-white focus:border-red-800 focus:outline-none",
};

export const tableHeaderTitles: string[] = [
  "حذف الفاتورة",
  "عرض الفاتورة",
  "تاريخ الفاتورة",
  "الإجمالى",
  "رقم الفاتورة",
  "إسم العميل",
];

export const comapanyInfos: CompanyInfos = {
  name: ["TRANS BORDERS TOURISM L.L.C"],
  address: "DUBAI-DEIRA-ABU HAIL",
  website: "https://tbtourism.com",
  email: "Info@tbtourism.com",
  tel: ["045782747"],
  mob: ["+971556620879", "+971507597677"],
};

export const invoiceHeaderTitles = [
  "NO.",
  "Description",
  "Quantity",
  "Price",
  "Total",
];
