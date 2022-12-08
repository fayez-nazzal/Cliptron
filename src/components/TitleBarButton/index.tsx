import { Close } from "@icon-park/react";
import { ITitleBarButtonProps } from "./index.types";

export const TitleBarButton = ({
  icon: Icon,
  onClick,
  className,
}: ITitleBarButtonProps) => {
  return (
    <button
      className={`text-[#444] ${className} p-1 rounded hover:bg-gray-200`}
      onClick={onClick}
    >
      <Icon theme="outline" size="22" fill="currentColor" />
    </button>
  );
};
