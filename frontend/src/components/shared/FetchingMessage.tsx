import SmallSpinner from "./SmallSpinner";

export const FetchingMessage = ({ isFetching }: { isFetching: boolean }) => {
  return (
    <div className="my-4 flex items-center justify-center gap-2 rounded border-l-4 border-yellow-600 bg-green-200 p-2 text-center font-bold text-gray-800">
      <SmallSpinner isLoading={isFetching} /> جارى التحديث التلقائى للبيانات
    </div>
  );
};
