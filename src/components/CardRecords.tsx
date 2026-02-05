import { motion } from 'motion/react'
import './CardRecords.css'

type CardRecordsState = 'loading' | 'scanning' | 'records-found' | 'in-progress' | 'complete'

interface CardRecordsProps {
  state: CardRecordsState
  totalRecords?: number
  completedPercentage?: number // Used in in-progress state
  defaultSpeedMultiplier?: number
  completeSpeedMultiplier?: number
  onClick?: () => void
}


// Scanning form illustration component with animated colors
function ScanningForm({ isActive = false }: { isActive?: boolean }) {
  // Rectangle outline always stays gray
  const outlineColor = 'rgba(0, 0, 0, 0.06)'
  // Inner elements (ellipses and lines) animate to purple when active
  const innerColor = isActive ? '#9F6EB8' : 'rgba(0, 0, 0, 0.06)'

  const colorTransitionConfig = {
    duration: 0.6,
    ease: [0.16, 1, 0.3, 1] as const
  }

  return (
    <svg width="148" height="168" viewBox="0 0 148 168" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Rectangle outline - always gray */}
      <rect 
        x="6" 
        y="6" 
        width="136" 
        height="156" 
        rx="18" 
        fill="none"
        stroke={outlineColor}
        strokeWidth="12"
      />
      
      {/* Ellipse 83 - larger ellipse (body) */}
      <motion.ellipse 
        cx="73.82" 
        cy="69.62" 
        rx="24.32" 
        ry="14.08" 
        animate={{ fill: innerColor }}
        transition={colorTransitionConfig}
      />
      
      {/* Ellipse 85 - smaller circle (head) */}
      <motion.ellipse 
        cx="74.34" 
        cy="40.52" 
        rx="11.52" 
        ry="11.52" 
        animate={{ fill: innerColor }}
        transition={colorTransitionConfig}
      />
      
      {/* Vector 1 - longer line */}
      <motion.line 
        x1="45" 
        y1="112.5" 
        x2="102.5" 
        y2="112.5" 
        animate={{ stroke: innerColor }}
        transition={colorTransitionConfig}
        strokeWidth="12"
        strokeLinecap="round"
      />
      
      {/* Vector 2 - shorter line */}
      <motion.line 
        x1="45" 
        y1="130.5" 
        x2="59" 
        y2="130.5" 
        animate={{ stroke: innerColor }}
        transition={colorTransitionConfig}
        strokeWidth="12"
        strokeLinecap="round"
      />
    </svg>
  )
}

// Animation configuration
const easeOutQuint = [0.16, 1, 0.3, 1] as const
const easeOutExpo = [0.22, 1, 0.36, 1] as const

const colorTransition = {
  duration: 0.6,
  ease: easeOutQuint
}

const textTransition = {
  duration: 0.4,
  ease: easeOutQuint
}

const progressTransition = {
  duration: 0.6,
  ease: easeOutExpo
}

function CardRecords({
  state,
  totalRecords = 12,
  completedPercentage = 0,
  onClick
}: CardRecordsProps) {
  const completed = Math.round((completedPercentage / 100) * totalRecords)

  // Derived state booleans
  const isLoading = state === 'loading'
  const isScanning = state === 'scanning'
  const isRecordsFound = state === 'records-found'
  const isInProgress = state === 'in-progress'
  const isComplete = state === 'complete'

  // Display percentage: use 100% when completed, otherwise use prop
  const displayPercentage = isComplete ? 100 : completedPercentage
  const displayCompleted = isComplete ? totalRecords : completed

  // Show progress bar colors based on state
  const progressColor = isComplete ? '#589D88' : '#9F6EB8'
  const checkmarkColor = isComplete ? '#589D88' : '#9F6EB8'

  // Get body text based on state
  const getBodyText = (): string => {
    return 'Records'
  }

  // Get number/subtitle text based on state
  const getNumberText = (): string => {
    switch (state) {
      case 'loading':
        return 'No records found yet'
      case 'scanning':
        return 'No records found yet'
      case 'records-found':
        return `${totalRecords} records found`
      case 'in-progress':
        return 'Submitting requests to remove records'
      case 'complete':
        return 'Record requests submitted'
    }
  }

  // Get footer text based on state
  const getFooterText = (): string => {
    switch (state) {
      case 'loading':
        return 'When we find a record we will submit a removal request'
      case 'scanning':
        return 'When we find a record we will submit a removal request'
      case 'records-found':
        return 'When we find a record we will submit a removal request'
      case 'in-progress':
        return `${totalRecords} records of your personal information were found`
      case 'complete':
        return `${totalRecords} records found. \n4 removals verified.`
    }
  }

  // Show skeleton text in loading state
  const showSkeletonText = isLoading
  const showScanningForm = isScanning || isRecordsFound
  const showProgressBar = isInProgress || isComplete

  return (
    <div 
      className="card-records"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <motion.div
        className="card-records-wrapper"
        animate={{ scale: isLoading ? 0.85 : 1 }}
        transition={{ duration: 0.6, ease: easeOutExpo }}
      >
        {/* Title Section */}
        <div className="card-records-title">
          <span className={`card-records-body ${showSkeletonText ? 'hidden' : ''}`}>
            {getBodyText()}
          </span>
          <span className={`card-records-number ${showSkeletonText ? 'hidden' : ''}`}>
            {getNumberText()}
          </span>
          <div className={`skeleton skeleton-text skeleton-body ${!showSkeletonText ? 'hidden' : ''}`} />
          <div className={`skeleton skeleton-text skeleton-number ${!showSkeletonText ? 'hidden' : ''}`} />
        </div>

        {/* Content Section */}
        <div className="card-records-content">
          {/* Loading skeleton bar chart */}
          {isLoading && (
            <div className="card-records-progress-container">
              {/* Skeleton progress bar track */}
              <div className="card-records-bar-track">
                <div className="card-records-bar-shimmer" />
              </div>

              {/* Skeleton key section */}
              <div className="card-records-bar-key">
                <div className="card-records-bar-key-loading">
                  <div className="card-records-bar-skeleton card-records-bar-skeleton-icon" />
                  <div className="card-records-bar-skeleton card-records-bar-skeleton-text" />
                </div>
              </div>
            </div>
          )}

          {/* Scanning form illustration */}
          {showScanningForm && (
            <motion.div
              className="card-records-scanning"
              initial={{ opacity: 0, y: 0, scale: 0.8 }}
              animate={{ 
                opacity: showScanningForm ? 1 : 0,
                y: showScanningForm ? -8 : 0,
                scale: isRecordsFound ? 1 : 0.8
              }}
              transition={{
                ...textTransition,
                scale: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
              }}
            >
              <ScanningForm isActive={isRecordsFound} />
            </motion.div>
          )}

          {/* Progress bar */}
          {showProgressBar && (
            <motion.div
              className="card-records-progress-container"
              initial={{ opacity: 0, y: 16 }}
              animate={{ 
                opacity: showProgressBar ? 1 : 0,
                y: 0
              }}
              transition={textTransition}
            >
              {/* Progress bar track */}
              <div className="card-records-bar-track">
                {/* Progress fill */}
                <motion.div 
                  className="card-records-bar-progress"
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: `${displayPercentage}%`,
                    backgroundColor: progressColor
                  }}
                  transition={progressTransition}
                />
              </div>

              {/* Key section */}
              <div className="card-records-bar-key">
                <motion.div 
                  className="card-records-bar-key-content"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0 
                  }}
                  transition={textTransition}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <motion.circle 
                      cx="12" 
                      cy="12" 
                      r="10" 
                      animate={{ fill: checkmarkColor }}
                      transition={colorTransition}
                    />
                    <path 
                      d="M8.5 12.5L10.5 14.5L15.5 9.5" 
                      stroke="white" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="card-records-bar-key-text">
                    {isComplete ? (
                      <span className="card-records-bar-key-bold">
                        {displayCompleted} record removal requests submitted
                      </span>
                    ) : (
                      <>
                        <span className="card-records-bar-key-bold">{displayCompleted} of {totalRecords}</span>
                        {' '}submitted
                      </>
                    )}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer Section */}
        <div className="card-records-footer">
          <span className={`card-records-info ${showSkeletonText ? 'hidden' : ''}`}>
            {getFooterText()}
          </span>
          <div className={`skeleton skeleton-text skeleton-footer ${!showSkeletonText ? 'hidden' : ''}`} />
        </div>
      </motion.div>
    </div>
  )
}

export { CardRecords }
export type { CardRecordsProps, CardRecordsState }
