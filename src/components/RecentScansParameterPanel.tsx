import './RecentScansParameterPanel.css'
import './DonutParameterPanel.css'

interface RecentScansParameterPanelProps {
  scanCount: number
  isLoading: boolean
  onScanCountChange: (count: number) => void
  onLoadingChange: (isLoading: boolean) => void
}

function RecentScansParameterPanel({
  scanCount,
  isLoading,
  onScanCountChange,
  onLoadingChange,
}: RecentScansParameterPanelProps) {
  return (
    <div className="parameter-panel">
      <div className="parameter-section">
        <label className="parameter-label">Scan Count</label>
        <div className="speed-input-container">
          <button
            className="speed-button"
            onClick={() => onScanCountChange(Math.max(0, scanCount - 1))}
            disabled={isLoading || scanCount <= 0}
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
            disabled={isLoading}
          />
          <button
            className="speed-button"
            onClick={() => onScanCountChange(Math.min(21, scanCount + 1))}
            disabled={isLoading || scanCount >= 21}
            aria-label="Increase scan count"
          >
            +
          </button>
        </div>
      </div>
      <div className="parameter-section">
        <label className="parameter-label">Loading</label>
        <label className="toggle-container">
          <input
            type="checkbox"
            className="toggle-input"
            checked={isLoading}
            onChange={(e) => onLoadingChange(e.target.checked)}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
    </div>
  )
}

export { RecentScansParameterPanel }
export type { RecentScansParameterPanelProps }
