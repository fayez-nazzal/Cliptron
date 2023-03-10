import { Checkbox } from "@components/Checkbox";
import { useAtom } from "jotai";
import { set_auto_paste } from "../../actions/tauri";
import { autoPasteAtom } from "@atoms/autopaste";

export const AutoPasteToggle = () => {
  const [autoPaste, setAutoPaste] = useAtom(autoPasteAtom);

  const toggleAutoPaste = () => {
    setAutoPaste(!autoPaste);
    set_auto_paste(!autoPaste);
  };

  return <Checkbox checked={autoPaste} onChange={toggleAutoPaste} />;
};
