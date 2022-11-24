import { useEffect, useState } from "react";
import { TiChevronLeft, TiChevronRight } from "react-icons/ti";

type PaginationProps = {
  range: number[];
  setPage: any;
  page: number;
  slice: any;
};

const Pagination = ({ range, setPage, page, slice }: PaginationProps) => {
  const [pageQuery, setPageQuery] = useState<number>(1);

  // useEffect(() => {
  //   if (slice.length < 1 && page !== 1) {
  //     console.log(slice.length);
  //     setPage({ page: page - 1 });
  //   }
  // }, [slice, page, setPage]);

  return (
    <div className="flex items-center justify-center flex-wrap gap-4 my-10">
      {/* Show Page Count */}
      <div className="text-sm font-semibold">
        <span>{`عرض الصفحة  (${page}) من (${range.length})`}</span>
      </div>

      {/* Table Pages */}
      <nav className="text-center">
        <ul className="flex items-center gap-1 flex-wrap mx-2">
          {/* Go To Prev Page Button*/}
          <li>
            <button
              title={`${page !== 1 ? "Previous Page" : ""}`}
              onClick={() => setPage({ page: page - 1 })}
              disabled={page === 1}
              className="flex justify-center items-center min-w-[40px] p-2 leading-tight text-red-900 border border-red-300 rounded hover:bg-red-100 hover:text-black disabled:cursor-not-allowed disabled:bg-gray-200 disabled:border-gray-500 disabled:text-black"
            >
              <TiChevronLeft size={20} />
            </button>
          </li>

          {/* More Previous Pages To Show && First Page Button */}
          {range.length > 5 && page > 3 && (
            <>
              <li onClick={() => setPage({ page: range[0] })}>
                <button
                  title={`Go First Page`}
                  className="p-2 leading-tight text-sm text-red-900 font-semibold border border-red-300 rounded hover:bg-red-100 hover:text-black"
                >
                  {"الصفحة الأولى"}
                </button>
              </li>

              <li className="min-w-[40px] flex justify-center items-center mr-1 p-2 leading-tight font-bold text-red-900 border border-red-300 rounded hover:bg-red-100 hover:text-black">
                {"...."}
              </li>
            </>
          )}

          {/* Case OF Table Pages <= 5 Pages*/}
          {range.length <= 5 &&
            range.map((pageNumber: number) => (
              <li
                key={pageNumber}
                onClick={() => setPage({ page: pageNumber })}
              >
                <button
                  title={`Go Page ${pageNumber}`}
                  className={`${
                    pageNumber === page && "bg-red-100"
                  } min-w-[40px] p-2 leading-tight text-red-900 border border-red-300 rounded hover:bg-red-100 hover:text-black`}
                >
                  {pageNumber}
                </button>
              </li>
            ))}

          {/* Case OF Table Pages > 5 Pages*/}
          {range.length > 5 &&
            range
              .slice(
                page > 2 ? page - 3 : 0,
                page < range.length - 2 ? page + 2 : page + 1
              )
              .map((pageNumber: number) => (
                <li
                  key={pageNumber}
                  onClick={() => setPage({ page: pageNumber })}
                >
                  <button
                    title={`Go Page ${pageNumber}`}
                    className={`${
                      pageNumber === page && "bg-red-100"
                    } min-w-[40px] p-2 leading-tight text-red-900 border border-red-300 rounded hover:bg-red-100 hover:text-black`}
                  >
                    {pageNumber}
                  </button>
                </li>
              ))}

          {/* More Next Pages To Show && Last Page Button */}
          {range.length > 5 && page < range.length - 1 && (
            <>
              <li className="min-w-[40px] flex justify-center items-center p-2 ml-1 leading-tight font-bold text-red-900 border border-red-300 rounded hover:bg-red-100 hover:text-black">
                {"...."}
              </li>

              <li onClick={() => setPage({ page: range.length })}>
                <button
                  title={`Go Last Page`}
                  className="p-2 leading-tight text-sm text-red-900 font-semibold border border-red-300 rounded hover:bg-red-100 hover:text-black"
                >
                  {"الصفحة الأخيرة"}
                </button>
              </li>
            </>
          )}

          {/* Go To Next Page Button*/}
          <li>
            <button
              title={`${page !== range.length ? "Next Page" : ""}`}
              onClick={() => setPage({ page: page + 1 })}
              disabled={page === range.length}
              className="flex justify-center items-center min-w-[40px] p-2 leading-tight text-red-900 border border-red-300 rounded hover:bg-red-100 hover:text-black disabled:cursor-not-allowed disabled:bg-gray-200 disabled:border-gray-500 disabled:text-black"
            >
              <TiChevronRight size={20} />
            </button>
          </li>
        </ul>
      </nav>

      {/* Show Page Count */}
      <div className="max-w-[200px] flex flex-row-reverse justify-center items-center flex-wrap gap-2 text-sm font-semibold">
        <label htmlFor="goPage">اختر الصفحة</label>
        <input
          className="max-w-[80px] p-2 bg-red-100 border border-red-500 text-center rounded focus:outline-none focus:border-blue-700"
          type={"number"}
          name="goPage"
          min={1}
          max={range.length}
          value={pageQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPageQuery(+e.target.value);
          }}
        />
        <div className="basis-full">
          <button
            className="bg-blue-800 px-4 py-2 text-white font-semibold border rounded hover:border-blue-700 hover:bg-white hover:text-blue-700"
            type="button"
            onClick={() => {
              if (range.includes(pageQuery) && page !== pageQuery) {
                setPage({ page: pageQuery });
              }
            }}
          >
            ذهاب للصفحة
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
