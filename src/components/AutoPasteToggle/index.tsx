import { Checkbox } from "@components/Checkbox";
import { autoPasteAtom } from "@pages/atoms";
import { useAtom } from "jotai";
import { set_auto_paste } from "../../actions/tauri";

export const AutoPasteToggle = () => {
  const [autoPaste, setAutoPaste] = useAtom(autoPasteAtom);

  const toggleAutoPaste = () => {
    setAutoPaste(!autoPaste);
    set_auto_paste(!autoPaste);
  };

  return <Checkbox checked={autoPaste} onChange={toggleAutoPaste} />;
};
