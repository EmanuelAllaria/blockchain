import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import TokenCard from '../components/TokenCard'

// Mock the useTokens hook
vi.mock('../hooks/useTokens', () => ({
  useTokens: vi.fn(() => ({
    balanceQuery: { data: BigInt(100000000000000000000), isLoading: false },
    allowanceQuery: { data: BigInt(50000000000000000000), isLoading: false },
    approve: vi.fn(),
    transfer: vi.fn(),
    mint: vi.fn(),
  })),
}))

describe('TokenCard', () => {
  it('renders balance', () => {
    render(<TokenCard token="DAI" />)
    expect(screen.getByText(/Balance:/)).toBeInTheDocument()
  })

  it('renders component without crashing', () => {
    const { container } = render(<TokenCard token="DAI" />)
    expect(container).toBeInTheDocument()
  })
})
