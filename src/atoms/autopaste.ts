import { atom } from "jotai";

export const autopasteAtom = atom<boolean>(
  typeof localStorage !== "undefined"
    ? localStorage.getItem("auto_paste") === "true"
    : true
);
