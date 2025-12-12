import { setupWorker } from "msw/browser";

import { handlers } from "./handlers";

// Configure the worker with our request handlers
export const worker = setupWorker(...handlers);

// Start the worker in development mode
export const startMocking = async () => {
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    return worker.start({
      onUnhandledRequest: "warn",
      serviceWorker: {
        url: "/mockServiceWorker.js",
      },
    });
  }
};

// Stop the worker
export const stopMocking = () => {
  if (typeof window !== "undefined") {
    worker.stop();
  }
};
