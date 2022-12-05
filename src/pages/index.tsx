import { Close, Setting, Clear } from '@icon-park/react';

function App() {
  return (
    <div className="w-full h-8">
      <div data-tauri-drag-region className="flex flex-row-reverse p-2 border-b-2" id="titlebar-close">
        <button className='text-[#444] hover:text-red-500'>
          <Close theme="outline" size="18" fill="currentColor" />
        </button>

        <button className='mr-1 text-[#444] hover:text-blue-500'>
          <Setting theme="outline" size="18" fill="currentColor" />
        </button>

        <div className="mr-auto text-sm">
          200 copied items
        </div>

        <button className='mr-1 text-[#444] hover:text-green-500'>
          <Clear theme="outline" size="18" fill="currentColor" />
        </button>
      </div>
    </div>
  );
}

export default App;
