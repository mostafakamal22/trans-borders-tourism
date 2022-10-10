import { CSSProperties } from "react";
import { BounceLoader } from "react-spinners";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

function SmallSpinner({ isLoading }: { isLoading: boolean }) {
  return (
    <BounceLoader
      color={"#ffffff"}
      loading={isLoading}
      cssOverride={override}
      size={8}
    />
  );
}

export default SmallSpinner;
