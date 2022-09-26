import "../styles/index.css";
import "antd/dist/antd.css";
import React, { useEffect, useRef } from "react";
import { Web3Provider } from "../helpers/Web3Context";
import { DevUI, NetworkDisplay, ThemeSwitch } from "../components";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import Head from "next/head";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }) {
  const prevTheme = useRef("light");
  const router = useRouter();
  const defaultWeb3Provider = process.env.DEFAULT_WEB3_PROVIDER || "localhost";

  const themes = {
    dark: `/css/dark-theme.css`,
    light: `/css/light-theme.css`,
  };

  useEffect(() => {
    prevTheme.current = window.localStorage.getItem("theme");
  }, []);

  return (
    <Web3Provider network={defaultWeb3Provider}>
      <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme.current}>
        <>
          <Head>
            <link
              rel="icon"
              href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🏗</text></svg>"
            />
          </Head>
          {router?.pathname !== "/debug" ? null : <NetworkDisplay />}
          {/* {router?.pathname === "/" ? null : <DevUI />} */}
          {/* {router?.pathname === "/" ? null : <ThemeSwitch />} */}
          <Component {...pageProps} />
        </>
      </ThemeSwitcherProvider>
    </Web3Provider>
  );
}

export default MyApp;
