import './OngoingProtection.css'

interface Broker {
  name: string
  logo: string
  color: string
}

interface ScanActivity {
  date: string
  brokers: Broker[]
}

function OngoingProtection() {
  const recentScans: ScanActivity[] = [
    {
      date: 'Mon, 19 Jan',
      brokers: [
        { name: '411', color: '#2ABEE3' },
        { name: 'Curadvisor', color: '#FFFFFF' },
        { name: 'NeighborWho', color: '#FABD1B' },
        { name: 'Intelius', color: '#000000' },
        { name: 'Dataveria', color: '#FFFFFF' },
        { name: 'IdentityPi', color: '#D21847' },
      ],
    },
  ]

  const brokerRows = [
    { name: 'Official USA', color: '#FE5A62' },
    { name: "That's Them", color: '#6E1899' },
    { name: 'Wellnut', color: '#0C1215' },
    { name: 'Whitepages', color: '#6D7580' },
  ]

  return (
    <div className="ongoing-protection">
      <div className="stat-header">
        <div className="stat-title">
          <div className="stat-title-text">Ongoing protection</div>
          <div className="stat-number">Scan activity</div>
        </div>
      </div>
      <div className="protection-content">
        {recentScans.map((scan, index) => (
          <div key={index} className="scan-group">
            <div className="scan-date">{scan.date}</div>
            <div className="broker-logos">
              {scan.brokers.map((broker, brokerIndex) => (
                <div
                  key={brokerIndex}
                  className="broker-logo"
                  style={{
                    backgroundColor: broker.color,
                    borderColor: '#F2F2F2',
                  }}
                >
                  {broker.name.charAt(0)}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="scan-date-secondary">2 days ago</div>
        <div className="broker-rows">
          {brokerRows.map((broker, index) => (
            <div key={index} className="broker-row">
              <div
                className="broker-logo-small"
                style={{ backgroundColor: broker.color }}
              >
                {broker.name.charAt(0)}
              </div>
              <div className="broker-name">{broker.name}</div>
              <svg
                width="13"
                height="10"
                viewBox="0 0 13 10"
                fill="none"
                className="broker-arrow"
              >
                <path
                  d="M1 5H12M12 5L8 1M12 5L8 9"
                  stroke="#222222"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ))}
        </div>
        <div className="fade-gradient" />
      </div>
    </div>
  )
}

export default OngoingProtection
