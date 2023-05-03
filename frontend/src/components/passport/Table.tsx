import dayjs from "dayjs";
import { passportService, passportTableHeaderTitles } from "./constants";
import { PassportService } from "./types";
import { AiFillEdit, AiFillFileAdd } from "react-icons/ai";
import FormButton from "../shared/FormButton";
import { TiDelete } from "react-icons/ti";
import { IPassportDocument } from "../../../../backend/models/passportModel";
import { TableRowProps } from "../shared/PaginationTable";

//Define table data
export const tableHeader = (
  <tr className="border-y border-y-black">
    {[...passportTableHeaderTitles]
      .reverse()
      .slice(0, 9)
      .map((title) => (
        <th
          key={title}
          scope="col"
          className="max-w-[100px] border-x border-x-black p-1 text-center"
        >
          {title}
        </th>
      ))}

    {[...passportTableHeaderTitles]
      .reverse()
      .slice(10, 11)
      .map((title) => (
        <th
          key={title}
          scope="col"
          className="max-w-[100px] border-x border-x-black p-1 text-center"
        >
          {title}
        </th>
      ))}

    {[...passportTableHeaderTitles]
      .reverse()
      .slice(12)
      .map((title) => (
        <th
          key={title}
          scope="col"
          className="max-w-[100px] border-x border-x-black p-1 text-center"
        >
          {title}
        </th>
      ))}
    <th scope="col" className="border-x border-x-black p-1 text-center">
      م
    </th>
  </tr>
);

export const tableRow = ({
  basicOptions,
  extraOptions,
}: TableRowProps<IPassportDocument>) => {
  const { item: passport, index, tableBodyData } = basicOptions;
  const {
    handleRemoving,
    handleAddInvoice,
    isCreatingInvoice,
    isDeleting,
    setId,
    setIsOpen,
  } = extraOptions;

  const tax = calculateTax(passport);

  const cutoffDate = dayjs("2023-05-01");

  const isPassportBefore1May2023 = dayjs(passport?.payment_date).isBefore(
    cutoffDate
  );

  return (
    <tr
      key={passport?.id}
      className={`${
        index % 2 === 0 ? "bg-white" : "bg-gray-100"
      } border-b border-b-black`}
    >
      {/* Delete passport */}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        <form
          className="m-auto max-w-[50px]"
          onSubmit={(event) => handleRemoving(event, passport?.id)}
        >
          <FormButton
            bgColor={["bg-red-600", "bg-red-700", "bg-red-800"]}
            icon={<TiDelete size={20} />}
            isLoading={isDeleting}
          />
        </form>
      </th>

      {/* Make Invoice */}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        <form
          className="m-auto max-w-[50px]"
          onSubmit={(event) =>
            handleAddInvoice?.(
              event,
              passport?.customer_name,
              passport?.service,
              passport?.payment_date!,
              passport?.sales,
              `After-30-4 ${passport?.service_price}`
            )
          }
        >
          <FormButton
            bgColor={["bg-orange-600", "bg-orange-700", "bg-orange-800"]}
            icon={<AiFillFileAdd size={20} />}
            isLoading={isCreatingInvoice}
          />
        </form>
      </th>

      {/* Update Passport */}
      <th
        scope="row"
        className="border-x border-x-black p-1 text-center text-gray-900"
      >
        <button
          className="flex w-full items-center justify-center rounded border border-transparent bg-blue-800 px-3 py-2.5 text-xs font-bold text-white transition-all duration-300 ease-in-out
          hover:border-blue-800 hover:bg-white hover:text-blue-800"
          onClick={() => {
            setId?.(passport?.id);
            setIsOpen?.(true);
          }}
        >
          <AiFillEdit size={20} />
        </button>
      </th>

      {/*Payment Date*/}
      <th
        scope="row"
        className="border-x  border-x-black p-1 text-center text-gray-900"
      >
        {passport?.payment_date
          ? dayjs(passport?.payment_date).format("DD/MM/YYYY")
          : "-"}
      </th>

      {/*Profit*/}
      <th
        scope="row"
        className="border-x  border-x-black  p-1 text-center text-gray-900"
      >
        {passport?.profit}
      </th>

      {/*Sales*/}
      <th
        scope="row"
        className="border-x  border-x-black  p-1 text-center text-gray-900"
      >
        {passport?.sales}
      </th>

      {/*Tax*/}
      <th
        scope="row"
        className="border-x  border-x-black  p-1 text-center text-gray-900"
      >
        {isPassportBefore1May2023 ? "-" : tax}
      </th>

      {/*Total Payment*/}
      <th
        scope="row"
        className="border-x  border-x-black  p-1 text-center text-gray-900"
      >
        {passport?.total}
      </th>

      {/*Service Taxable*/}
      <th
        scope="row"
        className="border-x  border-x-black  p-1 text-center text-gray-900"
      >
        {passport?.taxable}
      </th>

      {/*Service Price*/}
      <th
        scope="row"
        className="border-x  border-x-black  p-1 text-center text-gray-900"
      >
        {passport?.service_price}
      </th>

      {/*passport Service*/}
      <th
        scope="row"
        className="max-w-[90px] border-x border-x-black  p-1 text-center text-gray-900"
      >
        {passportService[passport.service as keyof PassportService]}
      </th>

      {/*passport State*/}
      {/* <th
        scope="row"
        className={`${
          passportState[passport.state as keyof PassportState][1]
        } border-x border-x-black  p-1 text-center text-gray-900`}
      >
        {passportState[passport.state as keyof PassportState][0]}
      </th> */}

      {/*passport ID*/}
      <th
        scope="row"
        className="border-x  border-x-black  p-1 text-center text-gray-900"
      >
        {passport?.passport_id}
      </th>

      {/*Customer Nationality*/}
      <th
        scope="row"
        className="border-x  border-x-black p-1 text-center text-gray-900"
      >
        {passport?.customer_nationality ? passport.customer_nationality : "-"}
      </th>

      {/*Customer Name*/}
      <th
        scope="row"
        className="border-x  border-x-black bg-red-200 p-1 text-center text-gray-900"
      >
        {passport?.customer_name}
      </th>

      {/*passport NO*/}
      <th
        scope="row"
        className="text-gray-90  border-x border-x-black p-1 text-center"
      >
        {tableBodyData.findIndex(
          (p: IPassportDocument) => p.id === passport?.id
        ) + 1}
      </th>
    </tr>
  );
};

export const calculateTax = (passport: IPassportDocument): string => {
  const tax = passport?.sales - passport?.total;

  return tax.toFixed(2);
};
