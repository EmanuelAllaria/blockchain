import { useAccount, useChainId, useReadContract, useWriteContract } from 'wagmi'
import { parseUnits } from 'viem'
import { useAppStore } from '../stores/useAppStore'
import type { TokenSymbol } from '../stores/useAppStore'

const TOKEN_ADDRESSES: Record<TokenSymbol, `0x${string}`> = {
  DAI: '0x1D70D57ccD2798323232B2dD027B3aBcA5C00091',
  USDC: '0xC891481A0AaC630F4D89744ccD2C7D2C4215FD47',
}

const TOKEN_DECIMALS: Record<TokenSymbol, number> = {
  DAI: 18,
  USDC: 6,
}

const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'owner', type: 'address' }],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ type: 'uint256' }],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ type: 'bool' }],
  },
  {
    name: 'mint',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [],
  },
] as const

export function useTokens(token: TokenSymbol, spender?: `0x${string}`) {
  const address = useAccount().address
  const chainId = useChainId()
  const { addEvent } = useAppStore()
  const { writeContractAsync } = useWriteContract()

  const contractAddress = TOKEN_ADDRESSES[token]
  const decimals = TOKEN_DECIMALS[token]

  const balanceQuery = useReadContract({
    address: contractAddress,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
  })

  const allowanceQuery = useReadContract({
    address: contractAddress,
    abi: ERC20_ABI,
    functionName: 'allowance',
    args: address && spender ? [address, spender] : undefined,
  })

  async function getBalance(): Promise<bigint | undefined> {
    if (!address) return undefined
    return balanceQuery.data as bigint | undefined
  }

  async function getAllowance(): Promise<bigint | undefined> {
    if (!address || !spender) return undefined
    return allowanceQuery.data as bigint | undefined
  }

  async function approve(spender: `0x${string}`, amount: string) {
    if (!address) throw new Error('Wallet not connected')
    const value = parseUnits(amount, decimals)
    const hash = await writeContractAsync({
      address: contractAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [spender, value],
    })
    addEvent({ type: 'approve', token, amount, from: address, to: spender, tx: hash })
    return hash
  }

  async function transfer(to: `0x${string}`, amount: string) {
    if (!address) throw new Error('Wallet not connected')
    const value = parseUnits(amount, decimals)
    const hash = await writeContractAsync({
      address: contractAddress,
      abi: ERC20_ABI,
      functionName: 'transfer',
      args: [to, value],
    })
    addEvent({ type: 'transfer', token, amount, from: address, to, tx: hash })
    return hash
  }

  async function mint(to: `0x${string}`, amount: string) {
    if (!address) throw new Error('Wallet not connected')
    const value = parseUnits(amount, decimals)
    const hash = await writeContractAsync({
      address: contractAddress,
      abi: ERC20_ABI,
      functionName: 'mint',
      args: [to, value],
    })
    addEvent({ type: 'mint', token, amount, from: address, to, tx: hash })
    return hash
  }

  return {
    address,
    chainId,
    balanceQuery,
    allowanceQuery,
    getBalance,
    getAllowance,
    approve,
    transfer,
    mint,
  }
}
