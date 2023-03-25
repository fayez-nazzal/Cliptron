import { EAppTheme, get_system_theme } from "@actions/tauri";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const autoPasteAtom = atomWithStorage("auto_paste", true);

export const autoStartAtom = atomWithStorage("auto_start", true);

export const historyAtom = atom<string[]>([]);

export const maxItemsAtom = atomWithStorage("max_items", 10);

export const previousShortcutAtom = atomWithStorage("previous_shortcut", "");

export const shortcutAtom = atomWithStorage("shortcut", "");

export const themeAtom = atomWithStorage<EAppTheme>(
  "theme",
  get_system_theme()
);

export const visitedAtom = atom<string[]>([]);
