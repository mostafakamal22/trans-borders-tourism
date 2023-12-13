import { useMemo } from "react";
import {
  ChartData,
  ChartOptions,
  PieController,
  PolarAreaController,
  RadialLinearScale,
} from "chart.js";
import { barOptions, labels, lineOptions } from "../invoice/Charts";
import { useGetPassportsQuery } from "../../state/features/passport/passportsApiSlice";
import dayjs from "dayjs";
import { MainSpinner } from "../shared/MainSpinner";
import { Chart } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement } from "chart.js";
import { passportsChartsCalculations, TotalMonthValues } from "./calculations";
import { passportService } from "./constants";
import { Sales } from "../shared/Sales";

ChartJS.register(
  ArcElement,
  RadialLinearScale,
  PolarAreaController,
  PieController
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

  //Sales This Month
  const salesThisMonth: number =
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

  //Sales This Year
  const salesThisYear: number =
    parseInt(
      Object.values(totalLastThreeValues[dayjs().year()])
        .reduceRight((prevTotal, currMonth) => prevTotal + currMonth, 0)
        .toString()
    ) -
    parseInt(
      Object.values(totalLastThreeValues[dayjs().year() - 1])
        .reduceRight((prevTotal, currMonth) => prevTotal + currMonth, 0)
        .toString()
    );

  if (isLoading || isFetching) {
    return (
      <MainSpinner spinnerHeight="20vh" isLoading={isLoading || isFetching} />
    );
  }

  return (
    <>
      <Sales salesThisMonth={salesThisMonth} salesThisYear={salesThisYear} />

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
