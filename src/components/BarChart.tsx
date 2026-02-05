import { motion } from 'motion/react'
import './BarChart.css'

type BarState = 'loading' | 'in-progress' | 'completed'

interface BarChartProps {
  state: BarState
  total: number
  completedPercentage: number  // Only used when state is 'in-progress'
}

// Checkmark icon component (24x24 purple circle with white check)
function CheckmarkIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#9F6EB8"/>
      <path 
        d="M8.5 12.5L10.5 14.5L15.5 9.5" 
        stroke="white" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Animation configuration - quint ease-out
const easeOutQuint = [0.16, 1, 0.3, 1] as const

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
  ease: [0.22, 1, 0.36, 1] as const
}

function BarChart({ state, total, completedPercentage }: BarChartProps) {
  const completed = Math.round((completedPercentage / 100) * total)

  // Derived state booleans
  const isLoading = state === 'loading'
  const isComplete = state === 'completed'

  // Display percentage: use 100% when completed, otherwise use prop
  const displayPercentage = isComplete ? 100 : completedPercentage
  const displayCompleted = isComplete ? total : completed

  return (
    <div className="bar-chart">
      {/* Progress bar track */}
      <div className="bar-chart-track">
        {/* Shimmer overlay for loading state */}
        <motion.div 
          className="bar-chart-shimmer"
          animate={{ opacity: isLoading ? 1 : 0 }}
          transition={colorTransition}
        />
        {/* Progress fill */}
        <motion.div 
          className="bar-chart-progress"
          initial={{ width: '0%' }}
          animate={{ width: isLoading ? '0%' : `${displayPercentage}%` }}
          transition={progressTransition}
        />
      </div>

      {/* Key section */}
      <div className="bar-chart-key">
        {/* Loading skeleton */}
        <motion.div 
          className="bar-chart-key-loading"
          animate={{ opacity: isLoading ? 1 : 0 }}
          transition={textTransition}
          style={{ pointerEvents: isLoading ? 'auto' : 'none' }}
        >
          <div className="bar-skeleton bar-skeleton-icon"></div>
          <div className="bar-skeleton bar-skeleton-text"></div>
        </motion.div>

        {/* Active state content */}
        <motion.div 
          className="bar-chart-key-content"
          initial={{ opacity: 0, y: 8 }}
          animate={{ 
            opacity: isLoading ? 0 : 1, 
            y: isLoading ? 8 : 0 
          }}
          transition={textTransition}
          style={{ pointerEvents: isLoading ? 'none' : 'auto' }}
        >
          <CheckmarkIcon />
          <span className="bar-chart-key-text">
            <span className="bar-chart-key-bold">{displayCompleted} of {total}</span>
            {' '}submitted
          </span>
        </motion.div>
      </div>
    </div>
  )
}

export { BarChart }
export type { BarState }
