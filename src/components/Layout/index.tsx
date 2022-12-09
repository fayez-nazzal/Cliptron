import { TitleBar } from "../TitleBar/index";
import { ILayoutProps } from "./index.types";

export const Layout = ({ children }: ILayoutProps) => {
  return (
    <div className="w-full h-screen rounded-xl relative overflow-hidden">
      <TitleBar />

      <div className="pt-12 bg-white">{children}</div>
    </div>
  );
};
