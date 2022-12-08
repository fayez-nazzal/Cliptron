import { Close, Setting, Clear } from "@icon-park/react";
import { clear_history, hide_window } from "../../actions/tauri";
import { TitleBarButton } from "../TitleBarButton/index";
import { useAtom } from "jotai";
import { historyAtom } from "../../atoms/history";

export const TitleBar = () => {
  const [history] = useAtom(historyAtom);

  const onClose = () => {
    hide_window();
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
        onClick={() => {}}
        className="hover:text-blue-500"
      />

      <div className="mr-auto text-sm pointer-events-none">
        {history.length} copied items
      </div>

      <TitleBarButton
        icon={Clear}
        onClick={clear_history}
        className="mr-1 hover:text-green-500"
      />
    </div>
  );
};
