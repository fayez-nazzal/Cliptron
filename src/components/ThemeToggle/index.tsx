import { change_dom_theme, EAppTheme } from "@actions/tauri";
import { DarkMode, SunOne } from "@icon-park/react";
import { themeAtom } from "@pages/atoms";
import { useAtom } from "jotai";

export const ThemeToggle = () => {
  const [theme, setTheme] = useAtom(themeAtom);

  const toggleTheme = () => {
    const newTheme =
      theme === EAppTheme.Light ? EAppTheme.Dark : EAppTheme.Light;
    setTheme(newTheme);
    change_dom_theme(newTheme);
  };

  return (
    <button
      className="flex gap-1 items-center text-black dark:text-white hover:bg-gray300-light dark:hover:bg-gray200-dark p-1 rounded-lg w-24 justify-center"
      onClick={toggleTheme}
    >
      {theme === EAppTheme.Dark ? (
        <DarkMode theme="outline" size="24" fill="currentColor" />
      ) : (
        <SunOne theme="outline" size="24" fill="currentColor" />
      )}

      <span className="capitalize">
        {theme === EAppTheme.Dark ? "Dark" : "Light"}
      </span>
    </button>
  );
};
