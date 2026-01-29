import { useState, useEffect, useRef, useCallback } from 'react'
import './DonutChartOdometer.css'

interface DonutChartOdometerProps {
  percentage: number
  variant: 'blue' | 'green'
  label?: string
  isLoading?: boolean
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
// so that offset + BASE_OFFSET lands on the correct digit
const ONES_BASE_OFFSET = 110  // strip[110] = 0, allows ±100 movement
const TENS_BASE_OFFSET = 10   // strip[10] = 0, allows ±10 movement

// Animation timing constants
const MIN_DURATION = 600   // Minimum animation duration in ms (increased from 300)
const MAX_DURATION = 2400  // Maximum animation duration in ms (increased from 1200)
const MS_PER_POINT = 25    // Additional ms per percentage point of change (increased from 15)

function calculateAnimationDuration(
  delta: number, 
  targetPercentage: number, 
  defaultSpeedMultiplier: number = 0.5,
  completeSpeedMultiplier: number = 0.2
): number {
  const absDelta = Math.abs(delta)
  let duration = MIN_DURATION + (absDelta * MS_PER_POINT)
  
  // Apply speed multiplier based on target percentage
  if (targetPercentage === 100) {
    duration = duration * completeSpeedMultiplier
  } else {
    duration = duration * defaultSpeedMultiplier
  }
  
  return Math.min(duration, MAX_DURATION)
}

function DonutChartOdometer({ 
  percentage, 
  variant, 
  label = 'Text info', 
  isLoading = false,
  defaultSpeedMultiplier = 0.5,
  completeSpeedMultiplier = 0.2
}: DonutChartOdometerProps) {
  const size = 169
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  // Inner white ring specifications from Figma
  const innerRingSize = 149
  const innerRingRadius = (innerRingSize - strokeWidth) / 2

  // Track success transition state
  const [showSuccessState, setShowSuccessState] = useState(false)
  const [isContracting, setIsContracting] = useState(false)
  const [isExpanding, setIsExpanding] = useState(false)
  const [isTextScalingOut, setIsTextScalingOut] = useState(false)
  const [showCheckmark, setShowCheckmark] = useState(false)
  const successTransitionTimerRef = useRef<number | null>(null)
  const textFadeTimerRef = useRef<number | null>(null)

  // Detect when we've reached 100%
  const isComplete = percentage === 100

  // Original variant colors (used before success transition)
  const strokeColor = variant === 'blue' ? '#A1D0F7' : '#CFEBDA'
  const activeColor = variant === 'blue' ? '#1074CC' : '#589D88'
  const innerFillColor = variant === 'blue' ? '#E8F4FD' : '#CFEBDA' // Light fill for inner circle
  
  // Display colors transition to success after ring completes
  const displayStrokeColor = showSuccessState ? SUCCESS_COLORS.outerStroke : strokeColor
  const displayActiveColor = showSuccessState ? SUCCESS_COLORS.outerStroke : activeColor
  const displayInnerFill = showSuccessState ? SUCCESS_COLORS.innerFill : innerFillColor

  // Track digit positions for proper odometer animation
  // Cap display at 99 even when percentage is 100
  const [digitPositions, setDigitPositions] = useState<DigitPosition[]>(() => {
    const displayValue = Math.min(percentage, 99)
    const digits = displayValue.toString().padStart(2, '0').split('').map(Number)
    return digits.map(value => ({ value, offset: value, isAnimating: false }))
  })
  // Track animation duration based on delta - stored in ref to update synchronously
  const animationDurationRef = useRef(MIN_DURATION)
  const previousPercentageRef = useRef(percentage)
  const isInitialMountRef = useRef(true)
  const stripRefs = useRef<(HTMLDivElement | null)[]>([])
  
  // Calculate animation duration synchronously during render
  if (!isInitialMountRef.current && previousPercentageRef.current !== percentage) {
    const delta = percentage - previousPercentageRef.current
    animationDurationRef.current = calculateAnimationDuration(
      delta, 
      percentage, 
      defaultSpeedMultiplier, 
      completeSpeedMultiplier
    )
  }
  
  const animationDuration = animationDurationRef.current

  // Normalize offsets after animation completes to prevent unbounded growth
  const normalizeOffsets = useCallback(() => {
    setDigitPositions(prev => {
      // Cap at 99 for display
      const displayValue = Math.min(percentage, 99)
      const digits = displayValue.toString().padStart(2, '0').split('').map(Number)
      return [
        { value: digits[0], offset: digits[0], isAnimating: false },
        { value: digits[1], offset: digits[1], isAnimating: false }
      ]
    })
  }, [percentage])

  useEffect(() => {
    // Skip animation on initial mount
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false
      return
    }

    // Skip if percentage hasn't changed
    if (previousPercentageRef.current === percentage) {
      return
    }

    const prevValue = previousPercentageRef.current
    const newValue = percentage
    // Use the ring's animation duration (calculated from full delta including 100%)
    // This ensures odometer and ring finish together
    const duration = animationDurationRef.current

    // For odometer display: cap at 99% even when percentage is 100%
    // This keeps the odometer at 99 while the ring completes to 100%
    const displayValue = Math.min(newValue, 99)
    const prevDisplayValue = Math.min(prevValue, 99)
    
    // Skip odometer animation if both display values are the same (e.g., going from 99 to 100)
    if (displayValue === prevDisplayValue) {
      previousPercentageRef.current = newValue
      return
    }

    // Calculate digit rotations based on mechanical odometer behavior:
    // - Ones digit rotates by the total value change
    // - Tens digit rotates by how many times we cross a tens boundary
    const newDigits = displayValue.toString().padStart(2, '0').split('').map(Number)
    const displayDelta = displayValue - prevDisplayValue
    
    // Ones digit (index 1): rotates once per unit change
    const onesDelta = displayDelta
    
    // Tens digit (index 0): rotates once per 10 units
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

    // Normalize offsets after animation completes
    const timer = setTimeout(() => {
      // Temporarily disable transition, reset offsets, then re-enable
      stripRefs.current.forEach(ref => {
        if (ref) ref.style.transition = 'none'
      })
      
      normalizeOffsets()
      
      // Re-enable transition after a frame
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          stripRefs.current.forEach(ref => {
            if (ref) ref.style.transition = ''
          })
        })
      })
    }, duration + 50)

    return () => clearTimeout(timer)
  }, [percentage, digitPositions, normalizeOffsets])

  // Handle success transition
  // Text fades before 99%, Phase 2 starts slightly before Phase 1 ends
  const TEXT_FADE_DURATION = 300 // matches CSS transition duration
  const PHASE_OVERLAP = 100 // ms of overlap between phases
  
  useEffect(() => {
    // Clear any existing timers
    if (successTransitionTimerRef.current) {
      clearTimeout(successTransitionTimerRef.current)
      successTransitionTimerRef.current = null
    }
    if (textFadeTimerRef.current) {
      clearTimeout(textFadeTimerRef.current)
      textFadeTimerRef.current = null
    }

    if (isComplete) {
      // Start text fade 300ms before animation ends (so it's faded before 99%)
      const textFadeStart = Math.max(0, animationDuration - TEXT_FADE_DURATION)
      textFadeTimerRef.current = window.setTimeout(() => {
        setIsTextScalingOut(true)
      }, textFadeStart)

      // Phase 2 starts slightly before Phase 1 ends (overlap)
      const phase2Start = Math.max(0, animationDuration - PHASE_OVERLAP)
      successTransitionTimerRef.current = window.setTimeout(() => {
        // Color changes to green + donut contracts
        setShowSuccessState(true)
        setIsContracting(true)
        
        // After contraction completes, expand with checkmark
        setTimeout(() => {
          setIsContracting(false)
          setShowCheckmark(true)
          setIsExpanding(true)
          
          // Reset expand after animation completes
          setTimeout(() => {
            setIsExpanding(false)
          }, 150)
        }, 200)
        
      }, phase2Start) // Phase 2 starts 100ms before ring animation ends
    } else {
      // Reset all states if we go below 100%
      setShowSuccessState(false)
      setIsContracting(false)
      setIsExpanding(false)
      setShowCheckmark(false)
      setIsTextScalingOut(false)
    }

    return () => {
      if (successTransitionTimerRef.current) {
        clearTimeout(successTransitionTimerRef.current)
      }
      if (textFadeTimerRef.current) {
        clearTimeout(textFadeTimerRef.current)
      }
    }
  }, [isComplete, animationDuration])

  // Tens digit strip: 30 digits (3 repetitions) - tens digit only moves 0-10
  const tensDigitStrip = Array.from({ length: 30 }, (_, i) => i % 10)
  
  // Ones digit strip: 220 digits (22 repetitions) - ones digit can rotate up to 100 times
  const onesDigitStrip = Array.from({ length: 220 }, (_, i) => i % 10)

  // Use linear timing when animating to 99% (no ease-out), otherwise use smooth easing
  // This ensures odometer and ring finish together when going to 100%
  const isAnimatingTo99 = percentage >= 99 && !showSuccessState
  const odometerTiming = isAnimatingTo99 ? 'linear' : 'cubic-bezier(0.22, 1, 0.36, 1)'
  const ringTiming = isAnimatingTo99 ? 'linear' : 'cubic-bezier(0.22, 1, 0.36, 1)'

  return (
    <div className={`donut-chart-container ${isContracting ? 'contracting' : ''} ${isExpanding ? 'expanding' : ''}`}>
      {/* Loaded content */}
      <div className={`donut-content-wrapper loaded-content ${!isLoading ? 'visible' : ''}`}>
        <svg width={size} height={size} className="donut-chart" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            className="donut-background-circle"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={displayStrokeColor}
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            className="donut-progress-circle"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={displayActiveColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{
              transition: `stroke-dashoffset ${animationDuration}ms ${ringTiming}, stroke 200ms ease-out`
            }}
          />
          {/* Inner circle - white ring in progress, filled in success */}
          <circle
            className="donut-inner-circle"
            cx={size / 2}
            cy={size / 2}
            r={innerRingRadius}
            fill={displayInnerFill}
            stroke="#FFFFFF"
            strokeWidth={strokeWidth}
          />
        </svg>
        <div className="donut-chart-text">
          {/* Percentage odometer - starts scaling out at threshold, fully hidden when success state activates */}
          <div className={`donut-percentage-odometer ${isTextScalingOut && !showSuccessState ? 'scaling-out' : ''} ${showSuccessState ? 'hidden' : ''}`}>
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
          
          {/* Success checkmark - shown after contraction completes */}
          <div className={`donut-success-checkmark ${showCheckmark ? 'visible' : ''}`}>
            <CheckmarkIcon />
          </div>
          
          {/* Label - hidden when text starts scaling out or success state is active */}
          <div className={`donut-label ${isTextScalingOut || showSuccessState ? 'hidden' : ''}`}>{label}</div>
        </div>
      </div>

      {/* Loading content */}
      <div className={`donut-content-wrapper loading-content ${isLoading ? 'visible' : ''}`}>
        <div className="donut-skeleton-ring"></div>
        <div className="donut-skeleton-center">
          <div className="donut-skeleton donut-skeleton-percentage"></div>
          <div className="donut-skeleton donut-skeleton-label"></div>
        </div>
      </div>
    </div>
  )
}

export default DonutChartOdometer
