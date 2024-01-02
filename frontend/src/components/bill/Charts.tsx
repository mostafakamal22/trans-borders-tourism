import { ChartData, ChartOptions } from "chart.js";
import { Chart } from "react-chartjs-2";
import { useGetBillsStatisticsQuery } from "../../state/features/bill/billApiSlice";
import { MainSpinner } from "../shared/MainSpinner";
import { labels } from "../invoice/Charts";
import dayjs from "dayjs";

export const barOptions: ChartOptions = {
  scales: {
    y: {
      ticks: {
        callback: function (value) {
          return "Dhs " + value;
        },
        color: "#c92a2a",
        font: {
          weight: "bold",
        },
      },
      position: "right",
    },
    x: {
      ticks: {
        color: "rgb(0, 0, 0)",
        font: {
          family: "'Tajawal', 'sans-serif'",
          weight: "bold",
        },
      },
      reverse: true,
    },
  },
  plugins: {
    tooltip: {
      rtl: true,
      titleAlign: "right",
      textDirection: "rtl",
    },
    title: {
      display: true,
      text: "مجموع الفواتير كل شهر فى السنة",
      font: {
        size: 20,
        family: "'Tajawal', 'sans-serif'",
      },
      color: "rgb(2, 132, 253)",
    },
  },
};

export const lineOptions: ChartOptions = {
  scales: {
    y: {
      ticks: {
        callback: function (value) {
          return "Dhs " + value;
        },
        color: "#c92a2a",
        font: {
          weight: "bold",
        },
      },
      position: "right",
    },
    x: {
      ticks: {
        color: "rgb(0, 0, 0)",
        font: {
          family: "'Tajawal', 'sans-serif'",
          weight: "bold",
        },
      },
      reverse: true,
    },
  },
  plugins: {
    tooltip: {
      rtl: true,
      titleAlign: "right",
      textDirection: "rtl",
    },
    title: {
      display: true,
      text: "مقارنة مجموع الفواتير اخر 3 سنوات",
      font: {
        size: 20,
        family: "'Tajawal', 'sans-serif'",
      },
      color: "rgb(2, 132, 253)",
    },
  },
};

export function BillCharts() {
  const { data, isLoading, isError } = useGetBillsStatisticsQuery(null, {
    pollingInterval: 3600000,
  });

  if (isError) return <div>An error has occurred!</div>;

  if (isLoading || !data) {
    return <MainSpinner spinnerHeight="20vh" isLoading={true} />;
  }

  const { totalLastThreeValues, totalMonthValues } = data;

  const barData: ChartData = {
    labels: labels,
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

  return (
    <>
      <Chart
        type="bar"
        options={barOptions}
        data={barData}
        className="w-full rounded border border-emerald-300 p-2 font-Tajawal shadow md:max-h-96 md:max-w-lg"
      />

      <Chart
        type="line"
        options={lineOptions}
        data={lineData}
        className="w-full rounded border border-emerald-300 p-2 font-Tajawal shadow md:max-h-96 md:max-w-lg"
      />
    </>
  );
}
