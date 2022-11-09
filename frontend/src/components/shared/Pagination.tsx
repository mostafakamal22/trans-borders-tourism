import { useEffect } from "react";

const Pagination = ({ range, setPage, page, slice }: any) => {
  useEffect(() => {
    if (slice.length < 1 && page !== 1) {
      setPage(page - 1);
    }
  }, [slice, page, setPage]);
  return (
    <nav className="mx-auto my-5 text-center">
      <ul className="inline-flex items-center gap-1 flex-wrap mx-2">
        {range.map((el: any, index: number) => (
          <li key={index} onClick={() => setPage(el)}>
            <button
              className={`${
                el === page && "bg-red-100"
              } min-w-[40px] p-2 leading-tight text-red-900 border border-red-300 rounded hover:bg-red-100 hover:text-black`}
            >
              {el}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;
