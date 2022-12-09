import { Check } from "@icon-park/react";
import { ICheckboxProps } from "@components/Checkbox/index.types";
import { useState, useEffect } from "react";

export const Checkbox = ({ checked, onChange }: ICheckboxProps) => {
  const [wasToggled, setWasToggled] = useState(false);
  const [justMounted, setJustMounted] = useState(true);

  useEffect(() => {
    if (!justMounted) {
      setWasToggled(true);
    } else {
      setJustMounted(false);
    }
  }, [checked]);

  return (
    <div className="flex items-center relative w-7 h-7">
      <input
        type="checkbox"
        checked={checked}
        onChange={({ target: { checked } }) => onChange(checked)}
        className="absolute w-full h-full opacity-0 cursor-pointer"
      />

      <div
        className={`w-full h-full border-2 border-gray-400 rounded-lg flex items-center justify-center ${
          checked ? "bg-blue-500-light" : ""
        } text-white pointer-events-none`}
      >
        {checked && (
          <Check
            theme="outline"
            className={`${wasToggled ? "scale-up-animation" : ""}`}
            size="16"
            strokeWidth={7}
            fill="currentColor"
          />
        )}
      </div>
    </div>
  );
};
