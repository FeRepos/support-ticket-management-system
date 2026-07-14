import PriorityDot from './PriorityDot.jsx'
import { PRIORITIES, PRIORITY_LABELS } from '../utils/priority.js'
import './PriorityPicker.css'

function PriorityPicker({
  name,
  value,
  onChange,
  onBlur,
  describedBy,
  invalid = false,
}) {
  return (
    <fieldset className="priority-picker">
      <legend className="priority-picker__legend">Priority</legend>
      <div
        className="priority-picker__options"
        role="radiogroup"
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy || undefined}
      >
        {PRIORITIES.map((priority) => {
          const selected = value === priority

          return (
            <label
              key={priority}
              className={`priority-picker__option${selected ? ' priority-picker__option--selected' : ''}`}
            >
              <input
                type="radio"
                name={name}
                value={priority}
                checked={selected}
                onChange={() => onChange(priority)}
                onBlur={onBlur}
                className="priority-picker__input"
              />
              <PriorityDot priority={priority} />
              <span className="priority-picker__label">{PRIORITY_LABELS[priority]}</span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export default PriorityPicker
