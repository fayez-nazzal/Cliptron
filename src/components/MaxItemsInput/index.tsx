import { TextInput } from "@components/Input/index";
import { maxItemsAtom } from "@atoms";
import { useAtom } from "jotai";
import { set_max_items } from "../../actions/tauri";

export const MaxItemsInput = () => {
  const [maxItems, setMaxItems] = useAtom(maxItemsAtom);

  const onChange = ({ target: { value } }) => {
    if (!+value) return;
    setMaxItems(+value);
    set_max_items(+value);
  };

  return (
    <TextInput
      className="border-gray400-light dark:border-gray400-dark border w-14 caret-transparent text-sm"
      type="number"
      max={100}
      min={2}
      value={maxItems}
      onChange={onChange}
      onKeyDown={(e) => e.preventDefault()}
    />
  );
};
