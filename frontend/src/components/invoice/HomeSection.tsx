import { InvoiceCharts } from "./Charts";

type Props = {
  heading: string;
};

export default function HomeSection({ heading }: Props) {
  return (
    <section
      id="invoices"
      className="my-10 flex flex-col items-center justify-center gap-10 font-semibold md:flex-row md:flex-wrap"
    >
      <h2 className="mb-2 w-full basis-full rounded bg-red-800 p-2 text-2xl text-white">
        {heading}
      </h2>

      <InvoiceCharts />
    </section>
  );
}
