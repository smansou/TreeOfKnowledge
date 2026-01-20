import { setupWorker } from "msw/browser";

import { handlers } from "./handlers";

// Lazy initialization to prevent SSR issues
let worker: ReturnType<typeof setupWorker> | null = null;

const getWorker = () => {
  if (!worker && typeof window !== "undefined") {
    worker = setupWorker(...handlers);
  }
  return worker;
};

// Start the worker in development mode
export const startMocking = async () => {
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
    const workerInstance = getWorker();
    if (workerInstance) {
      return workerInstance.start({
        onUnhandledRequest: "warn",
        serviceWorker: {
          url: "/mockServiceWorker.js",
        },
      });
    }
  }
};

// Stop the worker
export const stopMocking = () => {
  if (typeof window !== "undefined" && worker) {
    worker.stop();
  }
};

// Export worker for direct access if needed
export { getWorker as worker };
