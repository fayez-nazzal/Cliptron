import { register_shortcut } from "../../actions/tauri";
import { IStepProps } from "@pages/setup";
import { useState } from "react";
import { useAtom } from "jotai";
import { ShortcutInput } from "../ShortcutInput/index";
import { useErrorIf } from "@hooks/useErrorIf";
import { shortcutAtom } from "@atoms";

export const SetupShortcut = ({ onNext }: IStepProps) => {
  const [unsavedShortcut, setUnsavedShortcut] = useState<string>("");
  const [shortcut, setShortcut] = useAtom(shortcutAtom);
  const [previousShortcut, setPreviousShortcut] = useState<string>(shortcut);
  const [isShortcutConfirmed, setIsShortcutConfirmed] =
    useState<boolean>(false);
  const { isError, handleSubmit } = useErrorIf(!isShortcutConfirmed);

  const onNextClicked = async () => {
    await register_shortcut(unsavedShortcut, previousShortcut);
    setShortcut(unsavedShortcut);
    setPreviousShortcut(unsavedShortcut);
    !isError && onNext();
  };

  return (
    <div className="w-screen h-full flex flex-col text-center items-center">
      <h1 className="text-2xl mt-5 mb-2">Welcome to Cliptron! 🎉</h1>

      <div className="flex flex-col items-center mt-auto mb-auto">
        <p className="text-lg mb-4">
          Setup a keyboard shortcut for calling your clipboard history.
        </p>

        <ShortcutInput
          isConfirmed={isShortcutConfirmed}
          setIsConfirmed={setIsShortcutConfirmed}
          shortcut={shortcut}
          isError={isError}
          unsavedShortcut={unsavedShortcut}
          setUnsavedShortcut={setUnsavedShortcut}
          className="!min-h-[42px]"
          autoFocus
        />

        <p className="text-sm mt-2 text-red-500-light dark:text-red-500-dark w-44 h-11">
          {isError && "App shortcut should be formed of 2 or more keys."}
        </p>
      </div>

      <button
        className="bg-blue-500-light dark:bg-blue-500-dark text-white rounded-lg p-2 mt-auto mb-16 w-20 hover:brightness-95 active:ring"
        onClick={() => handleSubmit(onNextClicked)}
      >
        Go Next
      </button>
    </div>
  );
};
