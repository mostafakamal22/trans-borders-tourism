import { useEffect } from "react";
import { useErrorBoundary } from "react-error-boundary";

export default function ErrorFallback({ error }: { error: Error }) {
  const { resetBoundary } = useErrorBoundary();

  useEffect(() => {
    console.log("Error From ErrorFallback");
    console.log(error);
    console.log(error.message);
  }, []);

  return (
    <div role="alert" className="w-full">
      <p className="my-4 rounded border-l-4 border-red-600 bg-red-200 p-2 text-center text-base font-bold uppercase text-gray-800">
        .حدث خطأ، برجاء تحديث الصفحة او المحاولة لاحقاً
      </p>

      <button
        type="button"
        className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white focus:ring-4 focus:ring-blue-300 hover:bg-blue-800"
        onClick={resetBoundary}
      >
        {" "}
        تحديث الصفحة
      </button>
    </div>
  );
}
