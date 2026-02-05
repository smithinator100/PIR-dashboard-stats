import type { CardRecordsState } from './CardRecords'
import './DonutParameterPanel.css'

interface CardRecordsParameterPanelProps {
  state: CardRecordsState
  totalRecords: number
  completedPercentage: number
  onStateChange: (state: CardRecordsState) => void
  onTotalRecordsChange: (total: number) => void
  onCompletedPercentageChange: (percentage: number) => void
}

const STATE_OPTIONS: { value: CardRecordsState; label: string }[] = [
  { value: 'loading', label: 'Loading' },
  { value: 'scanning', label: 'Scanning' },
  { value: 'records-found', label: 'Records Found' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'complete', label: 'Complete' },
]

function CardRecordsParameterPanel({
  state,
  totalRecords,
  completedPercentage,
  onStateChange,
  onTotalRecordsChange,
  onCompletedPercentageChange
}: CardRecordsParameterPanelProps) {
  // Calculate completed count for display
  const completedCount = Math.round((completedPercentage / 100) * totalRecords)

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
        <label className="parameter-label">Total Records</label>
        <div className="speed-input-container">
          <button
            className="speed-button"
            onClick={() => onTotalRecordsChange(Math.max(1, totalRecords - 1))}
            aria-label="Decrease total records"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            max={100}
            value={totalRecords}
            onChange={(e) => {
              const value = e.target.value
              if (value === '') {
                onTotalRecordsChange(1)
              } else {
                const numValue = parseInt(value, 10)
                if (!isNaN(numValue) && numValue >= 1) {
                  onTotalRecordsChange(Math.min(100, numValue))
                }
              }
            }}
            className="parameter-input parameter-input-number"
          />
          <button
            className="speed-button"
            onClick={() => onTotalRecordsChange(Math.min(100, totalRecords + 1))}
            aria-label="Increase total records"
          >
            +
          </button>
        </div>
      </div>

      {(state === 'in-progress') && (
        <div className="parameter-section">
          <label className="parameter-label">Completed Percentage</label>
          <div className="speed-input-container">
            <button
              className="speed-button"
              onClick={() => onCompletedPercentageChange(Math.max(0, completedPercentage - 5))}
              disabled={completedPercentage <= 0}
              aria-label="Decrease completed percentage"
            >
              −
            </button>
            <input
              type="number"
              min={0}
              max={100}
              value={completedPercentage}
              onChange={(e) => {
                const value = e.target.value
                if (value === '') {
                  onCompletedPercentageChange(0)
                } else {
                  const numValue = parseInt(value, 10)
                  if (!isNaN(numValue) && numValue >= 0) {
                    onCompletedPercentageChange(Math.min(100, Math.max(0, numValue)))
                  }
                }
              }}
              className="parameter-input parameter-input-number"
            />
            <button
              className="speed-button"
              onClick={() => onCompletedPercentageChange(Math.min(100, completedPercentage + 5))}
              disabled={completedPercentage >= 100}
              aria-label="Increase completed percentage"
            >
              +
            </button>
          </div>
        </div>
      )}

      {(state === 'in-progress') && (
        <div className="parameter-section">
          <label className="parameter-label">Submitted Count</label>
          <div className="parameter-display-value">
            {completedCount} of {totalRecords}
          </div>
        </div>
      )}
    </div>
  )
}

export { CardRecordsParameterPanel }
