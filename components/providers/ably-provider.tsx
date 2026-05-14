'use client';

import * as Ably from 'ably';
import { AblyProvider, ChannelProvider } from 'ably/react';

// İstemci tarafında Ably bağlantısını başlatıyoruz
const client = new Ably.Realtime({ 
  key: process.env.NEXT_PUBLIC_ABLY_API_KEY,
  clientId: 'modul-dashboard-user' // Kullanıcıyı temsil eder
});

export function TelemetryProvider({ children }: { children: React.ReactNode }) {
  return (
    <AblyProvider client={client}>
      {/* Tüm sistemi 'modul-network' kanalına bağlıyoruz */}
      <ChannelProvider channelName="modul-network">
        {children}
      </ChannelProvider>
    </AblyProvider>
  );
}