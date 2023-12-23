import dayjs from "dayjs";
import { IPassportDocument } from "../../../../backend/models/passportModel";
import { calculateTax } from "./Table";

//Calculate Passports' total of [total price, tax rate, taxable, service price, sales, profits]
export const passportsCalculations = (passports: IPassportDocument[]) => {
  let totalValues = {
    totals: 0,
    taxRates: 0,
    taxables: 0,
    servicePrices: 0,
    sales: 0,
    profits: 0,
    taxes: 0,
  };

  passports.map((passport: IPassportDocument) => {
    const cutoffDate = dayjs("2023-05-01");

    const isPassportBefore1May2023 = dayjs(passport?.payment_date).isBefore(
      cutoffDate
    );

    totalValues.totals += passport?.total || 0;
    totalValues.taxRates += passport?.tax_rate || 0;
    totalValues.taxables += passport?.taxable || 0;
    totalValues.servicePrices += passport?.service_price || 0;
    totalValues.sales += passport?.sales || 0;
    totalValues.profits += passport?.profit || 0;
    totalValues.taxes += isPassportBefore1May2023 ? 0 : +calculateTax(passport);
  });

  return totalValues;
};

export type TotalMonthValues = {
  0: number;
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  7: number;
  8: number;
  9: number;
  10: number;
  11: number;
};
