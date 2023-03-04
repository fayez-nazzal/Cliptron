import { IShortcutInputProps } from "./index.types";
import { unregister } from "@tauri-apps/api/globalShortcut";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { shortcutAtom } from "@atoms/shortcut";
import { TextInput } from "../Input/index";

export const ShortcutInput = ({
  isConfirmed,
  setIsConfirmed,
  shortcut,
  unsavedShortcut,
  setUnsavedShortcut,
  isError,
  ...rest
}: IShortcutInputProps) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [focused, setFocused] = useState<boolean>(false);

  const getKey = (key: string) => {
    return key === " " ? "SPACE" : key.match(/META/i) ? "SUPER" : key.toUpperCase();
  };

  const onKeydown = (e: any) => {
    const { key } = e;

    if (key === "Escape") {
      setPressedKeys(new Set());
      setUnsavedShortcut("");
      return;
    }

    const newPressedKeys = new Set(pressedKeys);
    newPressedKeys.add(getKey(key));

    setPressedKeys(newPressedKeys);

    setUnsavedShortcut(Array.from(newPressedKeys).join("+"));

    setIsConfirmed(newPressedKeys.size > 1);

    e.preventDefault();
  };

  const onKeyup = (e: any) => {
    setPressedKeys(new Set());

    e.preventDefault();
  };

  const onInputFocus = () => {
    setFocused(true);
  };

  const onInputBlur = () => {
    setFocused(false);
    !isConfirmed && setUnsavedShortcut("");
  };

  return (
    <TextInput
      onKeyDown={onKeydown}
      onKeyUp={onKeyup}
      value={
        !focused && !unsavedShortcut
          ? `Set ${shortcut ? " New " : ""} Shortcut`
          : unsavedShortcut
      }
      className={`${rest.className ?? ""} ${
        !focused
          ? "text-black/30 dark:text-white/50"
          : "text-black dark:text-white"
      } flex-1 ${
        isError ? "border-red-500-light dark:border-red-500-dark" : ""
      } `}
      onFocus={onInputFocus}
      onBlur={onInputBlur}
      readOnly
    />
  );
};
