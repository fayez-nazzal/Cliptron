import { ITextInputProps } from "./index.types";

export const TextInput = ({ ...rest }: ITextInputProps) => {
  return (
    <input
      type="text"
      {...rest}
      className={`border-2 border-gray300-light dark:border-gray300-dark bg-gray100-light dark:bg-gray100-dark focus:border-blue-500-light dark:focus:border-blue-500-dark rounded-lg p-2 focus:outline-none ${
        rest.className ?? ""
      }`}
    />
  );
};
