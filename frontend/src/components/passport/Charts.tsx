import { useMemo } from "react";
import {
  BarElement,
  CategoryScale,
  ChartData,
  ChartOptions,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  RadialLinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { barOptions, labels, lineOptions } from "../invoice/Charts";
import { useGetPassportsQuery } from "../../state/features/passport/passportsApiSlice";
import dayjs from "dayjs";
import { MainSpinner } from "../shared/MainSpinner";
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement } from "chart.js";
import { passportsChartsCalculations } from "./calculations";
import { passportService } from "./constants";
import { AiFillPieChart } from "react-icons/ai";
import { HiArrowNarrowDown, HiArrowNarrowUp } from "react-icons/hi";
import { TotalMonthValues } from "../invoice/calculations";

ChartJS.register(
  ArcElement,
  RadialLinearScale,
  BarElement,
  Tooltip,
  LinearScale,
  CategoryScale,
  Legend,
  Title,
  LineElement,
  PointElement
);

const PBarOptions: ChartOptions = {
  ...barOptions,
  plugins: {
    ...barOptions.plugins,
    title: {
      ...barOptions?.plugins?.title,
      text: "مجموع صافى الربح كل شهر فى السنة",
    },
  },
};

const pLineOptions: ChartOptions = {
  ...lineOptions,
  plugins: {
    ...lineOptions.plugins,
    title: {
      ...lineOptions.plugins?.title,
      text: "مقارنة صافى الربح اخر 3 سنوات",
    },
  },
};

export const pieOptions: ChartOptions = {
  plugins: {
    tooltip: {
      rtl: true,
      titleAlign: "right",
      textDirection: "rtl",
    },
    title: {
      display: true,
      text: "مقارنة بين مبيعات خدمات الجوازات المختلفة",
      font: {
        size: 20,
        family: "'Tajawal', 'sans-serif'",
      },
      color: "rgb(2, 132, 253)",
    },
  },
};

export const polarOptions: ChartOptions = {
  plugins: {
    tooltip: {
      rtl: true,
      titleAlign: "right",
      textDirection: "rtl",
    },
    title: {
      display: true,
      text: "الجنسيات الخمسة الاكثر مبيعاٌ",
      font: {
        size: 20,
        family: "'Tajawal', 'sans-serif'",
      },
      color: "rgb(2, 132, 253)",
    },
  },
};

export function PassportCharts() {
  const {
    data: passportData,
    isLoading,
    isFetching,
  } = useGetPassportsQuery({});

  const {
    totalMonthValues,
    totalLastThreeValues,
    totalForEveryService,
    topNationalities,
  } = useMemo(
    () => passportsChartsCalculations(passportData?.docs || []),
    [passportData]
  );

  const barData: ChartData = {
    labels,
    datasets: [
      {
        type: "bar" as const,
        label: "المجموع",
        backgroundColor: "rgb(75, 192, 192)",
        data: totalMonthValues.map((value: number) =>
          parseInt(value.toString())
        ),
      },
    ],
  };

  const lineData: ChartData = {
    labels,
    datasets: [
      {
        type: "line" as const,
        label: `مجموع عام ${dayjs().year()}`,
        backgroundColor: "#c92a2a",
        borderColor: "#c92a2a",
        data: Object.values(totalLastThreeValues[dayjs().year()]).map(
          (value: number) => parseInt(value.toString())
        ),
      },
      {
        type: "line" as const,
        label: `مجموع عام ${dayjs().year() - 1}`,
        backgroundColor: "rgb(72, 73, 185)",
        borderColor: "rgb(72, 73, 185)",
        data: Object.values(totalLastThreeValues[dayjs().year() - 1]).map(
          (value: number) => parseInt(value.toString())
        ),
      },

      {
        type: "line" as const,
        label: `مجموع عام ${dayjs().year() - 2}`,
        backgroundColor: "rgb(45, 185, 63)",
        borderColor: "rgb(45, 185, 63)",
        data: Object.values(totalLastThreeValues[dayjs().year() - 2]).map(
          (value: number) => parseInt(value.toString())
        ),
      },
    ],
  };

  const pieData: ChartData = {
    labels: [...Object.values(passportService)],
    datasets: [
      {
        label: "عدد المبيعات",
        data: [...totalForEveryService],
        backgroundColor: [
          "#d9480f",
          "#343a40",
          "#c92a2a",
          "#cc5de8",
          "#a61e4d",
          "#1864ab",
          "#087f5b",
          "#fcc2d7",
          "#ffc078",
          "#fff3bf",
        ],
        borderWidth: 0,
      },
    ],
  };

  const polarData: ChartData = {
    labels: [...topNationalities.map((n) => n[0])],
    datasets: [
      {
        label: "عدد المبيعات",
        data: [...topNationalities.map((n) => +n[1])],
        backgroundColor: [
          "rgb(255, 0, 55)",
          "rgb(0, 144, 240)",
          "rgb(253, 181, 0)",
          "rgb(0, 253, 253)",
          "rgb(83, 0, 250)",
        ],
        borderWidth: 0,
      },
    ],
  };

  const salesThisMonth =
    parseInt(
      totalLastThreeValues[dayjs().year()][
        dayjs().month() as keyof TotalMonthValues
      ].toString()
    ) -
    parseInt(
      totalLastThreeValues[dayjs().year()][
        (dayjs().month() - 1) as keyof TotalMonthValues
      ].toString()
    );

  if (isLoading || isFetching) {
    return (
      <MainSpinner spinnerHeight="20vh" isLoading={isLoading || isFetching} />
    );
  }

  return (
    <>
      <div className="flex basis-full  flex-col items-center justify-center rounded bg-gradient-to-r from-cyan-600 to-cyan-400 py-4 px-16 text-white shadow-md">
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

      <Chart
        type="bar"
        options={PBarOptions}
        data={barData}
        className="w-full  rounded border border-emerald-300 p-2 font-Tajawal shadow md:max-h-96 md:max-w-lg"
      />

      <Chart
        type="line"
        options={pLineOptions}
        data={lineData}
        className="w-full  rounded border border-emerald-300 p-2 font-Tajawal shadow md:max-h-96 md:max-w-lg"
      />

      <Chart
        type="pie"
        options={pieOptions}
        data={pieData}
        className="w-full  rounded border border-emerald-300 p-2 font-Tajawal shadow md:max-h-96 md:max-w-lg"
      />

      <Chart
        type="polarArea"
        options={polarOptions}
        data={polarData}
        className="w-full  rounded border border-emerald-300 p-2 font-Tajawal shadow md:max-h-96 md:max-w-lg"
      />
    </>
  );
}
