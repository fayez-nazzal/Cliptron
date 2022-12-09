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
    <div className="flex items-center relative w-7 h-7 group">
      <input
        type="checkbox"
        checked={checked}
        onChange={({ target: { checked } }) => onChange(checked)}
        className="absolute w-full h-full opacity-0 cursor-pointer"
      />

      <div
        className={`w-full h-full border-2 border-gray300-light dark:border-gray400-dark rounded-lg flex items-center justify-center ${
          checked
            ? "bg-blue-500-light dark:bg-blue-500-dark group-hover:bg-blue-500-light/90"
            : "group-hover:bg-blue-500-light/60"
        } text-icon-dark pointer-events-none`}
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
