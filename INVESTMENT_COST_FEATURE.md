# Investment Cost Feature for Stock Options

## Overview
Added comprehensive investment cost calculations and displays for stock options (ISO and NSO) to help candidates understand the financial commitment required to exercise their options.

## What Was Added

### 1. Equity Breakdown Section

#### Individual Package Cards
Each equity package now shows:

**For Stock Options (ISO/NSO):**
- 💵 **Exercise Cost**: Total amount needed to exercise
- **Strike Price**: Per-share cost displayed
- Color: Highlighted in semi-transparent box

**For RSUs:**
- ✨ **No exercise cost badge**: Green badge showing RSUs are free
- No investment required

#### Total Card
- Shows **Total Exercise Cost** across all option packages
- RSU packages don't contribute to this cost
- Only appears if there are stock options in the package

### 2. Info Cards Section
New information cards displaying:
- 🗓 **Vesting Schedule**
- 💰 **Strike Price** per share
- 📊 **Current Share Price** (preferred share price)

### 3. Investment Explainer
A new educational section explaining:
- **Stock Options (ISO/NSO)**: How options work and when payment is required
- **RSUs**: No purchase required, just taxes
- **Your Potential Gain**: How to profit from equity

### 4. Equity Calculator Updates

#### Year Summary Cards
- **Investment Cost**: Shows total cost to exercise (in red)
- **Net Equity Gain**: Profit after deducting investment cost (in green)
- Replaces "Unrealized Gain" with more accurate "Net Gain"

#### Projections Table
Added new columns:
- **Investment Cost**: Amount needed to exercise vested options (shown in parentheses, red)
- **Net Equity Gain**: Actual profit after investment cost (green)
- **Total Comp**: Now includes net gain instead of gross gain

#### Smart Calculations
- Automatically calculates cost based on equity package mix
- ISO/NSO packages: Cost = units × strike price
- RSU packages: No cost
- Proportional vesting calculation

#### Enhanced Disclaimer
New notes explaining:
- Investment cost requirements
- Net equity gain definition
- Tax implications disclaimer

## Example Scenarios

### Scenario 1: Mixed Package with Options
```
Package 1: 15,000 ISO at $2.10 strike = $31,500 investment
Package 2: 5,000 RSU = $0 investment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: 20,000 units
Total Investment Required: $31,500
```

### Scenario 2: All Stock Options
```
Package 1: 20,000 ISO at $2.10 strike = $42,000 investment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: 20,000 units
Total Investment Required: $42,000
```

### Scenario 3: All RSUs
```
Package 1: 20,000 RSU = $0 investment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total: 20,000 units
No exercise cost! ✨
```

## Calculator Example

### Year 4 (Fully Vested)
```
Company Valuation: $5B
Vested Equity: 20,000 units
Share Price: $50

With Mixed Package (15k ISO + 5k RSU):
  Equity Value: $1,000,000
  Investment Cost: ($31,500)  ← Only for ISO units
  Net Equity Gain: $968,500   ← Your actual profit
  
Base Salary: $191,013
Bonus: $19,101
━━━━━━━━━━━━━━━━━━━━━━━━━
Total Compensation: $1,178,614
```

## Visual Design

### Color Coding
- 🔴 **Red**: Investment costs (money you need to pay)
- 🟢 **Green**: Net gains (your profit)
- 🔵 **Cyan**: Total compensation
- 💚 **Green Badge**: No cost required (RSUs)

### Card Styling
- **Investment Cost Box**: Semi-transparent overlay on equity cards
- **No Exercise Cost Badge**: Green with sparkle emoji
- **Info Cards**: Gray background with cyan border
- **Explainer Cards**: White cards in gradient background

## Key Benefits

### For Candidates
✅ **Transparency**: Clear understanding of financial commitment
✅ **Planning**: Can prepare for exercise costs
✅ **Comparison**: Easy to compare mixed packages
✅ **Education**: Learn how different equity types work
✅ **Real Numbers**: See actual costs, not just potential gains

### For Recruiters
✅ **Honesty**: Sets realistic expectations
✅ **Trust**: Builds confidence through transparency
✅ **Differentiation**: Shows RSU benefits clearly
✅ **Professional**: Demonstrates sophisticated comp planning

## Technical Implementation

### Calculation Logic
```javascript
// For each equity package
if (pkg.equity_unit_type === 'iso' || pkg.equity_unit_type === 'nso') {
  investmentCost = pkg.equity_units × strikePrice
} else if (pkg.equity_unit_type === 'rsu') {
  investmentCost = 0
}

// Net gain calculation
netGain = (sharePrice - strikePrice) × vestedUnits - investmentCost
```

### Data Flow
1. Read strike price from organization data
2. Calculate per-package investment costs
3. Sum costs for total investment
4. Display costs in breakdown cards
5. Use in calculator projections
6. Show net gains after costs

## User Experience Flow

### Candidate Journey
1. **See Overview**: Notice total equity units in overview card
2. **Scroll to Breakdown**: See detailed package cards
3. **Understand Costs**: 
   - ISO/NSO cards show exercise cost prominently
   - RSU cards show "no cost" badge
   - Total card summarizes investment needed
4. **Read Info Cards**: Learn strike price and current price
5. **Study Explainer**: Understand how each type works
6. **Use Calculator**: See net gains after costs
7. **Make Decision**: Evaluate true compensation value

## Important Notes

### What's Included
✅ Strike price per share
✅ Total exercise cost per package
✅ Combined total exercise cost
✅ Net gains after investment
✅ Educational content

### What's NOT Included
❌ Tax calculations (too complex, varies by individual)
❌ AMT (Alternative Minimum Tax) for ISOs
❌ Capital gains implications
❌ State-specific tax considerations
❌ Exercise timing strategies

### Disclaimer
The calculator shows investment costs but does NOT include:
- Federal income taxes
- State income taxes
- Social Security/Medicare taxes
- AMT implications
- Exercise timing considerations

Candidates should consult with a tax professional for complete planning.

## Files Modified

1. **src/pages/OfferView.jsx**
   - Added investment cost calculations per package
   - Added "no cost" badge for RSUs
   - Added total investment cost to total card
   - Added info cards section
   - Added investment explainer section

2. **src/pages/OfferView.css**
   - Styled investment cost boxes
   - Styled no-cost badge
   - Styled info cards
   - Styled explainer section
   - Color-coded costs (red) vs gains (green)

3. **src/components/EquityCalculator.jsx**
   - Added investment cost calculation function
   - Updated projections to include cost
   - Calculated net gains after costs
   - Updated table headers
   - Enhanced disclaimer with cost notes

4. **src/components/EquityCalculator.css**
   - Added color classes for positive/negative values
   - Styled cost cell in red
   - Updated disclaimer styling

## Testing Checklist

- [ ] View offer with all ISO options - shows investment cost
- [ ] View offer with all RSUs - shows "no cost" badge
- [ ] View offer with mixed packages - shows appropriate costs
- [ ] Check total investment cost calculation
- [ ] Verify calculator shows net gains
- [ ] Confirm strike price displayed correctly
- [ ] Test responsive design on mobile
- [ ] Verify explainer section is clear

## Future Enhancements

Potential additions:
- AMT calculator for ISO options
- Tax estimation tool
- Exercise timing simulator
- Break-even analysis
- Comparison with market rates
- Exercise strategy recommendations

---

**Great for candidate transparency and financial planning!** 💰

