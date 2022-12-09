import { Provider } from "jotai";
import type { AppProps } from "next/app";
import { Layout } from "../components/Layout";
import "../global.css";
import "@fontsource/open-sans";
import { useEffect } from "react";
import { retrieve_settings } from "@actions/tauri";
import { setup_shortcut } from "@actions/tauri";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    retrieve_settings();

    const shortcut = localStorage.getItem("shortcut");

    if (!shortcut) {
      router.push("/setup");
    } else {
      setup_shortcut(shortcut);
    }
  });

  return (
    <Provider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
