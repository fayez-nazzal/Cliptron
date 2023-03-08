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
      <h1 className="text-2xl mt-4 mb-1">Settings</h1>

      <SettingsEntry label="App Theme">
        <ThemeToggle />
      </SettingsEntry>

      <ShortcutSettingsEntry />

      <SettingsEntry label="Launch on startup">
        <AutostartToggle />
      </SettingsEntry>

      <SettingsEntry label="Auto Paste">
        <AutoPasteToggle />
      </SettingsEntry>

      <SettingsEntry label="Max clipboard items">
        <MaxItemsInput />
      </SettingsEntry>
    </div>
  );
};

export default SettingsPage;
