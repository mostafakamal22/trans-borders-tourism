import { useState } from "react";
import { RiExchangeFill } from "react-icons/ri";
import FormButton from "../shared/FormButton";

export const UpdatePassportState = ({ passport, handleUpdate }: any) => {
  //state for passport's status
  const [PassportState, setPassportState] = useState(passport.state);

  return (
    <form
      className="flex flex-col justify-center items-center mx-auto"
      onSubmit={(event) =>
        handleUpdate(event, passport._id, PassportState, passport.state)
      }
    >
      <select
        className="my-2 p-2 rounded"
        value={PassportState}
        onChange={(e) => setPassportState(e.target.value)}
      >
        <option value={"accepted"}>تمت الموافقة</option>
        <option value={"rejected"}>مرفوض</option>
        <option value={"refunded"}>تم استرداد الرسوم</option>
        <option value={"delivered"}>تم التسليم للعميل</option>
      </select>
      <FormButton
        text={{ default: "تعديل الوضعية" }}
        icon={<RiExchangeFill className="mb-[-2px] mr-1" size={25} />}
      />
    </form>
  );
};
