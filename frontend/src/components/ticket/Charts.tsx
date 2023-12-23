import { ChartData, ChartOptions } from "chart.js";
import { Chart } from "react-chartjs-2";
import { barOptions, labels, lineOptions } from "../invoice/Charts";
import { MainSpinner } from "../shared/MainSpinner";
import { useGetTicketsStatisticsQuery } from "../../state/features/ticket/ticketsApiSlice";
import { TotalMonthValues } from "./calculations";
import { pieOptions, polarOptions } from "../passport/Charts";
import { paymentMethods } from "../payment/constants";
import { Sales } from "../shared/Sales";
import dayjs from "dayjs";

const tBarOptions: ChartOptions = {
  ...barOptions,
  plugins: {
    ...barOptions.plugins,
    title: {
      ...barOptions?.plugins?.title,
      text: "مجموع صافى الربح كل شهر فى السنة",
    },
  },
};

const tLineOptions: ChartOptions = {
  ...lineOptions,
  plugins: {
    ...lineOptions.plugins,
    title: {
      ...lineOptions.plugins?.title,
      text: "مقارنة صافى الربح اخر 3 سنوات",
    },
  },
};

const tPolarEmployeeOptions: ChartOptions = {
  ...polarOptions,
  plugins: {
    ...polarOptions.plugins,
    title: {
      ...polarOptions.plugins?.title,
      text: "الموظفون الاكثر مبيعاٌ",
    },
  },
};

const tPolarSupplierOptions: ChartOptions = {
  ...polarOptions,
  plugins: {
    ...polarOptions.plugins,
    title: {
      ...polarOptions.plugins?.title,
      text: "الموردون الاكثر تعامل معهم",
    },
  },
};

const tPieOptions: ChartOptions = {
  ...pieOptions,
  plugins: {
    ...pieOptions.plugins,
    title: {
      ...pieOptions.plugins?.title,
      text: "مقارنة بين طرق دفع خدمات التذاكر المختلفة",
    },
  },
};

export function TicketCharts() {
  const { data, isLoading, isFetching, isError } = useGetTicketsStatisticsQuery(
    null,
    {
      pollingInterval: 3600000,
    }
  );

  if (isError) return <div>An error has occurred!</div>;

  if (isLoading || isFetching || !data) {
    return (
      <MainSpinner spinnerHeight="20vh" isLoading={isLoading || isFetching} />
    );
  }

  const {
    totalMonthValues,
    totalLastThreeValues,
    topEmployees,
    topSuppliers,
    totalForEveryPaymentMethod,
  } = data;

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
    labels: [...Object.values(paymentMethods)],
    datasets: [
      {
        label: "عدد مرات الدفع",
        data: [...totalForEveryPaymentMethod],
        backgroundColor: ["#ff4800", "#2b79c7", "#c92a2a", "#cc5de8"],
        borderWidth: 0,
      },
    ],
  };

  const polarEmployeesData: ChartData = {
    labels: [...topEmployees.map((n) => n[0])],
    datasets: [
      {
        label: "عدد المبيعات",
        data: [...topEmployees.map((n) => +n[1])],
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

  const polarSuppliersData: ChartData = {
    labels: [...topSuppliers.map((n) => n[0])],
    datasets: [
      {
        label: "عدد الشراء",
        data: [...topSuppliers.map((n) => +n[1])],
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
        options={tBarOptions}
        data={barData}
        className="w-full  rounded border border-emerald-300 p-2 font-Tajawal shadow md:max-h-96 md:max-w-lg"
      />

      <Chart
        type="line"
        options={tLineOptions}
        data={lineData}
        className="w-full  rounded border border-emerald-300 p-2 font-Tajawal shadow md:max-h-96 md:max-w-lg"
      />

      <Chart
        type="pie"
        options={tPieOptions}
        data={pieData}
        className="w-full  rounded border border-emerald-300 p-2 font-Tajawal shadow md:max-h-96 md:max-w-lg"
      />

      <Chart
        type="polarArea"
        options={tPolarEmployeeOptions}
        data={polarEmployeesData}
        className="w-full  rounded border border-emerald-300 p-2 font-Tajawal shadow md:max-h-96 md:max-w-lg"
      />

      <Chart
        type="polarArea"
        options={tPolarSupplierOptions}
        data={polarSuppliersData}
        className="w-full  rounded border border-emerald-300 p-2 font-Tajawal shadow md:max-h-96 md:max-w-lg"
      />
    </>
  );
}
