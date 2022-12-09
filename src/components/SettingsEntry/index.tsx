import { ISettingsEntryProps } from "./index.types";

export const SettingsEntry = ({ label, children }: ISettingsEntryProps) => {
  return (
    <div className="flex w-full justify-between items-center p-2 px-3 bg-gray100-light dark:bg-gray100-dark/80 text-black dark:text-white rounded-lg min-h-14 h-14 max-h-14">
      {label && <span>{label}</span>}
      {children}
    </div>
  );
};
