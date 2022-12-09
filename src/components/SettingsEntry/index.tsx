import { ISettingsEntryProps } from "./index.types";

export const SettingsEntry = ({ label, children }: ISettingsEntryProps) => {
  return (
    <div className="flex w-full justify-between items-center p-2 px-3 bg-gray-100 rounded-lg min-h-16 h-16 max-h-16">
      {label && <span>{label}</span>}
      {children}
    </div>
  );
};
