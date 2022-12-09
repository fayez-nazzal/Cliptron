import { ITextInputProps } from "./index.types";

export const TextInput = ({ ...rest }: ITextInputProps) => {
  return (
    <input
      type="text"
      {...rest}
      className={`border-2 bg-gray-100 focus:border-blue-500-light dark:focus:border-blue-500-dark rounded-lg p-2 focus:outline-none ${
        rest.className ?? ""
      }`}
    />
  );
};
