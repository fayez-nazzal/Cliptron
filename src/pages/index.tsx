import { Close, Setting, Clear } from '@icon-park/react';
import { invoke } from '@tauri-apps/api/tauri';
import { register } from '@tauri-apps/api/globalShortcut';
import { useEffect } from 'react';

const App = () => {
  const onClose = () => {
    const { appWindow } = require('@tauri-apps/api/window');

    // don't close, just hide
    appWindow.hide();
  };

  const onShortcut = async () => {
    const mouse_position = await invoke("get_mouse_position") as [number, number];

    const { appWindow, LogicalPosition } = require('@tauri-apps/api/window');

    appWindow.setPosition(new LogicalPosition(mouse_position[0], mouse_position[1]));

    appWindow.show();
    appWindow.setAlwaysOnTop(true);
  }

  useEffect(() => {
    register("CONTROL+X", onShortcut);
  }, []);

  return (
    <div className="w-full h-8">
      <div data-tauri-drag-region className="flex flex-row-reverse p-2 border-b-2" id="titlebar-close">
        <button className='text-[#444] hover:text-red-500 pointer-events-none' onClick={onClose}>
          <Close theme="outline" size="18" fill="currentColor" />
        </button>

        <button className='mr-1 text-[#444] hover:text-blue-500 pointer-events-none'>
          <Setting theme="outline" size="18" fill="currentColor" />
        </button>

        <div className="mr-auto text-sm pointer-events-none">
          200 copied items
        </div>

        <button className='mr-1 text-[#444] hover:text-green-500 pointer-events-none'>
          <Clear theme="outline" size="18" fill="currentColor" />
        </button>
      </div>
    </div>
  );
}

export default App;
