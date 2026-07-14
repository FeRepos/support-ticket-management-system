import { STATUS_CSS_VAR } from '../utils/status.js'
import './StatusBadge.css'

function StatusBadge({ status, className = '' }) {
  const cssVar = STATUS_CSS_VAR[status]

  if (!cssVar) {
    return <span className={`status-badge ${className}`.trim()}>{status}</span>
  }

  return (
    <span
      className={`status-badge ${className}`.trim()}
      style={{ '--status-color': `var(${cssVar})` }}
    >
      <span className="status-badge__dot" aria-hidden="true" />
      <span className="status-badge__label">{status}</span>
    </span>
  )
}

export default StatusBadge
