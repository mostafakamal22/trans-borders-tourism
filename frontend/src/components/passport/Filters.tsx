import { inputClassNamesStyles } from "../invoice/constants";
import { Fragment } from "react";
import {
  FilterProps,
  FilterSummaryProps,
  PassportService,
  PassportState,
} from "./types";
import { passportService, passportState } from "./constants";
import { FcFilledFilter } from "react-icons/fc";
import { useSearchParams } from "react-router-dom";
import { AiFillCloseCircle } from "react-icons/ai";

export const Filters = ({
  setSearchQuery,
  searchQuery,
  isFilterOpen,
  setIsFilterOpen,
  tableRows,
  setTableRows,
}: FilterProps) => {
  //Get Page Number From URL
  const [URLSearchParams, SetURLSearchParams] = useSearchParams();
  const pageNumber: string | null = URLSearchParams.get("page");

  const { year, month, day, nationality, state, service } = searchQuery;

  let yearRange: number[] = [];
  for (let i = 2010; i <= 2060; i++) {
    yearRange.push(i);
  }

  let monthRange: number[] = [];
  for (let i = 1; i <= 30; i++) {
    monthRange.push(i);
  }

  let dayRange: number[] = [];
  for (let i = 1; i <= 31; i++) {
    dayRange.push(i);
  }

  let tableRowsRange: number[] = [];
  for (let i = 10; i <= 200; i += 10) {
    tableRowsRange.push(i);
  }

  return (
    <div
      className={`${
        isFilterOpen ? "translate-x-0" : "-translate-x-60"
      } duration-350 absolute left-0 top-0 flex h-screen w-60 flex-wrap items-start justify-center gap-4  overflow-x-hidden overflow-y-scroll bg-slate-50 px-4 py-8 text-xs shadow-md transition-all ease-in-out scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 scrollbar-corner-slate-700 scrollbar-track-rounded-full scrollbar-w-0`}
    >
      <button
        className="absolute top-2 right-2 inline-flex items-center text-xs font-bold text-white sm:text-sm"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        type="button"
      >
        <AiFillCloseCircle className="text-red-700" size={30} />
      </button>

      <form className="mx-auto my-4  flex basis-full flex-col  items-center justify-center gap-4 font-semibold">
        <div className="flex flex-col items-center justify-center gap-2">
          <label
            className="w-full rounded bg-red-700 p-2 text-white"
            htmlFor="year"
          >
            السنة
          </label>

          <select
            name="year"
            id="year"
            className={inputClassNamesStyles.default}
            value={year}
            onChange={(e) => {
              if (pageNumber && +pageNumber > 1) {
                SetURLSearchParams({ page: "1" });
              }

              setSearchQuery({
                ...searchQuery,
                year: e.target.value,
              });
            }}
          >
            <option value={""}>{"كل السنوات"}</option>

            {yearRange.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <label
            className="w-full rounded bg-red-700 p-2 text-white"
            htmlFor="month"
          >
            الشهر
          </label>

          <select
            name="month"
            id="month"
            className={inputClassNamesStyles.default}
            value={month}
            onChange={(e) => {
              if (pageNumber && +pageNumber > 1) {
                SetURLSearchParams({ page: "1" });
              }

              setSearchQuery({
                ...searchQuery,
                month: e.target.value,
              });
            }}
          >
            <option value={""}>{"كل الشهور"}</option>

            {monthRange.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <label
            className="w-full rounded bg-red-700 p-2 text-white"
            htmlFor="day"
          >
            اليوم
          </label>
          <select
            name="day"
            id="day"
            className={inputClassNamesStyles.default}
            value={day}
            onChange={(e) => {
              if (pageNumber && +pageNumber > 1) {
                SetURLSearchParams({ page: "1" });
              }
              setSearchQuery({
                ...searchQuery,
                day: e.target.value,
              });
            }}
          >
            <option value={""}>{"كل الايام"}</option>

            {dayRange.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <label
            className="w-full rounded bg-red-700 p-2 text-white"
            htmlFor="tableRows"
          >
            عدد صفوف الجدول
          </label>
          <select
            name="tableRows"
            id="tableRows"
            className={inputClassNamesStyles.default}
            value={tableRows}
            onChange={(e) => {
              if (pageNumber && +pageNumber > 1) {
                SetURLSearchParams({ page: "1" });
              }

              setTableRows(+e.target.value);
            }}
          >
            {tableRowsRange.map((rowNumber) => (
              <option key={rowNumber} value={rowNumber}>
                {rowNumber}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col items-center justify-center gap-2">
          <label
            className="w-full rounded bg-red-700 p-2 text-white"
            htmlFor="nationality"
          >
            الجنسية
          </label>
          <input
            type="text"
            name="nationality"
            id="nationality"
            className={inputClassNamesStyles.default}
            value={nationality}
            placeholder="الجنسية"
            onChange={(e) => {
              if (pageNumber && +pageNumber > 1) {
                SetURLSearchParams({ page: "1" });
              }

              setSearchQuery({
                ...searchQuery,
                nationality: e.target.value,
              });
            }}
          />
        </div>

        <div className="flex basis-full flex-col items-center justify-center gap-2">
          <p className="w-full rounded bg-red-700 p-2 text-white">الوضعية</p>

          <div className="flex flex-row-reverse flex-wrap items-center justify-center gap-2">
            {state?.map(
              (item: { value: string; checked: boolean }, index: number) => (
                <Fragment key={item.value}>
                  <label htmlFor={item.value}>
                    {passportState[item.value as keyof PassportState][0]}
                  </label>

                  <input
                    type="checkbox"
                    id={item.value}
                    name={item.value}
                    value={item.value}
                    checked={item.checked}
                    onChange={() => {
                      if (pageNumber && +pageNumber > 1) {
                        SetURLSearchParams({ page: "1" });
                      }

                      setSearchQuery({
                        ...searchQuery,
                        state: state.map((i, indx: number) => {
                          return {
                            value: i.value,
                            checked: index === indx ? !i.checked : i.checked,
                          };
                        }),
                      });
                    }}
                  />
                </Fragment>
              )
            )}
          </div>
        </div>

        <div className="flex basis-full flex-col items-center justify-center gap-2">
          <p className="w-full rounded bg-red-700 p-2 text-white">الخدمة</p>

          <div className="flex flex-row-reverse flex-wrap items-center justify-center gap-2">
            {service?.map(
              (item: { value: string; checked: boolean }, index: number) => (
                <Fragment key={item.value}>
                  <label htmlFor={item.value}>
                    {passportService[item.value as keyof PassportService]}
                  </label>

                  <input
                    type="checkbox"
                    id={item.value}
                    name={item.value}
                    value={item.value}
                    checked={item.checked}
                    onChange={() => {
                      if (pageNumber && +pageNumber > 1) {
                        SetURLSearchParams({ page: "1" });
                      }

                      setSearchQuery({
                        ...searchQuery,
                        service: service.map((i, indx: number) => {
                          return {
                            value: i.value,
                            checked: index === indx ? !i.checked : i.checked,
                          };
                        }),
                      });
                    }}
                  />
                </Fragment>
              )
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export const FiltersSummary = ({
  searchQuery,
  stateArr,
  serviceArr,
  count,
  setIsFilterOpen,
  isFilterOpen,
}: FilterSummaryProps) => {
  const { year, month, day, nationality, state, service } = searchQuery;

  return (
    <>
      <h3
        id="filterHeader"
        className="relative flex basis-full flex-row-reverse flex-wrap items-center justify-center rounded  bg-red-700 p-3 text-center font-bold text-white shadow"
      >
        <button
          className="absolute top-2 right-2 flex items-center justify-center rounded bg-slate-50 p-2 text-xs font-semibold text-gray-600 shadow sm:text-sm"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          type="button"
        >
          <FcFilledFilter className="mr-1" size={25} />
          {isFilterOpen ? "إغلاق الفلترة" : "فتح الفلترة"}
        </button>

        <p className="mb-5 basis-full text-2xl underline decoration-sky-500 decoration-wavy decoration-2 underline-offset-8">
          فلتــرة الجـــوازات
        </p>
        <span>{" الجوازات المحفوظة"}</span>
        {!month && !day && !year && (
          <span className="mx-1 rounded-md bg-blue-500 p-1 text-white">
            {" الكلية "}
          </span>
        )}
        {month && (
          <span className="mx-1 rounded-md bg-rose-500 p-1 text-white">
            {" عن شهر " + month}
          </span>
        )}
        {day && (
          <span className="mx-1 rounded-md bg-rose-500 p-1 text-white">
            {" يوم " + day}
          </span>
        )}
        {year && (
          <span className="mx-1 rounded-md bg-amber-500 p-1 text-white">
            {" سنة " + year}
          </span>
        )}
        {state && (
          <span className="mx-1 rounded-md bg-emerald-500 p-1 text-white">
            {" والوضعية :- " +
              (stateArr.join() === ""
                ? " [كــل الوضعيات] "
                : stateArr.map(
                    (state: string) =>
                      ` ${passportState[state as keyof PassportState][0]} `
                  ))}
          </span>
        )}

        {service && (
          <span className="mx-1 rounded-md bg-purple-500 p-1 text-white">
            {" والخدمة :- " +
              (serviceArr.join() === ""
                ? " [كــل الخدمـات] "
                : serviceArr.map(
                    (state: string) =>
                      ` ${passportService[state as keyof PassportService]} `
                  ))}
          </span>
        )}

        {nationality && (
          <span className="mx-1 rounded-md bg-pink-500 p-1 text-white">
            {" و الجنسية " + nationality}
          </span>
        )}
        <span>({count})</span>
      </h3>
    </>
  );
};
