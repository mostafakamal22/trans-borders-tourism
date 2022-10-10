import { CSSProperties } from "react";
import { BounceLoader } from "react-spinners";

const override: CSSProperties = {
  display: "block",
  margin: "55px auto",
};

function SmallSpinner({ isLoading }: { isLoading?: boolean }) {
  return (
    <BounceLoader
      color={"#ff1717"}
      loading={isLoading}
      cssOverride={override}
      size={70}
    />
  );
}

export default SmallSpinner;
