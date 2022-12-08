import { Provider } from "jotai";
import type { AppProps } from "next/app";
import { Layout } from "../components/Layout";
import "../global.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
