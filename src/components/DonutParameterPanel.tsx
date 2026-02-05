import type { DonutState } from './DonutChartOdometer'
import './DonutParameterPanel.css'

interface DonutParameterPanelProps {
  state: DonutState
  percentage: number
  label: string
  defaultSpeedMultiplier: number
  completeSpeedMultiplier: number
  onStateChange: (state: DonutState) => void
  onPercentageChange: (percentage: number) => void
  onLabelChange: (label: string) => void
  onDefaultSpeedMultiplierChange: (multiplier: number) => void
  onCompleteSpeedMultiplierChange: (multiplier: number) => void
}

const PERCENTAGE_CHIPS = [15, 25, 50, 75]
const STATE_OPTIONS: { value: DonutState; label: string }[] = [
  { value: 'loading', label: 'Loading' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

function DonutParameterPanel({ 
  state,
  percentage, 
  label, 
  defaultSpeedMultiplier,
  completeSpeedMultiplier,
  onStateChange,
  onPercentageChange, 
  onLabelChange, 
  onDefaultSpeedMultiplierChange,
  onCompleteSpeedMultiplierChange
}: DonutParameterPanelProps) {
  return (
    <div className="parameter-panel">
      <div className="parameter-section">
        <label className="parameter-label">Percentage</label>
        <div className="percentage-chips">
          {PERCENTAGE_CHIPS.map((value) => (
            <button
              key={value}
              className={`percentage-chip ${percentage === value ? 'active' : ''}`}
              onClick={() => onPercentageChange(value)}
              disabled={state !== 'in-progress'}
            >
              {value}%
            </button>
          ))}
        </div>
      </div>
      
      <div className="parameter-section">
        <label className="parameter-label">Text</label>
        <input
          type="text"
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          className="parameter-input parameter-input-text"
          placeholder="Enter text"
        />
      </div>

      <div className="parameter-section">
        <label className="parameter-label">Default Speed</label>
        <div className="speed-input-container">
          <button
            className="speed-button"
            onClick={() => {
              const newValue = Math.max(0.1, defaultSpeedMultiplier - 0.25)
              onDefaultSpeedMultiplierChange(newValue)
            }}
            aria-label="Decrease default speed"
          >
            −
          </button>
          <input
            type="number"
            min="0.1"
            max="5"
            step="0.25"
            value={defaultSpeedMultiplier.toFixed(2)}
            onChange={(e) => {
              const value = parseFloat(e.target.value)
              if (!isNaN(value) && value > 0 && value <= 5) {
                onDefaultSpeedMultiplierChange(value)
              }
            }}
            className="parameter-input parameter-input-number"
          />
          <button
            className="speed-button"
            onClick={() => {
              const newValue = Math.min(5, defaultSpeedMultiplier + 0.25)
              onDefaultSpeedMultiplierChange(newValue)
            }}
            aria-label="Increase default speed"
          >
            +
          </button>
        </div>
      </div>

      <div className="parameter-section">
        <label className="parameter-label">Complete Speed</label>
        <div className="speed-input-container">
          <button
            className="speed-button"
            onClick={() => {
              const newValue = Math.max(0.1, completeSpeedMultiplier - 0.1)
              onCompleteSpeedMultiplierChange(newValue)
            }}
            aria-label="Decrease complete speed"
          >
            −
          </button>
          <input
            type="number"
            min="0.1"
            max="5"
            step="0.1"
            value={completeSpeedMultiplier.toFixed(2)}
            onChange={(e) => {
              const value = parseFloat(e.target.value)
              if (!isNaN(value) && value > 0 && value <= 5) {
                onCompleteSpeedMultiplierChange(value)
              }
            }}
            className="parameter-input parameter-input-number"
          />
          <button
            className="speed-button"
            onClick={() => {
              const newValue = Math.min(5, completeSpeedMultiplier + 0.1)
              onCompleteSpeedMultiplierChange(newValue)
            }}
            aria-label="Increase complete speed"
          >
            +
          </button>
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

export { DonutParameterPanel }
export type { DonutParameterPanelProps }
