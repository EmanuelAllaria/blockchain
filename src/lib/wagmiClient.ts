import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia } from 'wagmi/chains'
import { http } from 'viem'

export const chains = [sepolia] as const

export const wagmiConfig = getDefaultConfig({
  appName: 'Frontend Challenge',
  projectId: import.meta.env.VITE_WC_PROJECT_ID ?? 'frontend-challenge',
  chains,
  transports: {
    [sepolia.id]: http(import.meta.env.VITE_RPC_URL),
  },
  ssr: true,
})
