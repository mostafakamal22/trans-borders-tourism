export const NoSavedRecords = ({ customMsg }: { customMsg: string[] }) => {
  return (
    <div className="my-4 rounded border-l-4 border-yellow-600 bg-yellow-200 py-4 px-2 text-center font-bold text-gray-800">
      .
      {`لا يوجد ${customMsg[0]} محفوظة الان, يرجى إضافة ${customMsg[1]} لعرضها`}
    </div>
  );
};
