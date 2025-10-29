import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTokens } from '../hooks/useTokens'

// Mocks
const addEventMock = vi.fn()

vi.mock('../stores/useAppStore', () => ({
  useAppStore: () => ({ addEvent: addEventMock }),
}))

vi.mock('wagmi', () => ({
  useAccount: () => ({ address: '0x0000000000000000000000000000000000000001' }),
  useChainId: () => 11155111, // Sepolia
  useReadContract: vi.fn(() => ({ data: BigInt(1000000), isLoading: false })),
  useWriteContract: () => ({ writeContractAsync: vi.fn(async () => '0xhash') }),
}))

describe('useTokens hook', () => {
  beforeEach(() => {
    addEventMock.mockClear()
  })

  it('approve adds event with correct payload', async () => {
    const { approve } = useTokens('DAI')
    const tx = await approve('0x0000000000000000000000000000000000000002', '1.5')
    expect(tx).toBe('0xhash')
    expect(addEventMock).toHaveBeenCalledWith({
      type: 'approve',
      token: 'DAI',
      amount: '1.5',
      from: '0x0000000000000000000000000000000000000001',
      to: '0x0000000000000000000000000000000000000002',
      tx: '0xhash',
    })
  })

  it('transfer adds event with correct payload', async () => {
    const { transfer } = useTokens('USDC')
    const tx = await transfer('0x0000000000000000000000000000000000000003', '10')
    expect(tx).toBe('0xhash')
    expect(addEventMock).toHaveBeenCalledWith({
      type: 'transfer',
      token: 'USDC',
      amount: '10',
      from: '0x0000000000000000000000000000000000000001',
      to: '0x0000000000000000000000000000000000000003',
      tx: '0xhash',
    })
  })

  it('mint adds event with correct payload', async () => {
    const { mint } = useTokens('DAI')
    const tx = await mint('0x0000000000000000000000000000000000000004', '2')
    expect(tx).toBe('0xhash')
    expect(addEventMock).toHaveBeenCalledWith({
      type: 'mint',
      token: 'DAI',
      amount: '2',
      from: '0x0000000000000000000000000000000000000001',
      to: '0x0000000000000000000000000000000000000004',
      tx: '0xhash',
    })
  })
})
