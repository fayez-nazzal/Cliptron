import { Close, Setting, Clear, Delete, DownloadComputer } from '@icon-park/react';
import { invoke } from '@tauri-apps/api/tauri';
import { register } from '@tauri-apps/api/globalShortcut';
import { readText } from '@tauri-apps/api/clipboard';
import { useEffect, useState } from 'react';

const App = () => {
  const [history, setHistory] = useState<string[]>([]);
  
  const onClose = () => {
    const { appWindow } = require('@tauri-apps/api/window');

    // don't close, just hide
    appWindow.hide();
  };

  const getHistory = async () => {
    const history = await invoke("get_history") as string[];

    setHistory(history);
  };

  const onShortcut = async () => {
    const mouse_position = await invoke("get_mouse_position") as [number, number];

    const { appWindow, LogicalPosition } = require('@tauri-apps/api/window');

    appWindow.setPosition(new LogicalPosition(mouse_position[0], mouse_position[1]));

    appWindow.show();
    appWindow.setAlwaysOnTop(true);

    getHistory();
  }

  useEffect(() => {
    getHistory();

    register("CONTROL+SPACE", onShortcut);
  }, []);

  const recopy_at_index = async (index: number) => {
    invoke("recopy_at_index", { index });

    const { appWindow } = require('@tauri-apps/api/window');

    appWindow.hide();
  }

  const clear_history = async () => {
    await invoke("clear_history");

    getHistory();
  }

  const delete_from_history = async (index: number) => {
    await invoke("delete_from_history", { index });

    getHistory();
  }

  return (
    <div className="w-full h-8">
      <div data-tauri-drag-region className="flex flex-row-reverse p-2 border-b-2" id="titlebar-close">
        <button className='text-[#444] hover:text-red-500' onClick={onClose}>
          <Close theme="outline" size="18" fill="currentColor" />
        </button>

        <button className='mr-1 text-[#444] hover:text-blue-500'>
          <Setting theme="outline" size="18" fill="currentColor" />
        </button>

        <div className="mr-auto text-sm pointer-events-none">
          {history.length} copied items
        </div>

        <button className='mr-1 text-[#444] hover:text-green-500' onClick={clear_history}>
          <Clear theme="outline" size="18" fill="currentColor" />
        </button>
      </div>

      {history.map((item, index) => (
        <div className='flex border-b-2 p-2 group hover:bg-gray-100'>
          <button key={index} className="w-full text-left" onClick={() => recopy_at_index(index)}>
            {item.startsWith("data:image") ? (
              <img src={item} className="w-full p-2 border-2 border-gray-300 rounded-md" />
            ) : (
              <div>
                {item}
              </div>
            )}
          </button>
            
          <div className='flex flex-col gap-2'>
            <button className="p-1 border-2 text-[#444] rounded hover:text-blue-500 hover:bg-blue-200">
              <DownloadComputer theme="outline" size="16" fill="currentColor" />
            </button>

            <button className="p-1 border-2 text-[#444] rounded hover:text-red-500 hover:bg-red-200" onClick={() => delete_from_history(index)}>
              <Delete theme="outline" size="16" fill="currentColor" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
