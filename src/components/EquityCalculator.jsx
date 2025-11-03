import { useState, useMemo } from 'react'
import './EquityCalculator.css'

export default function EquityCalculator({ offer }) {
  const [currentValuation, setCurrentValuation] = useState(
    offer.organization?.valuation_cents || 0
  )
  const [annualGrowthRate, setAnnualGrowthRate] = useState(30)
  const [exitYear, setExitYear] = useState(5)
  const [salaryIncrease, setSalaryIncrease] = useState(
    offer.customization?.financials?.sliders?.defaultAnnualSalaryIncrease || 5
  )
  const [bonusPercentage, setBonusPercentage] = useState(
    offer.customization?.financials?.sliders?.defaultBonusPercentage || 10
  )
  const [equityRefresh, setEquityRefresh] = useState(
    offer.customization?.financials?.sliders?.defaultEquityRefresh || 5
  )

  const projections = useMemo(() => {
    const years = []
    let currentSalary = offer.annual_salary_cents / 100
    let totalEquity = offer.equity_units || 0
    let vestedEquity = 0
    const strikePriceCents = offer.organization?.strike_price_cents || 0
    const sharesOutstanding = offer.organization?.shares_outstanding || 10000000
    
    // Calculate investment cost based on equity packages
    const calculateInvestmentCost = (vestedUnits) => {
      if (!offer.equity_packages) return vestedUnits * strikePriceCents / 100
      
      let cost = 0
      let remainingVested = vestedUnits
      
      for (const pkg of offer.equity_packages) {
        const isOption = pkg.equity_unit_type === 'iso' || pkg.equity_unit_type === 'nso'
        const pkgUnits = Math.min(pkg.equity_units, remainingVested)
        
        if (isOption) {
          cost += pkgUnits * strikePriceCents / 100
        }
        
        remainingVested -= pkgUnits
        if (remainingVested <= 0) break
      }
      
      return cost
    }
    
    for (let year = 1; year <= 10; year++) {
      // Calculate vesting (standard 4 year vest with 1 year cliff)
      if (year === 1) {
        vestedEquity = (offer.equity_units || 0) * 0.25
      } else if (year <= 4) {
        vestedEquity = (offer.equity_units || 0) * (0.25 + ((year - 1) * 0.25))
      } else {
        vestedEquity = offer.equity_units || 0
      }
      
      // Add equity refresh after year 1
      if (year > 1) {
        totalEquity += (offer.equity_units || 0) * (equityRefresh / 100)
      }
      
      // Calculate valuation
      const growthMultiplier = Math.pow(1 + annualGrowthRate / 100, year)
      const yearValuation = currentValuation * growthMultiplier
      const pricePerShare = yearValuation / sharesOutstanding
      const equityValue = vestedEquity * pricePerShare / 100 // Convert cents to dollars
      const investmentCost = calculateInvestmentCost(vestedEquity)
      const gainPerShare = (pricePerShare - strikePriceCents) / 100
      const unrealizedGain = vestedEquity * gainPerShare
      const netGain = unrealizedGain - investmentCost
      
      // Calculate cash compensation
      currentSalary = currentSalary * Math.pow(1 + salaryIncrease / 100, year)
      const bonus = currentSalary * (bonusPercentage / 100)
      const totalCash = currentSalary + bonus
      
      // Total compensation (including net equity gain)
      const totalComp = totalCash + netGain
      
      years.push({
        year,
        valuation: yearValuation,
        vestedEquity: Math.floor(vestedEquity),
        totalEquity: Math.floor(totalEquity),
        equityValue,
        investmentCost,
        unrealizedGain,
        netGain,
        salary: currentSalary,
        bonus,
        totalCash,
        totalComp,
        pricePerShare: pricePerShare / 100,
      })
    }
    
    return years
  }, [offer, currentValuation, annualGrowthRate, salaryIncrease, bonusPercentage, equityRefresh, exitYear])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatSharePrice = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatValuation = (value) => {
    if (value >= 1e11) {
      return `$${(value / 1e11).toFixed(2)}B`
    }
    return `$${(value / 1e8).toFixed(0)}M`
  }

  const exitYearData = projections[exitYear - 1]

  return (
    <div className="equity-calculator">
      {/* Controls */}
      <div className="calculator-controls">
        <div className="control-section">
          <h3>🏢 Company Projections</h3>
          <div className="control-group">
            <label>
              <span className="label-text">Current Valuation</span>
              <div className="input-with-display">
                <input
                  type="range"
                  min="100000000"
                  max="1000000000000"
                  step="1000000000"
                  value={currentValuation}
                  onChange={(e) => setCurrentValuation(Number(e.target.value))}
                />
                <span className="value-display">{formatValuation(currentValuation)}</span>
              </div>
            </label>
          </div>
          
          <div className="control-group">
            <label>
              <span className="label-text">Annual Growth Rate</span>
              <div className="input-with-display">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={annualGrowthRate}
                  onChange={(e) => setAnnualGrowthRate(Number(e.target.value))}
                />
                <span className="value-display">{annualGrowthRate}%</span>
              </div>
            </label>
          </div>
          
          <div className="control-group">
            <label>
              <span className="label-text">Exit/Liquidity Year</span>
              <div className="input-with-display">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={exitYear}
                  onChange={(e) => setExitYear(Number(e.target.value))}
                />
                <span className="value-display">Year {exitYear}</span>
              </div>
            </label>
          </div>
        </div>

        <div className="control-section">
          <h3>💰 Compensation Growth</h3>
          <div className="control-group">
            <label>
              <span className="label-text">Annual Salary Increase</span>
              <div className="input-with-display">
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={salaryIncrease}
                  onChange={(e) => setSalaryIncrease(Number(e.target.value))}
                />
                <span className="value-display">{salaryIncrease}%</span>
              </div>
            </label>
          </div>
          
          <div className="control-group">
            <label>
              <span className="label-text">Annual Bonus %</span>
              <div className="input-with-display">
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={bonusPercentage}
                  onChange={(e) => setBonusPercentage(Number(e.target.value))}
                />
                <span className="value-display">{bonusPercentage}%</span>
              </div>
            </label>
          </div>
          
          <div className="control-group">
            <label>
              <span className="label-text">Annual Equity Refresh %</span>
              <div className="input-with-display">
                <input
                  type="range"
                  min="0"
                  max="25"
                  value={equityRefresh}
                  onChange={(e) => setEquityRefresh(Number(e.target.value))}
                />
                <span className="value-display">{equityRefresh}%</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Exit Year Summary */}
      <div className="exit-summary">
        <h3>🎯 Year {exitYear} Summary</h3>
        <div className="summary-grid">
          <div className="summary-card highlight">
            <div className="summary-label">Total Compensation</div>
            <div className="summary-value">{formatCurrency(exitYearData?.totalComp || 0)}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Company Valuation</div>
            <div className="summary-value">{formatValuation(exitYearData?.valuation || 0)}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Investment Cost</div>
            <div className="summary-value negative">{formatCurrency(exitYearData?.investmentCost || 0)}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Net Equity Gain</div>
            <div className="summary-value positive">{formatCurrency(exitYearData?.netGain || 0)}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Vested Equity</div>
            <div className="summary-value">{exitYearData?.vestedEquity?.toLocaleString() || 0} units</div>
          </div>
        </div>
      </div>

      {/* 10 Year Projections Table */}
      <div className="projections-table-wrapper">
        <h3>📊 10-Year Projections</h3>
        <div className="table-scroll">
          <table className="projections-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Valuation</th>
                <th>Vested Units</th>
                <th>Total Units</th>
                <th>Price/Share</th>
                <th>Investment Cost</th>
                <th>Net Equity Gain</th>
                <th>Base Salary</th>
                <th>Bonus</th>
                <th>Total Comp</th>
              </tr>
            </thead>
            <tbody>
              {projections.map((proj) => (
                <tr key={proj.year} className={proj.year === exitYear ? 'highlight-row' : ''}>
                  <td className="year-cell">Year {proj.year}</td>
                  <td>{formatValuation(proj.valuation)}</td>
                  <td>{proj.vestedEquity.toLocaleString()}</td>
                  <td>{proj.totalEquity.toLocaleString()}</td>
                  <td>{formatSharePrice(proj.pricePerShare)}</td>
                  <td className="cost-cell">({formatCurrency(proj.investmentCost)})</td>
                  <td className="gain-cell">{formatCurrency(proj.netGain)}</td>
                  <td>{formatCurrency(proj.salary)}</td>
                  <td>{formatCurrency(proj.bonus)}</td>
                  <td className="total-cell">{formatCurrency(proj.totalComp)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Market Comparisons */}
      {offer.customization?.financials?.marketMilestones && (
        <div className="market-comparisons">
          <h3>🌟 Similar Companies Exit Valuations</h3>
          <div className="milestone-chips">
            {offer.customization.financials.marketMilestones.map((company, idx) => (
              <div key={idx} className="milestone-chip">
                {company}
              </div>
            ))}
          </div>
          <p className="milestone-note">
            These companies represent potential exit scenarios. Adjust the calculator to explore different outcomes.
          </p>
        </div>
      )}
      
      <div className="calculator-disclaimer">
        <p>
          ⚠️ <strong>Important Notes:</strong>
        </p>
        <p>
          • <strong>Investment Cost:</strong> Stock options (ISO/NSO) require you to pay the strike price to exercise. RSUs have no exercise cost.
        </p>
        <p>
          • <strong>Net Equity Gain:</strong> This is your profit after deducting the investment cost from the total equity value.
        </p>
        <p>
          • <strong>Disclaimer:</strong> These projections are estimates for planning purposes only. 
          Actual equity value depends on company performance, market conditions, and many other factors. 
          Past performance of similar companies does not guarantee future results. Tax implications are not included.
        </p>
      </div>
    </div>
  )
}

