import { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Lottie from 'lottie-react'
import './CardRecentScans.css'

// Import Lottie animation
import shredderAnimation from '../lottie/shredder.json'

// Import broker logos
import OfficialUSA from '../img/Official-USA.png'
import Anywho from '../img/Anywho.svg'
import BeenVerified from '../img/Been-Verified.svg'
import CheckPeople from '../img/Check-People.svg'
import Clubset from '../img/Clubset.svg'
import CyberBackgroundChecks from '../img/Cyber-Background-Checks.svg'
import IdentityPi from '../img/Identity-Pi.svg'
import Infotracer from '../img/Infotracer.svg'
import Intelius from '../img/Intelius.svg'
import MyLife from '../img/MyLife.svg'
import NeighborReport from '../img/Neighbor-Report.svg'
import NeighborWho from '../img/Neighbor-Who.svg'
import Radaris from '../img/Radaris.svg'
import SelfieNetwork from '../img/Selfie-Network.svg'
import Spokeo from '../img/Spokeo.svg'
import ThatsThem from '../img/Thats-Them.svg'
import Truthfinder from '../img/Truthfinder.svg'
import USATrace from '../img/USA-Trace.svg'
import Verecor from '../img/Verecor.svg'
import Wellnut from '../img/Wellnut.svg'
import YellowPages from '../img/Yellow-Pages.svg'

type CardRecentScansState = 'loading' | 'logos' | 'scanning' | 'removal'

interface CardRecentScansProps {
  state: CardRecentScansState
  scanCount?: number
  removalBroker?: string
  removalRecordCount?: number
  logoColumns?: number
  logoRows?: number
  logoSize?: number
  onDismiss?: () => void
  onClick?: () => void
}

interface Broker {
  id: string
  name: string
  logo: string
}

// Helper function to convert filename to readable name
function formatBrokerName(filename: string): string {
  return filename
    .replace(/\.(png|svg)$/i, '')
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

const ALL_BROKERS: Broker[] = [
  { id: '1', name: formatBrokerName('Official-USA.png'), logo: OfficialUSA },
  { id: '2', name: formatBrokerName('Wellnut.svg'), logo: Wellnut },
  { id: '3', name: formatBrokerName('Anywho.svg'), logo: Anywho },
  { id: '4', name: formatBrokerName('Yellow-Pages.svg'), logo: YellowPages },
  { id: '5', name: formatBrokerName('Been-Verified.svg'), logo: BeenVerified },
  { id: '6', name: formatBrokerName('Verecor.svg'), logo: Verecor },
  { id: '7', name: formatBrokerName('Check-People.svg'), logo: CheckPeople },
  { id: '8', name: formatBrokerName('Clubset.svg'), logo: Clubset },
  { id: '9', name: formatBrokerName('Cyber-Background-Checks.svg'), logo: CyberBackgroundChecks },
  { id: '10', name: formatBrokerName('Identity-Pi.svg'), logo: IdentityPi },
  { id: '11', name: formatBrokerName('Infotracer.svg'), logo: Infotracer },
  { id: '12', name: formatBrokerName('Intelius.svg'), logo: Intelius },
  { id: '13', name: formatBrokerName('MyLife.svg'), logo: MyLife },
  { id: '14', name: formatBrokerName('Neighbor-Report.svg'), logo: NeighborReport },
  { id: '15', name: formatBrokerName('Neighbor-Who.svg'), logo: NeighborWho },
  { id: '16', name: formatBrokerName('Radaris.svg'), logo: Radaris },
  { id: '17', name: formatBrokerName('Selfie-Network.svg'), logo: SelfieNetwork },
  { id: '18', name: formatBrokerName('Spokeo.svg'), logo: Spokeo },
  { id: '19', name: formatBrokerName('Thats-Them.svg'), logo: ThatsThem },
  { id: '20', name: formatBrokerName('Truthfinder.svg'), logo: Truthfinder },
  { id: '21', name: formatBrokerName('USA-Trace.svg'), logo: USATrace },
]

// Transition timing
const easeOut = [0, 0, 0.2, 1] as const
const animationDuration = 0.4

// Generate random delay between min and max (in seconds)
function randomDelay(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function CardRecentScans({
  state,
  scanCount = 6,
  removalBroker = 'Verecor',
  removalRecordCount = 3,
  logoColumns = 8,
  logoRows = 4,
  logoSize = 32,
  onDismiss,
  onClick
}: CardRecentScansProps) {
  // Derived state booleans
  const isLoading = state === 'loading'
  const isLogos = state === 'logos'
  const isScanning = state === 'scanning'
  const isRemoval = state === 'removal'

  // Broker list state - reverse so new items appear at top
  const brokers = ALL_BROKERS.slice(0, scanCount).reverse()
  const [hasOverflow, setHasOverflow] = useState(false)
  const [showContent, setShowContent] = useState(!isLoading && !isLogos)
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set())
  const [animatedItems, setAnimatedItems] = useState<Set<string>>(new Set())
  const [isInitialReveal, setIsInitialReveal] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  // Logo animation configuration
  const logoWaveDelay = 600
  const logoDuration = 3
  const logoHoldDelay = 0.8
  const logoEasingIn = 'cubic-bezier(0.645, 0.045, 0.355, 1)'
  const logoEasingOut = 'cubic-bezier(0.645, 0.045, 0.355, 1)'
  
  // Logo animation state
  const [logoIndices, setLogoIndices] = useState<number[]>([])
  const [logoAnimationPaused, setLogoAnimationPaused] = useState(false)
  const logoStyleRef = useRef<HTMLStyleElement | null>(null)
  const logosInUseRef = useRef<Set<number>>(new Set())

  // All logos as array for the grid
  const LOGO_POOL = [
    OfficialUSA, Anywho, BeenVerified, CheckPeople, Clubset,
    CyberBackgroundChecks, IdentityPi, Infotracer, Intelius, MyLife,
    NeighborReport, NeighborWho, Radaris, SelfieNetwork, Spokeo,
    ThatsThem, Truthfinder, USATrace, Verecor, Wellnut, YellowPages
  ]

  // Calculate logo grid cells
  const logoGridCells = useMemo(() => {
    const containerWidth = 475
    const containerHeight = 204
    const paddingTop = 12
    const paddingLeft = 12
    const paddingRight = 12
    const paddingBottom = 12

    const usableWidth = containerWidth - paddingLeft - paddingRight
    const usableHeight = containerHeight - paddingTop - paddingBottom
    const cellWidth = usableWidth / logoColumns
    const cellHeight = usableHeight / logoRows
    const centerCol = (logoColumns - 1) / 2
    const centerRow = (logoRows - 1) / 2

    const shuffleArray = <T,>(array: T[]): T[] => {
      const shuffled = [...array]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    }

    const shuffledIndices = shuffleArray(LOGO_POOL.map((_, i) => i))
    const cells: { id: string; x: number; y: number; delay: number; logoIndex: number }[] = []

    for (let row = 0; row < logoRows; row++) {
      for (let col = 0; col < logoColumns; col++) {
        const index = row * logoColumns + col
        const x = paddingLeft + col * cellWidth + (cellWidth - logoSize) / 2
        const y = paddingTop + row * cellHeight + (cellHeight - logoSize) / 2
        const distance = Math.sqrt(Math.pow(col - centerCol, 2) + Math.pow(row - centerRow, 2))
        const delay = distance * logoWaveDelay

        cells.push({
          id: `logo-cell-${row}-${col}`,
          x,
          y,
          delay,
          logoIndex: shuffledIndices[index % shuffledIndices.length]
        })
      }
    }

    return cells
  }, [logoColumns, logoRows, logoSize])

  // Initialize logo indices when entering logos state, pause animation when exiting
  useEffect(() => {
    if (isLogos) {
      const indices = logoGridCells.map(cell => cell.logoIndex)
      setLogoIndices(indices)
      logosInUseRef.current = new Set(indices)
      setLogoAnimationPaused(false)
    } else {
      // Pause animation when exiting so logos freeze during fade out
      setLogoAnimationPaused(true)
    }
  }, [isLogos, logoGridCells])

  // Create and inject keyframes for logo animation
  useEffect(() => {
    if (isLogos && !logoStyleRef.current) {
      const totalCycle = logoDuration + logoHoldDelay
      const peakPercent = (logoDuration / totalCycle) * 50
      const endAnimPercent = (logoDuration / totalCycle) * 100

      const style = document.createElement('style')
      style.textContent = `
        @keyframes card-logo-ripple {
          0% { 
            transform: scale(0); 
            animation-timing-function: ${logoEasingIn}; 
          }
          ${peakPercent}% { 
            transform: scale(1); 
            animation-timing-function: ${logoEasingOut}; 
          }
          ${endAnimPercent}% { 
            transform: scale(0); 
          }
          100% { 
            transform: scale(0); 
          }
        }
      `
      document.head.appendChild(style)
      logoStyleRef.current = style
    }
  }, [isLogos])

  // Clean up keyframes only on unmount
  useEffect(() => {
    return () => {
      if (logoStyleRef.current) {
        logoStyleRef.current.remove()
        logoStyleRef.current = null
      }
    }
  }, [])

  // Handle logo swap on animation iteration
  const handleLogoAnimationIteration = useCallback((cellIndex: number) => {
    setLogoIndices(prev => {
      const newIndices = [...prev]
      const currentIndex = newIndices[cellIndex]
      logosInUseRef.current.delete(currentIndex)
      
      const available = LOGO_POOL.map((_, i) => i).filter(i => i !== currentIndex && !logosInUseRef.current.has(i))
      const newLogoIndex = available.length > 0 
        ? available[Math.floor(Math.random() * available.length)]
        : LOGO_POOL.map((_, i) => i).filter(i => i !== currentIndex)[Math.floor(Math.random() * (LOGO_POOL.length - 1))]
      
      logosInUseRef.current.add(newLogoIndex)
      newIndices[cellIndex] = newLogoIndex
      return newIndices
    })
  }, [])

  const logoTotalCycle = logoDuration + logoHoldDelay

  // Calculate how many skeleton items fit in the container
  const skeletonItemHeight = 36 // 24px row + 12px gap
  const containerHeight = 204
  const maxSkeletonItems = Math.floor(containerHeight / skeletonItemHeight)

  // Track previous state for transitions
  const prevStateRef = useRef(state)

  // Handle state transitions
  useEffect(() => {
    const prevState = prevStateRef.current
    prevStateRef.current = state

    if (isLoading || isLogos) {
      // In loading or logos state - hide broker content
      setShowContent(false)
      setVisibleItems(new Set())
      setAnimatedItems(new Set())
      setIsInitialReveal(false)
      // Clear any pending timers
      timersRef.current.forEach(t => clearTimeout(t))
      timersRef.current = []
    } else if ((prevState === 'loading' || prevState === 'logos') && isScanning) {
      // Transitioning to scanning - start revealing items with random delays
      setShowContent(true)
      setIsInitialReveal(true)
      
      // Add items one at a time with randomized delays
      // Reveal from bottom to top so each new item appears at the top
      let cumulativeDelay = 0
      const itemsToReveal = ALL_BROKERS.slice(0, scanCount).reverse()
      // Reverse again to reveal from bottom to top
      const revealOrder = [...itemsToReveal].reverse()
      
      revealOrder.forEach((broker, index) => {
        // First item appears immediately, subsequent items have random delays
        if (index > 0) {
          cumulativeDelay += randomDelay(animationDuration, animationDuration * 2)
        }
        
        const timer = setTimeout(() => {
          setVisibleItems(prev => new Set([...prev, broker.id]))
        }, cumulativeDelay * 1000)
        
        timersRef.current.push(timer)
      })
      
      // Mark initial reveal complete after all items are shown
      const totalRevealTime = cumulativeDelay + animationDuration
      const completeTimer = setTimeout(() => {
        setIsInitialReveal(false)
        setAnimatedItems(new Set(itemsToReveal.map(b => b.id)))
      }, totalRevealTime * 1000 + 100)
      timersRef.current.push(completeTimer)
    } else if (isScanning) {
      setShowContent(true)
      // Not coming from loading/logos, show all items immediately
      setVisibleItems(new Set(brokers.map(b => b.id)))
    }
    
    return () => {
      timersRef.current.forEach(t => clearTimeout(t))
      timersRef.current = []
    }
  }, [state, scanCount])

  // Sync visibleItems and animatedItems when scanCount changes (not during initial reveal)
  useEffect(() => {
    if (showContent && !isLoading && !isLogos && !isInitialReveal) {
      const currentIds = new Set(brokers.map(b => b.id))
      
      // Update visible items
      setVisibleItems(prev => {
        const next = new Set<string>()
        // Keep existing visible items that are still in the list
        prev.forEach(id => {
          if (currentIds.has(id)) {
            next.add(id)
          }
        })
        // Add any new items
        currentIds.forEach(id => next.add(id))
        return next
      })
      
      // Clean up removed items from animatedItems
      setAnimatedItems(prev => {
        const next = new Set<string>()
        prev.forEach(id => {
          if (currentIds.has(id)) {
            next.add(id)
          }
        })
        return next
      })
    }
  }, [showContent, isLoading, isLogos, isInitialReveal, brokers])

  // Mark new items as animated after they appear (for incremental adds)
  useEffect(() => {
    if (showContent && !isLoading && !isLogos && !isInitialReveal) {
      const visibleIds = [...visibleItems]
      const newIds = visibleIds.filter(id => !animatedItems.has(id))
      
      if (newIds.length > 0) {
        const timer = setTimeout(() => {
          setAnimatedItems(prev => {
            const next = new Set(prev)
            newIds.forEach(id => next.add(id))
            return next
          })
        }, animationDuration * 1000 + 100)
        return () => clearTimeout(timer)
      }
    }
  }, [showContent, isLoading, isLogos, isInitialReveal, visibleItems, animatedItems])

  // Check for overflow to show/hide fade
  useLayoutEffect(() => {
    if (isLoading || isLogos || !showContent) {
      setHasOverflow(false)
      return
    }

    const checkOverflow = () => {
      if (containerRef.current) {
        const { scrollHeight, clientHeight } = containerRef.current
        const hasScroll = scrollHeight > clientHeight + 1
        setHasOverflow(prev => prev !== hasScroll ? hasScroll : prev)
      }
    }

    // Use ResizeObserver for reliable detection
    const container = containerRef.current
    let resizeObserver: ResizeObserver | null = null
    
    if (container) {
      resizeObserver = new ResizeObserver(() => {
        checkOverflow()
      })
      resizeObserver.observe(container)
    }

    // Check frequently during animations
    const timeouts = [
      setTimeout(checkOverflow, 50),
      setTimeout(checkOverflow, 100),
      setTimeout(checkOverflow, 200),
      setTimeout(checkOverflow, 300),
      setTimeout(checkOverflow, 500),
      setTimeout(checkOverflow, 1000),
      setTimeout(checkOverflow, 2000),
    ]

    return () => {
      timeouts.forEach(t => clearTimeout(t))
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [isLoading, isLogos, showContent, scanCount, visibleItems.size])

  // Show fade when not loading/logos and either overflow detected or enough items to cause overflow
  // Each row is ~36px (24px + 12px gap), container is ~200px, so ~5 items fit
  const likelyOverflow = visibleItems.size > 5
  const showFade = !isLoading && !isLogos && showContent && (hasOverflow || likelyOverflow)


  return (
    <div 
      className="card-recent-scans"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading-content"
            className="card-recent-scans-wrapper"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 0.85, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Title Section - Skeleton */}
            <div className="card-recent-scans-title">
              <div className="skeleton skeleton-text skeleton-body" />
              <div className="skeleton skeleton-text skeleton-number" />
            </div>

            {/* Content Section - Skeletons */}
            <div className="card-recent-scans-content">
              <div ref={containerRef} className="broker-list-container">
                <div className="broker-list">
                  <div className="skeleton-container">
                    {Array.from({ length: Math.min(scanCount, maxSkeletonItems) }).map((_, index) => (
                      <div key={`skeleton-${index}`} className="broker-row">
                        <div className="skeleton skeleton-logo"></div>
                        <div className="skeleton skeleton-name"></div>
                        <div className="skeleton skeleton-icon"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Section - Skeleton */}
            <div className="card-recent-scans-footer">
              <div className="skeleton skeleton-text skeleton-footer" />
            </div>
          </motion.div>
        )}

        {(isLogos || isScanning) && (
          <motion.div
            key="active-content"
            className="card-recent-scans-wrapper"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Title Section - Static for logos and scanning */}
            <div className="card-recent-scans-title">
              <span className="card-recent-scans-body">Scan activity</span>
              <span className="card-recent-scans-number">Recent scans</span>
            </div>

            {/* Content Section - Transitions between logos and broker list */}
            <div className={`card-recent-scans-content ${showFade ? 'has-overflow' : ''}`}>
              <AnimatePresence mode="wait">
                {isLogos ? (
                  <motion.div
                    key="logo-grid-content"
                    className="logo-grid-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  >
                    <div className="logo-grid" style={{ position: 'relative', width: '100%', height: '100%' }}>
                      {logoGridCells.map((cell, index) => (
                        <img
                          key={cell.id}
                          src={LOGO_POOL[logoIndices[index] ?? cell.logoIndex]}
                          alt=""
                          className="logo-grid-item"
                          style={{
                            width: logoSize,
                            height: logoSize,
                            left: cell.x,
                            top: cell.y,
                            animation: `card-logo-ripple ${logoTotalCycle}s linear infinite`,
                            animationDelay: `${cell.delay}ms`,
                            animationPlayState: logoAnimationPaused ? 'paused' : 'running'
                          }}
                          onAnimationIteration={() => handleLogoAnimationIteration(index)}
                        />
                      ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="broker-list-content"
                    className="broker-list-container"
                    ref={containerRef}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <div className="broker-list">
                      {/* Broker list - items appear at top and push others down */}
                      {showContent && (
                        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <AnimatePresence initial={false} mode="popLayout">
                            {brokers.filter(broker => visibleItems.has(broker.id)).map((broker) => (
                              <motion.div
                                key={broker.id}
                                className="broker-row-wrapper"
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{
                                  opacity: { 
                                    duration: animationDuration, 
                                    ease: easeOut
                                  },
                                  layout: { 
                                    duration: animationDuration, 
                                    ease: easeOut
                                  }
                                }}
                              >
                                <div className="broker-row">
                                  <motion.div 
                                    className="broker-logo"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={{ 
                                      duration: animationDuration, 
                                      ease: easeOut
                                    }}
                                  >
                                    <img src={broker.logo} alt={broker.name} className="broker-logo-img" />
                                  </motion.div>
                                  <motion.span 
                                    className="broker-name"
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    style={{ transformOrigin: 'left' }}
                                    transition={{ 
                                      duration: animationDuration, 
                                      ease: easeOut
                                    }}
                                  >
                                    {broker.name}
                                  </motion.span>
                                  <motion.div 
                                    className="broker-icon"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={{ 
                                      duration: animationDuration, 
                                      ease: easeOut
                                    }}
                                  >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M20.7733 6.71244C21.0701 7.00128 21.0767 7.47611 20.7878 7.773L11.6731 17.1416C10.6424 18.201 8.94076 18.201 7.91012 17.1416L3.21268 12.3133C2.92384 12.0164 2.93036 11.5416 3.22725 11.2528C3.52414 10.9639 3.99897 10.9705 4.28781 11.2673L8.98525 16.0957C9.42696 16.5497 10.1562 16.5497 10.5979 16.0957L19.7127 6.727C20.0015 6.43012 20.4764 6.42359 20.7733 6.71244Z" fill="black" fillOpacity="0.84"/>
                                    </svg>
                                  </motion.div>
                                </div>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer Section - Static for logos and scanning */}
            <div className="card-recent-scans-footer">
              <span className="card-recent-scans-info">
                A scan takes around 5 mins depending on how much info you provide
              </span>
            </div>
          </motion.div>
        )}

        {isRemoval && (
          <motion.div
            key="removal-content"
            className="card-recent-scans-removal"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Lottie animation */}
            <div className="removal-lottie-container">
              <Lottie 
                animationData={shredderAnimation}
                loop={true}
                autoplay={true}
                style={{ width: 234, height: 234 }}
              />
            </div>
            
            {/* Text content */}
            <div className="removal-text-container">
              <h2 className="removal-title">
                Great news!{'\n'}Your info has been removed from {removalBroker}.
              </h2>
              <p className="removal-description">
                We can verify that {removalRecordCount} record{removalRecordCount !== 1 ? 's' : ''} about you {removalRecordCount !== 1 ? 'have' : 'has'} been removed from {removalBroker}'s site. We will continue to monitor this site for you.
              </p>
            </div>
            
            {/* Dismiss button */}
            <button 
              className="removal-dismiss-button"
              onClick={(e) => {
                e.stopPropagation()
                onDismiss?.()
              }}
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { CardRecentScans }
export type { CardRecentScansProps, CardRecentScansState }
