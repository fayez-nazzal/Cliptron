import { ShortcutInput } from "@components/ShortcutInput";
import { useAtom } from "jotai";
import { shortcutAtom } from "@atoms/shortcut";
import { useState, useEffect } from "react";
import { useErrorIf } from "../../hooks/useErrorIf";
import { setup_shortcut } from "../../actions/tauri";

export const ShortcutSettingsEntry = () => {
  const [unsavedShortcut, setUnsavedShortcut] = useState<string>("");
  const [shortcut, setShortcut] = useAtom(shortcutAtom);
  const [isShortcutConfirmed, setIsShortcutConfirmed] =
    useState<boolean>(false);
  const { isError, handleSubmit } = useErrorIf(!isShortcutConfirmed);

  const onApplyClicked = () => {
    setShortcut(unsavedShortcut);
    setup_shortcut(unsavedShortcut);
  };

  return (
    <>
      <ShortcutInput
        className={`border-gray-400 border w-40 max-w-40`}
        shortcut={shortcut}
        isConfirmed={isShortcutConfirmed}
        setIsConfirmed={setIsShortcutConfirmed}
        unsavedShortcut={unsavedShortcut}
        setUnsavedShortcut={setUnsavedShortcut}
        isError={isError}
      />

      <button
        className="bg-blue-500-light dark:bg-blue-500-dark text-white rounded-lg p-2 w-16"
        onClick={() => handleSubmit(onApplyClicked)}
      >
        Apply
      </button>
    </>
  );
};
