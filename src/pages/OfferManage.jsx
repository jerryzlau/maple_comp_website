import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOffers } from '../context/OffersContext'
import './OfferManage.css'

export default function OfferManage() {
  const navigate = useNavigate()
  const { offers, createOffer, deleteOffer } = useOffers()
  const [showForm, setShowForm] = useState(false)
  const [equityPackages, setEquityPackages] = useState([
    { equity_units: '', equity_unit_type: 'iso' }
  ])
  const [formData, setFormData] = useState({
    candidate_full_name: '',
    candidate_email: '',
    position: '',
    location: '',
    annual_salary_cents: '',
    equity_percent_bps: '',
    start_date: '',
    expires_at: '',
    manager_full_name: '',
    manager_position: '',
    recruiter_full_name: '',
    recruiter_email: '',
    vesting_schedule: '1/48 monthly, 25% vest at 12 month cliff',
    organization_name: '',
    organization_valuation_cents: '',
    strike_price_cents: '',
    shares_outstanding: '',
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleEquityPackageChange = (index, field, value) => {
    const newPackages = [...equityPackages]
    newPackages[index][field] = value
    setEquityPackages(newPackages)
  }

  const addEquityPackage = () => {
    setEquityPackages([...equityPackages, { equity_units: '', equity_unit_type: 'iso' }])
  }

  const removeEquityPackage = (index) => {
    if (equityPackages.length > 1) {
      setEquityPackages(equityPackages.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Calculate total equity units from all packages
    const totalEquityUnits = equityPackages.reduce((sum, pkg) => sum + parseInt(pkg.equity_units || 0), 0)
    
    // Determine primary equity type (the one with most units)
    const primaryPackage = equityPackages.reduce((prev, current) => 
      (parseInt(current.equity_units || 0) > parseInt(prev.equity_units || 0)) ? current : prev
    )
    
    const offerData = {
      candidate_full_name: formData.candidate_full_name,
      candidate_email: formData.candidate_email,
      position: formData.position,
      location: formData.location,
      annual_salary_cents: parseInt(formData.annual_salary_cents) * 100,
      equity_units: totalEquityUnits,
      equity_unit_type: primaryPackage.equity_unit_type,
      equity_percent_bps: parseInt(formData.equity_percent_bps),
      start_date: new Date(formData.start_date).toISOString(),
      expires_at: new Date(formData.expires_at).toISOString(),
      manager_full_name: formData.manager_full_name,
      manager_position: formData.manager_position,
      recruiter_full_name: formData.recruiter_full_name,
      recruiter_email: formData.recruiter_email,
      vesting_schedule: formData.vesting_schedule,
      cash_currency: 'USD',
      compensation_type: 'annual',
      state: 'open',
      organization: {
        name: formData.organization_name,
        valuation_cents: parseInt(formData.organization_valuation_cents) * 100,
        strike_price_cents: parseInt(formData.strike_price_cents),
        shares_outstanding: parseInt(formData.shares_outstanding),
        default_vesting_schedule: formData.vesting_schedule,
      },
      customization: {
        theme: 'cyan',
        welcome: {
          title: `Welcome, ${formData.candidate_full_name}!`,
          message: `The team is excited to extend you an offer to join the ${formData.organization_name} family. We hope you'll accept and come do the best work of your life! 🚀`,
          confetti: true,
        },
        overview: {
          title: `🎉 Congrats, ${formData.candidate_full_name.split(' ')[0]}, on your offer from ${formData.organization_name}! 🎉`,
          message: 'The team is excited for you to join!',
        },
        company: {
          metrics: [],
        },
        financials: {
          sliders: {
            defaultAnnualSalaryIncrease: 5,
            defaultBonusPercentage: 10,
            defaultEquityRefresh: 5,
            defaultEquityMultiplier: 1,
            defaultValuationMax: 10,
          },
          performanceCompensation: {
            cashBonus: true,
            salaryIncrease: true,
            equityRefresh: true,
            equityMultiplier: true,
          },
          marketMilestones: ['Slack', 'Twilio', 'Notion', 'Figma'],
        },
      },
      benefit_package: {
        benefits: {
          all_benefits: [
            {
              emoji: '🏥',
              title: 'Health insurance',
              featured: true,
              description: 'Comprehensive health coverage',
            },
            {
              emoji: '🦷',
              title: 'Dental insurance',
              description: 'Full dental coverage',
            },
            {
              emoji: '👓',
              title: 'Vision insurance',
              description: 'Vision care coverage',
            },
            {
              emoji: '🏝',
              title: 'Paid time off',
              featured: true,
              description: '20 days per year',
            },
            {
              emoji: '🏛',
              title: '401K',
              featured: true,
              description: 'Retirement savings plan',
            },
          ],
        },
      },
      equity_packages: equityPackages.map(pkg => ({
        equity_units: parseInt(pkg.equity_units),
        equity_unit_type: pkg.equity_unit_type,
      })),
    }

    const newOffer = createOffer(offerData)
    setShowForm(false)
    setEquityPackages([{ equity_units: '', equity_unit_type: 'iso' }])
    setFormData({
      candidate_full_name: '',
      candidate_email: '',
      position: '',
      location: '',
      annual_salary_cents: '',
      equity_percent_bps: '',
      start_date: '',
      expires_at: '',
      manager_full_name: '',
      manager_position: '',
      recruiter_full_name: '',
      recruiter_email: '',
      vesting_schedule: '1/48 monthly, 25% vest at 12 month cliff',
      organization_name: '',
      organization_valuation_cents: '',
      strike_price_cents: '',
      shares_outstanding: '',
    })
    
    alert(`Offer created successfully!\nOffer ID: ${newOffer.public_uuid}\nView at: /offer/${newOffer.public_uuid}`)
  }

  const handleDelete = (offerId) => {
    if (confirm('Are you sure you want to delete this offer?')) {
      deleteOffer(offerId)
    }
  }

  const formatCurrency = (cents) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(cents / 100)
  }

  return (
    <div className="offer-manage">
      <div className="manage-header">
        <div className="header-content">
          <h1>🎯 Offer Management Portal</h1>
          <p>Create and manage job offers for candidates</p>
        </div>
        <button 
          className="btn-create-offer"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '❌ Cancel' : '➕ Create New Offer'}
        </button>
      </div>

      {showForm && (
        <div className="offer-form-container fade-in">
          <div className="form-header">
            <h2>✨ Create New Offer</h2>
            <p>Fill in the details to generate a beautiful offer for your candidate</p>
          </div>
          
          <form onSubmit={handleSubmit} className="offer-form">
            {/* Candidate Information */}
            <div className="form-section">
              <h3>👤 Candidate Information</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="candidate_full_name">Full Name *</label>
                  <input
                    type="text"
                    id="candidate_full_name"
                    name="candidate_full_name"
                    value={formData.candidate_full_name}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="candidate_email">Email *</label>
                  <input
                    type="email"
                    id="candidate_email"
                    name="candidate_email"
                    value={formData.candidate_email}
                    onChange={handleInputChange}
                    required
                    placeholder="john.doe@example.com"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="position">Position *</label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    required
                    placeholder="Senior Software Engineer"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="location">Location *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>
            </div>

            {/* Compensation */}
            <div className="form-section">
              <h3>💰 Compensation</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="annual_salary_cents">Annual Salary (USD) *</label>
                  <input
                    type="number"
                    id="annual_salary_cents"
                    name="annual_salary_cents"
                    value={formData.annual_salary_cents}
                    onChange={handleInputChange}
                    required
                    placeholder="150000"
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="equity_percent_bps">Ownership % (in bps, e.g., 20 = 0.2%) *</label>
                  <input
                    type="number"
                    id="equity_percent_bps"
                    name="equity_percent_bps"
                    value={formData.equity_percent_bps}
                    onChange={handleInputChange}
                    required
                    placeholder="20"
                    min="0"
                  />
                </div>
                
                <div className="form-group full-width">
                  <label htmlFor="vesting_schedule">Vesting Schedule *</label>
                  <input
                    type="text"
                    id="vesting_schedule"
                    name="vesting_schedule"
                    value={formData.vesting_schedule}
                    onChange={handleInputChange}
                    required
                    placeholder="1/48 monthly, 25% vest at 12 month cliff"
                  />
                </div>
              </div>
              
              <div className="equity-packages-section">
                <div className="equity-header">
                  <h4>📈 Equity Packages (Mix of Different Types)</h4>
                  <button 
                    type="button" 
                    className="btn-add-equity"
                    onClick={addEquityPackage}
                  >
                    ➕ Add Another Package
                  </button>
                </div>
                
                {equityPackages.map((pkg, index) => (
                  <div key={index} className="equity-package-item">
                    <div className="package-number">Package {index + 1}</div>
                    <div className="equity-package-grid">
                      <div className="form-group">
                        <label>Equity Units *</label>
                        <input
                          type="number"
                          value={pkg.equity_units}
                          onChange={(e) => handleEquityPackageChange(index, 'equity_units', e.target.value)}
                          required
                          placeholder="20000"
                          min="0"
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Equity Type *</label>
                        <select
                          value={pkg.equity_unit_type}
                          onChange={(e) => handleEquityPackageChange(index, 'equity_unit_type', e.target.value)}
                          required
                        >
                          <option value="iso">ISO (Incentive Stock Options)</option>
                          <option value="nso">NSO (Non-Qualified Stock Options)</option>
                          <option value="rsu">RSU (Restricted Stock Units)</option>
                        </select>
                      </div>
                      
                      {equityPackages.length > 1 && (
                        <button
                          type="button"
                          className="btn-remove-equity"
                          onClick={() => removeEquityPackage(index)}
                          title="Remove this package"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                
                <div className="equity-total">
                  <strong>Total Equity Units:</strong> {equityPackages.reduce((sum, pkg) => sum + parseInt(pkg.equity_units || 0), 0).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="form-section">
              <h3>📅 Important Dates</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="start_date">Start Date *</label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="expires_at">Offer Expiration Date *</label>
                  <input
                    type="date"
                    id="expires_at"
                    name="expires_at"
                    value={formData.expires_at}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Company & Team */}
            <div className="form-section">
              <h3>🏢 Company & Team</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="organization_name">Company Name *</label>
                  <input
                    type="text"
                    id="organization_name"
                    name="organization_name"
                    value={formData.organization_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Acme Inc."
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="organization_valuation_cents">Company Valuation (USD) *</label>
                  <input
                    type="number"
                    id="organization_valuation_cents"
                    name="organization_valuation_cents"
                    value={formData.organization_valuation_cents}
                    onChange={handleInputChange}
                    required
                    placeholder="3100000000"
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="strike_price_cents">Strike Price (cents) *</label>
                  <input
                    type="number"
                    id="strike_price_cents"
                    name="strike_price_cents"
                    value={formData.strike_price_cents}
                    onChange={handleInputChange}
                    required
                    placeholder="210"
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="shares_outstanding">Shares Outstanding *</label>
                  <input
                    type="number"
                    id="shares_outstanding"
                    name="shares_outstanding"
                    value={formData.shares_outstanding}
                    onChange={handleInputChange}
                    required
                    placeholder="10000000"
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="manager_full_name">Manager Name *</label>
                  <input
                    type="text"
                    id="manager_full_name"
                    name="manager_full_name"
                    value={formData.manager_full_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Jane Smith"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="manager_position">Manager Position *</label>
                  <input
                    type="text"
                    id="manager_position"
                    name="manager_position"
                    value={formData.manager_position}
                    onChange={handleInputChange}
                    required
                    placeholder="VP of Engineering"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="recruiter_full_name">Recruiter Name *</label>
                  <input
                    type="text"
                    id="recruiter_full_name"
                    name="recruiter_full_name"
                    value={formData.recruiter_full_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Sarah Johnson"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="recruiter_email">Recruiter Email *</label>
                  <input
                    type="email"
                    id="recruiter_email"
                    name="recruiter_email"
                    value={formData.recruiter_email}
                    onChange={handleInputChange}
                    required
                    placeholder="sarah@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                ✨ Create Offer
              </button>
              <button 
                type="button" 
                className="btn-cancel"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Offers List */}
      <div className="offers-list">
        <h2>📋 All Offers ({offers.length})</h2>
        {offers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No offers yet</h3>
            <p>Create your first offer to get started!</p>
          </div>
        ) : (
          <div className="offers-grid">
            {offers.map((offer) => (
              <div key={offer.id} className="offer-card slide-in">
                <div className="offer-card-header">
                  <div>
                    <h3>{offer.candidate_full_name}</h3>
                    <p className="offer-position">{offer.position}</p>
                  </div>
                  <span className={`offer-status status-${offer.state}`}>
                    {offer.state}
                  </span>
                </div>
                
                <div className="offer-card-details">
                  <div className="detail-row">
                    <span className="detail-label">💰 Salary:</span>
                    <span className="detail-value">{formatCurrency(offer.annual_salary_cents)}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📈 Total Equity:</span>
                    <span className="detail-value">
                      {offer.equity_units?.toLocaleString()} units
                    </span>
                  </div>
                  {offer.equity_packages && offer.equity_packages.length > 1 && (
                    <div className="detail-row equity-packages-row">
                      <span className="detail-label">Breakdown:</span>
                      <div className="detail-equity-packages">
                        {offer.equity_packages.map((pkg, idx) => (
                          <span key={idx} className="mini-equity-badge">
                            {pkg.equity_units.toLocaleString()} {pkg.equity_unit_type.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="detail-row">
                    <span className="detail-label">📍 Location:</span>
                    <span className="detail-value">{offer.location}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">🏢 Company:</span>
                    <span className="detail-value">{offer.organization?.name}</span>
                  </div>
                </div>
                
                <div className="offer-card-actions">
                  <button
                    className="btn-view"
                    onClick={() => navigate(`/offer/${offer.public_uuid || offer.uuid}`)}
                  >
                    👁 View Offer
                  </button>
                  <button
                    className="btn-edit"
                    onClick={() => navigate(`/manage/offer/${offer.public_uuid || offer.uuid}`)}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn-copy"
                    onClick={() => {
                      const url = `${window.location.origin}/offer/${offer.public_uuid || offer.uuid}`
                      navigator.clipboard.writeText(url)
                      alert('Offer link copied to clipboard!')
                    }}
                  >
                    🔗 Copy Link
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(offer.id)}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


