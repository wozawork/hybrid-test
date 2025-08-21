(function detectDeviceAndInjectMeta() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.platform) && !window.MSStream;
  const isAndroid = /Android/i.test(userAgent);
  const isWebView = /\bwv\b/.test(userAgent); // WebView indicator
  const isHybrid = isIOS || isAndroid || isWebView;

  const metaTag = document.createElement("meta");
  metaTag.name = "isHybrid";
  metaTag.content = isHybrid ? "true" : "false";

  document.head.appendChild(metaTag);
  console.log(
    `Meta tag injected: <meta name="isHybrid" content="${metaTag.content}">`
  );
})();
