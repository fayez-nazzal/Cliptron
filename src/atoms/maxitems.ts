import { atom } from "jotai";

export const maxItemsAtom = atom<number>(
  typeof localStorage !== "undefined" ? +localStorage.getItem("max_items") : 10
);
