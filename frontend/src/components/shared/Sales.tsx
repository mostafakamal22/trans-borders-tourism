import dayjs from "dayjs";
import { AiFillPieChart } from "react-icons/ai";
import { HiArrowNarrowDown, HiArrowNarrowUp } from "react-icons/hi";

type SalesProps = {
  salesThisMonth: number;
  salesThisYear: number;
};

export const Sales = ({ salesThisMonth, salesThisYear }: SalesProps) => {
  return (
    <div className="flex basis-full flex-wrap items-center justify-center gap-4 rounded bg-gradient-to-r from-cyan-600 to-cyan-400 py-4 px-16 text-white shadow-md">
      <div className="flex flex-grow basis-60 flex-col items-center justify-center rounded bg-white/30 p-4 shadow backdrop-blur-lg">
        <p className="my-2 flex items-center justify-center text-2xl">
          {new Intl.NumberFormat("ar", {
            style: "currency",
            currency: "AED",
          }).format(salesThisMonth)}

          {salesThisMonth >= 0 ? (
            <HiArrowNarrowUp
              className="text-green-400 drop-shadow-md"
              size={25}
            />
          ) : (
            <HiArrowNarrowDown
              className="text-red-400 drop-shadow-md"
              size={25}
            />
          )}
        </p>

        <AiFillPieChart size={60} />

        <p className="text-3xl">الأرباح هذا الشهر</p>

        <hr className="my-2 w-full border-b border-white/70" />
        <p>{dayjs().format("h:mm a [أخر تحديث اليوم]")}</p>
      </div>

      <div className="flex flex-grow basis-60 flex-col items-center justify-center rounded bg-white/30 p-4 shadow backdrop-blur-lg">
        <p className="my-2 flex items-center justify-center text-2xl">
          {new Intl.NumberFormat("ar", {
            style: "currency",
            currency: "AED",
          }).format(salesThisYear)}

          {salesThisYear >= 0 ? (
            <HiArrowNarrowUp
              className="text-green-400 drop-shadow-md"
              size={25}
            />
          ) : (
            <HiArrowNarrowDown
              className="text-red-400 drop-shadow-md"
              size={25}
            />
          )}
        </p>

        <AiFillPieChart size={60} />

        <p className="text-3xl">الأرباح هذة السنة</p>

        <hr className="my-2 w-full border-b border-white/70" />
        <p>{dayjs().format("h:mm a [أخر تحديث اليوم]")}</p>
      </div>
    </div>
  );
};
