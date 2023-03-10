import { Provider, useAtom } from "jotai";
import type { AppProps } from "next/app";
import { Layout } from "../components/Layout";
import "../global.css";
import "@fontsource/open-sans";
import { useEffect, useState } from "react";
import { retrieve_settings } from "@actions/tauri";
import { register_shortcut } from "@actions/tauri";
import { useRouter } from "next/router";
import { visitedAtom } from "@atoms/visited";
import { themeAtom } from "@atoms/theme";
import { autopasteAtom } from "@atoms/autopaste";
import { autostartAtom } from "@atoms/autostart";
import { maxItemsAtom } from "@atoms/maxitems";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [canRender, setCanRender] = useState(false);
  const [visitedRoutes, setVisitedRoutes] = useAtom(visitedAtom);
  const [maxItems] = useAtom(maxItemsAtom);
  const [theme] = useAtom(themeAtom);
  const [autoPaste] = useAtom(autopasteAtom);
  const [autoStart] = useAtom(autostartAtom);

  const onAppStart = async () => {
    retrieve_settings({
      maxItems,
      autoPaste,
      autoStart,
      theme,
    });

    const wasSetUp = localStorage.getItem("set_up");
    const shortcut = localStorage.getItem("shortcut");

    if (!wasSetUp || !shortcut) {
      router.push("/setup");
    } else if (visitedRoutes.length === 0) {
      // we register only in the startup ( when having no visitedRoutes )
      await register_shortcut(shortcut);
      router.push("/hiding");
    }

    setVisitedRoutes([...visitedRoutes, router.pathname]);

    setCanRender(true);
  };

  useEffect(() => {
    onAppStart();
  }, []);

  return (
    <Provider>
      <Layout>{canRender && <Component {...pageProps} />}</Layout>
    </Provider>
  );
}
