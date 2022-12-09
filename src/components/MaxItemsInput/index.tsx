import { TextInput } from "@components/Input/index";
import { useAtom } from "jotai";
import { maxItemsAtom } from "../../atoms/maxitems";
import { set_max_items } from "../../actions/tauri";

export const MaxItemsInput = () => {
  const [maxItems, setMaxItems] = useAtom(maxItemsAtom);

  const onChange = ({ target: { value } }) => {
    if (!+value) return;

    console.log(+value);

    setMaxItems(+value);
    set_max_items(+value);
  };

  return (
    <TextInput
      className="border-gray-400 border w-14 caret-transparent"
      type="number"
      max={100}
      min={2}
      value={maxItems}
      onChange={onChange}
      onKeyDown={(e) => e.preventDefault()}
    />
  );
};