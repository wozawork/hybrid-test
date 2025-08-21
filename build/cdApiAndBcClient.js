// sample on how to use the cdApi or bcClient in the hybrid flow (based on the meta tag `isHybrid` + 'csid' meta tag):
function initializeClient() {
  let pollingIntervalId;
  let reminderTimeoutId;

  /**
   * Starts the bcClient with the given CSID, if valid.
   */
  function startClient(csid) {
    console.log("Starting bcClient with CSID:", csid); // remember to delete this line in production
    if (window.bcClientConfiguration && typeof bcClient?.start === "function") {
      console.log(csid); // remember to delete this line in production
      csid = csid.trim();
      bcClient.start(
        "https://wup-4ff4f23f.eu.v2.we-stats.com",
        "dummy",
        csid,
        window.bcClientConfiguration,
        4
      );
      console.log("bcClient started with CSID:", csid); // remember to delete this line in production
    } else {
      console.error("bcClientConfiguration or bcClient.start not available"); // remember to delete this line in production
    }
  }

  /**
   * Check the document for a valid CSID in meta tag.
   * Starts the client if found and clears all timers.
   */
  function checkForCSID() {
    console.log("Checking for meta tag..."); // remember to delete this line in production
    const getMetatagContent = window.bcGetMetatagContent;

    if (typeof getMetatagContent !== "function") {
      console.error("bcGetMetatagContent is not defined."); // remember to delete this line in production
      return;
    }

    const csid = getMetatagContent("customerSessionId");

    if (csid && csid.length > 10) {
      console.log("Valid meta tag found. Initializing client..."); // remember to delete this line in production
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
    console.log("Polling stopped after timeout."); // remember to delete this line in production
  }

  // Begin polling every 1 seconds
  pollingIntervalId = setInterval(checkForCSID, 1000);

  // Stop all activity after 10 seconds
  reminderTimeoutId = setTimeout(() => {
    console.warn(
      "CSID meta tag not found within 10 seconds. Stopping polling."
    ); // remember to delete this line in production
    stopPolling();
  }, 10000);
}
