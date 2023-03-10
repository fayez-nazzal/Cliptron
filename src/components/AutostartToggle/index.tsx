import { Checkbox } from "@components/Checkbox";
import { useAtom } from "jotai";
import { autoStartAtom } from "../../atoms/autostart";
import { set_auto_start } from "../../actions/tauri";

export const AutostartToggle = () => {
  const [autostart, setAutostart] = useAtom(autoStartAtom);

  const toggleAutostart = () => {
    setAutostart(!autostart);
    set_auto_start(!autostart);
  };

  return <Checkbox checked={autostart} onChange={toggleAutostart} />;
};
