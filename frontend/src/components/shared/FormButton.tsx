import SmallSpinner from "./SmallSpinner";

type FormButtonProps = {
  icon: React.ReactElement;
  text?: { loading?: string; default?: string };
  isLoading?: boolean;
  bgColor?: string[];
};
export default function FormButton({
  icon,
  text,
  isLoading = false,
  bgColor = ["bg-blue-600", "bg-blue-700", "bg-blue-800"],
}: FormButtonProps) {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className={
        `${bgColor[0]} hover:${bgColor[1]} focus:${bgColor[1]}  active:${bgColor[2]}` +
        " text-md flex min-h-[2.5rem] w-full items-center justify-center rounded px-3 py-2.5 font-bold leading-tight text-white shadow-md transition duration-150 ease-in-out focus:shadow-lg  focus:outline-none focus:ring-0 disabled:cursor-not-allowed hover:shadow-lg active:shadow-lg"
      }
    >
      {!isLoading && icon}
      <SmallSpinner isLoading={isLoading} />

      <span className="inline-block ">
        {isLoading ? text?.loading : text?.default}
      </span>
    </button>
  );
}
