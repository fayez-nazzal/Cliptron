import {
  Close,
  Setting,
  Clear,
  Delete,
  DownloadComputer,
  Copy,
  Pin,
  DropDownList,
} from "@icon-park/react";
import { invoke } from "@tauri-apps/api/tauri";
import { register } from "@tauri-apps/api/globalShortcut";
import { useEffect, useState } from "react";
import { listen } from '@tauri-apps/api/event'

const App = () => {
  const [history, setHistory] = useState<string[]>([]);

  const onClose = () => {
    const { appWindow } = require("@tauri-apps/api/window");

    // don't close, just hide
    appWindow.hide();
  };

  const getHistory = async () => {
    const history = (await invoke("get_history")) as string[];

    setHistory(history);
  };

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

  useEffect(() => {
    getHistory();

    register("CONTROL+SPACE", onShortcut);

    listen("copied", () => {
      getHistory();
    });
  }, []);

  const recopy_at_index = async (index: number) => {
    invoke("recopy_at_index", { index });

    const { appWindow } = require("@tauri-apps/api/window");

    appWindow.hide();
  };

  const clear_history = async () => {
    await invoke("clear_history");
  };

  const delete_from_history = async (index: number) => {
    await invoke("delete_from_history", { index });
  };

  return (
    <div className="w-full h-screen relative overflow-hidden">
      <div
        data-tauri-drag-region
        className="flex flex-row-reverse p-2 border-b-2 h-10 w-full absolute"
        id="titlebar-close"
      >
        <button className="text-[#444] hover:text-red-500" onClick={onClose}>
          <Close theme="outline" size="20" fill="currentColor" />
        </button>

        <button className="mr-1 text-[#444] hover:text-blue-500">
          <Setting theme="outline" size="20" fill="currentColor" />
        </button>

        <div className="mr-auto text-sm pointer-events-none">
          {history.length} copied items
        </div>

        <button
          className="mr-1 text-[#444] hover:text-green-500"
          onClick={clear_history}
        >
          <Clear theme="outline" size="20" fill="currentColor" />
        </button>
      </div>

      <div className="h-full pt-10">
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
                    className="flex-1 p-2 border-2 border-gray-300 rounded-md"
                  />
                ) : (
                  <div className="flex-1 text-ellipsis break-words">{item}</div>
                )}
              </button>

              <div className="h-25 duration-500 transition-all">
                <div className=" top-1/2 -translate-y-1/2 right-1 flex w-20  group-hover:opacity-100 opacity-0 duration-500 transition-all absolute bg-gray-50 flex-col justify-center items-center">
                  <button className="flex flex-row items-center w-full h-7 px-2 hover:bg-gray-200 rounded-md">
                    <Pin theme="outline" size="18" fill="currentColor" />
                    <div className="ml-2 text-xs">Pin</div>
                  </button>

                  <button className="flex flex-row items-center w-full h-7 px-2 hover:bg-gray-200 rounded-md">
                    <Copy theme="outline" size="18" fill="currentColor" />
                    <div className="ml-2 text-xs">Copy</div>
                  </button>

                  <button className="flex flex-row items-center w-full h-7 px-2 hover:bg-gray-200 rounded-md">
                    <DownloadComputer
                      theme="outline"
                      size="18"
                      fill="currentColor"
                    />
                    <div className="ml-2 text-xs">Save</div>
                  </button>

                  <button
                    className="flex flex-row items-center w-full h-7 px-2 hover:bg-gray-200 rounded-md"
                    onClick={() => delete_from_history(index)}
                  >
                    <Delete theme="outline" size="18" fill="currentColor" />
                    <div className="ml-2 text-xs">Delete</div>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
