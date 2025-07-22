/**
 * The `cdApi` object provides configuration management, context switching, and session control
 * for the client application. It retrieves configuration values, posts messages to the window,
 * and manages customer session and brand information.
 *
 * If the meta tag `isHybeid` is present and set to true, only `cdApi` is appended to the global scope.
 * If the meta tag `isHybeid` is absent or set to false,`BcClient` are appended.
 * Once the bcClient.Start was triggerd the `cdApi` will be appended to the window as-well. (so old integration will not break - they will still have access to the `cdApi` object)
 *
 * This logic allows the application to adapt its available APIs based on the environment or integration mode.
 */

(function (window, document) {
    'use strict';
    const getMetatagContent = (name) => {
        const elem = document.querySelector(`meta[name="${name}"]`);
        return elem ? elem.getAttribute('content') : '';
    };

    const isHybrid = getMetatagContent('isHybrid');

    if (isHybrid === 'false') {
      console.log("Hybrid mode is false, using cdApi"); // remember to delete this line in production
      const cdApi = {
        configurationKeys: {
          wupServerURL: "wupServerURL",
          logServerURL: "logServerURL",
          enableCustomElementsProcessing: "enableCustomElementsProcessing",
          collectionSettings: "collectionSettings",
          maxShadowDepth: "maxShadowDepth",
        },

        getMetatagContent: (name) => {
          const elem = document.querySelector(`meta[name="${name}"]`);
          return elem ? elem.getAttribute("content") : "";
        },

        getConfigurations: function (callback) {
          const configurations = {};
          configurations[cdApi.configurationKeys.wupServerURL] =
            "https://wup-4ff4f23f.eu.v2.we-stats.com/client/v3.1/web/wup?v=1&cid=dummy";
          configurations[cdApi.configurationKeys.logServerURL] =
            "https://logs-4ff4f23f.eu.v2.we-stats.com/api/v1/sendLogs";
          configurations[
            cdApi.configurationKeys.enableCustomElementsProcessing
          ] = true;
          configurations[cdApi.configurationKeys.maxShadowDepth] = 25;
          configurations[cdApi.configurationKeys.collectionSettings] = {
            elementSettings: { customElementAttribute: "data-bb" },
          };
          callback(configurations);
        },

        postMessage: function (message) {
          window.postMessage(message, window.location.origin);
        },

        changeContext: function (contextName) {
          this.postMessage({
            type: "ContextChange",
            context: contextName,
          });
        },

        startNewSession: function (csid) {
          this.postMessage({
            type: "ResetSession",
            resetReason: "customerApi",
            csid,
          });
        },

        setCustomerSessionId: function (csid) {
          this.postMessage({ type: "cdSetCsid", csid: csid });
        },

        setCustomerBrand: function (brand) {
          this.postMessage({
            type: "cdSetCustomerBrand",
            brand: brand,
          });
        },
      };
      window.cdApi = cdApi;
    } else {
      console.log("Hybrid mode is true, using bcClient"); // remember to delete this line in production
      const bcGetMetatagContent = (name) => {
        const elem = document.querySelector(`meta[name="${name}"]`);
        return elem ? elem.getAttribute("content") : "";
      };
      const bcGetCookiesContent = (key) => {
        let result = new RegExp(
          "(?:^|; )" + encodeURIComponent(key) + "=([^;]*)"
        ).exec(document.cookie);
        return result ? decodeURIComponent(result[1]) : "";
      };
      const bcClientConfiguration = {};
      bcClientConfiguration["logServerURL"] =
        "https://logs-4ff4f23f.eu.v2.we-stats.com/api/v1/sendLogs";
      bcClientConfiguration["enableCustomElementsProcessing"] = true;
      bcClientConfiguration["collectionSettings"] = {
        mode: {
          agentType: "secondary",
          collectionMode: "lean",
        },
      };
      window.bcClientConfiguration = bcClientConfiguration;
      window.bcGetMetatagContent = bcGetMetatagContent;
      window.bcGetCookiesContent = bcGetCookiesContent;
    }
})(window, document);



// sample on how to use the cdApi or bcClient in the hybrid flow (based on the meta tag `isHybrid` + 'csid' meta tag):
function initializeClient() {
    let pollingIntervalId;
    let reminderTimeoutId;

    /**
     * Starts the bcClient with the given CSID, if valid.
     */
    function startClient(csid) {
        console.log('Starting bcClient with CSID:', csid); // remember to delete this line in production
        if (window.bcClientConfiguration && typeof bcClient?.start === 'function') {
            console.log(csid); // remember to delete this line in production
            csid = csid.trim();
            bcClient.start('https://wup-4ff4f23f.eu.v2.we-stats.com', 'dummy', csid, window.bcClientConfiguration, 4);
            console.log('bcClient started with CSID:', csid); // remember to delete this line in production
        } else {
            console.error('bcClientConfiguration or bcClient.start not available'); // remember to delete this line in production
        }
    }

    /**
     * Check the document for a valid CSID in meta tag.
     * Starts the client if found and clears all timers.
     */
    function checkForCSID() {
        console.log('Checking for meta tag...'); // remember to delete this line in production
        const getMetatagContent = window.bcGetMetatagContent;

        if (typeof getMetatagContent !== 'function') {
            console.error('bcGetMetatagContent is not defined.'); // remember to delete this line in production
            return;
        }

        const csid = getMetatagContent('customerSessionId');

        if (csid && csid.length > 10) {
            console.log('Valid meta tag found. Initializing client...'); // remember to delete this line in production
            startClient(csid);
            clearInterval(pollingIntervalId);
            clearTimeout(reminderTimeoutId);
        }
    }

    /**
     * Stops all polling and timeouts.
     */
    function stopPolling() {
        clearInterval(pollingIntervalId);
        clearTimeout(reminderTimeoutId);
        console.log('Polling stopped after timeout.'); // remember to delete this line in production
    }

    // Begin polling every 1 seconds
    pollingIntervalId = setInterval(checkForCSID, 1000);

    // Stop all activity after 10 seconds
    reminderTimeoutId = setTimeout(() => {
        console.warn('CSID meta tag not found within 10 seconds. Stopping polling.'); // remember to delete this line in production
        stopPolling();
    }, 10000);
}
