import { BounceLoader } from "react-spinners";

type MainSpinnerProps = {
  isLoading: boolean;
  spinnerHeight?: string;
  spinnerSize?: number;
};
export const MainSpinner = ({
  isLoading,
  spinnerHeight = "80vh",
  spinnerSize = 70,
}: MainSpinnerProps) => {
  return (
    <div
      style={{ minHeight: spinnerHeight }}
      className="flex justify-center items-center"
    >
      <BounceLoader
        className="m-auto"
        color={"#ff1717"}
        loading={isLoading}
        size={spinnerSize}
      />
    </div>
  );
};
