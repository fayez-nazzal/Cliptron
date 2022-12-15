import { useState, useEffect } from "react";
import { IStepProps } from "@pages/setup";
import { listen } from "@tauri-apps/api/event";
import { hide_window } from "../../actions/tauri";
import { useRouter } from "next/router";

export const TestShortcut = ({ onBack, onNext }: IStepProps) => {
  const [shortcutCalled, setShortcutCalled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    listen("shortcut", () => setShortcutCalled(true));
  }, []);

  const onNextClicked = () => {
    router.push("/");

    onNext();
  };

  return (
    <div className="w-screen h-full flex flex-col text-center items-center">
      <h1 className="text-2xl mt-5 mb-2">
        {shortcutCalled ? "Your shortcut works 🥳" : "Test your Shortcut!"}
      </h1>

      <div className="flex flex-col items-center mt-auto mb-auto">
        <p className="text-lg mb-4 mx-4 mt-2">
          {shortcutCalled ? (
            <>
              That's it! You can now use your shortcut anytime to call your
              clipboard history.
            </>
          ) : (
            "Move your mouse anywhere on the screen, then press your shortcut."
          )}
        </p>
      </div>

      <div className="flex flex-col gap-2 items-center mt-auto mb-12">
        <button
          className="bg-blue-500-light dark:bg-blue-500-dark text-white rounded-lg p-2 disabled:opacity-50 hover:brightness-95 active:ring"
          onClick={onNextClicked}
          disabled={!shortcutCalled}
        >
          Start using Cliptron
        </button>

        <button
          className="bg-gray-600 dark:bg-gray-300-dark text-white rounded-lg p-1 w-20 hover:brightness-95 active:ring"
          onClick={onBack}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};
