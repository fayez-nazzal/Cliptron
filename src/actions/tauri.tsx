import { invoke } from "@tauri-apps/api/tauri";
import { save } from "@tauri-apps/api/dialog";

export const clear_history = async () => {
  await invoke("clear_history");
};

export const hide_window = async () => {
  await invoke("hide_window")
};

let listening = false;
export const hideWhenNotFocused = () => {
  if (listening) return;

  const { appWindow } = require("@tauri-apps/api/window");

  listening = true;
  appWindow.listen("tauri://blur", hide_window);
};

export const show_window = () => {
  const { appWindow } = require("@tauri-apps/api/window");

  appWindow.show();
  appWindow.setAlwaysOnTop(true);
};

export const delete_from_history = async (index: number) => {
  await invoke("delete_from_history", { index });
};

export const get_history = async () => {
  const history = (await invoke("get_history")) as string[];

  return history;
};

export const select_clipboard_item = async (index: number) => {
  invoke("select_clipboard_item", { index });

  hide_window();
};

export const save_to_file = async (index: number, is_image: boolean) => {
  const filters = [];

  if (is_image) {
    filters.push({
      name: "Image",
      extensions: ["png", "jpg", "jpeg", "gif", "webp", "bmp", "ico"],
    });
  }

  const filePath = await save({
    filters,
  });

  if (filePath) {
    await invoke("save_to_file", { index, path: filePath });
    hide_window();
  }
};

export const register_shortcut = async (
  shortcut: string,
  previousShortcut?: string
) => {
  previousShortcut ??= undefined;

  // we need to ensure that the shortcut is not wrapped in quotes
  // It may be wrapped because jotai does this with use atomWithStorage
  shortcut = shortcut.replace(/\"/g, "");

  await invoke("register_shortcut", { shortcut, previousShortcut });
};

export const unregister_shortcut = async (shortcut: string) => {
  await invoke("unregister_shortcut", { shortcut });
};

export enum EAppTheme {
  Light,
  Dark,
}

export const get_system_theme = () => {
  if (
    typeof localStorage !== "undefined" &&
    !("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return EAppTheme.Dark;
  } else {
    return EAppTheme.Light;
  }
};

export const change_dom_theme = (theme: EAppTheme) => {
  if (theme === EAppTheme.Dark) {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  }
};

export const set_auto_start = async (value: boolean) => {
  await invoke("set_auto_start", { value });
};

export const set_auto_paste = async (value: boolean) => {
  localStorage.setItem("auto_paste", value.toString());

  let numberValue = value ? 1 : 0;

  invoke("set_item_select_behavior", { behavior: numberValue });
};

export const set_max_items = async (value: number) => {
  await invoke("set_max_items", { value });
};

export const set_context_menu = async () => {
  // Disable right click in production
  if (process.env.NODE_ENV === "production")
    document.addEventListener("contextmenu", (event) => event.preventDefault());
};
