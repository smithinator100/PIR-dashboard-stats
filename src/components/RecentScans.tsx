import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import './RecentScans.css'

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

interface Broker {
  id: string
  name: string
  logo: string
}

interface RecentScansProps {
  scanCount: number
  isLoading?: boolean
  animationDelay?: number // delay between each item in ms (used for incremental adds)
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
  { id: '2', name: formatBrokerName('Anywho.svg'), logo: Anywho },
  { id: '3', name: formatBrokerName('Been-Verified.svg'), logo: BeenVerified },
  { id: '4', name: formatBrokerName('Check-People.svg'), logo: CheckPeople },
  { id: '5', name: formatBrokerName('Clubset.svg'), logo: Clubset },
  { id: '6', name: formatBrokerName('Cyber-Background-Checks.svg'), logo: CyberBackgroundChecks },
  { id: '7', name: formatBrokerName('Identity-Pi.svg'), logo: IdentityPi },
  { id: '8', name: formatBrokerName('Infotracer.svg'), logo: Infotracer },
  { id: '9', name: formatBrokerName('Intelius.svg'), logo: Intelius },
  { id: '10', name: formatBrokerName('MyLife.svg'), logo: MyLife },
  { id: '11', name: formatBrokerName('Neighbor-Report.svg'), logo: NeighborReport },
  { id: '12', name: formatBrokerName('Neighbor-Who.svg'), logo: NeighborWho },
  { id: '13', name: formatBrokerName('Radaris.svg'), logo: Radaris },
  { id: '14', name: formatBrokerName('Selfie-Network.svg'), logo: SelfieNetwork },
  { id: '15', name: formatBrokerName('Spokeo.svg'), logo: Spokeo },
  { id: '16', name: formatBrokerName('Thats-Them.svg'), logo: ThatsThem },
  { id: '17', name: formatBrokerName('Truthfinder.svg'), logo: Truthfinder },
  { id: '18', name: formatBrokerName('USA-Trace.svg'), logo: USATrace },
  { id: '19', name: formatBrokerName('Verecor.svg'), logo: Verecor },
  { id: '20', name: formatBrokerName('Wellnut.svg'), logo: Wellnut },
  { id: '21', name: formatBrokerName('Yellow-Pages.svg'), logo: YellowPages },
]

// Transition timing
const easeOut = [0, 0, 0.2, 1] as const
const animationDuration = 0.4

// Generate random delay between min and max (in seconds)
function randomDelay(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function RecentScans({ scanCount, isLoading = false }: RecentScansProps) {
  // Reverse the array so new items appear at the top
  const brokers = ALL_BROKERS.slice(0, scanCount).reverse()
  const [hasOverflow, setHasOverflow] = useState(false)
  const [showContent, setShowContent] = useState(!isLoading)
  const [visibleItems, setVisibleItems] = useState<Set<string>>(new Set())
  const [animatedItems, setAnimatedItems] = useState<Set<string>>(new Set())
  const [isInitialReveal, setIsInitialReveal] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const prevLoadingRef = useRef(isLoading)
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([])

  // Calculate how many skeleton items fit in the container
  const skeletonItemHeight = 36 // 24px row + 12px gap
  const containerHeight = 150
  const maxSkeletonItems = Math.floor(containerHeight / skeletonItemHeight)

  // Handle loading state transitions
  useEffect(() => {
    const wasLoading = prevLoadingRef.current
    prevLoadingRef.current = isLoading

    if (isLoading) {
      setShowContent(false)
      setVisibleItems(new Set())
      setAnimatedItems(new Set())
      setIsInitialReveal(false)
      // Clear any pending timers
      timersRef.current.forEach(t => clearTimeout(t))
      timersRef.current = []
    } else if (wasLoading && !isLoading) {
      // Just finished loading - start revealing items with random delays
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
        // Min delay = animationDuration, Max delay = animationDuration * 2
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
    } else {
      setShowContent(true)
      // Not coming from loading, show all items immediately
      setVisibleItems(new Set(brokers.map(b => b.id)))
    }
    
    return () => {
      timersRef.current.forEach(t => clearTimeout(t))
      timersRef.current = []
    }
  }, [isLoading, scanCount])

  // Sync visibleItems and animatedItems when scanCount changes (not during initial reveal)
  useEffect(() => {
    if (showContent && !isLoading && !isInitialReveal) {
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
  }, [showContent, isLoading, isInitialReveal, brokers])

  // Mark new items as animated after they appear (for incremental adds)
  useEffect(() => {
    if (showContent && !isLoading && !isInitialReveal) {
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
  }, [showContent, isLoading, isInitialReveal, visibleItems, animatedItems])

  // Check for overflow to show/hide fade
  useLayoutEffect(() => {
    if (isLoading || !showContent) {
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

    // Check after animations complete
    const timeouts = [
      setTimeout(checkOverflow, 100),
      setTimeout(checkOverflow, 500),
      setTimeout(checkOverflow, 2000),
      setTimeout(checkOverflow, 4000), // After all staggered animations complete
    ]

    return () => {
      timeouts.forEach(t => clearTimeout(t))
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [isLoading, showContent, scanCount])

  const showFade = !isLoading && showContent

  return (
    <div className={`recent-scans ${showFade && hasOverflow ? 'has-overflow' : ''} ${showFade && !hasOverflow ? 'no-overflow' : ''}`}>
      <div ref={containerRef} className="recent-scans-container">
        <div className="broker-list">
          {/* Skeletons - fade out while content appears */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                key="skeletons"
                className="skeleton-container"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                {Array.from({ length: Math.min(scanCount, maxSkeletonItems) }).map((_, index) => (
                  <div key={`skeleton-${index}`} className="broker-row">
                    <div className="broker-logo">
                      <div className="skeleton skeleton-logo"></div>
                    </div>
                    <div className="skeleton skeleton-name"></div>
                    <div className="broker-icon">
                      <div className="skeleton skeleton-icon"></div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Broker list - items appear one at a time */}
          {showContent && !isLoading && (
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
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.3337 4L6.00033 11.3333L2.66699 8" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </motion.div>
                      </div>
                      </motion.div>
                    )
                  )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export { RecentScans }
export type { RecentScansProps }
