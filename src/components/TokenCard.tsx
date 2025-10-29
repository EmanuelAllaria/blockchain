import { useState } from 'react'
import { parseUnits } from 'viem'
import { motion } from 'framer-motion'
import { useTokens } from '../hooks/useTokens'
import type { TokenSymbol } from '../stores/useAppStore'

function formatBigint(value?: bigint, decimals = 18) {
  if (value === undefined) return '—'
  const s = value.toString()
  if (decimals === 0) return s
  const pad = s.padStart(decimals + 1, '0')
  const int = pad.slice(0, -decimals)
  const frac = pad.slice(-decimals).replace(/0+$/, '')
  return frac ? `${int}.${frac}` : int
}

export default function TokenCard({ token }: { token: TokenSymbol }) {
  const [amount, setAmount] = useState('')
  const [address, setAddress] = useState<`0x${string}` | ''>('')
  const [spender, setSpender] = useState<`0x${string}` | ''>('')
  const { balanceQuery, allowanceQuery, approve, transfer, mint } = useTokens(
    token,
    spender || undefined
  )
  const [loadingApprove, setLoadingApprove] = useState(false)
  const [loadingTransfer, setLoadingTransfer] = useState(false)
  const [loadingMint, setLoadingMint] = useState(false)

  const isLoadingBalance = balanceQuery.isLoading
  const balance = balanceQuery.data as bigint | undefined

  const decimals = token === 'USDC' ? 6 : 18

  const notEnoughFunds = (() => {
    if (!balance || !amount) return false
    try {
      const a = parseUnits(amount as `${string}`, decimals)
      return a > balance
    } catch {
      return false
    }
  })()

  const invalidAmount = !amount || Number(amount) <= 0 || !isFinite(Number(amount))
  const invalidAddress = !address || !/^0x[0-9a-fA-F]{40}$/.test(address)

  return (
    <motion.div
      className="card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="card-header">
        <strong style={{ marginRight: 'auto' }}>{token}</strong>
        <span>Balance: {isLoadingBalance ? 'Loading…' : formatBigint(balance, decimals)}</span>
      </div>
      <div className="inputs">
        <input
          className="input"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          className="input"
          placeholder="Address (for transfer/mint)"
          value={address}
          onChange={(e) => setAddress(e.target.value as `0x${string}`)}
        />
        <input
          className="input"
          placeholder="Spender (for allowance/approve)"
          value={spender}
          onChange={(e) => setSpender(e.target.value as `0x${string}`)}
        />
        <span className="helper">
          Allowance:{' '}
          {allowanceQuery.isLoading
            ? 'Loading…'
            : formatBigint(allowanceQuery.data as bigint | undefined, decimals)}
        </span>
        {notEnoughFunds && <span className="error">Not enough funds</span>}
        {invalidAmount && amount && <span className="error">Invalid amount</span>}
        {invalidAddress && address && <span className="error">Invalid address</span>}
        <div className="actions">
          <motion.button
            onClick={async () => {
              try {
                setLoadingApprove(true)
                await approve((spender || address) as `0x${string}`, amount)
              } finally {
                setLoadingApprove(false)
              }
            }}
            disabled={invalidAmount || (invalidAddress && !spender) || loadingApprove}
            className="btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            {loadingApprove ? 'Approving…' : 'Approve'}
          </motion.button>
          <motion.button
            onClick={async () => {
              try {
                setLoadingTransfer(true)
                await transfer(address as `0x${string}`, amount)
              } finally {
                setLoadingTransfer(false)
              }
            }}
            disabled={invalidAmount || invalidAddress || notEnoughFunds || loadingTransfer}
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            {loadingTransfer ? 'Transferring…' : 'Transfer'}
          </motion.button>
          <motion.button
            onClick={async () => {
              try {
                setLoadingMint(true)
                await mint(address as `0x${string}`, amount)
              } finally {
                setLoadingMint(false)
              }
            }}
            disabled={invalidAmount || invalidAddress || loadingMint}
            className="btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            {loadingMint ? 'Minting…' : 'Mint'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
