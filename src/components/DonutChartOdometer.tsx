import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'motion/react'
import './DonutChartOdometer.css'

type DonutState = 'loading' | 'in-progress' | 'completed'

interface DonutChartOdometerProps {
  state: DonutState
  percentage: number  // Only used when state is 'in-progress'
  variant: 'blue' | 'green'
  label?: string
  defaultSpeedMultiplier?: number
  completeSpeedMultiplier?: number
}

// Success state colors from Figma
const SUCCESS_COLORS = {
  outerStroke: '#589D88',
  innerFill: '#CFEBDA',
  checkmark: '#0A4739'
}

// Checkmark SVG component for success state
function CheckmarkIcon() {
  return (
    <svg width="34" height="24" viewBox="0 0 34 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M33.2138 0.781049C34.2621 1.82245 34.2621 3.51089 33.2138 4.55228L14.4243 23.219C13.3761 24.2603 11.6765 24.2603 10.6283 23.219L0.786187 13.4412C-0.262062 12.3998 -0.262062 10.7113 0.786187 9.66994C1.83444 8.62854 3.53398 8.62854 4.58223 9.66994L12.5263 17.5621L29.4178 0.781049C30.466 -0.26035 32.1656 -0.26035 33.2138 0.781049Z" 
        fill={SUCCESS_COLORS.checkmark}
      />
    </svg>
  )
}

// Tracks cumulative position for each digit to enable proper odometer wrapping
interface DigitPosition {
  value: number
  offset: number  // Cumulative offset (can exceed 9 or go negative for wrapping)
  isAnimating: boolean
}

// Height of each digit in pixels
const DIGIT_HEIGHT = 40
// Base offset must point to an index where strip value is 0
const ONES_BASE_OFFSET = 110
const TENS_BASE_OFFSET = 10

// Animation timing constants
const MIN_DURATION = 600
const MAX_DURATION = 2400
const MS_PER_POINT = 25

function calculateAnimationDuration(
  delta: number, 
  targetPercentage: number, 
  defaultSpeedMultiplier: number = 0.5,
  completeSpeedMultiplier: number = 0.2
): number {
  const absDelta = Math.abs(delta)
  let duration = MIN_DURATION + (absDelta * MS_PER_POINT)
  
  if (targetPercentage === 100) {
    duration = duration * completeSpeedMultiplier
  } else {
    duration = duration * defaultSpeedMultiplier
  }
  
  return Math.min(duration, MAX_DURATION)
}

// Easing curves
const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const
const EASE_OUT_QUINT = [0, 0, 0.2, 1] as const
const EASE_STANDARD = [0.4, 0, 0.2, 1] as const

// Motion transition configs
const containerTransition = {
  duration: 0.15,
  ease: EASE_STANDARD
}

const contentTransition = {
  duration: 0.6,
  ease: EASE_OUT_EXPO
}

function DonutChartOdometer({ 
  state,
  percentage, 
  variant, 
  label = 'Text info', 
  defaultSpeedMultiplier = 0.5,
  completeSpeedMultiplier = 0.2
}: DonutChartOdometerProps) {
  const size = 169
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  
  const [animatedPercentage, setAnimatedPercentage] = useState<number | null>(null)
  
  const displayPercentage: number = state === 'completed' 
    ? (animatedPercentage !== null ? animatedPercentage : 100)
    : (animatedPercentage !== null ? animatedPercentage : percentage)
  const offset = circumference - (displayPercentage / 100) * circumference
  
  const isLoading = state === 'loading'
  const isComplete = state === 'completed'

  const innerRingSize = 149
  const innerRingRadius = (innerRingSize - strokeWidth) / 2
  
  const [showSuccessState, setShowSuccessState] = useState(state === 'completed')
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'contracting' | 'expanding'>('idle')
  const [isTextScalingOut, setIsTextScalingOut] = useState(state === 'completed')
  const [showCheckmark, setShowCheckmark] = useState(state === 'completed')
  const animateTo99TimerRef = useRef<number | null>(null)

  const strokeColor = variant === 'blue' ? '#A1D0F7' : '#CFEBDA'
  const activeColor = variant === 'blue' ? '#1074CC' : '#589D88'
  const innerFillColor = variant === 'blue' ? '#E8F4FD' : '#CFEBDA'
  
  const displayStrokeColor = showSuccessState ? SUCCESS_COLORS.outerStroke : strokeColor
  const displayActiveColor = showSuccessState ? SUCCESS_COLORS.outerStroke : activeColor
  const displayInnerFill = showSuccessState ? SUCCESS_COLORS.innerFill : innerFillColor

  const [digitPositions, setDigitPositions] = useState<DigitPosition[]>(() => {
    const displayValue = Math.min(percentage, 99)
    const digits = displayValue.toString().padStart(2, '0').split('').map(Number)
    return digits.map(value => ({ value, offset: value, isAnimating: false }))
  })
  
  const animationDurationRef = useRef(MIN_DURATION)
  const previousPercentageRef = useRef(percentage)
  const previousStateRef = useRef(state)
  const isInitialMountRef = useRef(true)
  const stripRefs = useRef<(HTMLDivElement | null)[]>([])
  
  const isInitialRender = isInitialMountRef.current
  
  const effectivePercentage = animatedPercentage !== null ? animatedPercentage : percentage
  const isCompletionTransition = state === 'completed' && animatedPercentage !== null
  if (!isInitialMountRef.current && previousPercentageRef.current !== effectivePercentage) {
    const delta = effectivePercentage - previousPercentageRef.current
    const absDelta = Math.abs(delta)
    if (isCompletionTransition) {
      animationDurationRef.current = Math.min(
        (MIN_DURATION + (absDelta * MS_PER_POINT)) * completeSpeedMultiplier,
        MAX_DURATION
      )
    } else {
      animationDurationRef.current = calculateAnimationDuration(
        delta, 
        effectivePercentage, 
        defaultSpeedMultiplier, 
        completeSpeedMultiplier
      )
    }
  }
  
  const animationDuration = animationDurationRef.current

  const normalizeOffsets = useCallback(() => {
    setDigitPositions(() => {
      const effectivePercentage = animatedPercentage !== null ? animatedPercentage : percentage
      const displayValue = Math.min(effectivePercentage, 99)
      const digits = displayValue.toString().padStart(2, '0').split('').map(Number)
      return [
        { value: digits[0], offset: digits[0], isAnimating: false },
        { value: digits[1], offset: digits[1], isAnimating: false }
      ]
    })
  }, [percentage, animatedPercentage])

  const prevStateForAnimationRef = useRef(state)
  
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false
      prevStateForAnimationRef.current = state
      return
    }

    if (state === 'completed' && animatedPercentage === null) {
      prevStateForAnimationRef.current = state
      return
    }

    const wasCompleted = prevStateForAnimationRef.current === 'completed'
    const isNowInProgress = state === 'in-progress'
    if (wasCompleted && isNowInProgress) {
      previousPercentageRef.current = 99
    }
    prevStateForAnimationRef.current = state

    const effectivePercentage = animatedPercentage !== null ? animatedPercentage : percentage

    if (previousPercentageRef.current === effectivePercentage) {
      return
    }

    const prevValue = previousPercentageRef.current
    const newValue = effectivePercentage
    const duration = animationDurationRef.current

    const displayValue = Math.min(newValue, 99)
    const prevDisplayValue = Math.min(prevValue, 99)
    
    if (displayValue === prevDisplayValue) {
      previousPercentageRef.current = newValue
      return
    }

    const newDigits = displayValue.toString().padStart(2, '0').split('').map(Number)
    const displayDelta = displayValue - prevDisplayValue
    
    const onesDelta = displayDelta
    const tensDelta = Math.floor(displayValue / 10) - Math.floor(prevDisplayValue / 10)

    const newPositions: DigitPosition[] = [
      {
        value: newDigits[0],
        offset: digitPositions[0].offset + tensDelta,
        isAnimating: true
      },
      {
        value: newDigits[1],
        offset: digitPositions[1].offset + onesDelta,
        isAnimating: true
      }
    ]

    setDigitPositions(newPositions)
    previousPercentageRef.current = newValue

    const timer = setTimeout(() => {
      stripRefs.current.forEach(ref => {
        if (ref) ref.style.transition = 'none'
      })
      
      normalizeOffsets()
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          stripRefs.current.forEach(ref => {
            if (ref) ref.style.transition = ''
          })
        })
      })
    }, duration + 50)

    return () => clearTimeout(timer)
  }, [percentage, animatedPercentage, digitPositions, normalizeOffsets])

  useEffect(() => {
    if (animateTo99TimerRef.current) {
      clearTimeout(animateTo99TimerRef.current)
      animateTo99TimerRef.current = null
    }

    const wasInProgress = previousStateRef.current === 'in-progress'
    const isNowCompleted = state === 'completed'

    if (isNowCompleted && wasInProgress && !isInitialRender) {
      const currentPercentage = percentage
      const delta = 99 - currentPercentage
      const absDelta = Math.abs(delta)
      const duration = Math.min(
        (MIN_DURATION + (absDelta * MS_PER_POINT)) * completeSpeedMultiplier,
        MAX_DURATION
      )

      setAnimatedPercentage(99)
      animationDurationRef.current = duration

      animateTo99TimerRef.current = window.setTimeout(() => {
        previousPercentageRef.current = 99
        setAnimatedPercentage(null)
      }, duration)
    } else if (!isNowCompleted) {
      setAnimatedPercentage(null)
    }

    return () => {
      if (animateTo99TimerRef.current) {
        clearTimeout(animateTo99TimerRef.current)
      }
    }
  }, [state, percentage, completeSpeedMultiplier, isInitialRender])

  useEffect(() => {
    const wasCompleted = previousStateRef.current === 'completed'
    const wasInProgress = previousStateRef.current === 'in-progress'
    previousStateRef.current = state

    if ((isComplete && wasCompleted) || (!isComplete && !wasCompleted && !wasInProgress)) {
      return
    }

    if (isComplete) {
      if (isInitialRender) {
        setIsTextScalingOut(true)
        setShowSuccessState(true)
        setShowCheckmark(true)
        return
      }

      const animDuration = wasInProgress ? animationDurationRef.current : 0
      const textFadeStart = Math.round(animDuration * 0.4)
      
      const timer1 = setTimeout(() => {
        setIsTextScalingOut(true)
      }, textFadeStart)

      const timer2 = setTimeout(() => {
        setShowSuccessState(true)
        setAnimationPhase('contracting')
      }, animDuration + 50)

      const timer3 = setTimeout(() => {
        setAnimationPhase('expanding')
        setShowCheckmark(true)
      }, animDuration + 250)

      const timer4 = setTimeout(() => {
        setAnimationPhase('idle')
      }, animDuration + 400)

      return () => {
        clearTimeout(timer1)
        clearTimeout(timer2)
        clearTimeout(timer3)
        clearTimeout(timer4)
      }
    } else {
      setShowSuccessState(false)
      setAnimationPhase('idle')
      setShowCheckmark(false)
      setIsTextScalingOut(false)
    }
  }, [state, isComplete, isInitialRender])

  const tensDigitStrip = Array.from({ length: 30 }, (_, i) => i % 10)
  const onesDigitStrip = Array.from({ length: 220 }, (_, i) => i % 10)

  const effectivePercentageForTiming = animatedPercentage !== null ? animatedPercentage : percentage
  const isAnimatingTo99 = effectivePercentageForTiming >= 99 && !showSuccessState
  const odometerTiming = isAnimatingTo99 ? 'linear' : 'cubic-bezier(0.22, 1, 0.36, 1)'
  const ringTiming = isAnimatingTo99 ? 'linear' : 'cubic-bezier(0.22, 1, 0.36, 1)'

  // Calculate container scale based on animation phase
  const getContainerScale = () => {
    switch (animationPhase) {
      case 'contracting': return 0.9
      case 'expanding': return 1.1
      default: return 1
    }
  }

  // Use longer duration when settling back from expanded state
  const getContainerTransition = () => {
    if (animationPhase === 'idle' && showSuccessState) {
      return { duration: 0.4, ease: EASE_STANDARD }
    }
    return containerTransition
  }

  return (
    <motion.div 
      className="donut-chart-container"
      animate={{ 
        scale: getContainerScale(),
        y: -8
      }}
      transition={getContainerTransition()}
    >
      {/* SVG Ring - always rendered, transitions colors */}
      <svg width={size} height={size} className="donut-chart" viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle - transitions from skeleton gray to variant color */}
        <motion.circle
          className="donut-background-circle"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          animate={{ stroke: isLoading ? '#E5E5E5' : displayStrokeColor }}
          transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        />
        {/* Progress circle - hidden when loading */}
        <motion.circle
          className="donut-progress-circle"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          animate={{
            stroke: displayActiveColor,
            strokeDashoffset: isLoading ? circumference : offset,
            opacity: isLoading ? 0 : 1
          }}
          transition={{ 
            strokeDashoffset: { duration: animationDuration / 1000, ease: isAnimatingTo99 ? 'linear' : EASE_OUT_EXPO },
            stroke: { duration: 0.2, ease: 'easeOut' },
            opacity: { duration: 0.3, ease: 'easeOut' }
          }}
        />
        {/* Inner circle */}
        <motion.circle
          className="donut-inner-circle"
          cx={size / 2}
          cy={size / 2}
          r={innerRingRadius}
          stroke="#FFFFFF"
          strokeWidth={strokeWidth}
          fill={SUCCESS_COLORS.innerFill}
          animate={{ 
            fillOpacity: showSuccessState ? 1 : 0,
            strokeOpacity: isLoading ? 0 : 1
          }}
          transition={{ 
            fillOpacity: { duration: 0.2, ease: 'easeOut' },
            strokeOpacity: { duration: 0.6, ease: EASE_OUT_EXPO }
          }}
        />
      </svg>

      {/* Success checkmark - positioned at center of donut */}
      <motion.div 
        className="donut-success-checkmark"
        initial={{ x: '-50%', y: '-50%', scale: 0 }}
        animate={{
          scale: showCheckmark ? 1 : 0,
          x: '-50%',
          y: '-50%'
        }}
        transition={{ duration: 0.15, ease: EASE_OUT_QUINT }}
        style={{ opacity: showCheckmark ? 1 : 0, pointerEvents: showCheckmark ? 'auto' : 'none' }}
      >
        <CheckmarkIcon />
      </motion.div>

      {/* Skeleton center content */}
      <motion.div
        className="donut-skeleton-center"
        initial={{ x: '-50%', y: '-50%', opacity: isLoading ? 1 : 0, scale: isLoading ? 1 : 0.85 }}
        animate={{ 
          opacity: isLoading ? 1 : 0, 
          scale: isLoading ? 1 : 0.85,
          x: '-50%',
          y: '-50%'
        }}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        style={{ pointerEvents: isLoading ? 'auto' : 'none' }}
      >
        <div className="donut-skeleton donut-skeleton-percentage"></div>
        <div className="donut-skeleton donut-skeleton-label"></div>
      </motion.div>

      {/* Percentage and label */}
      <motion.div 
        className="donut-chart-text"
        initial={{ x: '-50%', y: '-50%', opacity: isLoading ? 0 : 1, scale: isLoading ? 0.85 : 1 }}
        animate={{ 
          opacity: isLoading ? 0 : (showCheckmark ? 0 : (isTextScalingOut ? 0 : 1)), 
          scale: isLoading ? 0.85 : (showCheckmark ? 0.85 : (isTextScalingOut ? 0.85 : 1)),
          x: '-50%',
          y: '-50%'
        }}
        transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
        style={{ pointerEvents: isLoading || showCheckmark ? 'none' : 'auto' }}
      >
            {/* Percentage odometer */}
            <div className="donut-percentage-odometer">
              {/* Tens digit */}
              <div className="odometer-digit-container">
                <div 
                  ref={el => stripRefs.current[0] = el}
                  className="odometer-digit-strip"
                  style={{
                    transform: `translateY(-${(digitPositions[0].offset + TENS_BASE_OFFSET) * DIGIT_HEIGHT}px)`,
                    transition: `transform ${animationDuration}ms ${odometerTiming}`
                  }}
                >
                  {tensDigitStrip.map((num, i) => (
                    <div key={i} className="odometer-digit">
                      {num}
                    </div>
                  ))}
                </div>
              </div>
              {/* Ones digit */}
              <div className="odometer-digit-container">
                <div 
                  ref={el => stripRefs.current[1] = el}
                  className="odometer-digit-strip"
                  style={{
                    transform: `translateY(-${(digitPositions[1].offset + ONES_BASE_OFFSET) * DIGIT_HEIGHT}px)`,
                    transition: `transform ${animationDuration}ms ${odometerTiming}`
                  }}
                >
                  {onesDigitStrip.map((num, i) => (
                    <div key={i} className="odometer-digit">
                      {num}
                    </div>
                  ))}
                </div>
              </div>
              <span className="percentage-symbol">%</span>
            </div>
            
            {/* Label */}
            <div className="donut-label">
              {label}
            </div>
          </motion.div>
    </motion.div>
  )
}

export default DonutChartOdometer
export type { DonutState }
