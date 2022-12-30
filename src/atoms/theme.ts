import { atom } from "jotai";
import { get_app_theme } from "@actions/tauri";

export const themeAtom = atom<string>(get_app_theme());
