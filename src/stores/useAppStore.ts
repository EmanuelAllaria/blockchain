import { create } from 'zustand'

export type TokenSymbol = 'DAI' | 'USDC'
export type EventType = 'approve' | 'transfer' | 'mint' | 'balance'

export interface TokenEvent {
  type: EventType
  token: TokenSymbol
  amount: string
  from?: string
  to?: string
  tx?: string
  timestamp?: number
}

interface AppState {
  events: TokenEvent[]
  addEvent: (e: TokenEvent) => void
  clearEvents: () => void
}

export const useAppStore = create<AppState>((set) => ({
  events: [],
  addEvent: (e) => set((s) => ({ events: [{ ...e, timestamp: Date.now() }, ...s.events] })),
  clearEvents: () => set({ events: [] }),
}))
