import { ThemeToggle } from "@components/ThemeToggle";
import { SettingsEntry } from "../components/SettingsEntry/index";
import { Checkbox } from "../components/Checkbox/index";
import { AutostartToggle } from "../components/AutostartToggle/index";
import { TextInput } from "../components/Input/index";

const SettingsPage = () => {
  return (
    <div className="w-screen h-screen gap-2 flex flex-col text-center items-center px-6">
      <h1 className="text-2xl mt-4 mb-2">Settings</h1>

      <SettingsEntry label="App Theme">
        <ThemeToggle />
      </SettingsEntry>

      <SettingsEntry label="Launch on startup">
        <AutostartToggle />
      </SettingsEntry>

      <SettingsEntry label="Max clipboard items">
        <TextInput
          className="border-gray-400 border w-14"
          type="number"
          max={100}
          min={2}
        />
      </SettingsEntry>

      <SettingsEntry label="Shortcut">
        <TextInput className="border-gray-400 border w-[9.6rem]" />
      </SettingsEntry>

      <div className="flex w-full justify-center mt-auto mb-20  gap-2">
        <button className="bg-gray-500 text-white rounded-lg p-2">
          Cancel
        </button>

        <button className="bg-blue-500-light dark:bg-blue-500-dark text-white rounded-lg p-2 flex-[0.4]">
          Save
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
