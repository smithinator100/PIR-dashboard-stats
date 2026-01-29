import { useState } from 'react'
import { StatCard } from './components/StatCard'
import { ParameterPanel } from './components/ParameterPanel'
import { DonutParameterPanel } from './components/DonutParameterPanel'
import DonutChart from './components/DonutChartOdometer'
import './App.css'

function App() {
  const [activePage, setActivePage] = useState<'card' | 'donut'>('card')
  const [cardSize, setCardSize] = useState<'medium' | 'large'>('medium')
  const [isCardLoading, setIsCardLoading] = useState(false)
  const [donutPercentage, setDonutPercentage] = useState(50)
  const [donutLabel, setDonutLabel] = useState('Text info')
  const [isDonutLoading, setIsDonutLoading] = useState(false)
  const [defaultSpeedMultiplier, setDefaultSpeedMultiplier] = useState(0.5)
  const [completeSpeedMultiplier, setCompleteSpeedMultiplier] = useState(0.2)

  return (
    <div className="app-container">
      <div className="sidebar">
        <h1 className="sidebar-title">PIR Top Stats</h1>
        <ul className="sidebar-list">
          <li 
            className={`sidebar-item ${activePage === 'card' ? 'active' : ''}`}
            onClick={() => setActivePage('card')}
          >
            Card
          </li>
          <li 
            className={`sidebar-item ${activePage === 'donut' ? 'active' : ''}`}
            onClick={() => setActivePage('donut')}
          >
            Donut
          </li>
        </ul>
      </div>
      <div className="content">
        {activePage === 'card' && (
          <div className="page">
            <div className="stats-grid">
              <StatCard
                title="Data broker sites"
                subtitle="50 sites scanned"
                footerText="10 sites have records of your personal info"
                size={cardSize}
                isLoading={isCardLoading}
              />
            </div>
            <ParameterPanel
              size={cardSize}
              isLoading={isCardLoading}
              onSizeChange={setCardSize}
              onLoadingToggle={setIsCardLoading}
            />
          </div>
        )}
        {activePage === 'donut' && (
          <div className="page">
            <div className="donut-charts-container">
              <DonutChart 
                percentage={donutPercentage} 
                variant="blue" 
                label={donutLabel} 
                isLoading={isDonutLoading}
                defaultSpeedMultiplier={defaultSpeedMultiplier}
                completeSpeedMultiplier={completeSpeedMultiplier}
              />
            </div>
            <DonutParameterPanel
              percentage={donutPercentage}
              label={donutLabel}
              isLoading={isDonutLoading}
              defaultSpeedMultiplier={defaultSpeedMultiplier}
              completeSpeedMultiplier={completeSpeedMultiplier}
              onPercentageChange={setDonutPercentage}
              onLabelChange={setDonutLabel}
              onLoadingToggle={setIsDonutLoading}
              onDefaultSpeedMultiplierChange={setDefaultSpeedMultiplier}
              onCompleteSpeedMultiplierChange={setCompleteSpeedMultiplier}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
