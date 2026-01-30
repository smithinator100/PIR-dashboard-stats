import { useState, useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import './BarChart.css'

type BarState = 'loading' | 'in-progress' | 'completed'

interface BarChartProps {
  state: BarState
  total: number
  completedPercentage: number  // Only used when state is 'in-progress'
}

// Checkmark icon component for completed state (16x16)
function CheckmarkIcon16() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        d="M11.9393 3.93934C12.5251 3.35355 13.4746 3.35355 14.0604 3.93934C14.6462 4.52513 14.6462 5.47465 14.0604 6.06043L7.41395 12.7069C6.63291 13.4879 5.36686 13.4879 4.58582 12.7069L1.93934 10.0604C1.35355 9.47465 1.35355 8.52513 1.93934 7.93934C2.52513 7.35355 3.47465 7.35355 4.06043 7.93934L5.99989 9.87879L11.9393 3.93934Z" 
        fill="#589D88"
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
  const inProgress = total - completed

  // Derived state booleans
  const isLoading = state === 'loading'
  const isComplete = state === 'completed'

  // Track success transition state - separate states for in-progress exit and completed enter
  const [showSuccessState, setShowSuccessState] = useState(state === 'completed')
  const [hideInProgressText, setHideInProgressText] = useState(state === 'completed')
  const [showCompletedText, setShowCompletedText] = useState(state === 'completed')

  // Refs for timers
  const previousStateRef = useRef(state)
  const isInitialMountRef = useRef(true)

  // Handle success transition when state changes to 'completed'
  useEffect(() => {
    const isInitialRender = isInitialMountRef.current
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false
    }

    const wasCompleted = previousStateRef.current === 'completed'
    previousStateRef.current = state

    if ((isComplete && wasCompleted) || (!isComplete && !wasCompleted)) {
      return
    }

    if (isComplete) {
      if (isInitialRender) {
        setShowSuccessState(true)
        setHideInProgressText(true)
        setShowCompletedText(true)
        return
      }

      // Step 1: Immediately start hiding in-progress text (before bar reaches end)
      setHideInProgressText(true)

      // Step 2: After in-progress text has exited, show completed text
      const timer1 = setTimeout(() => {
        setShowCompletedText(true)
      }, 350) // Wait for in-progress exit animation to complete

      // Step 3: Update success state for colors (can happen in parallel with bar)
      const timer2 = setTimeout(() => {
        setShowSuccessState(true)
      }, 100)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    } else {
      // Reverse transition: completed → in-progress
      // Step 1: Immediately start hiding completed text (moves down and fades out)
      setShowCompletedText(false)

      // Step 2: After completed text has exited, show in-progress text (moves up and fades in)
      const timer1 = setTimeout(() => {
        setHideInProgressText(false)
      }, 350)

      // Step 3: Update success state for colors
      const timer2 = setTimeout(() => {
        setShowSuccessState(false)
      }, 100)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
      }
    }
  }, [state, isComplete])

  // Display percentage: use 100% when completed, otherwise use prop
  const displayPercentage = isComplete ? 100 : completedPercentage

  // Track and progress colors based on state
  const trackColor = isLoading ? '#E5E5E5' : (showSuccessState ? '#CFEBDA' : '#D3B9EB')
  const progressColor = isLoading ? '#DDDDDD' : (showSuccessState ? '#589D88' : '#7D4794')
  const progressWidth = isLoading ? 0 : displayPercentage

  return (
    <div className="bar-chart">
      {/* Unified bar track - transitions from skeleton to actual */}
      <motion.div 
        className="bar-chart-track"
        animate={{
          backgroundColor: trackColor
        }}
        initial={{ backgroundColor: '#E5E5E5' }}
        transition={colorTransition}
      >
        {/* Shimmer overlay - fades out smoothly */}
        <motion.div 
          className="bar-chart-shimmer"
          animate={{ opacity: isLoading ? 1 : 0 }}
          transition={colorTransition}
        />
        <motion.div 
          className="bar-chart-progress"
          initial={{ width: '0%', backgroundColor: '#DDDDDD' }}
          animate={{
            width: `${progressWidth}%`,
            backgroundColor: progressColor
          }}
          transition={progressTransition}
        />
      </motion.div>

      {/* Key section */}
      <div className="bar-chart-key">
        {/* Loading skeleton key items - positioned at y:8 to match text start position */}
        <motion.div 
          className="bar-chart-key-items-wrapper bar-chart-key-items-wrapper--absolute"
          style={{ pointerEvents: isLoading ? 'auto' : 'none', transform: 'translateY(8px)' }}
          animate={{ opacity: isLoading ? 1 : 0 }}
          transition={textTransition}
        >
          <div className="bar-chart-key-item">
            <div className="bar-skeleton bar-skeleton-indicator"></div>
            <div className="bar-skeleton bar-skeleton-label"></div>
          </div>
          <div className="bar-chart-key-item">
            <div className="bar-skeleton bar-skeleton-indicator"></div>
            <div className="bar-skeleton bar-skeleton-label"></div>
          </div>
        </motion.div>

        {/* In-progress key items */}
        <motion.div 
          className="bar-chart-key-items-wrapper bar-chart-key-items-wrapper--absolute"
          style={{ pointerEvents: !isLoading && !hideInProgressText ? 'auto' : 'none' }}
          initial={{ opacity: 0, y: -8 }}
          animate={{
            opacity: !isLoading && !hideInProgressText ? 1 : 0,
            y: !isLoading && !hideInProgressText ? 0 : 8
          }}
          transition={textTransition}
        >
          <div className="bar-chart-key-item">
            <motion.div 
              className="bar-chart-indicator"
              animate={{ backgroundColor: '#D3B9EB' }}
              transition={colorTransition}
            />
            <span className="bar-chart-label">{inProgress} in-progress</span>
          </div>
          <div className="bar-chart-key-item">
            <motion.div 
              className="bar-chart-indicator"
              animate={{ backgroundColor: '#7D4794' }}
              transition={colorTransition}
            />
            <span className="bar-chart-label">{completed} completed</span>
          </div>
        </motion.div>

        {/* Completed key item */}
        <motion.div 
          className="bar-chart-key-items-wrapper bar-chart-completed-wrapper"
          initial={{ opacity: 0, y: 8 }}
          animate={{
            opacity: showCompletedText ? 1 : 0,
            y: showCompletedText ? 0 : 8
          }}
          transition={textTransition}
          style={{ pointerEvents: showCompletedText ? 'auto' : 'none' }}
        >
          <div className="bar-chart-key-item">
            <div className="bar-chart-checkmark">
              <CheckmarkIcon16 />
            </div>
            <span className="bar-chart-label">All removal requests have been completed</span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export { BarChart }
export type { BarState }
