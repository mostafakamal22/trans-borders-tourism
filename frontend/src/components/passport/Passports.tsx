import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { FcBusiness } from "react-icons/fc";
import { TiDelete } from "react-icons/ti";
import { UseResetStatus } from "../../hooks/UseResetStatus";
import { resetAdminAuthStatus } from "../../state/features/admin/auth/adminAuthSlice";
import {
  useAppDispatch,
  useAppSelector,
} from "../../state/features/hooks/StateHooks";
import {
  deletePassport,
  resetPassportsStatus,
  updatePassport,
} from "../../state/features/passport/passportSlice";
import FormButton from "../shared/FormButton";
import logo from "../../assets/imgs/trans-logo.png";
import MessagesContainer from "../shared/MessagesContainer";
import { PaginationTable } from "../shared/PaginationTable";
import { MainSpinner } from "../shared/MainSpinner";
import { UpdatePassportState } from "./UpdatePassportState";

const tableHeaderTitles = [
  "Customer Name",
  "Nationality",
  "Passport ID",
  "State",
  "Service",
  "Total Payment",
  "Payment Date",
  "Update State",
  "Delete Passport",
];

type PassportState = {
  accepted: string[];
  rejected: string[];
  refunded: string[];
  delivered: string[];
};

type PassportService = {
  "30days": "٣٠يوم";
  "90days": "٩٠يوم";
  extend_permission: "تمديد إذن دخول";
  report_request: "طلب كشف كفيل ومكفولين";
  renew_resedency: "تجديد إقامة";
  temp_shutdown_with_escape: "إغلاق مؤقت مع بلاغ هروب";
  change_situation: "تعديل وضع";
};

export const passportState: PassportState = {
  accepted: ["تمت الموافقة", "bg-green-200"],
  rejected: ["مرفوض", "bg-red-200"],
  refunded: ["تم استلام الرسوم", "bg-blue-200"],
  delivered: ["تم التسليم للعميل", "bg-yellow-200"],
};

export const passportService: PassportService = {
  "30days": "٣٠يوم",
  "90days": "٩٠يوم",
  extend_permission: "تمديد إذن دخول",
  report_request: "طلب كشف كفيل ومكفولين",
  renew_resedency: "تجديد إقامة",
  temp_shutdown_with_escape: "إغلاق مؤقت مع بلاغ هروب",
  change_situation: "تعديل وضع",
};

export const Passports = () => {
  const { info } = useAppSelector((state) => state.adminAuth);
  const { passportsList } = useAppSelector((state) => state.passportsData);
  const dispatch = useAppDispatch();

  const { isLoading, isError, isSuccess, message } = useAppSelector(
    (state) => state.passportsData
  );

  //search message state
  const [msg, setMsg] = useState("");

  // handle Delete Passport
  const handleRemoving = (e: any, removedPassportID: string) => {
    e.preventDefault();

    //get admin token
    const token = info.token;

    //payload (admin token + id of the passport to delete)
    const passportData = {
      id: removedPassportID,
      token,
    };

    dispatch(deletePassport(passportData));
  };

  // handle Update Passport
  const handleUpdate = (
    e: React.SyntheticEvent,
    passportID: string,
    newState: string,
    oldState: string
  ) => {
    e.preventDefault();

    //get admin token
    const token = info.token;

    //payload (admin token + id of the passport to delete)
    const passportData = {
      id: passportID,
      newState,
      oldState,
      token,
    };

    dispatch(updatePassport(passportData));
  };

  useEffect(() => {
    if (isError) {
      setMsg(message);
    }

    if (isSuccess && message) {
      setMsg(message);
    }
  }, [isError, message, isSuccess, msg]);

  //Define table data
  const tableHeader = (
    <tr className="border-b border-b-black">
      {tableHeaderTitles.map((title) => (
        <th
          key={title}
          scope="col"
          className="py-3 px-3 text-center border-x border-x-black"
        >
          {title}
        </th>
      ))}
    </tr>
  );

  const tableRow = (passport: any, index: number) => {
    return (
      <tr
        key={passport._id}
        className={`${
          index % 2 === 0 ? "bg-white" : "bg-gray-100"
        } border-b border-b-black`}
      >
        {/*Customer Name*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x text-center border-x-black"
        >
          {passport.customer_name}
        </th>

        {/*Customer Nationality*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x text-center border-x-black"
        >
          {passport.customer_nationality}
        </th>

        {/*passport ID*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x text-center border-x-black"
        >
          {passport.passport_id}
        </th>

        {/*passport State*/}
        <th
          scope="row"
          className={`${
            passportState[passport.state as keyof PassportState][1]
          } p-2 text-gray-900 whitespace-nowrap  border-x text-center border-x-black`}
        >
          {passportState[passport.state as keyof PassportState][0]}
        </th>

        {/*passport Service*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x text-center border-x-black"
        >
          {passportService[passport.service as keyof PassportService]}
        </th>

        {/*Total Payment*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x text-center border-x-black"
        >
          {passport.total}
        </th>

        {/*Payment Date*/}
        <th
          scope="row"
          className="p-2  text-gray-900 whitespace-nowrap  border-x text-center border-x-black"
        >
          {dayjs(passport.payment_date).format("DD/MM/YYYY")}
        </th>

        {/* Update State */}
        <th
          scope="row"
          className="p-2 text-gray-900 whitespace-nowrap  border-x text-center border-x-black"
        >
          <UpdatePassportState
            passport={passport}
            handleUpdate={handleUpdate}
          />
        </th>

        {/* Delete passport */}
        <th
          scope="row"
          className="p-2 text-gray-900 whitespace-nowrap  border-x text-center border-x-black"
        >
          <form
            className="max-w-[150px] m-auto"
            onSubmit={(event) => handleRemoving(event, passport._id)}
          >
            <FormButton
              text={{ default: "مسح الجواز" }}
              bgColor={["bg-red-600", "bg-red-700", "bg-red-800"]}
              icon={<TiDelete className="mb-[-2px]" size={25} />}
            />
          </form>
        </th>
      </tr>
    );
  };

  //clean up status (when mount and unmount)
  UseResetStatus(() => {
    dispatch(resetAdminAuthStatus());
    dispatch(resetPassportsStatus());
  });

  UseResetStatus(() => {
    return () => {
      dispatch(resetAdminAuthStatus());
      dispatch(resetPassportsStatus());
    };
  });

  return (
    <div className="max-w-7xl min-h-[75vh] w-full mx-auto my-20 overflow-x-auto  p-6 bg-slate-50 rounded shadow-lg shadow-black/30">
      <h3 className="flex justify-center items-center text-2xl my-10 p-3 text-center font-bold bg-red-200 text-gray-900 border-b-4 border-red-800 rounded shadow">
        <span className="flex justify-center items-center mr-2">
          <FcBusiness size={50} />
        </span>
        ({passportsList && passportsList.length}) الجوازات المحفوظة
      </h3>

      <img className="mx-auto" src={logo} alt="logo" />

      {/*Request Status and Errors*/}
      {(isError || (isSuccess && message)) && (
        <MessagesContainer msg={msg} isSuccess={isSuccess} isError={isError} />
      )}

      {/*Display Table All Data Needed*/}
      {!isLoading && passportsList?.length > 0 && (
        <PaginationTable
          tableRow={tableRow}
          tableHeader={tableHeader}
          tableBodyData={[...passportsList].reverse()}
          rowsPerPage={10}
        />
      )}

      {/* if there is No Passports Records */}
      {passportsList?.length === 0 && !isLoading && (
        <div className="bg-yellow-200 text-gray-800 text-center font-bold my-4 py-4 px-2 border-l-4 border-yellow-600 rounded">
          There No Passports Records Currently!
        </div>
      )}

      {/* Show spinner when Loading State is true */}
      {isLoading && <MainSpinner isLoading={isLoading} />}
    </div>
  );
};
