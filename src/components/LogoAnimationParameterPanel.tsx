import './LogoAnimationParameterPanel.css'

interface LogoAnimationParameterPanelProps {
  columns: number
  rows: number
  logoSize: number
  waveDelay: number
  duration: number
  holdDelay: number
  easingIn: string
  easingOut: string
  onColumnsChange: (value: number) => void
  onRowsChange: (value: number) => void
  onLogoSizeChange: (value: number) => void
  onWaveDelayChange: (value: number) => void
  onDurationChange: (value: number) => void
  onHoldDelayChange: (value: number) => void
  onEasingInChange: (value: string) => void
  onEasingOutChange: (value: string) => void
}

const EASING_OPTIONS = [
  { value: 'linear', label: 'Linear' },
  { value: 'quad-in', label: 'Quad In' },
  { value: 'quad-out', label: 'Quad Out' },
  { value: 'quad-in-out', label: 'Quad InOut' },
  { value: 'cubic-in', label: 'Cubic In' },
  { value: 'cubic-out', label: 'Cubic Out' },
  { value: 'cubic-in-out', label: 'Cubic InOut' },
  { value: 'quart-in', label: 'Quart In' },
  { value: 'quart-out', label: 'Quart Out' },
  { value: 'quart-in-out', label: 'Quart InOut' },
  { value: 'expo-in', label: 'Expo In' },
  { value: 'expo-out', label: 'Expo Out' },
  { value: 'expo-in-out', label: 'Expo InOut' },
  { value: 'back-in', label: 'Back In' },
  { value: 'back-out', label: 'Back Out' },
  { value: 'back-in-out', label: 'Back InOut' },
]

function LogoAnimationParameterPanel({
  columns,
  rows,
  logoSize,
  waveDelay,
  duration,
  holdDelay,
  easingIn,
  easingOut,
  onColumnsChange,
  onRowsChange,
  onLogoSizeChange,
  onWaveDelayChange,
  onDurationChange,
  onHoldDelayChange,
  onEasingInChange,
  onEasingOutChange,
}: LogoAnimationParameterPanelProps) {
  return (
    <div className="logo-parameter-panel">
      <div className="logo-parameter-grid">
        {/* Left Column */}
        <div className="logo-parameter-column">
          {/* Columns */}
          <div className="logo-parameter-row">
            <label className="logo-parameter-label">Columns</label>
            <span className="logo-parameter-value">{columns}</span>
          </div>
          <input
            type="range"
            min={2}
            max={12}
            value={columns}
            onChange={(e) => onColumnsChange(Number(e.target.value))}
            className="logo-parameter-slider"
          />

          {/* Logo Size */}
          <div className="logo-parameter-row">
            <label className="logo-parameter-label">Logo Size</label>
            <span className="logo-parameter-value">{logoSize}px</span>
          </div>
          <input
            type="range"
            min={12}
            max={48}
            value={logoSize}
            onChange={(e) => onLogoSizeChange(Number(e.target.value))}
            className="logo-parameter-slider"
          />

          {/* Duration */}
          <div className="logo-parameter-row">
            <label className="logo-parameter-label">Duration</label>
            <span className="logo-parameter-value">{duration}s</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={6}
            step={0.1}
            value={duration}
            onChange={(e) => onDurationChange(Number(e.target.value))}
            className="logo-parameter-slider"
          />

          {/* Easing In */}
          <div className="logo-parameter-row">
            <label className="logo-parameter-label">Easing In</label>
          </div>
          <select
            value={easingIn}
            onChange={(e) => onEasingInChange(e.target.value)}
            className="logo-parameter-select"
          >
            {EASING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Right Column */}
        <div className="logo-parameter-column">
          {/* Rows */}
          <div className="logo-parameter-row">
            <label className="logo-parameter-label">Rows</label>
            <span className="logo-parameter-value">{rows}</span>
          </div>
          <input
            type="range"
            min={2}
            max={8}
            value={rows}
            onChange={(e) => onRowsChange(Number(e.target.value))}
            className="logo-parameter-slider"
          />

          {/* Wave Delay */}
          <div className="logo-parameter-row">
            <label className="logo-parameter-label">Wave Delay</label>
            <span className="logo-parameter-value">{waveDelay}ms</span>
          </div>
          <input
            type="range"
            min={100}
            max={1500}
            step={50}
            value={waveDelay}
            onChange={(e) => onWaveDelayChange(Number(e.target.value))}
            className="logo-parameter-slider"
          />

          {/* Hold Delay */}
          <div className="logo-parameter-row">
            <label className="logo-parameter-label">Hold Delay</label>
            <span className="logo-parameter-value">{holdDelay}s</span>
          </div>
          <input
            type="range"
            min={0}
            max={2}
            step={0.1}
            value={holdDelay}
            onChange={(e) => onHoldDelayChange(Number(e.target.value))}
            className="logo-parameter-slider"
          />

          {/* Easing Out */}
          <div className="logo-parameter-row">
            <label className="logo-parameter-label">Easing Out</label>
          </div>
          <select
            value={easingOut}
            onChange={(e) => onEasingOutChange(e.target.value)}
            className="logo-parameter-select"
          >
            {EASING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

export { LogoAnimationParameterPanel }
