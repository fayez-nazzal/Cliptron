import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { hide_window, on_shortcut } from '../actions/tauri';

const hidingPage = () => {
  const [countdown, setCountdown] = useState(5);
  const router = useRouter();

  const decreaseCountdown = () => {
    setCountdown(countdown - 1);
  };

  const setCountdownTimer = () => {
    setTimeout(() => {
      decreaseCountdown();
    }, 1000);
  };

  const onCountdownEnd = () => {
    hide_window();
    router.push("/");
  };

  useEffect(() => {
    if (countdown > 0) {
      setCountdownTimer();
    } else {
      onCountdownEnd();
    }
  }, [countdown]);

  return (
    <div className="w-screen h-full gap-2 flex flex-col text-center items-center px-6">
      <h1 className="text-2xl mt-3 mb-1">Cliptron is running! 🥳</h1>
      <p className="text-lg mt-2">We are going to hide the window for you.</p>
      <p className="text-lg mt-2">
        You can always show it again by pressing the shortcut.
      </p>
      <p className="text-5xl mt-3 mb-1 text-blue-500-dark">{countdown}</p>
    </div>
  );
};

export default hidingPage;
