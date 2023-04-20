import { FcFilledFilter } from "react-icons/fc";
import { FilterProps, FilterSummaryProps } from "./types";
import { inputClassNamesStyles } from "../invoice/constants";
import { useSearchParams } from "react-router-dom";
import { AiFillCloseCircle } from "react-icons/ai";

export const Filters = ({
  setSearchQuery,
  searchQuery,
  tableRows,
  setTableRows,
  isFilterOpen,
  setIsFilterOpen,
}: FilterProps) => {
  let tableRowsRange: number[] = [];
  for (let i = 10; i <= 200; i += 10) {
    tableRowsRange.push(i);
  }

  //Get Page Number From URL
  const [URLSearchParams, SetURLSearchParams] = useSearchParams();
  const pageNumber: string | null = URLSearchParams.get("page");

  return (
    <div
      id="filters"
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

      <form className="mx-auto my-4 flex flex-col justify-start  gap-4 font-semibold">
        <div className="flex basis-full flex-col items-center justify-center gap-2">
          <label
            htmlFor="searchQuery"
            className="w-full rounded bg-red-700 p-2 text-white"
          >
            إسم العميل
          </label>
          <input
            type="text"
            id="searchQuery"
            name="searchQuery"
            className={inputClassNamesStyles.default}
            placeholder="بحث عن الفاتورة بالإسم"
            value={searchQuery}
            onChange={(e) => {
              if (pageNumber && +pageNumber > 1) {
                SetURLSearchParams({ page: "1" });
              }
              setSearchQuery(e.target.value);
            }}
          />
        </div>

        <div className="flex w-full flex-col items-center justify-center gap-2 font-semibold">
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
      </form>
    </div>
  );
};

export const FiltersSummary = ({
  searchQuery,
  isFilterOpen,
  setIsFilterOpen,
  count,
}: FilterSummaryProps) => {
  return (
    <h3
      id="filterHeader"
      className="relative flex basis-full flex-row-reverse flex-wrap items-center justify-center rounded  bg-red-700 p-3 text-center font-bold text-white shadow"
    >
      <button
        id="openFilters"
        className="absolute top-2 right-2 flex items-center justify-center rounded bg-slate-50 p-2 text-xs font-semibold text-gray-600 shadow sm:text-sm"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        type="button"
      >
        <FcFilledFilter className="mr-1" size={25} />
        {isFilterOpen ? "إغلاق الفلترة" : "فتح الفلترة"}
      </button>

      <p className="mb-5 basis-full text-2xl underline decoration-sky-500 decoration-wavy decoration-2 underline-offset-8">
        فلتــرة الفــواتيــر
      </p>
      <span>{" الفـواتيـر المحفوظة"}</span>
      {!searchQuery && (
        <span className="mx-1 rounded-md bg-blue-500 p-1 text-white">
          {" الكلية "}
        </span>
      )}
      {searchQuery && (
        <span className="mx-1 rounded-md bg-rose-500 p-1 text-white">
          {" إسم العميل " + searchQuery}
        </span>
      )}

      <span>({count})</span>
    </h3>
  );
};
