import { motion } from 'motion/react'
import { RecentScans } from './RecentScans'
import './CardRecentScans.css'

type CardRecentScansState = 'loading' | 'scanning' | 'in-progress' | 'complete'

interface CardRecentScansProps {
  state: CardRecentScansState
  scanCount?: number
  onClick?: () => void
}

function CardRecentScans({
  state,
  scanCount = 6,
  onClick
}: CardRecentScansProps) {
  // Derived state booleans
  const isLoading = state === 'loading'
  const isScanning = state === 'scanning'
  const isInProgress = state === 'in-progress'
  const isComplete = state === 'complete'

  // Get body text based on state
  const getBodyText = (): string => {
    return 'Recent scans'
  }

  // Get number/subtitle text based on state
  const getNumberText = (): string => {
    switch (state) {
      case 'loading':
        return 'No scans yet'
      case 'scanning':
        return 'Scanning sites'
      case 'in-progress':
        return `${scanCount} scans completed`
      case 'complete':
        return `${scanCount} scans completed`
    }
  }

  // Get footer text based on state
  const getFooterText = (): string => {
    switch (state) {
      case 'loading':
        return 'When scans complete they will appear here'
      case 'scanning':
        return 'Scanning data broker sites for your information'
      case 'in-progress':
        return 'Next scan is 19 Jan'
      case 'complete':
        return 'Next scan is 19 Jan'
    }
  }

  // Show skeleton text in loading state
  const showSkeletonText = isLoading
  const showRecentScans = !isLoading

  return (
    <div 
      className="card-recent-scans"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <motion.div
        className="card-recent-scans-wrapper"
        animate={{ scale: isLoading ? 0.85 : 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Title Section */}
        <div className="card-recent-scans-title">
          <span className={`card-recent-scans-body ${showSkeletonText ? 'hidden' : ''}`}>
            {getBodyText()}
          </span>
          <span className={`card-recent-scans-number ${showSkeletonText ? 'hidden' : ''}`}>
            {getNumberText()}
          </span>
          <div className={`skeleton skeleton-text skeleton-body ${!showSkeletonText ? 'hidden' : ''}`} />
          <div className={`skeleton skeleton-text skeleton-number ${!showSkeletonText ? 'hidden' : ''}`} />
        </div>

        {/* Content Section */}
        <div className="card-recent-scans-content">
          {showRecentScans && (
            <RecentScans scanCount={scanCount} isLoading={isScanning} />
          )}
        </div>

        {/* Footer Section */}
        <div className="card-recent-scans-footer">
          <span className={`card-recent-scans-info ${showSkeletonText ? 'hidden' : ''}`}>
            {getFooterText()}
          </span>
          <div className={`skeleton skeleton-text skeleton-footer ${!showSkeletonText ? 'hidden' : ''}`} />
        </div>
      </motion.div>
    </div>
  )
}

export { CardRecentScans }
export type { CardRecentScansProps, CardRecentScansState }
