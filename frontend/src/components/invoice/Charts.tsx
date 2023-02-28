import { useMemo } from "react";
import { CategoryScale, ChartData, ChartOptions } from "chart.js";
import {
  Chart as ChartJS,
  BarElement,
  Tooltip,
  LinearScale,
  Legend,
  Title,
  LineElement,
  PointElement,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { invoicesChartsCalculations } from "./calculations";
import { useGetInvoicesQuery } from "../../state/features/invoice/invoiceApiSlice";
import dayjs from "dayjs";
import { MainSpinner } from "../shared/MainSpinner";

ChartJS.register(
  BarElement,
  Tooltip,
  LinearScale,
  CategoryScale,
  Legend,
  Title,
  LineElement,
  PointElement
);

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

export const labels = [
  "يناير",
  "فبراير",
  "مارس",
  "ابريل",
  "مايو",
  "يونيو",
  "يوليو",
  "اغسطس",
  "سبتمبر",
  "اكتوبر",
  "نوفمبر",
  "ديسمبر",
];

export function InvoiceCharts() {
  const { data: invoiceData, isLoading, isFetching } = useGetInvoicesQuery({});

  const { totalMonthValues, totalLastThreeValues } = useMemo(
    () => invoicesChartsCalculations(invoiceData?.docs || []),
    [invoiceData]
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

  if (isLoading || isFetching) {
    return (
      <MainSpinner spinnerHeight="20vh" isLoading={isLoading || isFetching} />
    );
  }

  return (
    <>
      <Chart
        type="bar"
        options={barOptions}
        data={barData}
        className="w-full  rounded border border-emerald-300 p-2 font-Tajawal shadow md:max-h-96 md:max-w-lg"
      />

      <Chart
        type="line"
        options={lineOptions}
        data={lineData}
        className="w-full  rounded border border-emerald-300 p-2 font-Tajawal shadow md:max-h-96 md:max-w-lg"
      />
    </>
  );
}
