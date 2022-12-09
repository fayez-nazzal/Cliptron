import { ISettingsEntryProps } from "./index.types";

export const SettingsEntry = ({ label, children }: ISettingsEntryProps) => {
  return (
    <label className="flex w-full justify-between items-center p-2 px-3 bg-gray-100 hover:bg-gray-200 rounded-lg px-2">
      <span>{label}</span>
      {children}
    </label>
  );
};
