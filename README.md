# Frontend Challenge

React + Vite application with Web3 integration (Wagmi/Viem), wallet (RainbowKit), state (Zustand), and routing.

## Requirements

- Node `>=18`
- Account/API key for Sepolia RPC (Alchemy or similar)
- WalletConnect Project ID

## Setup

1. Create a `.env` file at the project root with:

```
VITE_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_SEPOLIA_API_KEY
VITE_WC_PROJECT_ID=YOUR_WALLETCONNECT_PROJECT_ID
```

2. Install dependencies:

```
npm install
```

3. Development:

```
npm run dev
```

4. Build and preview:

```
npm run build
npm run preview
```

## Technical Decisions

- `wagmi` + `@rainbow-me/rainbowkit` for providers and wallet connection.
- `zustand` for simple state management (events and UI flags).
- `@tanstack/react-query` for RainbowKit compatibility.
- `react-router-dom` to provide routing and page separation.
- UI uses basic HTML and inline styles to avoid conflicts with Chakra v3.
- `framer-motion` for subtle animations (fade-in and micro-interactions).

## Implemented Functionality

- Connect wallet and detect network; guide the user to use Sepolia.
- Display balances for `DAI` (18) and `USDC` (6).
- Read `allowance` for the entered `spender`.
- Actions: `Approve`, `Transfer`, `Mint` with validations and loading states.
- Events table: token, type, amount, from, to, `txHash`.
- Routing: `Dashboard` page at `/`.

## Scripts

- `npm run dev` — development server.
- `npm run build` — production build.
- `npm run preview` — preview of the build.
- `npm run test` — unit tests (Vitest).
- `npm run cypress:open` — E2E (Cypress UI).
- `npm run format` — Prettier.

## Tests

- Unit (Vitest + Testing Library):
  - Run `npm run test`.
  - `useTokens` is mocked to validate `TokenCard` rendering and actions.
- E2E (Cypress):
  - Start the app (`npm run dev` or `npm run preview`).
  - Run `npm run cypress:open` and execute `App flows`.

## Notes

- Ensure `VITE_RPC_URL` points only to Sepolia.
- Enter a valid `VITE_WC_PROJECT_ID` for WalletConnect.
- If desired, a UI library (Chakra v3) can be reintroduced once types are stable.
