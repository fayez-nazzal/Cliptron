import { useRouter } from "next/router";
import { useEffect } from "react";
import { hide_window } from '../actions/tauri';

const hidingPage = () => {
  const router = useRouter();

  const onHide = () => {
    hide_window();
    router.push("/");
  };

  const setHideTimeout = () => {
    setTimeout(() => {
      onHide();
    }, 2000);
  };

  useEffect(() => {
    setHideTimeout();
  }, []);

  return (
    <div className="w-screen h-full gap-2 flex flex-col text-center items-center px-6">
      <h1 className="text-2xl mt-3 mb-1">Cliptron is running! 🥳</h1>
      <p className="text-lg mt-2">We are going to hide the window for you.</p>
      <p className="text-lg mt-2">
        You can always show it again by pressing the shortcut.
      </p>
    </div>
  );
};

export default hidingPage;
