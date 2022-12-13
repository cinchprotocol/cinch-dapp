import "../styles/index.css";
import "antd/dist/antd.css";
import React, { useEffect, useRef } from "react";
import { Web3Provider } from "../helpers/Web3Context";
import { DevUI, NetworkDisplay, ThemeSwitch } from "../components";
import { ThemeSwitcherProvider } from "react-css-theme-switcher";
import Head from "next/head";
import { useRouter } from "next/router";
import 'aos/dist/aos.css';
import AOS from 'aos';
import { CommonHead } from "/components/CommonHead";

function MyApp({ Component, pageProps }) {
  const prevTheme = useRef("light");
  const router = useRouter();
  const defaultWeb3Provider = process.env.DEFAULT_WEB3_PROVIDER || "goerli";

  const themes = {
    dark: `/css/dark-theme.css`,
    light: `/css/light-theme.css`,
  };

  useEffect(() => {
    prevTheme.current = window.localStorage.getItem("theme");
    AOS.init({
    });
  }, []);

  return (
    <Web3Provider network={defaultWeb3Provider}>
      <ThemeSwitcherProvider themeMap={themes} defaultTheme={prevTheme.current}>
        <>
          <CommonHead />
          {router?.pathname !== "/debug" ? null : <NetworkDisplay />}
          {router?.pathname !== "/debug" ? null : <DevUI />}
          {/* {router?.pathname === "/" ? null : <ThemeSwitch />} */}
          <Component {...pageProps} />
        </>
      </ThemeSwitcherProvider>
    </Web3Provider>
  );
}

export default MyApp;
