// import dayjs from "dayjs";
// import { IInvoiceDocument } from "../../../../backend/models/invoiceModel";

// export type TotalMonthValues = {
//   0: number;
//   1: number;
//   2: number;
//   3: number;
//   4: number;
//   5: number;
//   6: number;
//   7: number;
//   8: number;
//   9: number;
//   10: number;
//   11: number;
// };

// export type InvoicesChartsCalculations = (invoices: IInvoiceDocument[]) => {
//   totalMonthValues: number[];
//   totalLastThreeValues: {
//     [x: number]: TotalMonthValues;
//   };
// };

// //Calculate Invoices' Charts Needed Calcualtions
// export const invoicesChartsCalculations: InvoicesChartsCalculations = (
//   invoices
// ) => {
//   //Totals For Every Month
//   let totalMonthValues: TotalMonthValues = {
//     0: 0,
//     1: 0,
//     2: 0,
//     3: 0,
//     4: 0,
//     5: 0,
//     6: 0,
//     7: 0,
//     8: 0,
//     9: 0,
//     10: 0,
//     11: 0,
//   };

//   //Totals For Last 3 Years
//   let totalLastThreeValues: { [year: number]: TotalMonthValues } = {
//     [dayjs().year()]: {
//       0: 0,
//       1: 0,
//       2: 0,
//       3: 0,
//       4: 0,
//       5: 0,
//       6: 0,
//       7: 0,
//       8: 0,
//       9: 0,
//       10: 0,
//       11: 0,
//     },
//     [dayjs().year() - 1]: {
//       0: 0,
//       1: 0,
//       2: 0,
//       3: 0,
//       4: 0,
//       5: 0,
//       6: 0,
//       7: 0,
//       8: 0,
//       9: 0,
//       10: 0,
//       11: 0,
//     },
//     [dayjs().year() - 2]: {
//       0: 0,
//       1: 0,
//       2: 0,
//       3: 0,
//       4: 0,
//       5: 0,
//       6: 0,
//       7: 0,
//       8: 0,
//       9: 0,
//       10: 0,
//       11: 0,
//     },
//   };

//   invoices.forEach((invoice: IInvoiceDocument) => {
//     const month = dayjs(invoice?.date)?.month();
//     const year = dayjs(invoice?.date)?.year();
//     const invoiceTotal = invoice?.total
//       ? invoice.total
//       : invoice?.details?.[0]?.price;

//     if (month >= 0 && year) {
//       totalMonthValues[month as keyof TotalMonthValues] += invoiceTotal;

//       if (
//         totalLastThreeValues?.[year]?.[month as keyof TotalMonthValues] >= 0
//       ) {
//         totalLastThreeValues[year][month as keyof TotalMonthValues] +=
//           invoiceTotal;
//       }
//     }
//   });

//   return {
//     totalMonthValues: Object.values(totalMonthValues),
//     totalLastThreeValues: { ...totalLastThreeValues },
//   };
// };
