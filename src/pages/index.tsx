import { Delete, DownloadComputer, Copy } from "@icon-park/react";
import { invoke } from "@tauri-apps/api/tauri";
import { register } from "@tauri-apps/api/globalShortcut";
import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { historyAtom } from "../atoms/history";
import { useAtom } from "jotai";
import { get_history, recopy_at_index } from "../actions/tauri";
import { ActionButton } from "../components/ActionButton/index";

const App = () => {
  const [history, setHistory] = useAtom(historyAtom);

  const onShortcut = async () => {
    const mouse_position = (await invoke("get_mouse_position")) as [
      number,
      number
    ];

    const { appWindow, LogicalPosition } = require("@tauri-apps/api/window");

    appWindow.setPosition(
      new LogicalPosition(mouse_position[0], mouse_position[1])
    );

    appWindow.show();
    appWindow.setAlwaysOnTop(true);
  };

  const updateHistory = async () => {
    const history = await get_history();

    setHistory(history);
  };

  useEffect(() => {
    updateHistory();

    register("CONTROL+SPACE", onShortcut);

    listen("history", () => {
      updateHistory();
    });
  }, []);

  return (
    <div className="h-full pt-12">
      <div className="overflow-auto h-full">
        {history.map((item, index) => (
          <div className="relative flex border-b-2 p-2 group transition-all hover:bg-gray-50">
            <button
              key={index}
              className="flex-1 text-left max-h-44 overflow-auto"
              onClick={() => recopy_at_index(index)}
            >
              {item.startsWith("data:image") ? (
                <img
                  src={item}
                  className="flex-1 rounded-md max-w-[180px] max-h-40"
                />
              ) : (
                <div className="flex-1 text-ellipsis break-words">{item}</div>
              )}
            </button>

            <div className="h-20 duration-500 transition-all">
              <div className=" top-1/2 -translate-y-1/2 right-[0.5rem] flex w-20  group-hover:opacity-100 opacity-0 duration-500 transition-all absolute rounded-md bg-gray-50/90 flex-col justify-center items-center">
                <ActionButton
                  icon={Copy}
                  label="Copy"
                  onClick={() => recopy_at_index(index)}
                />
                <ActionButton
                  icon={DownloadComputer}
                  label="Download"
                  onClick={() => recopy_at_index(index)}
                />
                <ActionButton
                  icon={Delete}
                  label="Delete"
                  onClick={() => recopy_at_index(index)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
