import scn from "scn";
import { ISettingsEntryProps } from "./index.types";

export const SettingsEntry = ({
  label,
  children,
  className,
}: ISettingsEntryProps) => {
  return (
    <div
      className={scn(
        "flex w-full text-sm justify-between items-center p-2 bg-gray100-light dark:bg-gray100-dark/80 text-black dark:text-white rounded-lg h-10",
        className
      )}
    >
      {label && <span>{label}</span>}
      {children}
    </div>
  );
};
