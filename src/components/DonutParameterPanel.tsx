import './DonutParameterPanel.css'

interface DonutParameterPanelProps {
  percentage: number
  label: string
  isLoading: boolean
  defaultSpeedMultiplier: number
  completeSpeedMultiplier: number
  onPercentageChange: (percentage: number) => void
  onLabelChange: (label: string) => void
  onLoadingToggle: (isLoading: boolean) => void
  onDefaultSpeedMultiplierChange: (multiplier: number) => void
  onCompleteSpeedMultiplierChange: (multiplier: number) => void
}

const PERCENTAGE_CHIPS = [15, 25, 50, 75, 100]

function DonutParameterPanel({ 
  percentage, 
  label, 
  isLoading, 
  defaultSpeedMultiplier,
  completeSpeedMultiplier,
  onPercentageChange, 
  onLabelChange, 
  onLoadingToggle,
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
        <label className="parameter-label">Loading State</label>
        <label className="toggle-container">
          <input
            type="checkbox"
            checked={isLoading}
            onChange={(e) => onLoadingToggle(e.target.checked)}
            className="toggle-input"
          />
          <span className="toggle-slider"></span>
          <span className="toggle-label">{isLoading ? 'Loading' : 'Loaded'}</span>
        </label>
      </div>
    </div>
  )
}

export { DonutParameterPanel }
export type { DonutParameterPanelProps }
