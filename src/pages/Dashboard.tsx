import WalletBar from '../components/WalletBar'
import TokenCard from '../components/TokenCard'
import EventTable from '../components/EventTable'

export default function Dashboard() {
  return (
    <div className="container">
      <WalletBar />
      <div className="cards">
        <TokenCard token="DAI" />
        <TokenCard token="USDC" />
      </div>
      <EventTable />
    </div>
  )
}
