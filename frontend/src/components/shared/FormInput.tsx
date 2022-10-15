import React, { FC } from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
  labeClassNames: string;
}

export const FormInput: FC<FormInputProps> = ({
  name,
  label,
  labeClassNames,
  ...rest
}) => {
  return (
    <>
      <label className={labeClassNames} htmlFor={name}>
        {label}
      </label>

      <input name={name} {...rest} />
    </>
  );
};
