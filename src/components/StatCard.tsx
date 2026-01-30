import { motion } from 'motion/react'
import './StatCard.css'

interface StatCardProps {
  title: string
  subtitle: string
  footerText?: string
  children?: React.ReactNode
  size?: 'medium' | 'large'
  isLoading?: boolean
  onClick?: () => void
}

function StatCard({ title, subtitle, footerText, children, size = 'medium', isLoading = false, onClick }: StatCardProps) {
  // Always render both skeleton and content to avoid DOM mutations during transition
  return (
    <div className={`stat-card stat-card-${size}`} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <motion.div 
        className="stat-card-content-wrapper"
        animate={{ scale: isLoading ? 0.85 : 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="stat-card-title">
          {/* Always render both, toggle visibility via CSS */}
          <span className={`stat-card-body ${isLoading ? 'hidden' : ''}`}>{title}</span>
          <span className={`stat-card-number ${isLoading ? 'hidden' : ''}`}>{subtitle}</span>
          <div className={`skeleton skeleton-text skeleton-body ${!isLoading ? 'hidden' : ''}`}></div>
          <div className={`skeleton skeleton-text skeleton-number ${!isLoading ? 'hidden' : ''}`}></div>
        </div>
        <div className="stat-card-content">{children}</div>
        {footerText && (
          <div className="stat-card-footer">
            {/* Always render both, toggle visibility via CSS */}
            <span className={`stat-card-info ${isLoading ? 'hidden' : ''}`}>{footerText}</span>
            <div className={`skeleton skeleton-text skeleton-footer ${!isLoading ? 'hidden' : ''}`}></div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export { StatCard }
export type { StatCardProps }
