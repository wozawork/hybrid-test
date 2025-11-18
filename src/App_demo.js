import logo from './logo.svg';
import './App.css';
import React, { useEffect } from "react";
import { changeContext } from "./utils/sdk";
import { PAGE_CONTEXT, PAGE_NAME } from "./utils/constants";
import { initializeBioCatch } from "./utils/bioCatchSessionManager";
import {
  isDesktopBrowser,
  isWebView,
  isMobileBrowser,
} from "./utils/detectDevice";
import { initializebcClient } from "./utils/bcClientSessionManager";
import { changeContextBcClient } from "./utils/sdkbcClient";

import InsuranceStep1 from "./InsuranceStep1";

function App() {
  useEffect(() => {
    if (isDesktopBrowser()) {
      console.log("Desktop browser detected, initializing BioCatch");
      initializeBioCatch();
      changeContext(PAGE_CONTEXT.HOME);
    } else if (isWebView()) {
      console.log("WebView detected, initializing BioCatch Client");
      //initializebcClient();
      changeContextBcClient(PAGE_CONTEXT.HOME);
    } else if (isMobileBrowser()) {
      console.log("Mobile browser detected, initializing BioCatch");
      initializeBioCatch();
      changeContext(PAGE_CONTEXT.HOME);
    } else {
      console.log("Unknown environment, defaulting to BioCatch");
      initializeBioCatch();
      changeContext(PAGE_CONTEXT.HOME);
    }
  }, []);
  return <InsuranceStep1 />;
};

export default App;
