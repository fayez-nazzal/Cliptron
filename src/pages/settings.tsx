import { ThemeToggle } from "@components/ThemeToggle";
import { SettingsEntry } from "../components/SettingsEntry/index";
import { AutostartToggle } from "../components/AutostartToggle/index";
import { MaxItemsInput } from "@components/MaxItemsInput/index";
import { ShortcutSettingsEntry } from "../components/ShortcutSettingsEntry/index";
import { useRouter } from "next/router";
import { AutoPasteToggle } from "@components/AutoPasteToggle";

const SettingsPage = () => {
  const router = useRouter();

  const onOK = () => {
    router.push("/");
  };

  return (
    <div className="w-screen h-full gap-2 flex flex-col text-center items-center px-6">
      <h1 className="mx-4 justify-between text-2xl mt-4 mb-1">
        Settings
      </h1>

      <ShortcutSettingsEntry />

      <SettingsEntry label="App Theme">
        <ThemeToggle />
      </SettingsEntry>


      <SettingsEntry label="Launch on startup">
        <AutostartToggle />
      </SettingsEntry>

      <SettingsEntry label="Auto Paste">
        <AutoPasteToggle />
      </SettingsEntry>

      <SettingsEntry label="Max clipboard items">
        <MaxItemsInput />
      </SettingsEntry>

      <button
        className="bg-blue-500-light !text-lg dark:bg-blue-500-dark text-white rounded-lg h-9 flex items-center justify-center w-14 disabled:opacity-50 hover:brightness-95 active:ring"
        onClick={onOK}
      >
        OK
      </button>
    </div>
  );
};

export default SettingsPage;
