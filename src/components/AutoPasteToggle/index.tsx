import { Checkbox } from "@components/Checkbox";
import { useAtom } from "jotai";
import { autostartAtom } from "../../atoms/autostart";
import { set_auto_paste } from "../../actions/tauri";
import { autopasteAtom } from "@atoms/autopaste";

export const AutoPasteToggle = () => {
  const [autoPaste, setAutoPaste] = useAtom(autopasteAtom);

  const toggleAutostart = () => {
    setAutoPaste(!autoPaste);
    set_auto_paste(!autoPaste);
  };

  return <Checkbox checked={autoPaste} onChange={toggleAutostart} />;
};
