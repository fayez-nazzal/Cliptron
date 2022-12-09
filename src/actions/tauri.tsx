import { invoke } from "@tauri-apps/api/tauri";
import { save } from "@tauri-apps/api/dialog";
import { register } from "@tauri-apps/api/globalShortcut";
import { emit } from "@tauri-apps/api/event";

export const clear_history = async () => {
  await invoke("clear_history");
};

export const hide_window = () => {
  const { appWindow } = require("@tauri-apps/api/window");

  appWindow.hide();
};

export const show_window = () => {
  const { appWindow } = require("@tauri-apps/api/window");

  appWindow.show();
};

export const delete_from_history = async (index: number) => {
  await invoke("delete_from_history", { index });
};

export const get_history = async () => {
  const history = (await invoke("get_history")) as string[];

  return history;
};

export const recopy_at_index = async (index: number) => {
  invoke("recopy_at_index", { index });

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

export const on_shortcut = async () => {
  const mouse_position = (await invoke("get_mouse_position")) as [
    number,
    number
  ];

  const { appWindow, LogicalPosition } = require("@tauri-apps/api/window");

  appWindow.setPosition(
    new LogicalPosition(mouse_position[0] - 150, mouse_position[1] + 25)
  );

  appWindow.show();
  appWindow.setAlwaysOnTop(true);

  emit("shortcut");
};

let shortcutSet = false;
export const setup_shortcut = async (shortcut: string) => {
  !shortcutSet && register(shortcut, on_shortcut);
  shortcutSet = true;
};

export const setup_app_theme = async () => {
  if (
    localStorage.getItem("theme") === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

export const set_theme = async (theme: "dark" | "light") => {
  localStorage.setItem("theme", theme);
  setup_app_theme();
};

export const setup_settings = async () => {
  localStorage.setItem("auto_start", "true");
  setup_app_theme();
};

export const retrieve_settings = async () => {
  const has_settings = localStorage.getItem("settings");

  if (!has_settings) setup_settings();

  const should_auto_start = localStorage.getItem("auto_start");

  invoke("set_auto_start", { value: should_auto_start === "true" });
};