import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export interface IShortcutInputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  isConfirmed: boolean;
  setIsConfirmed: (value: boolean) => void;
  shortcut: string;
  unsavedShortcut: string;
  setUnsavedShortcut: (value: string) => void;
  isError: boolean;
}
