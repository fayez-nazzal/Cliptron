import { register, unregister } from "@tauri-apps/api/globalShortcut";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { shortcutAtom } from "../../atoms/shortcut";
import { setup_shortcut } from "../../actions/tauri";
import { IStepProps } from "@pages/setup";

export const SetupShortcut = ({ onNext }: IStepProps) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [shortcut, setShortcut] = useAtom(shortcutAtom);
  const [isShortcutConfirmed, setIsShortcutConfirmed] =
    useState<boolean>(false);

  useEffect(() => {
    // when this page is mounted, unregister the global shortcut if exists
    if (shortcut) unregister(shortcut);
  }, []);

  const getKey = (key: string) => {
    return key === " " ? "SPACE" : key === "META" ? "SUPER" : key.toUpperCase();
  };

  const onKeydown = (e: any) => {
    const { key } = e;

    if (key === "Escape") {
      setPressedKeys(new Set());
      setShortcut("");
      return;
    }

    const newPressedKeys = new Set(pressedKeys);
    newPressedKeys.add(getKey(key));

    setPressedKeys(newPressedKeys);

    setShortcut(Array.from(newPressedKeys).join("+"));

    setIsShortcutConfirmed(newPressedKeys.size > 1);

    e.preventDefault();
  };

  const onKeyup = (e: any) => {
    setPressedKeys(new Set());

    e.preventDefault();
  };

  const onNextClicked = () => {
    setup_shortcut(shortcut);
    onNext();
  };

  return (
    <div className="w-screen h-screen flex flex-col text-center items-center">
      <h1 className="text-2xl mt-4 mb-2">Welcome to Cliptron! 🎉</h1>

      <div className="flex flex-col items-center mt-auto mb-auto">
        <p className="text-lg mb-4">
          Setup your keyboard shortcut for calling your clipboard history.
        </p>

        <input
          type="text"
          onKeyDown={onKeydown}
          onKeyUp={onKeyup}
          value={shortcut}
          autoFocus
          placeholder="Record your shortcut..."
          className="border-2 bg-gray-100 focus:border-blue-500-light dark:focus:border-blue-500-dark rounded-lg p-2 focus:outline-none"
        />

        <p className="text-red-500-light dark:text-red-500-dark mt-2">
          {!isShortcutConfirmed
            ? "Shortcut must have at least 2 keys."
            : "\u200A"}
        </p>
      </div>

      <button
        className="bg-blue-500-light dark:bg-blue-500-dark text-white rounded-lg p-2 mt-auto mb-16 w-20"
        onClick={onNextClicked}
        disabled={!isShortcutConfirmed}
      >
        Go Next
      </button>
    </div>
  );
};
