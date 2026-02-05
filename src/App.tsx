import { useState, useEffect, useRef } from 'react'
import { DonutParameterPanel } from './components/DonutParameterPanel'
import DonutChart, { type DonutState } from './components/DonutChartOdometer'
import { BarChart, type BarState } from './components/BarChart'
import { BarChartParameterPanel } from './components/BarChartParameterPanel'
import { CardDataBrokerSites, type CardDataBrokerSitesState } from './components/CardDataBrokerSites'
import { CardDataBrokerSitesParameterPanel } from './components/CardDataBrokerSitesParameterPanel'
import { CardRecords, type CardRecordsState } from './components/CardRecords'
import { CardRecordsParameterPanel } from './components/CardRecordsParameterPanel'
import { CardRecentScans, type CardRecentScansState } from './components/CardRecentScans'
import { CardRecentScansParameterPanel } from './components/CardRecentScansParameterPanel'
import { LogoAnimation } from './components/LogoAnimation'
import { LogoAnimationParameterPanel } from './components/LogoAnimationParameterPanel'
import './App.css'
import './components/BarChart.css'

// Constants moved outside component to avoid dependency issues
const cardPercentages = [20, 60, 80]
const cardBarChartPercentages = [25, 50, 75]
const TOTAL_SITES = 50

function App() {
  const [activePage, setActivePage] = useState<'card' | 'donut' | 'barChart' | 'recentScans' | 'cardDataBrokerSites' | 'cardRecords' | 'logos'>('card')
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

  // Card Data Broker Sites state
  const [dataBrokerState, setDataBrokerState] = useState<CardDataBrokerSitesState>('loading')
  const [dataBrokerTotalSites, setDataBrokerTotalSites] = useState(50)
  const [dataBrokerCurrentScanIndex, setDataBrokerCurrentScanIndex] = useState(1)
  const [dataBrokerCurrentBrokerName, setDataBrokerCurrentBrokerName] = useState('Spokeo')
  const [dataBrokerSitesWithRecords, setDataBrokerSitesWithRecords] = useState(10)

  // Card Records state
  const [cardRecordsState, setCardRecordsState] = useState<CardRecordsState>('loading')
  const [cardRecordsTotalRecords, setCardRecordsTotalRecords] = useState(12)
  const [cardRecordsCompletedPercentage, setCardRecordsCompletedPercentage] = useState(25)

  // Card Recent Scans state
  const [recentScansState, setRecentScansState] = useState<CardRecentScansState>('loading')
  const [recentScansCount, setRecentScansCount] = useState(6)
  const [recentScansRemovalBroker, setRecentScansRemovalBroker] = useState('Verecor')
  const [recentScansRemovalRecordCount, setRecentScansRemovalRecordCount] = useState(3)
  const [recentScansLogoColumns, setRecentScansLogoColumns] = useState(8)
  const [recentScansLogoRows, setRecentScansLogoRows] = useState(4)
  const [recentScansLogoSize, setRecentScansLogoSize] = useState(32)

  // Logo Animation state (standalone page)
  const [logoColumns, setLogoColumns] = useState(7)
  const [logoRows, setLogoRows] = useState(4)
  const [logoSize, setLogoSize] = useState(24)
  const [logoWaveDelay, setLogoWaveDelay] = useState(600)
  const [logoDuration, setLogoDuration] = useState(3)
  const [logoHoldDelay, setLogoHoldDelay] = useState(0.8)
  const [logoEasingIn, setLogoEasingIn] = useState('cubic-in-out')
  const [logoEasingOut, setLogoEasingOut] = useState('cubic-in-out')

  // Track previous page to detect when switching TO card page
  const previousPageRef = useRef<'card' | 'donut' | 'barChart' | 'recentScans' | 'cardDataBrokerSites' | 'cardRecords' | 'logos' | null>(null)

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
        setRecentScansState('loading')
        setCardDonutState('loading')
        setCardDonutPercentage(0)
        setCardBarChartState('loading')
        setCardBarChartCompletedPercentage(0)
      }

      // Stagger effect: Recent Scans first, then Donut, then Bar Chart
      // After 1400ms, transition Recent Scans to scanning
      const recentScansTimer = setTimeout(() => {
        setRecentScansState('scanning')
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




  const handleDataBrokerSitesCardClick = () => {
    // Cycle: Loading -> Scanning -> In-progress -> Complete -> Loading
    switch (dataBrokerState) {
      case 'loading':
        setDataBrokerState('scanning')
        break
      case 'scanning':
        setDataBrokerState('in-progress')
        break
      case 'in-progress':
        setDataBrokerState('complete')
        break
      case 'complete':
        setDataBrokerState('loading')
        break
    }
  }

  const handleRecordsCardClick = () => {
    // Cycle: Loading -> Scanning -> Records Found -> In-progress (25%) -> 50% -> 75% -> Complete -> Loading
    const recordsPercentages = [25, 50, 75]
    switch (cardRecordsState) {
      case 'loading':
        setCardRecordsState('scanning')
        break
      case 'scanning':
        setCardRecordsState('records-found')
        break
      case 'records-found':
        setCardRecordsState('in-progress')
        setCardRecordsCompletedPercentage(recordsPercentages[0])
        break
      case 'in-progress': {
        const currentIndex = recordsPercentages.indexOf(cardRecordsCompletedPercentage)
        if (currentIndex === recordsPercentages.length - 1) {
          setCardRecordsState('complete')
        } else {
          const nextIndex = currentIndex === -1 ? 0 : currentIndex + 1
          setCardRecordsCompletedPercentage(recordsPercentages[nextIndex])
        }
        break
      }
      case 'complete':
        setCardRecordsState('loading')
        setCardRecordsCompletedPercentage(0)
        break
    }
  }

  const handleRecentScansClick = () => {
    // Cycle through all states: Loading (skeleton) -> Logos -> Scanning -> Removal -> Loading
    const stateOrder: CardRecentScansState[] = ['loading', 'logos', 'scanning', 'removal']
    const currentIndex = stateOrder.indexOf(recentScansState)
    const nextIndex = (currentIndex + 1) % stateOrder.length
    setRecentScansState(stateOrder[nextIndex])
  }

  const handleRecentScansDismiss = () => {
    setRecentScansState('scanning')
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
            Dashboard
          </li>
          <li className="sidebar-subheader">Cards</li>
          <li 
            className={`sidebar-item ${activePage === 'recentScans' ? 'active' : ''}`}
            onClick={() => setActivePage('recentScans')}
          >
            Recent Scans
          </li>
          <li 
            className={`sidebar-item ${activePage === 'cardDataBrokerSites' ? 'active' : ''}`}
            onClick={() => setActivePage('cardDataBrokerSites')}
          >
            Data Broker Sites
          </li>
          <li 
            className={`sidebar-item ${activePage === 'cardRecords' ? 'active' : ''}`}
            onClick={() => setActivePage('cardRecords')}
          >
            Records
          </li>
          <li className="sidebar-subheader">Charts</li>
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
            Bar
          </li>
          <li 
            className={`sidebar-item ${activePage === 'logos' ? 'active' : ''}`}
            onClick={() => setActivePage('logos')}
          >
            Logos
          </li>
        </ul>
      </div>
      <div className="content">
        {activePage === 'card' && (
          <div className="page">
            <div className="stats-grid">
              <CardRecentScans
                state={recentScansState}
                scanCount={recentScansCount}
                removalBroker={recentScansRemovalBroker}
                removalRecordCount={recentScansRemovalRecordCount}
                logoColumns={recentScansLogoColumns}
                logoRows={recentScansLogoRows}
                logoSize={recentScansLogoSize}
                onDismiss={handleRecentScansDismiss}
                onClick={handleRecentScansClick}
              />
              <CardDataBrokerSites
                state={dataBrokerState}
                totalSites={dataBrokerTotalSites}
                currentScanIndex={dataBrokerCurrentScanIndex}
                currentBrokerName={dataBrokerCurrentBrokerName}
                sitesWithRecords={dataBrokerSitesWithRecords}
                onClick={handleDataBrokerSitesCardClick}
              />
              <CardRecords
                state={cardRecordsState}
                totalRecords={cardRecordsTotalRecords}
                completedPercentage={cardRecordsCompletedPercentage}
                onClick={handleRecordsCardClick}
              />
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
          <div className="page">
            <CardRecentScans
              state={recentScansState}
              scanCount={recentScansCount}
              removalBroker={recentScansRemovalBroker}
              removalRecordCount={recentScansRemovalRecordCount}
              logoColumns={recentScansLogoColumns}
              logoRows={recentScansLogoRows}
              logoSize={recentScansLogoSize}
              onDismiss={handleRecentScansDismiss}
              onClick={handleRecentScansClick}
            />
            <CardRecentScansParameterPanel
              state={recentScansState}
              scanCount={recentScansCount}
              removalBroker={recentScansRemovalBroker}
              removalRecordCount={recentScansRemovalRecordCount}
              logoColumns={recentScansLogoColumns}
              logoRows={recentScansLogoRows}
              logoSize={recentScansLogoSize}
              onStateChange={setRecentScansState}
              onScanCountChange={setRecentScansCount}
              onRemovalBrokerChange={setRecentScansRemovalBroker}
              onRemovalRecordCountChange={setRecentScansRemovalRecordCount}
              onLogoColumnsChange={setRecentScansLogoColumns}
              onLogoRowsChange={setRecentScansLogoRows}
              onLogoSizeChange={setRecentScansLogoSize}
            />
          </div>
        )}
        {activePage === 'cardDataBrokerSites' && (
          <div className="page">
            <CardDataBrokerSites
              state={dataBrokerState}
              totalSites={dataBrokerTotalSites}
              currentScanIndex={dataBrokerCurrentScanIndex}
              currentBrokerName={dataBrokerCurrentBrokerName}
              sitesWithRecords={dataBrokerSitesWithRecords}
            />
            <CardDataBrokerSitesParameterPanel
              state={dataBrokerState}
              totalSites={dataBrokerTotalSites}
              currentScanIndex={dataBrokerCurrentScanIndex}
              currentBrokerName={dataBrokerCurrentBrokerName}
              sitesWithRecords={dataBrokerSitesWithRecords}
              onStateChange={setDataBrokerState}
              onTotalSitesChange={setDataBrokerTotalSites}
              onCurrentScanIndexChange={setDataBrokerCurrentScanIndex}
              onCurrentBrokerNameChange={setDataBrokerCurrentBrokerName}
              onSitesWithRecordsChange={setDataBrokerSitesWithRecords}
            />
          </div>
        )}
        {activePage === 'cardRecords' && (
          <div className="page">
            <CardRecords
              state={cardRecordsState}
              totalRecords={cardRecordsTotalRecords}
              completedPercentage={cardRecordsCompletedPercentage}
            />
            <CardRecordsParameterPanel
              state={cardRecordsState}
              totalRecords={cardRecordsTotalRecords}
              completedPercentage={cardRecordsCompletedPercentage}
              onStateChange={setCardRecordsState}
              onTotalRecordsChange={setCardRecordsTotalRecords}
              onCompletedPercentageChange={setCardRecordsCompletedPercentage}
            />
          </div>
        )}
        {activePage === 'logos' && (
          <div className="page">
            <LogoAnimation
              columns={logoColumns}
              rows={logoRows}
              logoSize={logoSize}
              waveDelay={logoWaveDelay}
              duration={logoDuration}
              holdDelay={logoHoldDelay}
              easingIn={logoEasingIn}
              easingOut={logoEasingOut}
            />
            <LogoAnimationParameterPanel
              columns={logoColumns}
              rows={logoRows}
              logoSize={logoSize}
              waveDelay={logoWaveDelay}
              duration={logoDuration}
              holdDelay={logoHoldDelay}
              easingIn={logoEasingIn}
              easingOut={logoEasingOut}
              onColumnsChange={setLogoColumns}
              onRowsChange={setLogoRows}
              onLogoSizeChange={setLogoSize}
              onWaveDelayChange={setLogoWaveDelay}
              onDurationChange={setLogoDuration}
              onHoldDelayChange={setLogoHoldDelay}
              onEasingInChange={setLogoEasingIn}
              onEasingOutChange={setLogoEasingOut}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
