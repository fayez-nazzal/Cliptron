import { themeAtom } from "@atoms/theme";
import { DarkMode, SunOne } from "@icon-park/react";
import { useAtom } from "jotai";
import { toggle_theme } from "../../actions/tauri";

export const ThemeToggle = () => {
  const [theme, setTheme] = useAtom(themeAtom);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    toggle_theme();
  };

  return (
    <button className="flex gap-2 items-center" onClick={toggleTheme}>
      {theme === "dark" ? (
        <DarkMode theme="outline" size="24" fill="#fff" />
      ) : (
        <SunOne theme="outline" size="24" fill="#000" />
      )}

      <span className="capitalize">{theme}</span>
    </button>
  );
};
