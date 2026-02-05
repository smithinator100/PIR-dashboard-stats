import type { CardRecentScansState } from './CardRecentScans'
import './DonutParameterPanel.css'

interface CardRecentScansParameterPanelProps {
  state: CardRecentScansState
  scanCount: number
  onStateChange: (state: CardRecentScansState) => void
  onScanCountChange: (count: number) => void
}

const STATE_OPTIONS: { value: CardRecentScansState; label: string }[] = [
  { value: 'loading', label: 'Loading' },
  { value: 'scanning', label: 'Scanning' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'complete', label: 'Complete' },
]

function CardRecentScansParameterPanel({
  state,
  scanCount,
  onStateChange,
  onScanCountChange
}: CardRecentScansParameterPanelProps) {
  return (
    <div className="parameter-panel">
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

      <div className="parameter-section">
        <label className="parameter-label">Scan Count</label>
        <div className="speed-input-container">
          <button
            className="speed-button"
            onClick={() => onScanCountChange(Math.max(0, scanCount - 1))}
            disabled={scanCount <= 0}
            aria-label="Decrease scan count"
          >
            −
          </button>
          <input
            type="number"
            min={0}
            max={21}
            value={scanCount}
            onChange={(e) => {
              const value = e.target.value
              if (value === '') {
                onScanCountChange(0)
              } else {
                const numValue = parseInt(value, 10)
                if (!isNaN(numValue) && numValue >= 0) {
                  onScanCountChange(Math.min(21, numValue))
                }
              }
            }}
            className="parameter-input parameter-input-number"
          />
          <button
            className="speed-button"
            onClick={() => onScanCountChange(Math.min(21, scanCount + 1))}
            disabled={scanCount >= 21}
            aria-label="Increase scan count"
          >
            +
          </button>
        </div>
      </div>
    </div>
  )
}

export { CardRecentScansParameterPanel }
