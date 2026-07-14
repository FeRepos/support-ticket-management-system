import StatusBadge from './StatusBadge.jsx'
import StatusBadgeButton from './StatusBadgeButton.jsx'
import { getAllowedTransitions } from '../utils/stateMachine.js'
import './StatusTransitionControls.css'

function StatusTransitionControls({
  currentStatus,
  onTransition,
  transitioning = false,
  error = null,
}) {
  const allowedTargets = getAllowedTransitions(currentStatus)
  const errorId = 'status-transition-error'

  if (allowedTargets.length === 0) {
    return (
      <section className="status-transitions" aria-label="Status transitions">
        <h2 className="status-transitions__title">Status</h2>
        <p className="status-transitions__terminal">
          <StatusBadge status={currentStatus} />
          <span className="status-transitions__terminal-text">
            No further status changes are available.
          </span>
        </p>
      </section>
    )
  }

  return (
    <section className="status-transitions" aria-label="Status transitions">
      <h2 className="status-transitions__title">Change status</h2>
      <p className="status-transitions__hint">
        Current: <StatusBadge status={currentStatus} />
      </p>
      <div
        className="status-transitions__actions"
        role="group"
        aria-label="Choose next status"
        aria-describedby={error ? errorId : undefined}
      >
        {allowedTargets.map((status) => (
          <StatusBadgeButton
            key={status}
            status={status}
            onClick={() => onTransition(status)}
            disabled={transitioning}
          />
        ))}
      </div>
      {transitioning && (
        <p className="status-transitions__updating" aria-live="polite">
          Updating status…
        </p>
      )}
      {error && (
        <p id={errorId} className="status-transitions__error" role="alert">
          {error}
        </p>
      )}
    </section>
  )
}

export default StatusTransitionControls
