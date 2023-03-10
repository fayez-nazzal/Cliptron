import { atom } from "jotai";
import { get_system_theme } from "@actions/tauri";

export const themeAtom = atom<"dark" | "light">(get_system_theme());
