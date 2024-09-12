import SmallSpinner from "./SmallSpinner";

type Props = {};

export default function ConvertingMessage({}: Props) {
  return (
    <div className="my-4 flex items-center justify-center gap-2 rounded border-l-4 border-red-600 bg-blue-200 p-2 text-center font-bold text-gray-800">
      <SmallSpinner />

      <span>برجاء الانتظار قليلاً</span>
      <span>, PDF</span>
      <span>جاري تحويل البيانات لملفات</span>
    </div>
  );
}
