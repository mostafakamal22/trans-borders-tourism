import { useScroll } from "../../hooks/useScroll";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import logo from "../../assets/imgs/trans-logo.png";
import TicketsSection from "../ticket/HomeSection";
import PassportsSection from "../passport/HomeSection";
import InvoicesSection from "../invoice/HomeSection";
import BillsSection from "../bill/HomeSection";

const mainHeadings: string[] = [
  "(قديمة) الفواتير",
  "(جديدة) الفواتير",
  "الجوازات",
  "التذاكـر",
];

export default function Home() {
  useDocumentTitle("الصفحة الرئيسية");
  useScroll("main");

  return (
    <main id="main" className="w-full">
      <header className="my-4 flex items-center justify-center rounded bg-gradient-to-r from-cyan-400 to-blue-500 bg-fixed p-3 shadow md:max-h-[12rem]">
        <img className="max-h-full w-[70%] max-w-full" src={logo} alt="logo" />
      </header>

      {/* Invoices Section */}
      <InvoicesSection heading={mainHeadings[0]} />

      {/* Bills Section */}
      <BillsSection heading={mainHeadings[1]} />

      {/* Passports Section */}
      <PassportsSection heading={mainHeadings[2]} />

      {/* Tickets Section */}
      <TicketsSection heading={mainHeadings[3]} />
    </main>
  );
}
