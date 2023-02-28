import { ChartData, ChartOptions } from "chart.js";
import { Chart } from "react-chartjs-2";
import { barOptions, labels, lineOptions } from "../invoice/Charts";
import dayjs from "dayjs";
import { MainSpinner } from "../shared/MainSpinner";
import { TotalMonthValues } from "../invoice/calculations";
import { useGetTicketsQuery } from "../../state/features/ticket/ticketsApiSlice";
import { useMemo } from "react";
import { ticketsChartsCalculations } from "./calculations";
import { HiArrowNarrowDown, HiArrowNarrowUp } from "react-icons/hi";
import { AiFillPieChart } from "react-icons/ai";
import { pieOptions, polarOptions } from "../passport/Charts";
import { paymentMethods } from "../payment/constants";

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
  const { data: ticketData, isLoading, isFetching } = useGetTicketsQuery({});

  const {
    totalMonthValues,
    totalLastThreeValues,
    topEmployees,
    topSuppliers,
    totalForEveryPaymentMethod,
  } = useMemo(
    () => ticketsChartsCalculations(ticketData?.docs || []),
    [ticketData]
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