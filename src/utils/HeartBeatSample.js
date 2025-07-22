export default class HeartBeatSample {
  constructor(heartBeatIntervalMs = 5000, maxCheckAttempts = 3) {
    this.heartBeatEventsCounter = 0;
    this.heartBeatStatus = "";
    this.heartBeatInterval = heartBeatIntervalMs;
    this.maxCheckAttempts = maxCheckAttempts;
  }
  _setHeartBeatListener() {
    const self = this;
    window.addEventListener("message", (event) => {
      if (event.data.type === "cdHeartbeat") {
        self.heartBeatEventsCounter += 1;
        self.heartBeatStatus = event.data.data;
      }
    });
  }
  _checkHeartBeatStatus() {
    this.maxCheckAttempts -= 1;
    if (this.maxCheckAttempts === 0 && this.heartBeatEventsCounter === 0) {
      // JS is blocked or unavailable, send a Heartbeat API request with "jsstatus":["error(699)"]
    }
    if (this.heartBeatStatus === "Ok") {
      console.log("heartBeat status is Ok");
    } else if (typeof this.heartBeatStatus === "object") {
      console.log("heartBeat errors:");
      this.heartBeatStatus.map((errorNumber) => console.log(errorNumber));
      // REPORT_ACTION -> An error occurred, send a Heartbeat API request with "jsstatus":["error(errorNumber1)","error(errorNumber2)"]
    }
  }
  startListen() {
    this._setHeartBeatListener();
    setInterval(this._checkHeartBeatStatus.bind(this), this.heartBeatInterval);
  }
}

/**
 * REPORT_ACTION
 * An API request should be sent to BioCatch server with the following information:

 "action":"update"

 "jsStatus":"js_unavailable"/”error(X)”

 "uuid":"<uuid>"

 "customerSessionID":"<csid>"

 "brand":"<brand>"

 "customerID":"<cid>"

 "userAgent":"<userAgent>"
 */
