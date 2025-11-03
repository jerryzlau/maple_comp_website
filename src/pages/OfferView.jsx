import { useParams } from 'react-router-dom'
import { useOffers } from '../context/OffersContext'
import { useState, useEffect } from 'react'
import Confetti from 'react-confetti'
import './OfferView.css'
import EquityCalculator from '../components/EquityCalculator'

export default function OfferView() {
  const { id } = useParams()
  const { getOfferById } = useOffers()
  const offer = getOfferById(id)
  const [showConfetti, setShowConfetti] = useState(false)
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (offer?.customization?.welcome?.confetti) {
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 5000)
    }
  }, [offer])

  if (!offer) {
    return (
      <div className="offer-not-found">
        <div className="error-box">
          <h1>🔍</h1>
          <h2>Offer Not Found</h2>
          <p>The offer you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  // Format currency from cents
  const formatCurrency = (cents) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: offer.cash_currency || 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100)
  }

  // Format currency from dollars (no conversion needed)
  const formatDollars = (dollars) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: offer.cash_currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(dollars)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <div className="offer-view">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}
      
      {/* Welcome Section */}
      <section className="welcome-section fade-in">
        <div className="welcome-content">
          <h1 className="gradient-text">{offer.customization?.welcome?.title || `Welcome, ${offer.candidate_full_name}!`}</h1>
          <p className="welcome-message">{offer.customization?.welcome?.message}</p>
          <div className="company-logo">
            <span className="company-name">{offer.organization?.name}</span>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="overview-section slide-in">
        <div className="container">
          <h2>{offer.customization?.overview?.title || "Your Offer Overview"}</h2>
          <p className="overview-subtitle">{offer.customization?.overview?.message}</p>
          
          <div className="offer-details-grid">
            <div className="detail-card">
              <div className="detail-icon">💰</div>
              <div className="detail-content">
                <span className="detail-label">Annual Salary</span>
                <span className="detail-value">{formatCurrency(offer.annual_salary_cents)}</span>
              </div>
            </div>
            
            <div className="detail-card">
              <div className="detail-icon">📈</div>
              <div className="detail-content">
                <span className="detail-label">Total Equity</span>
                <span className="detail-value">
                  {offer.equity_units?.toLocaleString()} units
                </span>
                <span className="detail-sub">
                  {offer.equity_percent_bps ? `${(offer.equity_percent_bps / 100).toFixed(2)}% ownership` : ''}
                </span>
                {offer.equity_packages && offer.equity_packages.length > 1 && (
                  <div className="equity-breakdown">
                    {offer.equity_packages.map((pkg, idx) => (
                      <div key={idx} className="equity-package-badge">
                        {pkg.equity_units.toLocaleString()} {pkg.equity_unit_type.toUpperCase()}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="detail-card">
              <div className="detail-icon">📍</div>
              <div className="detail-content">
                <span className="detail-label">Location</span>
                <span className="detail-value">{offer.location}</span>
              </div>
            </div>
            
            <div className="detail-card">
              <div className="detail-icon">🎯</div>
              <div className="detail-content">
                <span className="detail-label">Position</span>
                <span className="detail-value">{offer.position}</span>
              </div>
            </div>
            
            <div className="detail-card">
              <div className="detail-icon">📅</div>
              <div className="detail-content">
                <span className="detail-label">Start Date</span>
                <span className="detail-value">{formatDate(offer.start_date)}</span>
              </div>
            </div>
            
            <div className="detail-card">
              <div className="detail-icon">⏰</div>
              <div className="detail-content">
                <span className="detail-label">Offer Expires</span>
                <span className="detail-value expires">{formatDate(offer.expires_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Equity Breakdown Section */}
      {offer.equity_packages && offer.equity_packages.length > 0 && (
        <section className="equity-breakdown-section">
          <div className="container">
            <h2>📊 Your Equity Package Breakdown</h2>
            <p className="section-subtitle">Your total equity is composed of the following:</p>
            <div className="equity-packages-display">
              {offer.equity_packages.map((pkg, idx) => {
                const isOption = pkg.equity_unit_type === 'iso' || pkg.equity_unit_type === 'nso';
                const strikePrice = offer.organization?.strike_price_cents || 0;
                const investmentCost = isOption ? (pkg.equity_units * strikePrice) / 100 : 0;
                
                return (
                  <div key={idx} className="equity-package-card">
                    <div className="package-header">
                      <span className="package-type">{pkg.equity_unit_type.toUpperCase()}</span>
                    </div>
                    <div className="package-amount">{pkg.equity_units.toLocaleString()}</div>
                    <div className="package-label">units</div>
                    <div className="package-description">
                      {pkg.equity_unit_type === 'iso' && 'Incentive Stock Options'}
                      {pkg.equity_unit_type === 'nso' && 'Non-Qualified Stock Options'}
                      {pkg.equity_unit_type === 'rsu' && 'Restricted Stock Units'}
                    </div>
                    {isOption && (
                      <div className="investment-cost">
                        <div className="cost-label">💵 Exercise Cost:</div>
                        <div className="cost-amount">{formatDollars(investmentCost)}</div>
                        <div className="cost-detail">
                          Strike price: {formatDollars(strikePrice / 100)}/share
                        </div>
                      </div>
                    )}
                    {!isOption && (
                      <div className="no-investment-badge">
                        ✨ No exercise cost
                      </div>
                    )}
                  </div>
                )
              })}
              <div className="equity-package-card total-card">
                <div className="package-header">
                  <span className="package-type">TOTAL</span>
                </div>
                <div className="package-amount">{offer.equity_units?.toLocaleString()}</div>
                <div className="package-label">units</div>
                <div className="package-description">
                  {offer.equity_percent_bps ? `${(offer.equity_percent_bps / 100).toFixed(3)}% ownership` : 'Total Equity'}
                </div>
                {(() => {
                  const totalInvestment = offer.equity_packages.reduce((sum, pkg) => {
                    const isOption = pkg.equity_unit_type === 'iso' || pkg.equity_unit_type === 'nso'
                    const strikePrice = offer.organization?.strike_price_cents || 0
                    return sum + (isOption ? (pkg.equity_units * strikePrice) / 100 : 0)
                  }, 0)
                  
                  if (totalInvestment > 0) {
                    return (
                      <div className="investment-cost">
                        <div className="cost-label">💵 Total Exercise Cost:</div>
                        <div className="cost-amount">{formatDollars(totalInvestment)}</div>
                      </div>
                    )
                  }
                  return null
                })()}
              </div>
            </div>
            <div className="equity-info-grid">
              <div className="info-card">
                <strong>🗓 Vesting Schedule:</strong>
                <div>{offer.vesting_schedule}</div>
              </div>
              {offer.organization?.strike_price_cents && (
                <div className="info-card">
                  <strong>💰 Strike Price:</strong>
                  <div>{formatDollars(offer.organization.strike_price_cents / 100)} per share</div>
                </div>
              )}
              {offer.organization?.preferred_share_price_cents && (
                <div className="info-card">
                  <strong>📊 Current Share Price:</strong>
                  <div>{formatDollars(offer.organization.preferred_share_price_cents / 100)} per share</div>
                </div>
              )}
            </div>
            
            <div className="investment-explainer">
              <h4>💡 Understanding Your Investment</h4>
              <div className="explainer-grid">
                <div className="explainer-item">
                  <strong>Stock Options (ISO/NSO):</strong>
                  <p>You have the <em>option</em> to buy shares at the strike price when they vest. The strike price is locked in now, but you pay when you exercise.</p>
                </div>
                <div className="explainer-item">
                  <strong>RSUs:</strong>
                  <p>These are actual shares granted to you. No purchase required! You receive them when they vest (minus taxes).</p>
                </div>
                <div className="explainer-item">
                  <strong>Your Potential Gain:</strong>
                  <p>If the share price increases above the strike price, you profit from the difference when you exercise and sell.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Equity Calculator Section */}
      <section className="calculator-section">
        <div className="container">
          <h2>💎 Equity Value Calculator</h2>
          <p className="section-subtitle">Simulate your potential returns based on company valuation projections</p>
          <EquityCalculator offer={offer} />
        </div>
      </section>

      {/* Company Metrics */}
      {offer.customization?.company?.metrics && (
        <section className="metrics-section">
          <div className="container">
            <h2>🚀 Company Highlights</h2>
            <div className="metrics-grid">
              {offer.customization.company.metrics.map((metric, idx) => (
                <div key={idx} className="metric-card">
                  <div className="metric-value">{metric.value}</div>
                  <div className="metric-label">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      {offer.benefit_package?.benefits?.all_benefits && (
        <section className="benefits-section">
          <div className="container">
            <h2>🎁 Benefits & Perks</h2>
            <div className="benefits-grid">
              {offer.benefit_package.benefits.all_benefits.map((benefit, idx) => (
                <div key={idx} className={`benefit-card ${benefit.featured ? 'featured' : ''}`}>
                  <div className="benefit-emoji">{benefit.emoji}</div>
                  <div className="benefit-title">{benefit.title}</div>
                  <div className="benefit-description">{benefit.description}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Messages Section */}
      {offer.messages && offer.messages.length > 0 && (
        <section className="messages-section">
          <div className="container">
            <h2>💬 Messages from the Team</h2>
            <div className="messages-grid">
              {offer.messages.map((message) => (
                <div key={message.id} className="message-card">
                  <div className="message-header">
                    <div className="message-author">
                      {message.user?.imagePath && (
                        <div className="author-avatar">{message.user.fullName[0]}</div>
                      )}
                      <div className="author-info">
                        <div className="author-name">{message.authorFullName}</div>
                        <div className="author-title">{message.user?.title}</div>
                      </div>
                    </div>
                    <div className="message-group">{message.user?.group}</div>
                  </div>
                  <div className="message-content">{message.content}</div>
                  {message.videoUrl && (
                    <div className="message-video">
                      <iframe
                        src={message.videoUrl}
                        frameBorder="0"
                        allowFullScreen
                        title={`Video from ${message.authorFullName}`}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>Ready to Join Us? 🎉</h2>
            <p>We're excited to have you on the team!</p>
            <div className="cta-buttons">
              <button className="btn-primary">Accept Offer</button>
              <button className="btn-secondary">Download Details</button>
            </div>
            <p className="cta-footer">
              Questions? Contact {offer.recruiter_full_name} at {offer.recruiter_email}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

