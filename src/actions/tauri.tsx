import { invoke } from "@tauri-apps/api/tauri";
import { save } from "@tauri-apps/api/dialog";

export const clear_history = async () => {
  await invoke("clear_history");
};

export const hide_window = () => {
  const { appWindow } = require("@tauri-apps/api/window");

  appWindow.hide();
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
  }

  hide_window();
};
