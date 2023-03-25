import { Delete, DownloadComputer, Copy } from "@icon-park/react";
import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { useAtom } from "jotai";
import {
  get_history,
  select_clipboard_item,
  delete_from_history,
  save_to_file,
} from "../actions/tauri";
import { ActionButton } from "../components/ActionButton/index";
import { useRouter } from "next/router";
import { historyAtom } from "../atoms";

const App = () => {
  const [history, setHistory] = useAtom(historyAtom);
  const router = useRouter();

  const updateHistory = async () => {
    const history = await get_history();

    setHistory(history);
  };

  useEffect(() => {
    updateHistory();

    listen("history", updateHistory);
  }, []);

  return (
    <div className="h-full">
      {history.map((item, index) => {
        const isImage = item.startsWith("data:image");

        return (
          <div className="relative flex border-gray300-light/60 dark:border-gray300-dark/60 m-3 rounded-2xl border-2 group transition-all hover:bg-gray50-light dark:bg-gray200-dark">
            <button
              key={index}
              className="flex-1 text-left max-h-44 overflow-auto text-black dark:text-white p-2"
              onClick={() => select_clipboard_item(index)}
            >
              {isImage ? (
                <img
                  src={item}
                  className="flex-1 rounded-md max-w-[180px] max-h-40"
                />
              ) : (
                <div className="flex-1 text-ellipsis break-words">{item}</div>
              )}
            </button>

            <div className="h-24 duration-500 transition-all">
              <div className=" top-1/2 -translate-y-1/2 right-[0.5rem] flex w-20  group-hover:opacity-100 opacity-0 duration-500 transition-all absolute rounded-md bg-gray100-light/90 dark:bg-gray100-dark flex-col justify-center items-center">
                <ActionButton
                  icon={Copy}
                  label="Copy"
                  onClick={() => select_clipboard_item(index)}
                />
                <ActionButton
                  icon={DownloadComputer}
                  label="Save"
                  onClick={() => save_to_file(index, isImage)}
                />
                <ActionButton
                  icon={Delete}
                  label="Delete"
                  onClick={() => delete_from_history(index)}
                />
              </div>
            </div>
          </div>
        );
      })}

      <div className="h-1" />
    </div>
  );
};

export default App;
