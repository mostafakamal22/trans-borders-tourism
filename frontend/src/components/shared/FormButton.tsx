import SmallSpinner from "./SmallSpinner";

type FormButtonProps = {
  icon: any;
  text: { loading?: string; default?: string };
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
        " w-full flex items-center justify-center px-6 py-2.5 text-white font-bold text-md leading-tight rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0  active:shadow-lg disabled:cursor-not-allowed transition duration-150 ease-in-out"
      }
    >
      <span className="inline-block ">
        {isLoading ? text.loading : text.default}
      </span>
      {!isLoading && icon}
      <SmallSpinner isLoading={isLoading} />
    </button>
  );
}
