import { TitleBar } from "../TitleBar/index";
import { ILayoutProps } from "./index.types";

export const Layout = ({ children }: ILayoutProps) => {
  return (
    <div className="w-full h-screen rounded-xl bg-bg-light dark:bg-bg-dark relative overflow-hidden text-black dark:text-white">
      <TitleBar />

      <div className="h-full pt-12">
        <div className="h-full overflow-auto">{children}</div>
      </div>
    </div>
  );
};
