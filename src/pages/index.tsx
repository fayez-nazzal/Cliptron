import { Delete, DownloadComputer, Copy } from "@icon-park/react";
import { invoke } from "@tauri-apps/api/tauri";
import { useEffect } from "react";
import { listen } from "@tauri-apps/api/event";
import { historyAtom } from "../atoms/history";
import { useAtom } from "jotai";
import {
  get_history,
  recopy_at_index,
  delete_from_history,
  save_to_file,
} from "../actions/tauri";
import { ActionButton } from "../components/ActionButton/index";
import { useRouter } from "next/router";
import { setup_shortcut } from "../actions/tauri";
import { shortcutAtom } from "@atoms/shortcut";

const App = () => {
  const [history, setHistory] = useAtom(historyAtom);
  const router = useRouter();
  const [shortcut] = useAtom(shortcutAtom);

  const updateHistory = async () => {
    const history = await get_history();

    setHistory(history);
  };

  useEffect(() => {
    updateHistory();

    listen("history", updateHistory);

    if (!shortcut) {
      router.push("/setup");
    } else {
      setup_shortcut(shortcut);
    }
  }, []);

  return (
    <div className="h-full">
      <div className="overflow-auto h-full">
        {history.map((item, index) => {
          const isImage = item.startsWith("data:image");

          return (
            <div className="relative flex border-b-2 p-2 group transition-all hover:bg-gray-50">
              <button
                key={index}
                className="flex-1 text-left max-h-44 overflow-auto"
                onClick={() => recopy_at_index(index)}
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

              <div className="h-20 duration-500 transition-all">
                <div className=" top-1/2 -translate-y-1/2 right-[0.5rem] flex w-20  group-hover:opacity-100 opacity-0 duration-500 transition-all absolute rounded-md bg-gray-50/90 flex-col justify-center items-center">
                  <ActionButton
                    icon={Copy}
                    label="Copy"
                    onClick={() => recopy_at_index(index)}
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
      </div>
    </div>
  );
};

export default App;
