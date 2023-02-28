import { InvoiceCharts } from "../invoice/Charts";
import { useScroll } from "../../hooks/useScroll";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import logo from "../../assets/imgs/trans-logo.png";
import { PassportCharts } from "../passport/Charts";
import { TicketCharts } from "../ticket/Charts";

const mainHeadings: string[] = [
  "الفواتير",
  "الجوازات",
  "التذاكـر",
  "التأشيرات",
  "المصروفات",
  "المشتريات",
  "المعاملات البنكية",
];

export const Home = () => {
  useDocumentTitle("الصفحة الرئيسية");
  useScroll("main");

  return (
    <main id="main" className="w-full">
      <header className="my-4 flex items-center justify-center rounded bg-gradient-to-r from-cyan-400 to-blue-500 bg-fixed p-3 shadow md:max-h-[12rem]">
        <img className="max-h-full w-[70%] max-w-full" src={logo} alt="logo" />
      </header>

      {/* Invoices Section */}
      <section
        id="invoices"
        className="my-10 flex flex-col items-center justify-center gap-10 font-semibold md:flex-row md:flex-wrap"
      >
        <h2 className="mb-2 w-full basis-full rounded bg-red-800 p-2 text-2xl text-white">
          {mainHeadings[0]}
        </h2>

        <InvoiceCharts />
      </section>

      {/* Passports Section */}
      <section
        id="passports"
        className="my-10 flex flex-col items-center justify-center gap-10 font-semibold md:flex-row md:flex-wrap"
      >
        <h2 className="mb-2 w-full basis-full rounded bg-red-800 p-2 text-2xl text-white">
          {mainHeadings[1]}
        </h2>

        <PassportCharts />
      </section>

      {/* Tickets Section */}
      <section
        id="Tickets"
        className="my-10 flex flex-col items-center justify-center gap-10 font-semibold md:flex-row md:flex-wrap"
      >
        <h2 className="mb-2 w-full basis-full rounded bg-red-800 p-2 text-2xl text-white">
          {mainHeadings[2]}
        </h2>

        <TicketCharts />
      </section>
    </main>
  );
};
