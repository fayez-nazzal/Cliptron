import { IActionButtonProps } from "./index.types";
import { Copy } from "@icon-park/react";
import { recopy_at_index } from "../../actions/tauri";

export const ActionButton = ({
  icon: Icon,
  label,
  onClick,
  className,
}: IActionButtonProps) => {
  return (
    <button
      className={`flex flex-row items-center w-full h-7 px-2 hover:bg-gray200-light dark:hover:bg-gray300-dark rounded-md text-icon-light dark:text-icon-dark ${className}`}
      onClick={onClick}
    >
      <Icon theme="outline" size="18" fill="currentColor" />
      <div className="ml-2 text-xs">{label}</div>
    </button>
  );
};
