import { Provider } from "jotai";
import type { AppProps } from "next/app";
import { Layout } from "../components/Layout";
import "../global.css";
import "@fontsource/open-sans";
import { useEffect } from "react";
import { retrieve_settings } from "@actions/tauri";

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    retrieve_settings();
  });

  return (
    <Provider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
