import { atom } from "jotai";

export const autostartAtom = atom<boolean>(
  typeof localStorage !== "undefined"
    ? localStorage.getItem("auto_start") === "true"
    : true
);
