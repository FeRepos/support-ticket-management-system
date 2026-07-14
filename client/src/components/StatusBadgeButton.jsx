import { STATUS_CSS_VAR } from '../utils/status.js'
import './StatusBadge.css'

function StatusBadgeButton({ status, onClick, disabled = false, className = '' }) {
  const cssVar = STATUS_CSS_VAR[status]

  return (
    <button
      type="button"
      className={`status-badge status-badge--button ${className}`.trim()}
      style={cssVar ? { '--status-color': `var(${cssVar})` } : undefined}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Change status to ${status}`}
    >
      <span className="status-badge__dot" aria-hidden="true" />
      <span className="status-badge__label">{status}</span>
    </button>
  )
}

export default StatusBadgeButton
