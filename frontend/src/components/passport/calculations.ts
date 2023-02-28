import dayjs from "dayjs";
import { IPassportDocument } from "../../../../backend/models/passportModel";
import { TotalMonthValues } from "../invoice/calculations";
import { PassportsChartsCalculations } from "./types";

//Calculate Passports' total of [total price, tax rate, taxable, service price, sales, profits]
export const passportsCalculations = (passports: IPassportDocument[]) => {
  let totalValues = {
    totals: 0,
    taxRates: 0,
    taxables: 0,
    servicePrices: 0,
    sales: 0,
    profits: 0,
  };

  passports.map((passport: IPassportDocument) => {
    totalValues.totals += passport?.total || 0;
    totalValues.taxRates += passport?.tax_rate || 0;
    totalValues.taxables += passport?.taxable || 0;
    totalValues.servicePrices += passport?.service_price || 0;
    totalValues.sales += passport?.sales || 0;
    totalValues.profits += passport?.profit || 0;
  });

  return totalValues;
};

//Calculate Passports' Charts Needed Calcualtions
export const passportsChartsCalculations: PassportsChartsCalculations = (
  passports
) => {
  //Totals For Every Month
  let totalMonthValues: TotalMonthValues = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
  };

  //Totals For Last 3 Years
  let totalLastThreeValues: { [year: number]: TotalMonthValues } = {
    [dayjs().year()]: {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
    },
    [dayjs().year() - 1]: {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
    },
    [dayjs().year() - 2]: {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
    },
  };

  //Totals For Passports' Services
  let totalForEveryService: { [service: string]: number } = {
    "30days": 0,
    "60days": 0,
    "90days": 0,
    extend_permission: 0,
    cancel_permission: 0,
    report_request: 0,
    renew_resedency: 0,
    cancel_resedency: 0,
    temp_shutdown_with_escape: 0,
    change_situation: 0,
  };

  //Count The Customers' Top Countries
  const nationalitiesCounter: { [natioanlity: string]: number } = {};

  //Loop Through Passports And Add All Values We Need Each To The Specific Object Defined.
  passports.forEach((passport: IPassportDocument) => {
    const month = dayjs(passport?.payment_date)?.month();
    const year = dayjs(passport?.payment_date)?.year();
    const passportProfit = isNaN(passport?.profit) ? 0 : +passport?.profit;
    const passportService = passport?.service;

    //Month And Year Data
    if (month >= 0 && year) {
      totalMonthValues[month as keyof TotalMonthValues] += passportProfit;

      if (
        totalLastThreeValues?.[year]?.[month as keyof TotalMonthValues] >= 0
      ) {
        totalLastThreeValues[year][month as keyof TotalMonthValues] +=
          passportProfit;
      }
    }

    //Passport Service Data
    if (passportService) {
      totalForEveryService[passportService] += 1;
    }

    //Customer Nationality Data
    if (
      passport?.customer_nationality &&
      nationalitiesCounter.hasOwnProperty(passport.customer_nationality)
    ) {
      nationalitiesCounter[passport.customer_nationality] += 1;
    } else if (passport?.customer_nationality) {
      nationalitiesCounter[passport.customer_nationality] = 1;
    }
  });

  return {
    totalMonthValues: Object.values(totalMonthValues),
    totalLastThreeValues: { ...totalLastThreeValues },
    totalForEveryService: Object.values(totalForEveryService),
    topNationalities: Object.keys(nationalitiesCounter)
      .map((key) => [key, nationalitiesCounter[key]])
      .sort((a, b) => +b[1] - +a[1])
      .slice(0, 5),
  };
};
