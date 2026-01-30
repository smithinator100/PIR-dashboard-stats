import DonutChart from './DonutChartOdometer'
import './StatVertical.css'

interface StatVerticalProps {
  title: string
  number: string
  percentage: number
  hasRecords: boolean
  recordsCount?: number
  variant: 'blue' | 'green'
}

function StatVertical({
  title,
  number,
  percentage,
  hasRecords,
  recordsCount,
  variant,
}: StatVerticalProps) {
  const bgColor = variant === 'blue' ? '#E6F6FF' : '#E2F3E9'
  const bannerBgColor = variant === 'green' ? '#CFEBDA' : undefined

  return (
    <div className="stat-vertical" style={{ backgroundColor: bgColor }}>
      <div className="stat-header">
        <div className="stat-title">
          <div className="stat-title-text">{title}</div>
          <div className="stat-number">{number}</div>
        </div>
      </div>
      <div className="stat-content">
        <DonutChart state="in-progress" percentage={percentage} variant={variant} />
        {hasRecords && recordsCount && (
          <div className="stat-info">
            {recordsCount} sites have records of your personal info
          </div>
        )}
      </div>
      {variant === 'green' && (
        <div className="stat-banner" style={{ backgroundColor: bannerBgColor }}>
          <div className="stat-banner-text">
            No sites have records of your personal information
          </div>
        </div>
      )}
    </div>
  )
}

export default StatVertical
