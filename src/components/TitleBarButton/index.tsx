import { Close } from "@icon-park/react";
import { ITitleBarButtonProps } from "./index.types";

export const TitleBarButton = ({
  icon: Icon,
  onClick,
  className,
}: ITitleBarButtonProps) => {
  return (
    <button
      className={`text-icon-light dark:text-icon-dark p-1 rounded hover:bg-gray200-light dark:hover:bg-gray100-dark ${className}`}
      onClick={onClick}
    >
      <Icon theme="outline" size="22" fill="currentColor" />
    </button>
  );
};
