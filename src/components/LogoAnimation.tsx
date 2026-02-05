import { useEffect, useMemo, useRef, useCallback, useState } from 'react'
import './LogoAnimation.css'

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

// All available logos for the animation pool
const LOGOS = [
  OfficialUSA, Anywho, BeenVerified, CheckPeople, Clubset,
  CyberBackgroundChecks, IdentityPi, Infotracer, Intelius, MyLife,
  NeighborReport, NeighborWho, Radaris, SelfieNetwork, Spokeo,
  ThatsThem, Truthfinder, USATrace, Verecor, Wellnut, YellowPages
]

// Easing function CSS values
const EASING_FUNCTIONS: Record<string, string> = {
  'linear': 'linear',
  'quad-in': 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
  'quad-out': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  'quad-in-out': 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
  'cubic-in': 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  'cubic-out': 'cubic-bezier(0.215, 0.61, 0.355, 1)',
  'cubic-in-out': 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  'quart-in': 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
  'quart-out': 'cubic-bezier(0.165, 0.84, 0.44, 1)',
  'quart-in-out': 'cubic-bezier(0.77, 0, 0.175, 1)',
  'expo-in': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
  'expo-out': 'cubic-bezier(0.19, 1, 0.22, 1)',
  'expo-in-out': 'cubic-bezier(1, 0, 0, 1)',
  'back-in': 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',
  'back-out': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  'back-in-out': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
}

interface LogoAnimationProps {
  columns?: number
  rows?: number
  logoSize?: number
  waveDelay?: number
  duration?: number
  holdDelay?: number
  easingIn?: string
  easingOut?: string
}

interface LogoCell {
  id: string
  col: number
  row: number
  x: number
  y: number
  delay: number
  logoIndex: number
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function getRandomLogoIndex(exclude: number, inUse: Set<number>): number {
  const available = LOGOS.map((_, i) => i).filter(i => i !== exclude && !inUse.has(i))
  if (available.length === 0) {
    const fallback = LOGOS.map((_, i) => i).filter(i => i !== exclude)
    return fallback[Math.floor(Math.random() * fallback.length)]
  }
  return available[Math.floor(Math.random() * available.length)]
}

function LogoAnimation({
  columns = 7,
  rows = 4,
  logoSize = 24,
  waveDelay = 600,
  duration = 3,
  holdDelay = 0.8,
  easingIn = 'cubic-in-out',
  easingOut = 'cubic-in-out'
}: LogoAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const styleRef = useRef<HTMLStyleElement | null>(null)
  const [logoIndices, setLogoIndices] = useState<number[]>([])
  const logosInUseRef = useRef<Set<number>>(new Set())
  
  // Container dimensions
  const containerWidth = 360
  const containerHeight = 252
  const paddingTop = 24
  const paddingLeft = 24
  const paddingRight = 24
  const paddingBottom = 24

  // Calculate grid layout
  const cells = useMemo(() => {
    const usableWidth = containerWidth - paddingLeft - paddingRight
    const usableHeight = containerHeight - paddingTop - paddingBottom
    const cellWidth = usableWidth / columns
    const cellHeight = usableHeight / rows
    const centerCol = (columns - 1) / 2
    const centerRow = (rows - 1) / 2

    const result: LogoCell[] = []
    const shuffledIndices = shuffleArray(LOGOS.map((_, i) => i))

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < columns; col++) {
        const index = row * columns + col
        const x = paddingLeft + col * cellWidth + (cellWidth - logoSize) / 2
        const y = paddingTop + row * cellHeight + (cellHeight - logoSize) / 2
        const distance = Math.sqrt(Math.pow(col - centerCol, 2) + Math.pow(row - centerRow, 2))
        const delay = distance * waveDelay

        result.push({
          id: `logo-${row}-${col}`,
          col,
          row,
          x,
          y,
          delay,
          logoIndex: shuffledIndices[index % shuffledIndices.length]
        })
      }
    }

    return result
  }, [columns, rows, logoSize, waveDelay])

  // Initialize logo indices
  useEffect(() => {
    const indices = cells.map(cell => cell.logoIndex)
    setLogoIndices(indices)
    logosInUseRef.current = new Set(indices)
  }, [cells])

  // Create and inject keyframes
  useEffect(() => {
    // Remove old stylesheet
    if (styleRef.current) {
      styleRef.current.remove()
    }

    const easingInValue = EASING_FUNCTIONS[easingIn] || EASING_FUNCTIONS['cubic-in-out']
    const easingOutValue = EASING_FUNCTIONS[easingOut] || EASING_FUNCTIONS['cubic-in-out']
    const totalCycle = duration + holdDelay
    const peakPercent = (duration / totalCycle) * 50
    const endAnimPercent = (duration / totalCycle) * 100

    const style = document.createElement('style')
    style.textContent = `
      @keyframes logo-ripple {
        0% { 
          transform: scale(0); 
          animation-timing-function: ${easingInValue}; 
        }
        ${peakPercent}% { 
          transform: scale(1); 
          animation-timing-function: ${easingOutValue}; 
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
    styleRef.current = style

    return () => {
      if (styleRef.current) {
        styleRef.current.remove()
        styleRef.current = null
      }
    }
  }, [duration, holdDelay, easingIn, easingOut])

  // Handle logo swap on animation iteration
  const handleAnimationIteration = useCallback((cellIndex: number) => {
    setLogoIndices(prev => {
      const newIndices = [...prev]
      const currentIndex = newIndices[cellIndex]
      logosInUseRef.current.delete(currentIndex)
      const newLogoIndex = getRandomLogoIndex(currentIndex, logosInUseRef.current)
      logosInUseRef.current.add(newLogoIndex)
      newIndices[cellIndex] = newLogoIndex
      return newIndices
    })
  }, [])

  const totalCycle = duration + holdDelay

  return (
    <div className="logo-animation-container" ref={containerRef}>
      <div 
        className="logo-animation-grid"
        style={{ 
          width: containerWidth, 
          height: containerHeight 
        }}
      >
        {cells.map((cell, index) => (
          <img
            key={cell.id}
            src={LOGOS[logoIndices[index] ?? cell.logoIndex]}
            alt=""
            className="logo-animation-item"
            style={{
              width: logoSize,
              height: logoSize,
              left: cell.x,
              top: cell.y,
              animation: `logo-ripple ${totalCycle}s linear infinite`,
              animationDelay: `${cell.delay}ms`
            }}
            onAnimationIteration={() => handleAnimationIteration(index)}
          />
        ))}
      </div>
    </div>
  )
}

export { LogoAnimation }
export type { LogoAnimationProps }
