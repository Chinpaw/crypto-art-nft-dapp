// file: app/providers.tsx
'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import React from 'react'; // Impor React untuk menggunakan tipe React.ReactNode

// Dapatkan projectId dari https://cloud.walletconnect.com/
const projectId = 'MASUKKAN_PROJECT_ID_WALLETCONNECT_ANDA'; 

const config = getDefaultConfig({
  appName: 'CryptoArt',
  projectId: projectId,
  chains: [sepolia],
  ssr: true,
});

const queryClient = new QueryClient();

//           TAMBAHKAN TIPE UNTUK CHILDREN DI SINI
//                     vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}