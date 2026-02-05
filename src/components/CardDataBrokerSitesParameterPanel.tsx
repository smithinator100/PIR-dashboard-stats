import type { CardDataBrokerSitesState } from './CardDataBrokerSites'
import './DonutParameterPanel.css'

interface CardDataBrokerSitesParameterPanelProps {
  state: CardDataBrokerSitesState
  totalSites: number
  currentScanIndex: number
  currentBrokerName: string
  sitesWithRecords: number
  onStateChange: (state: CardDataBrokerSitesState) => void
  onTotalSitesChange: (total: number) => void
  onCurrentScanIndexChange: (index: number) => void
  onCurrentBrokerNameChange: (name: string) => void
  onSitesWithRecordsChange: (sites: number) => void
}

const STATE_OPTIONS: { value: CardDataBrokerSitesState; label: string }[] = [
  { value: 'loading', label: 'Loading' },
  { value: 'scanning', label: 'Scanning' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'complete', label: 'Complete' },
]

function CardDataBrokerSitesParameterPanel({
  state,
  totalSites,
  currentScanIndex,
  currentBrokerName,
  sitesWithRecords,
  onStateChange,
  onTotalSitesChange,
  onCurrentScanIndexChange,
  onCurrentBrokerNameChange,
  onSitesWithRecordsChange
}: CardDataBrokerSitesParameterPanelProps) {
  // Calculate percentage for display
  const percentage = totalSites > 0 
    ? Math.round(((totalSites - sitesWithRecords) / totalSites) * 100)
    : 0

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
        <label className="parameter-label">Total Sites</label>
        <div className="speed-input-container">
          <button
            className="speed-button"
            onClick={() => onTotalSitesChange(Math.max(1, totalSites - 1))}
            aria-label="Decrease total sites"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            max={100}
            value={totalSites}
            onChange={(e) => {
              const value = e.target.value
              if (value === '') {
                onTotalSitesChange(1)
              } else {
                const numValue = parseInt(value, 10)
                if (!isNaN(numValue) && numValue >= 1) {
                  onTotalSitesChange(Math.min(100, numValue))
                }
              }
            }}
            className="parameter-input parameter-input-number"
          />
          <button
            className="speed-button"
            onClick={() => onTotalSitesChange(Math.min(100, totalSites + 1))}
            aria-label="Increase total sites"
          >
            +
          </button>
        </div>
      </div>

      {(state === 'loading' || state === 'scanning') && (
        <>
          <div className="parameter-section">
            <label className="parameter-label">Scan Index</label>
            <div className="speed-input-container">
              <button
                className="speed-button"
                onClick={() => onCurrentScanIndexChange(Math.max(1, currentScanIndex - 1))}
                disabled={currentScanIndex <= 1}
                aria-label="Decrease scan index"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                max={totalSites}
                value={currentScanIndex}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === '') {
                    onCurrentScanIndexChange(1)
                  } else {
                    const numValue = parseInt(value, 10)
                    if (!isNaN(numValue) && numValue >= 1) {
                      onCurrentScanIndexChange(Math.min(totalSites, Math.max(1, numValue)))
                    }
                  }
                }}
                className="parameter-input parameter-input-number"
              />
              <button
                className="speed-button"
                onClick={() => onCurrentScanIndexChange(Math.min(totalSites, currentScanIndex + 1))}
                disabled={currentScanIndex >= totalSites}
                aria-label="Increase scan index"
              >
                +
              </button>
            </div>
          </div>

          <div className="parameter-section">
            <label className="parameter-label">Broker Name</label>
            <input
              type="text"
              value={currentBrokerName}
              onChange={(e) => onCurrentBrokerNameChange(e.target.value)}
              className="parameter-input parameter-input-text"
              placeholder="Broker name"
            />
          </div>
        </>
      )}

      {state === 'in-progress' && (
        <div className="parameter-section">
          <label className="parameter-label">Sites With Records</label>
          <div className="speed-input-container">
            <button
              className="speed-button"
              onClick={() => onSitesWithRecordsChange(Math.max(0, sitesWithRecords - 1))}
              disabled={sitesWithRecords <= 0}
              aria-label="Decrease sites with records"
            >
              −
            </button>
            <input
              type="number"
              min={0}
              max={totalSites}
              value={sitesWithRecords}
              onChange={(e) => {
                const value = e.target.value
                if (value === '') {
                  onSitesWithRecordsChange(0)
                } else {
                  const numValue = parseInt(value, 10)
                  if (!isNaN(numValue) && numValue >= 0) {
                    onSitesWithRecordsChange(Math.min(totalSites, Math.max(0, numValue)))
                  }
                }
              }}
              className="parameter-input parameter-input-number"
            />
            <button
              className="speed-button"
              onClick={() => onSitesWithRecordsChange(Math.min(totalSites, sitesWithRecords + 1))}
              disabled={sitesWithRecords >= totalSites}
              aria-label="Increase sites with records"
            >
              +
            </button>
          </div>
        </div>
      )}

      {state === 'in-progress' && (
        <div className="parameter-section">
          <label className="parameter-label">Percentage Clear</label>
          <div className="parameter-display-value">
            {percentage}%
          </div>
        </div>
      )}
    </div>
  )
}

export { CardDataBrokerSitesParameterPanel }
