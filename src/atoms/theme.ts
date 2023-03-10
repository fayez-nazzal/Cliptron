import { EAppTheme, get_system_theme } from "@actions/tauri";
import { atomWithStorage } from "jotai/utils";

export const themeAtom = atomWithStorage<EAppTheme>(
  "theme",
  get_system_theme()
);
