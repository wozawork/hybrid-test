// utils/detectDevice.js

export function isMobileDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  const isIOS = /iPad|iPhone|iPod/.test(navigator.platform) && !window.MSStream;
  const isAndroid = /Android/i.test(userAgent);
  const isWebView = /\bwv\b/.test(userAgent); // WebView detection (best-effort)

  return isIOS || isAndroid || isWebView;
}

export function isWebDevice() {
  return !isMobileDevice();
}
