import './ParameterPanel.css'

interface ParameterPanelProps {
  size: 'medium' | 'large'
  isLoading: boolean
  onSizeChange: (size: 'medium' | 'large') => void
  onLoadingToggle: (loading: boolean) => void
}

function ParameterPanel({ size, isLoading, onSizeChange, onLoadingToggle }: ParameterPanelProps) {
  return (
    <div className="parameter-panel">
      <div className="parameter-section">
        <label className="parameter-label">Size</label>
        <div className="chip-group">
          <button
            className={`chip ${size === 'medium' ? 'chip-active' : ''}`}
            onClick={() => onSizeChange('medium')}
          >
            Medium
          </button>
          <button
            className={`chip ${size === 'large' ? 'chip-active' : ''}`}
            onClick={() => onSizeChange('large')}
          >
            Large (523px)
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

export { ParameterPanel }
export type { ParameterPanelProps }
