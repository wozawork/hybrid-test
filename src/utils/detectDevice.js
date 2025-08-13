// utils/detectDevice.js

/**
 * Detects if the current environment is a WebView (embedded browser)
 * @returns {boolean} true if running in a WebView
 */
export function isWebView() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // iOS WebView detection
  if (isIOSDevice()) {
    // WKWebView doesn't have Safari in user agent
    if (!/Safari/.test(userAgent)) {
      return true;
    }
    
    // UIWebView detection (legacy)
    if (/AppleWebKit/.test(userAgent) && !/Safari/.test(userAgent)) {
      return true;
    }
    
    // Check for specific WebView indicators
    if (/\bwv\b/.test(userAgent) || /Version\/[\d.]+.*Mobile.*Safari/.test(userAgent)) {
      return true;
    }
  }
  
  // Android WebView detection
  if (isAndroidDevice()) {
    // Android WebView typically has "wv" in user agent
    if (/\bwv\b/.test(userAgent)) {
      return true;
    }
    
    // Chrome WebView detection
    if (/Chrome\/[\d.]+.*Mobile.*Safari/.test(userAgent) && !/\bVersion\/[\d.]+/.test(userAgent)) {
      return true;
    }
    
    // Generic Android WebView patterns
    if (/Android.*AppleWebKit(?!.*(?:Version|Chrome))/.test(userAgent)) {
      return true;
    }
  }
  
  // Additional WebView indicators
  if (window.ReactNativeWebView || 
      window.external?.notify || 
      window.webkit?.messageHandlers ||
      document.documentElement.getAttribute('data-wv') === 'true') {
    return true;
  }
  
  return false;
}

/**
 * Detects if the current device is iOS
 * @returns {boolean} true if iOS device
 */
export function isIOSDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  // Check platform first (most reliable)
  if (/iPad|iPhone|iPod/.test(navigator.platform) && !window.MSStream) {
    return true;
  }
  
  // Fallback for iOS 13+ where platform might be "MacIntel"
  if (/iPad|iPhone|iPod|iOS/.test(userAgent) && !window.MSStream) {
    return true;
  }
  
  // iOS 13+ iPad detection (reports as desktop)
  if (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) {
    return true;
  }
  
  return false;
}

/**
 * Detects if the current device is Android
 * @returns {boolean} true if Android device
 */
export function isAndroidDevice() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /Android/i.test(userAgent);
}

/**
 * Detects if the current device is mobile (iOS or Android)
 * @returns {boolean} true if mobile device
 */
export function isMobileDevice() {
  return isIOSDevice() || isAndroidDevice();
}

/**
 * Detects if running in a desktop web browser
 * @returns {boolean} true if desktop browser
 */
export function isDesktopBrowser() {
  return !isMobileDevice() && !isWebView();
}

/**
 * Detects if running in a mobile browser (not WebView)
 * @returns {boolean} true if mobile browser
 */
export function isMobileBrowser() {
  return isMobileDevice() && !isWebView();
}

/**
 * Gets detailed environment information
 * @returns {object} Environment details
 */
export function getEnvironmentInfo() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  
  return {
    userAgent,
    isDesktop: isDesktopBrowser(),
    isMobile: isMobileDevice(),
    isWebView: isWebView(),
    isMobileBrowser: isMobileBrowser(),
    isIOS: isIOSDevice(),
    isAndroid: isAndroidDevice(),
    platform: navigator.platform,
    vendor: navigator.vendor,
    maxTouchPoints: navigator.maxTouchPoints
  };
}
