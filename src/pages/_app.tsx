import { Provider, useAtom } from "jotai";
import type { AppProps } from "next/app";
import { Layout } from "../components/Layout";
import "../global.css";
import "@fontsource/open-sans";
import { useEffect, useState } from "react";
import {
  change_dom_theme,
  retrieve_settings,
  set_auto_paste,
  set_auto_start,
  set_max_items,
} from "@actions/tauri";
import { register_shortcut } from "@actions/tauri";
import { useRouter } from "next/router";
import { visitedAtom } from "@atoms/visited";
import { themeAtom } from "@atoms/theme";
import { autoPasteAtom } from "@atoms/autopaste";
import { autoStartAtom } from "@atoms/autostart";
import { maxItemsAtom } from "@atoms/maxitems";
import { shortcutAtom } from "@atoms/shortcut";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [canRender, setCanRender] = useState(false);
  const [visitedRoutes, setVisitedRoutes] = useAtom(visitedAtom);
  const [maxItems] = useAtom(maxItemsAtom);
  const [theme] = useAtom(themeAtom);
  const [autoPaste] = useAtom(autoPasteAtom);
  const [autoStart] = useAtom(autoStartAtom);
  const [shortcut] = useAtom(shortcutAtom);

  const onAppStart = async () => {
    change_dom_theme(theme);
    set_max_items(maxItems);
    set_auto_start(autoStart);
    set_auto_paste(autoPaste);

    const wasSetUp = localStorage.getItem("set_up");

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
