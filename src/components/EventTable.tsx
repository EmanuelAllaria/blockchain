import { useAppStore } from '../stores/useAppStore'

export default function EventTable() {
  const { events } = useAppStore()

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Token</th>
          <th>Type</th>
          <th style={{ textAlign: 'right' }}>Amount</th>
          <th>From</th>
          <th>To</th>
          <th>Hash</th>
        </tr>
      </thead>
      <tbody>
        {events.map((e, i) => (
          <tr key={i}>
            <td>{e.token}</td>
            <td>{e.type}</td>
            <td style={{ textAlign: 'right' }}>{e.amount}</td>
            <td>{e.from ?? '—'}</td>
            <td>{e.to ?? '—'}</td>
            <td>{e.tx ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
