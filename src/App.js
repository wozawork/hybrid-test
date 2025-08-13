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

function App() {
  useEffect(() => {
    if (isDesktopBrowser()) {
      console.log("Desktop browser detected, initializing BioCatch");
      initializeBioCatch();
      changeContext(PAGE_CONTEXT.HOME);
    } else if (isWebView()) {
      console.log("WebView detected, initializing BioCatch Client");
      initializebcClient();
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
  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "auto",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}>
      <h2 style={{ marginBottom: 0 }}>Log in to</h2>
      <h1 style={{ marginTop: 0, color: "#005eb8" }}>ANZ Internet Banking</h1>

      <label htmlFor="crn">Customer Registration Number</label>
      <input
        type="text"
        id="crn"
        name="crn"
        style={{
          width: "100%",
          padding: "10px",
          margin: "8px 0",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        name="password"
        style={{
          width: "100%",
          padding: "10px",
          margin: "8px 0",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      />

      <button
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor: "#0076c0",
          color: "white",
          border: "none",
          borderRadius: "4px",
          fontSize: "16px",
          cursor: "pointer",
        }}>
        🔒 Log in
      </button>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
        }}>
        <a href="#" style={{ color: "#005eb8", textDecoration: "none" }}>
          Forgot login details?
        </a>
        <a href="#" style={{ color: "#005eb8", textDecoration: "none" }}>
          Help
        </a>
      </div>

      <hr style={{ margin: "20px 0" }} />

      <p>
        New to Internet Banking?{" "}
        <a href="#" style={{ color: "#6a1b9a" }}>
          Register
        </a>
      </p>
      <p style={{ fontSize: "12px" }}>
        By logging in, you accept our{" "}
        <a href="#" style={{ color: "#005eb8" }}>
          Security and Privacy Statement
        </a>
        .
      </p>
    </div>
  );
};

export default App;
