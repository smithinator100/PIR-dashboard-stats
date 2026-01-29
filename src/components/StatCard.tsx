import './StatCard.css'

interface StatCardProps {
  title: string
  subtitle: string
  footerText?: string
  children?: React.ReactNode
  size?: 'medium' | 'large'
  isLoading?: boolean
}

function StatCard({ title, subtitle, footerText, children, size = 'medium', isLoading = false }: StatCardProps) {
  return (
    <div className={`stat-card stat-card-${size}`}>
      <div className={`stat-card-content-wrapper loaded-content ${!isLoading ? 'visible' : ''}`}>
        <div className="stat-card-title">
          <span className="stat-card-body">{title}</span>
          <span className="stat-card-number">{subtitle}</span>
        </div>
        <div className="stat-card-content">{children}</div>
        {footerText && (
          <div className="stat-card-footer">
            <span className="stat-card-info">{footerText}</span>
          </div>
        )}
      </div>
      
      <div className={`stat-card-content-wrapper loading-content ${isLoading ? 'visible' : ''}`}>
        <div className="stat-card-title">
          <div className="skeleton skeleton-text skeleton-body"></div>
          <div className="skeleton skeleton-text skeleton-number"></div>
        </div>
        <div className="stat-card-content"></div>
        <div className="stat-card-footer">
          <div className="skeleton skeleton-text skeleton-footer"></div>
        </div>
      </div>
    </div>
  )
}

export { StatCard }
export type { StatCardProps }
