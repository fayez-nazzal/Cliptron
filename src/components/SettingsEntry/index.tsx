import { ISettingsEntryProps } from "./index.types";

export const SettingsEntry = ({ label, children }: ISettingsEntryProps) => {
  return (
    <div className="flex w-full justify-between items-center p-2 px-3 bg-gray-100 rounded-lg">
      <span>{label}</span>
      {children}
    </div>
  );
};
