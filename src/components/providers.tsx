"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import { AuthProvider } from "@/lib/auth/use-auth";
import { TripProvider } from "@/hooks/use-trips";
import { MessageProvider } from "@/hooks/use-messages";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <APIProvider 
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}
      libraries={['places']}
    >
      <AuthProvider>
        <TripProvider>
          <MessageProvider>
            {children}
          </MessageProvider>
        </TripProvider>
      </AuthProvider>
    </APIProvider>
  );
}
