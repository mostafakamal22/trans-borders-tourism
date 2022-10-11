import { CSSProperties } from "react";
import { BeatLoader } from "react-spinners";

const override: CSSProperties = {
  margin: "0 0 -6px 4px",
};

function SmallSpinner({ isLoading }: { isLoading?: boolean }) {
  return (
    <BeatLoader
      color={"#ffffff"}
      loading={isLoading}
      cssOverride={override}
      size={8}
    />
  );
}

export default SmallSpinner;
