import { Close, Setting, Clear } from "@icon-park/react";
import { clear_history, hide_window } from "../../actions/tauri";
import { TitleBarButton } from "../TitleBarButton/index";
import { useAtom } from "jotai";
import { historyAtom } from "../../atoms/history";
import { useRouter } from "next/router";
import Image from "next/image";
import Icon from "@assets/icon.png";

export const TitleBar = () => {
  const [history] = useAtom(historyAtom);
  const router = useRouter();

  const onClose = () => {
    hide_window();
  };

  const onSettings = () => {
    router.push(router.pathname === "/settings" ? "/" : "/settings");
  };

  const onClear = () => {
    clear_history();
  };

  return (
    <div
      data-tauri-drag-region
      className="flex items-center flex-row-reverse p-2 border-b-2 h-12 w-full absolute"
      id="titlebar-close"
    >
      <TitleBarButton
        icon={Close}
        onClick={onClose}
        className="hover:text-red-500"
      />

      <TitleBarButton
        icon={Setting}
        onClick={onSettings}
        className={`hover:text-blue-400 ${
          router.pathname === "/settings" ? "text-blue-500-light" : ""
        }`}
      />

      <div
        className={`mr-auto text-sm pointer-events-none ${
          router.pathname !== "/" ? "hidden" : ""
        }`}
      >
        {history.length} copied items
      </div>

      <TitleBarButton
        icon={Clear}
        onClick={onClear}
        className={`mr-1 hover:text-green-500 ${
          router.pathname !== "/" ? "hidden" : ""
        }`}
      />

      <div
        className={`mr-auto ml-1 text-sm pointer-events-none flex items-center gap-1 ${
          router.pathname === "/" ? "hidden" : ""
        }`}
      >
        <Image src={Icon} width={20} height={20} />
        <span className="translate-y-[1px] capitalize">Cliptron</span>
      </div>
    </div>
  );
};
