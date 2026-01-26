/**
 * Production-grade logger utility.
 * Conditionally logs based on environment.
 * Can be easily extended for remote logging services.
 */

const isDev = import.meta.env.DEV;

export const logger = {
  info: (...args: unknown[]) => {
    if (isDev) console.log("[INFO]", ...args);
  },
  warn: (...args: unknown[]) => {
    if (isDev) console.warn("[WARN]", ...args);
  },
  error: (...args: unknown[]) => {
    // Always log errors, even in production
    console.error("[ERROR]", ...args);
  },
  debug: (...args: unknown[]) => {
    if (isDev) console.log("[DEBUG]", ...args);
  },
};

export default logger;
