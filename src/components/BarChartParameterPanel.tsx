import type { BarState } from './BarChart'
import './BarChartParameterPanel.css'

interface BarChartParameterPanelProps {
  state: BarState
  total: number
  completedPercentage: number
  onStateChange: (state: BarState) => void
  onTotalChange: (value: number) => void
  onCompletedPercentageChange: (percentage: number) => void
}

const PERCENTAGE_CHIPS = [20, 50, 67]
const STATE_OPTIONS: { value: BarState; label: string }[] = [
  { value: 'loading', label: 'Loading' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

function BarChartParameterPanel({
  state,
  total,
  completedPercentage,
  onStateChange,
  onTotalChange,
  onCompletedPercentageChange,
}: BarChartParameterPanelProps) {
  return (
    <div className="parameter-panel">
      <div className="parameter-section">
        <label className="parameter-label">Total</label>
        <input
          type="number"
          min={1}
          value={total}
          onChange={(e) => onTotalChange(Math.max(1, parseInt(e.target.value) || 1))}
          className="parameter-input parameter-input-number"
          disabled={state !== 'in-progress'}
        />
      </div>

      <div className="parameter-section">
        <label className="parameter-label">Completed</label>
        <div className="percentage-chips">
          {PERCENTAGE_CHIPS.map((value) => (
            <button
              key={value}
              className={`percentage-chip ${completedPercentage === value ? 'active' : ''}`}
              onClick={() => onCompletedPercentageChange(value)}
              disabled={state !== 'in-progress'}
            >
              {value}%
            </button>
          ))}
        </div>
      </div>

      <div className="parameter-section">
        <label className="parameter-label">State</label>
        <div className="state-chips">
          {STATE_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`state-chip ${state === option.value ? 'active' : ''}`}
              onClick={() => onStateChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export { BarChartParameterPanel }
export type { BarChartParameterPanelProps }
