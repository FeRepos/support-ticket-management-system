import { PRIORITY_LABELS } from '../utils/priority.js'
import './PriorityDot.css'

function PriorityDot({ priority, className = '' }) {
  const label = PRIORITY_LABELS[priority] ?? priority

  return (
    <span
      className={`priority-dot priority-dot--${priority} ${className}`.trim()}
      role="img"
      aria-label={`Priority: ${label}`}
      title={label}
    />
  )
}

export default PriorityDot
