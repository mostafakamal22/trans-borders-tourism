import { IPurchaseDocument } from "../../../../backend/models/purchaseModel";
import { purchasesCalculations } from "./calculations";

const totalsHeaders: string[] = ["القيمة", "الإجمالى"];

export const Totals = ({ purchases }: { purchases: IPurchaseDocument[] }) => {
  const { totals } = purchasesCalculations(purchases);

  const tableBody: string[][] = [["تكلفة المشتــريات", totals.toFixed(2)]];

  //Define table data
  const tableHeader = (
    <tr className="border-b border-b-teal-500">
      {totalsHeaders.map((title: string) => (
        <th
          key={title}
          scope="col"
          className="border-x border-x-teal-500 py-3 px-3 text-center"
        >
          {title}
        </th>
      ))}
    </tr>
  );

  const tableRow = (total: string[], index: number) => {
    return (
      <tr
        key={total[0]}
        className={`${
          index % 2 === 0 ? "bg-white" : "bg-red-100"
        } border-b border-b-teal-500`}
      >
        {/*Total Type*/}
        <th
          scope="row"
          className="whitespace-nowrap  border-x border-x-teal-500  p-2  text-center text-gray-900"
        >
          {total[1]}
        </th>

        {/*Total Value*/}
        <th
          scope="row"
          className="whitespace-nowrap  border-x border-x-teal-500  p-2  text-center text-gray-900"
        >
          {total[0]}
        </th>
      </tr>
    );
  };

  return (
    <div className="my-5 rounded-md bg-red-700 p-4 ">
      <h4 className="mb-5 p-3 text-center text-2xl font-bold text-white underline decoration-sky-500 decoration-wavy decoration-2 underline-offset-8">
        إجماليات الصفحة
      </h4>

      <div className="my-5  rounded">
        <table className="w-full text-sm font-bold text-gray-500 ">
          <thead className="bg-red-100 uppercase text-gray-900">
            {tableHeader}
          </thead>
          <tbody>
            {tableBody.map((row, index: number) => tableRow(row, index))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
