import { ConnectButton } from '@rainbow-me/rainbowkit'
import { motion } from 'framer-motion'
import { useChainId, useSwitchChain } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export default function WalletBar() {
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()

  const isSepolia = chainId === sepolia.id

  return (
    <motion.div
      className="wallet-bar"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <ConnectButton />
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <span className="badge">Network: {isSepolia ? 'Sepolia' : (chainId ?? '—')}</span>
        {!isSepolia && (
          <motion.button
            onClick={() => switchChain({ chainId: sepolia.id })}
            disabled={isPending}
            className="btn btn-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
          >
            {isPending ? 'Switching…' : 'Switch to Sepolia'}
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}
