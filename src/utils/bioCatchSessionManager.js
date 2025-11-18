/**
 * BioCatch Session Manager - Compliant Implementation
 *
 * Manages CSID lifecycle according to BioCatch best practices:
 * - Maintains 1:1 CSID:SID relationship
 * - Handles session persistence across page navigation
 * - Manages session timeouts and cleanup
 * - Properly initializes and ends sessions
 */

import { WINDOW_CDAPI_NOT_EXIST } from "./constants";

class BioCatchSessionManager {
  constructor() {
    this.sessionKey = "biocatch_session";
    this.sessionTimeout = 1800000; // 30 minutes in milliseconds
    this.isInitialized = false;
    this.currentCSID = null;
  }

  /**
   * Initialize session at application startup
   * Call this in App.js or main entry point
   */
  async initializeApplication() {
    if (this.isInitialized) return;

    try {
      // Check if we have an existing valid session
      const existingSession = this.getStoredSession();

      if (existingSession && this.isSessionValid(existingSession)) {
        // Restore existing session - do NOT call startNewSession
        this.currentCSID = existingSession.csid;
        this.setCustomerSessionId(existingSession.csid);
        console.log(
          "BioCatch: Restored existing session",
          existingSession.csid
        );
      } else {
        // Start completely new session
        await this.startNewSession();
      }

      this.isInitialized = true;
      this.setupSessionCleanup();
    } catch (error) {
      console.error("BioCatch Session Manager Error:", error);
    }
  }

  /**
   * Start a completely new session
   * Use ONLY when:
   * - Application first loads and no valid session exists
   * - User logs out
   * - Session expires
   * - User switches between different authentication contexts
   */
  async startNewSession() {
    try {
      if (window && window.cdApi) {
        // Generate new CSID (should come from your backend in production)
        const newCSID = this.generateCSID();

        // IMPORTANT: Call startNewSession first, then set CSID
        //window.cdApi.startNewSession();

        // Wait a bit for session to initialize
        setTimeout(() => {
          this.setCustomerSessionId(newCSID);
        }, 100);

        // Store session data
        const sessionData = {
          csid: newCSID,
          startTime: Date.now(),
          lastActivity: Date.now(),
        };

        this.storeSession(sessionData);
        this.currentCSID = newCSID;

        console.log("BioCatch: Started new session", newCSID);
        return newCSID;
      } else {
        console.warn(WINDOW_CDAPI_NOT_EXIST);
      }
    } catch (error) {
      console.error("BioCatch SDK Error - startNewSession:", error);
    }
  }

  /**
   * Update session activity timestamp
   * Call on user interactions to extend session
   */
  updateActivity() {
    const session = this.getStoredSession();
    if (session && this.isSessionValid(session)) {
      session.lastActivity = Date.now();
      this.storeSession(session);
    }
  }

  /**
   * Get current session CSID
   * Use this instead of generating new CSIDs
   */
  getCurrentCSID() {
    return this.currentCSID;
  }

  /**
   * Check if current session is valid
   */
  isSessionValid(session = null) {
    const sessionData = session || this.getStoredSession();
    if (!sessionData) return false;

    const now = Date.now();
    const timeSinceLastActivity = now - sessionData.lastActivity;
    return timeSinceLastActivity <= this.sessionTimeout;
  }

  /**
   * End current session and cleanup
   * Call this on logout or session timeout
   */
  async endSession() {
    try {
      // Clear stored session data
      this.clearStoredSession();
      this.currentCSID = null;
      this.isInitialized = false;

      console.log("BioCatch: Session ended");

      // Start a new session for the next user interaction
      // This ensures we're ready for login page tracking
      await this.startNewSession();
    } catch (error) {
      console.error("BioCatch Session Manager - endSession error:", error);
    }
  }

  /**
   * Handle user logout
   * Properly ends session and starts new one for login tracking
   */
  async handleLogout() {
    console.log("BioCatch: Handling user logout");
    await this.endSession();
  }

  /**
   * Handle user login
   * Sets CSID for authenticated session (should come from backend)
   */
  handleLogin(userCSID) {
    if (!userCSID) {
      console.warn("BioCatch: No CSID provided for login");
      return;
    }

    // Update current session with authenticated CSID
    this.currentCSID = userCSID;
    this.setCustomerSessionId(userCSID);

    // Update stored session
    const sessionData = this.getStoredSession() || {};
    sessionData.csid = userCSID;
    sessionData.lastActivity = Date.now();
    sessionData.isAuthenticated = true;
    this.storeSession(sessionData);

    console.log("BioCatch: User logged in with CSID:", userCSID);
  }

  /**
   * Set customer session ID with BioCatch SDK
   * @private
   */
  setCustomerSessionId(csid) {
    try {
      if (window && window.cdApi) {
        window.cdApi.setCustomerSessionId(csid);
        console.log("BioCatch: CSID set successfully", csid);
      } else {
        console.warn(WINDOW_CDAPI_NOT_EXIST);
      }
    } catch (error) {
      console.error("BioCatch SDK Error - setCustomerSessionId:", error);
    }
  }

  /**
   * Generate a new CSID following best practices
   * @private
   */
  generateCSID() {
    // In production, this should come from your backend
    // This is a demo implementation only
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `DEMO_${timestamp}_${random}`;
  }

  /**
   * Store session data in sessionStorage
   * @private
   */
  storeSession(sessionData) {
    try {
      sessionStorage.setItem(this.sessionKey, JSON.stringify(sessionData));
    } catch (error) {
      console.error("Failed to store session data:", error);
    }
  }

  /**
   * Retrieve session data from sessionStorage
   * @private
   */
  getStoredSession() {
    try {
      const data = sessionStorage.getItem(this.sessionKey);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Failed to retrieve session data:", error);
      return null;
    }
  }

  /**
   * Clear stored session data
   * @private
   */
  clearStoredSession() {
    try {
      sessionStorage.removeItem(this.sessionKey);
    } catch (error) {
      console.error("Failed to clear session data:", error);
    }
  }

  /**
   * Setup automatic session cleanup
   * @private
   */
  setupSessionCleanup() {
    // Check session validity periodically
    const checkInterval = setInterval(() => {
      if (!this.isSessionValid()) {
        console.log("BioCatch: Session expired, ending session");
        this.endSession();
        clearInterval(checkInterval);
      }
    }, 60000); // Check every minute

    // Handle page visibility changes (tab switching)
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        // Page became visible, update activity
        this.updateActivity();
      }
    });

    // Handle beforeunload - don't clear session on page refresh
    window.addEventListener("beforeunload", () => {
      // Update last activity but don't end session
      // Session will be restored on next page load if still valid
      this.updateActivity();
    });
  }
}

// Export singleton instance
export const bioCatchSessionManager = new BioCatchSessionManager();

// Convenience functions for backward compatibility
export const initializeBioCatch = () =>
  bioCatchSessionManager.initializeApplication();
export const startNewBioCatchSession = () =>
  bioCatchSessionManager.startNewSession();
export const getCurrentBioCatchCSID = () =>
  bioCatchSessionManager.getCurrentCSID();
export const updateBioCatchActivity = () =>
  bioCatchSessionManager.updateActivity();
export const endBioCatchSession = () => bioCatchSessionManager.endSession();
export const handleBioCatchLogout = () => bioCatchSessionManager.handleLogout();
export const handleBioCatchLogin = (csid) =>
  bioCatchSessionManager.handleLogin(csid);

export default bioCatchSessionManager;
