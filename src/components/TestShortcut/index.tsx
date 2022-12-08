import { useState, useEffect } from "react";
import { IStepProps } from "@pages/setup";
import { listen } from "@tauri-apps/api/event";

export const TestShortcut = ({ onNext }: IStepProps) => {
  const [shortcutCalled, setShortcutCalled] = useState(false);

  useEffect(() => {
    listen("shortcut", () => {
      setShortcutCalled(true);
    });
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col text-center items-center">
      <h1 className="text-2xl mt-4 mb-2">
        {shortcutCalled ? "Your shortcut works 🥳" : "Test your Shortcut!"}
      </h1>

      <div className="flex flex-col items-center mt-auto mb-auto">
        <p className="text-lg mb-4">
          {shortcutCalled ? (
            <>
              That's it! You can now use your shortcut anytime to call your
              clipboard history.
            </>
          ) : (
            "Move your mouse anywhere on the screen and press your shortcut."
          )}
        </p>
      </div>

      <button className="bg-blue-500-light dark:bg-blue-500-dark text-white rounded-lg p-2 mt-auto mb-16 w-28">
        Go Next
      </button>
    </div>
  );
};
