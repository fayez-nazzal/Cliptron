import { ThemeToggle } from "@components/ThemeToggle";
import { SettingsEntry } from "../components/SettingsEntry/index";
import { Checkbox } from "../components/Checkbox/index";
import { AutostartToggle } from "../components/AutostartToggle/index";
import { TextInput } from "../components/Input/index";
import { MaxItemsInput } from "@components/MaxItemsInput/index";
import { ShortcutInput } from "../components/ShortcutInput/index";
import { ShortcutSettingsEntry } from "../components/ShortcutSettingsEntry/index";
import { useRouter } from "next/router";
import { useEffect } from "react";

const SettingsPage = () => {
  const router = useRouter();

  const onOK = () => {
    router.push("/");
  };

  return (
    <div className="w-screen h-screen gap-2 flex flex-col text-center items-center px-6">
      <h1 className="text-2xl mt-4 mb-1">Settings</h1>

      <SettingsEntry label="App Theme">
        <ThemeToggle />
      </SettingsEntry>

      <SettingsEntry label="Launch on startup">
        <AutostartToggle />
      </SettingsEntry>

      <SettingsEntry label="Max clipboard items">
        <MaxItemsInput />
      </SettingsEntry>

      <ShortcutSettingsEntry />

      <div className="flex w-full justify-center mt-auto mb-16 gap-2">
        <button
          className="bg-blue-500-light dark:bg-blue-500-dark text-white rounded-lg p-2 flex-[0.4] hover:brightness-95 active:ring"
          onClick={onOK}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
