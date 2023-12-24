import { MainSpinner } from "./MainSpinner";

export default function DataFetchingSpinner() {
  return (
    <div className="w-full">
      <MainSpinner isLoading={true} />
    </div>
  );
}
