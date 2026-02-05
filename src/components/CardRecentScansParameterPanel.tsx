import type { CardRecentScansState } from './CardRecentScans'
import './DonutParameterPanel.css'

interface CardRecentScansParameterPanelProps {
  state: CardRecentScansState
  scanCount: number
  removalBroker: string
  removalRecordCount: number
  logoColumns: number
  logoRows: number
  logoSize: number
  onStateChange: (state: CardRecentScansState) => void
  onScanCountChange: (count: number) => void
  onRemovalBrokerChange: (broker: string) => void
  onRemovalRecordCountChange: (count: number) => void
  onLogoColumnsChange: (columns: number) => void
  onLogoRowsChange: (rows: number) => void
  onLogoSizeChange: (size: number) => void
}

const STATE_OPTIONS: { value: CardRecentScansState; label: string }[] = [
  { value: 'loading', label: 'Loading' },
  { value: 'logos', label: 'Logos' },
  { value: 'scanning', label: 'Scanning' },
  { value: 'removal', label: 'Removal' },
]

const BROKER_OPTIONS = [
  'Verecor',
  'Spokeo',
  'BeenVerified',
  'Intelius',
  'Radaris',
  'MyLife',
  'Truthfinder',
]

function CardRecentScansParameterPanel({
  state,
  scanCount,
  removalBroker,
  removalRecordCount,
  logoColumns,
  logoRows,
  logoSize,
  onStateChange,
  onScanCountChange,
  onRemovalBrokerChange,
  onRemovalRecordCountChange,
  onLogoColumnsChange,
  onLogoRowsChange,
  onLogoSizeChange
}: CardRecentScansParameterPanelProps) {
  const isLogosState = state === 'logos'
  const isScanningState = state === 'scanning'
  const isRemovalState = state === 'removal'

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

      {isLogosState && (
        <>
          <div className="parameter-section">
            <label className="parameter-label">Logo Columns</label>
            <div className="speed-input-container">
              <button
                className="speed-button"
                onClick={() => onLogoColumnsChange(Math.max(1, logoColumns - 1))}
                disabled={logoColumns <= 1}
                aria-label="Decrease columns"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                max={10}
                value={logoColumns}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === '') {
                    onLogoColumnsChange(1)
                  } else {
                    const numValue = parseInt(value, 10)
                    if (!isNaN(numValue) && numValue >= 1) {
                      onLogoColumnsChange(Math.min(10, numValue))
                    }
                  }
                }}
                className="parameter-input parameter-input-number"
              />
              <button
                className="speed-button"
                onClick={() => onLogoColumnsChange(Math.min(10, logoColumns + 1))}
                disabled={logoColumns >= 10}
                aria-label="Increase columns"
              >
                +
              </button>
            </div>
          </div>

          <div className="parameter-section">
            <label className="parameter-label">Logo Rows</label>
            <div className="speed-input-container">
              <button
                className="speed-button"
                onClick={() => onLogoRowsChange(Math.max(1, logoRows - 1))}
                disabled={logoRows <= 1}
                aria-label="Decrease rows"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                max={8}
                value={logoRows}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === '') {
                    onLogoRowsChange(1)
                  } else {
                    const numValue = parseInt(value, 10)
                    if (!isNaN(numValue) && numValue >= 1) {
                      onLogoRowsChange(Math.min(8, numValue))
                    }
                  }
                }}
                className="parameter-input parameter-input-number"
              />
              <button
                className="speed-button"
                onClick={() => onLogoRowsChange(Math.min(8, logoRows + 1))}
                disabled={logoRows >= 8}
                aria-label="Increase rows"
              >
                +
              </button>
            </div>
          </div>

          <div className="parameter-section">
            <label className="parameter-label">Logo Size</label>
            <div className="speed-input-container">
              <button
                className="speed-button"
                onClick={() => onLogoSizeChange(Math.max(12, logoSize - 2))}
                disabled={logoSize <= 12}
                aria-label="Decrease size"
              >
                −
              </button>
              <input
                type="number"
                min={12}
                max={48}
                value={logoSize}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === '') {
                    onLogoSizeChange(12)
                  } else {
                    const numValue = parseInt(value, 10)
                    if (!isNaN(numValue) && numValue >= 12) {
                      onLogoSizeChange(Math.min(48, numValue))
                    }
                  }
                }}
                className="parameter-input parameter-input-number"
              />
              <button
                className="speed-button"
                onClick={() => onLogoSizeChange(Math.min(48, logoSize + 2))}
                disabled={logoSize >= 48}
                aria-label="Increase size"
              >
                +
              </button>
            </div>
          </div>
        </>
      )}

      {isScanningState && (
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
      )}

      {isRemovalState && (
        <>
          <div className="parameter-section">
            <label className="parameter-label">Broker</label>
            <select
              value={removalBroker}
              onChange={(e) => onRemovalBrokerChange(e.target.value)}
              className="parameter-select"
            >
              {BROKER_OPTIONS.map((broker) => (
                <option key={broker} value={broker}>
                  {broker}
                </option>
              ))}
            </select>
          </div>

          <div className="parameter-section">
            <label className="parameter-label">Records Removed</label>
            <div className="speed-input-container">
              <button
                className="speed-button"
                onClick={() => onRemovalRecordCountChange(Math.max(1, removalRecordCount - 1))}
                disabled={removalRecordCount <= 1}
                aria-label="Decrease record count"
              >
                −
              </button>
              <input
                type="number"
                min={1}
                max={99}
                value={removalRecordCount}
                onChange={(e) => {
                  const value = e.target.value
                  if (value === '') {
                    onRemovalRecordCountChange(1)
                  } else {
                    const numValue = parseInt(value, 10)
                    if (!isNaN(numValue) && numValue >= 1) {
                      onRemovalRecordCountChange(Math.min(99, numValue))
                    }
                  }
                }}
                className="parameter-input parameter-input-number"
              />
              <button
                className="speed-button"
                onClick={() => onRemovalRecordCountChange(Math.min(99, removalRecordCount + 1))}
                disabled={removalRecordCount >= 99}
                aria-label="Increase record count"
              >
                +
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export { CardRecentScansParameterPanel }
