import { useState, useEffect, useRef } from 'react'
import { StatCard } from './components/StatCard'
import { DonutParameterPanel } from './components/DonutParameterPanel'
import DonutChart, { type DonutState } from './components/DonutChartOdometer'
import { BarChart, type BarState } from './components/BarChart'
import { BarChartParameterPanel } from './components/BarChartParameterPanel'
import { RecentScansParameterPanel } from './components/RecentScansParameterPanel'
import { RecentScans } from './components/RecentScans'
import './App.css'
import './components/BarChart.css'

// Constants moved outside component to avoid dependency issues
const cardPercentages = [20, 60, 80]
const cardBarChartPercentages = [25, 50, 75]
const TOTAL_SITES = 50

function App() {
  const [activePage, setActivePage] = useState<'card' | 'donut' | 'barChart' | 'recentScans'>('card')
  const [cardSize, setCardSize] = useState<'medium' | 'large'>('medium')
  const [cardDonutState, setCardDonutState] = useState<DonutState>('loading')
  const [cardDonutPercentage, setCardDonutPercentage] = useState(0)
  const [cardBarChartState, setCardBarChartState] = useState<BarState>('loading')
  const cardBarChartTotal = 12
  const [cardBarChartCompletedPercentage, setCardBarChartCompletedPercentage] = useState(0)
  const [donutState, setDonutState] = useState<DonutState>('in-progress')
  const [donutPercentage, setDonutPercentage] = useState(50)
  const [donutLabel, setDonutLabel] = useState('Text info')
  const [defaultSpeedMultiplier, setDefaultSpeedMultiplier] = useState(0.5)
  const [completeSpeedMultiplier, setCompleteSpeedMultiplier] = useState(0.2)
  const [barChartState, setBarChartState] = useState<BarState>('in-progress')
  const [barChartTotal, setBarChartTotal] = useState(12)
  const [barChartCompletedPercentage, setBarChartCompletedPercentage] = useState(50)
  const [scanCount, setScanCount] = useState(6)
  const [recentScansLoading, setRecentScansLoading] = useState(false)
  const [cardRecentScansLoading, setCardRecentScansLoading] = useState(true)
  const [cardScanCount, setCardScanCount] = useState(1)

  // Track previous page to detect when switching TO card page
  const previousPageRef = useRef<'card' | 'donut' | 'barChart' | 'recentScans' | null>(null)

  // Handle card page load sequence: loading -> in-progress transitions
  useEffect(() => {
    const wasCardPage = previousPageRef.current === 'card'
    const isCardPage = activePage === 'card'
    const isSwitchingToCard = isCardPage && !wasCardPage && previousPageRef.current !== null
    const isInitialLoad = isCardPage && previousPageRef.current === null

    // Trigger on initial load or when switching TO card page
    if (isInitialLoad || isSwitchingToCard) {
      // Reset states to loading first (only if switching pages, not on initial load)
      if (isSwitchingToCard) {
        setCardRecentScansLoading(true)
        setCardScanCount(1)
        setCardDonutState('loading')
        setCardDonutPercentage(0)
        setCardBarChartState('loading')
        setCardBarChartCompletedPercentage(0)
      }

      // Stagger effect: Recent Scans first, then Donut, then Bar Chart
      // After 1400ms, transition Recent Scans to loaded
      const recentScansTimer = setTimeout(() => {
        setCardRecentScansLoading(false)
      }, 1400)

      // After 1600ms, transition donut to in-progress
      const donutTimer = setTimeout(() => {
        setCardDonutState('in-progress')
        setCardDonutPercentage(cardPercentages[0])
      }, 1600)

      // After 1800ms, transition bar chart to in-progress
      const barChartTimer = setTimeout(() => {
        setCardBarChartState('in-progress')
        setCardBarChartCompletedPercentage(cardBarChartPercentages[0])
      }, 1800)

      return () => {
        clearTimeout(recentScansTimer)
        clearTimeout(donutTimer)
        clearTimeout(barChartTimer)
      }
    }

    // Update previous page ref after checking
    previousPageRef.current = activePage
  }, [activePage])

  // Calculate footer text based on percentage
  const getFooterText = (percentage: number, state: DonutState): string => {
    if (state === 'loading' || state === 'completed') {
      return state === 'completed' 
        ? 'All sites are clear of your personal records'
        : '10 sites have records of your personal info'
    }
    const sitesWithoutRecords = Math.round((percentage / 100) * TOTAL_SITES)
    const sitesWithRecords = TOTAL_SITES - sitesWithoutRecords
    return `${sitesWithRecords} sites have records of your personal info`
  }

  const handleCardClick = () => {
    // Cycle: Loading -> In-progress (20%) -> 60% -> 80% -> Completed -> Loading
    if (cardDonutState === 'loading') {
      // From loading, switch to in-progress starting at 20%
      setCardDonutState('in-progress')
      setCardDonutPercentage(cardPercentages[0])
    } else if (cardDonutState === 'in-progress') {
      const currentIndex = cardPercentages.indexOf(cardDonutPercentage)
      if (currentIndex === cardPercentages.length - 1) {
        // At 80%, switch to completed
        setCardDonutState('completed')
      } else {
        // Move to next percentage
        const nextIndex = currentIndex + 1
        setCardDonutPercentage(cardPercentages[nextIndex])
      }
    } else {
      // From completed, switch back to loading
      setCardDonutState('loading')
      setCardDonutPercentage(0)
    }
  }

  const handleBarChartCardClick = () => {
    // Cycle: Loading -> In-progress (25%) -> 50% -> 75% -> Completed -> Loading
    if (cardBarChartState === 'loading') {
      // From loading, switch to in-progress starting at 25%
      setCardBarChartState('in-progress')
      setCardBarChartCompletedPercentage(cardBarChartPercentages[0])
    } else if (cardBarChartState === 'in-progress') {
      const currentIndex = cardBarChartPercentages.indexOf(cardBarChartCompletedPercentage)
      if (currentIndex === cardBarChartPercentages.length - 1) {
        // At 75%, switch to completed
        setCardBarChartState('completed')
      } else {
        // Move to next percentage
        const nextIndex = currentIndex + 1
        setCardBarChartCompletedPercentage(cardBarChartPercentages[nextIndex])
      }
    } else {
      // From completed, switch back to loading
      setCardBarChartState('loading')
      setCardBarChartCompletedPercentage(0)
    }
  }

  const handleRecentScansCardClick = () => {
    // Cycle: 1 broker -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 brokers -> Loading -> 1 broker
    if (cardRecentScansLoading) {
      // From loading, go back to 1 broker
      setCardRecentScansLoading(false)
      setCardScanCount(1)
    } else if (cardScanCount < 8) {
      // Add another broker
      setCardScanCount(cardScanCount + 1)
    } else {
      // At 8 brokers, switch to loading
      setCardRecentScansLoading(true)
    }
  }

  // Calculate footer text for bar chart based on state
  const getBarChartFooterText = (percentage: number, state: BarState): string => {
    if (state === 'loading') {
      return 'Processing removal requests...'
    }
    if (state === 'completed') {
      return 'All removal requests have been completed'
    }
    const completed = Math.round((percentage / 100) * cardBarChartTotal)
    const inProgress = cardBarChartTotal - completed
    return `${completed} completed, ${inProgress} in-progress`
  }

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
          <li 
            className={`sidebar-item ${activePage === 'barChart' ? 'active' : ''}`}
            onClick={() => setActivePage('barChart')}
          >
            Bar Chart
          </li>
          <li 
            className={`sidebar-item ${activePage === 'recentScans' ? 'active' : ''}`}
            onClick={() => setActivePage('recentScans')}
          >
            Recent scans
          </li>
        </ul>
      </div>
      <div className="content">
        {activePage === 'card' && (
          <div className="page">
            <div className="stats-grid">
              <StatCard
                title="Recent scans"
                subtitle="Recent scans"
                footerText="Next scan is 19 Jan"
                size="large"
                isLoading={cardRecentScansLoading}
                onClick={handleRecentScansCardClick}
              >
                <RecentScans scanCount={cardScanCount} isLoading={cardRecentScansLoading} />
              </StatCard>
              <StatCard
                title="Data broker sites"
                subtitle="50 sites scanned"
                footerText={getFooterText(cardDonutPercentage, cardDonutState)}
                size={cardSize}
                isLoading={cardDonutState === 'loading'}
                onClick={handleCardClick}
              >
                <DonutChart 
                  state={cardDonutState}
                  percentage={cardDonutPercentage} 
                  variant="blue" 
                  label="clear of records"
                  defaultSpeedMultiplier={defaultSpeedMultiplier}
                  completeSpeedMultiplier={completeSpeedMultiplier}
                />
              </StatCard>
              <StatCard
                title="Removal requests"
                subtitle={`${cardBarChartTotal} records found`}
                footerText={getBarChartFooterText(cardBarChartCompletedPercentage, cardBarChartState)}
                size={cardSize}
                isLoading={cardBarChartState === 'loading'}
                onClick={handleBarChartCardClick}
              >
                <BarChart 
                  state={cardBarChartState}
                  total={cardBarChartTotal}
                  completedPercentage={cardBarChartCompletedPercentage}
                />
              </StatCard>
            </div>
          </div>
        )}
        {activePage === 'donut' && (
          <div className="page">
            <div className="donut-charts-container">
              <DonutChart 
                state={donutState}
                percentage={donutPercentage} 
                variant="blue" 
                label={donutLabel} 
                defaultSpeedMultiplier={defaultSpeedMultiplier}
                completeSpeedMultiplier={completeSpeedMultiplier}
              />
            </div>
            <DonutParameterPanel
              state={donutState}
              percentage={donutPercentage}
              label={donutLabel}
              defaultSpeedMultiplier={defaultSpeedMultiplier}
              completeSpeedMultiplier={completeSpeedMultiplier}
              onStateChange={setDonutState}
              onPercentageChange={setDonutPercentage}
              onLabelChange={setDonutLabel}
              onDefaultSpeedMultiplierChange={setDefaultSpeedMultiplier}
              onCompleteSpeedMultiplierChange={setCompleteSpeedMultiplier}
            />
          </div>
        )}
        {activePage === 'barChart' && (
          <div className="page">
            <BarChart 
              state={barChartState}
              total={barChartTotal} 
              completedPercentage={barChartCompletedPercentage} 
            />
            <BarChartParameterPanel
              state={barChartState}
              total={barChartTotal}
              completedPercentage={barChartCompletedPercentage}
              onStateChange={setBarChartState}
              onTotalChange={setBarChartTotal}
              onCompletedPercentageChange={setBarChartCompletedPercentage}
            />
          </div>
        )}
        {activePage === 'recentScans' && (
          <div className="page recent-scans-page">
            <div className="recent-scans-page-container">
              <RecentScans scanCount={scanCount} isLoading={recentScansLoading} />
            </div>
            <RecentScansParameterPanel
              scanCount={scanCount}
              isLoading={recentScansLoading}
              onScanCountChange={setScanCount}
              onLoadingChange={setRecentScansLoading}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
