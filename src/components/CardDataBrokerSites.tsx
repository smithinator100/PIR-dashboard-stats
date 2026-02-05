import { motion } from 'motion/react'
import DonutChart, { type DonutState } from './DonutChartOdometer'
import './CardDataBrokerSites.css'

type CardDataBrokerSitesState = 'loading' | 'scanning' | 'in-progress' | 'complete'

interface CardDataBrokerSitesProps {
  state: CardDataBrokerSitesState
  totalSites?: number
  currentScanIndex?: number // Used in loading state (1-indexed)
  currentBrokerName?: string // Used in loading state
  sitesWithRecords?: number // Used in in-progress state (percentage is calculated from this)
  defaultSpeedMultiplier?: number
  completeSpeedMultiplier?: number
  onClick?: () => void
}

function CardDataBrokerSites({
  state,
  totalSites = 50,
  currentScanIndex = 1,
  currentBrokerName = 'Broker name',
  sitesWithRecords = 10,
  defaultSpeedMultiplier = 0.5,
  completeSpeedMultiplier = 0.2,
  onClick
}: CardDataBrokerSitesProps) {
  // Calculate percentage from sitesWithRecords and totalSites
  const calculatePercentage = (): number => {
    if (totalSites === 0) return 0
    const sitesClear = totalSites - sitesWithRecords
    return Math.round((sitesClear / totalSites) * 100)
  }

  const percentage = state === 'in-progress' ? calculatePercentage() : 0

  // Derive donut state from card state
  const getDonutState = (): DonutState => {
    switch (state) {
      case 'loading':
        return 'loading'
      case 'scanning':
        return 'scanning'
      case 'in-progress':
        return 'in-progress'
      case 'complete':
        return 'completed'
    }
  }

  // Get body text based on state
  const getBodyText = (): string => {
    switch (state) {
      case 'loading':
        return 'Data broker sites'
      case 'scanning':
        return 'Data broker sites'
      case 'in-progress':
        return 'Broker sites'
      case 'complete':
        return 'Data broker sites'
    }
  }

  // Get number/subtitle text based on state
  const getNumberText = (): string => {
    switch (state) {
      case 'loading':
        return `Scanning ${currentScanIndex} of ${totalSites} sites`
      case 'scanning':
        return `Scanning ${currentScanIndex} of ${totalSites} sites`
      case 'in-progress':
        return `Monitoring ${totalSites} sites`
      case 'complete':
        return `Monitoring ${totalSites} sites`
    }
  }

  // Get footer text based on state
  const getFooterText = (): string => {
    switch (state) {
      case 'loading':
        return currentBrokerName
      case 'scanning':
        return currentBrokerName
      case 'in-progress':
        return `${sitesWithRecords} sites have records of your personal info`
      case 'complete':
        return `All ${totalSites} sites are clear of your personal information`
    }
  }

  const isLoading = state === 'loading'
  const showSkeletonText = isLoading // Only loading state shows skeleton text

  return (
    <div 
      className="card-data-broker-sites"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <motion.div
        className="card-data-broker-sites-wrapper"
        animate={{ scale: isLoading ? 0.85 : 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Title Section */}
        <div className="card-data-broker-sites-title">
          <span className={`card-data-broker-sites-body ${showSkeletonText ? 'hidden' : ''}`}>
            {getBodyText()}
          </span>
          <span className={`card-data-broker-sites-number ${showSkeletonText ? 'hidden' : ''}`}>
            {getNumberText()}
          </span>
          <div className={`skeleton skeleton-text skeleton-body ${!showSkeletonText ? 'hidden' : ''}`} />
          <div className={`skeleton skeleton-text skeleton-number ${!showSkeletonText ? 'hidden' : ''}`} />
        </div>

        {/* Content Section */}
        <div className="card-data-broker-sites-content">
          <DonutChart
            state={getDonutState()}
            percentage={percentage}
            variant="blue"
            label={`Sites are clear\nof records`}
            defaultSpeedMultiplier={defaultSpeedMultiplier}
            completeSpeedMultiplier={completeSpeedMultiplier}
          />
        </div>

        {/* Footer Section */}
        <div className="card-data-broker-sites-footer">
          <span className={`card-data-broker-sites-info ${showSkeletonText ? 'hidden' : ''}`}>
            {getFooterText()}
          </span>
          <div className={`skeleton skeleton-text skeleton-footer ${!showSkeletonText ? 'hidden' : ''}`} />
        </div>
      </motion.div>
    </div>
  )
}

export { CardDataBrokerSites }
export type { CardDataBrokerSitesProps, CardDataBrokerSitesState }
