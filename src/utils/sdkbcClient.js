import { WINDOW_CDAPI_NOT_EXIST, ABC_NUMBER_CHARACTERS } from "./constants";
import HeartBeatSample from "./HeartBeatSample";

/**
 * BioCatch SDK Integration Utilities
 *
 * This file contains wrapper functions for BioCatch SDK integration.
 * These functions provide a safe interface to interact with the BioCatch
 * cdApi object while handling errors gracefully.
 *
 * For more information about BioCatch SDK integration, visit:
 * https://docs.biocatch.com/
 */

/**
 * Sets the customer session ID for BioCatch tracking
 *
 * This function should be called when a user session begins or when
 * transitioning between different user contexts. The session ID helps
 * BioCatch maintain continuity in behavioral analysis.
 *
 * @param {string} userCSID - Customer Session ID
 */
export const setCustomerSessionId = (userCSID) => {
  try {
    if (window && window.bcClient) {
      window.bcClient.setCustomerSessionId(userCSID);
      console.log("BioCatch: Customer session ID set successfully");
    } else {
      console.warn(WINDOW_CDAPI_NOT_EXIST);
    }
  } catch (error) {
    console.error("BioCatch SDK Error - setCustomerSessionId:", error);
  }
};

/**
 * Changes the current context for BioCatch behavioral tracking
 *
 * This function informs BioCatch about the current page or application
 * state. Different contexts help BioCatch understand user behavior
 * patterns specific to different parts of your application.
 *
 * @param {string} pageName - The name/identifier of the current page context
 */
export const changeContextBcClient = (pageName) => {
  try {
    if (window && window.bcClient) {
      window.bcClient.changeContext(pageName);
      console.log(`BioCatch: Context changed to ${pageName}`);
    } else {
      console.warn(WINDOW_CDAPI_NOT_EXIST, " - Context:", pageName);
    }
  } catch (error) {
    console.error("BioCatch SDK Error - changeContext:", error);
  }
};

/**
 * Sets the customer brand for BioCatch tracking
 *
 * This function allows you to specify the brand context for behavioral
 * analysis, useful for multi-brand applications or white-label solutions.
 *
 * @param {string} brand - Brand identifier
 */
export const setCustomerBrand = (brand) => {
  try {
    if (window && window.bcClient) {
      window.bcClient.setCustomerBrand(brand);
      console.log(`BioCatch: Brand set to ${brand}`);
    } else {
      console.warn(WINDOW_CDAPI_NOT_EXIST);
    }
  } catch (error) {
    console.error("BioCatch SDK Error - setCustomerBrand:", error);
  }
};

/**
 * Triggers an immediate flush of behavioral data to BioCatch servers
 *
 * This function should be called before critical user actions (like login,
 * payments, or form submissions) to ensure all captured behavioral data
 * is sent to BioCatch for real-time risk assessment.
 *
 * For more details, see: https://docs.biocatch.com/docs/ios-optional-functions?highlight=flush
 */
export const performFlush = () => {
  try {
    if (window && window.bcClient && window.bcClient.client) {
      window.bcClient.client.flush();
      console.log("BioCatch: Data flushed successfully");
    } else {
      console.warn(WINDOW_CDAPI_NOT_EXIST);
    }
  } catch (error) {
    console.error("BioCatch SDK Error - performFlush:", error);
  }
};

export const resumeCollection = () => {
  try {
    if (window && window.bcClient) {
      window.bcClient.resumeCollection();
    } else {
      console.log(WINDOW_CDAPI_NOT_EXIST);
    }
  } catch (e) {
    console.error(e);
  }
};

export const pauseCollection = () => {
  try {
    if (window && window.bcClient) {
      window.bcClient.pauseCollection();
    } else {
      console.log(WINDOW_CDAPI_NOT_EXIST);
    }
  } catch (e) {
    console.error(e);
  }
};

export const startHeartBeat = () => {
  try {
    const heartBeat = new HeartBeatSample();
    heartBeat.startListen();
  } catch (e) {
    console.error(e);
  }
};

export const dummyData = (
  customerId,
  actionName,
  CSID,
  activityType,
  uuid,
  brand,
  solution
) => {
  return {
    customerId: customerId ? customerId : "dummy",
    action: actionName,
    customerSessionId: CSID,
    activityType: activityType ? activityType : "LOGIN",
    uuid: uuid,
    brand: brand,
    solution: solution,
  };
};

export function postApi(actionName) {
  console.log("API call: ", actionName);
  // fetch(POST_URL, {
  //     method: "POST",
  //     body: JSON.stringify(dummyData(actionName)),
  // })
  //     .then(res => res.json())
  //     .then(json => console.log(json))
  //     .catch(err => console.log(err))
}

export function firstInitial(CSID, customerBrand, context) {
  try {
    if (window && window.bcClient) {
      window.bcClient.setCustomerSessionId(CSID);
      window.bcClient.setCustomerBrand(customerBrand);
      window.bcClient.changeContext(context);
    }
  } catch (e) {
    console.error(e);
  }
}

// FOR DUMMY DEMO ONLY - in real life the CSID value is managed server-side:
export function getTheCSID() {
  const dateNowSec = Date.now().toString();
  const CSID = "TEST" + dateNowSec;
  return CSID;

  // try {
  //   const CSID = window.sessionStorage.getItem('CSID');
  //   if (!CSID) {
  //     const dateNowSec = Date.now().toString();
  //     const CSID = 'TEST' + dateNowSec;
  //     sessionStorage.setItem('CSID', CSID);
  //     console.log('a CSID sessionStorage key created: ' + CSID);
  //     return CSID;
  //   } else {
  //     console.log('a CSID sessionStorage key: ' + CSID);
  //     return CSID; // do nothing, just get the CSID from the sessionStorage.
  //   }
  // } catch (e) {
  //   console.error('Oops: ' + e);
  // }
}

export function alternativeLoad(url, csid, context, brand) {
  const jsLoaded = window.sessionStorage.getItem("isLoaded");
  let theJs = document.createElement("script");
  theJs.type = "text/javascript";

  function jsSdkCheckState() {
    function onNotification(e) {
      const msg = e.data;
      if (
        msg.type === "cdStateChangedEvent" &&
        (msg.event["state"] === "starting" || msg.event["state"] === "started")
      ) {
        try {
          window.bcClient.setCustomerSessionId(csid);
          window.bcClient.changeContext(context);
        } catch (e) {
          console.error(e);
        }
        window.removeEventListener("message", onNotification, true);
      }
    }
    window && window.addEventListener
      ? window.addEventListener("message", onNotification, true)
      : window.attachEvent("onmessage", onNotification);
  }

  if (window.self === window.top) {
    window.onbeforeunload = function () {
      sessionStorage.removeItem("isLoaded");
    };
  }
  if (jsLoaded !== "true") {
    jsSdkCheckState();
    theJs.src = url;
    document.getElementsByTagName("head")[0].appendChild(theJs);
    sessionStorage.setItem("isLoaded", "true");
  } else {
    if (window.self === window.top && window.bcClient) {
      try {
        window.bcClient.setCustomerSessionId(csid);
        window.bcClient.changeContext(context);
        if (brand) {
          window.bcClient.setCustomerBrand(brand);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }
}

export function generateString(length) {
  let result = "T";
  const charactersLength = ABC_NUMBER_CHARACTERS.length;
  for (let i = 0; i < length; i++) {
    result += ABC_NUMBER_CHARACTERS.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }

  return result;
}
