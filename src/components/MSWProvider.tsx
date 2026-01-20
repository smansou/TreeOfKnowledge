"use client";

import { useEffect, useState } from "react";

interface MSWProviderProps {
  children: React.ReactNode;
}

export function MSWProvider({ children }: MSWProviderProps) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    const initMSW = async () => {
      if (
        typeof window !== "undefined" &&
        process.env.NODE_ENV === "development"
      ) {
        // Dynamic import to avoid SSR issues
        const { startMocking } = await import("@/lib/mocks/browser");
        await startMocking();
      }
      setMswReady(true);
    };

    initMSW();
  }, []);

  if (process.env.NODE_ENV === "development" && !mswReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-sm text-gray-600">
            Initializing mock services...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
