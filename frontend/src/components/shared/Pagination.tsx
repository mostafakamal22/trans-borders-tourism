import { Document } from "mongoose";
import { useEffect, useState } from "react";
import { TiChevronLeft, TiChevronRight } from "react-icons/ti";
import { ListResponse } from "../../state/features/passport/passportsApiSlice";

type PaginationProps = {
  options: ListResponse<Document>;
  setPage: ({ page }: { page: number }) => void;
  slice: Document[];
};

const Pagination = ({ options, setPage }: PaginationProps) => {
  const { page, totalPages, hasNextPage, hasPrevPage, nextPage, prevPage } =
    options;

  //Create a range array from TotalPages number
  let range: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    range.push(i);
  }
  const [pageQuery, setPageQuery] = useState<number>(page!);

  // useEffect(() => {
  //   if (slice.length < 1 && page !== 1) {
  //     console.log(slice.length);
  //     setPage({ page: page - 1 });
  //   }
  // }, [slice, page, setPage]);

  return (
    <div className="my-10 mx-auto flex w-full flex-wrap items-center justify-center gap-4">
      {/* Show Page Count */}
      <div className="text-sm font-semibold">
        <span>{`عرض الصفحة  (${page}) من (${totalPages})`}</span>
      </div>

      {/* Table Pages */}
      <nav className="text-center">
        <ul className="mx-2 flex flex-wrap items-center gap-1">
          {/* Go To Prev Page Button*/}
          <li>
            <button
              title={`${page !== 1 ? "Previous Page" : ""}`}
              onClick={() => setPage({ page: prevPage ? prevPage : 1 })}
              disabled={!hasPrevPage}
              className="flex min-w-[40px] items-center justify-center rounded border border-red-300 p-2 leading-tight text-red-900 disabled:cursor-not-allowed disabled:border-gray-500 disabled:bg-gray-200 disabled:text-black hover:bg-red-100 hover:text-black"
            >
              <TiChevronLeft size={20} />
            </button>
          </li>

          {/* More Previous Pages To Show && First Page Button */}
          {totalPages > 5 && page > 3 && (
            <>
              <li onClick={() => setPage({ page: range[0] })}>
                <button
                  title={`Go First Page`}
                  className="rounded border border-red-300 p-2 text-sm font-semibold leading-tight text-red-900 hover:bg-red-100 hover:text-black"
                >
                  {"الصفحة الأولى"}
                </button>
              </li>

              <li className="mr-1 flex min-w-[40px] items-center justify-center rounded border border-red-300 p-2 font-bold leading-tight text-red-900 hover:bg-red-100 hover:text-black">
                {"...."}
              </li>
            </>
          )}

          {/* Case OF Table Pages <= 5 Pages*/}
          {totalPages <= 5 &&
            range.map((pageNumber: number) => (
              <li
                key={pageNumber}
                onClick={() => setPage({ page: pageNumber })}
              >
                <button
                  title={`Go Page ${pageNumber}`}
                  className={`${
                    pageNumber === page && "bg-red-100"
                  } min-w-[40px] rounded border border-red-300 p-2 leading-tight text-red-900 hover:bg-red-100 hover:text-black`}
                >
                  {pageNumber}
                </button>
              </li>
            ))}

          {/* Case OF Table Pages > 5 Pages*/}
          {totalPages > 5 &&
            range
              .slice(
                page > 2 ? page - 3 : 0,
                page < totalPages - 2 ? page + 2 : page + 1
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
                    } min-w-[40px] rounded border border-red-300 p-2 leading-tight text-red-900 hover:bg-red-100 hover:text-black`}
                  >
                    {pageNumber}
                  </button>
                </li>
              ))}

          {/* More Next Pages To Show && Last Page Button */}
          {totalPages > 5 && page < totalPages - 1 && (
            <>
              <li className="ml-1 flex min-w-[40px] items-center justify-center rounded border border-red-300 p-2 font-bold leading-tight text-red-900 hover:bg-red-100 hover:text-black">
                {"...."}
              </li>

              <li onClick={() => setPage({ page: totalPages })}>
                <button
                  title={`Go Last Page`}
                  className="rounded border border-red-300 p-2 text-sm font-semibold leading-tight text-red-900 hover:bg-red-100 hover:text-black"
                >
                  {"الصفحة الأخيرة"}
                </button>
              </li>
            </>
          )}

          {/* Go To Next Page Button*/}
          <li>
            <button
              title={`${page !== totalPages ? "Next Page" : ""}`}
              onClick={() => setPage({ page: nextPage ? nextPage : 1 })}
              disabled={!hasNextPage}
              className="flex min-w-[40px] items-center justify-center rounded border border-red-300 p-2 leading-tight text-red-900 disabled:cursor-not-allowed disabled:border-gray-500 disabled:bg-gray-200 disabled:text-black hover:bg-red-100 hover:text-black"
            >
              <TiChevronRight size={20} />
            </button>
          </li>
        </ul>
      </nav>

      {/* Show Page Count */}
      <div className="flex max-w-[200px] flex-row-reverse flex-wrap items-center justify-center gap-2 text-sm font-semibold">
        <label htmlFor="goPage">اختر الصفحة</label>
        <input
          className="max-w-[80px] rounded border border-red-500 bg-red-100 p-2 text-center focus:border-blue-700 focus:outline-none"
          type={"number"}
          name="goPage"
          min={1}
          max={totalPages}
          value={pageQuery}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setPageQuery(+e.target.value);
          }}
        />
        <div className="basis-full">
          <button
            className="rounded border bg-blue-800 px-4 py-2 font-semibold text-white hover:border-blue-700 hover:bg-white hover:text-blue-700"
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
