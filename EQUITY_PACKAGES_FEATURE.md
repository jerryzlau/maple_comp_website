# Mixed Equity Packages Feature

## Overview
The compensation section has been updated to support multiple equity packages with different equity types (ISO, NSO, RSU) for a single offer.

## Changes Made

### 1. Offer Management Page (`/offer/manage`)

#### Form Updates
- Removed single equity input fields
- Added dynamic equity packages section
- Users can now add multiple equity packages with different types
- Each package includes:
  - Equity Units (number)
  - Equity Type (ISO/NSO/RSU dropdown)
- "➕ Add Another Package" button to add more packages
- "🗑️" button to remove packages (minimum 1 required)
- Real-time total equity units calculation displayed

#### Offer List Display
- Shows total equity units
- Displays breakdown of equity packages when multiple types exist
- Color-coded badges for different equity types

### 2. Offer View Page (`/offer/:id`)

#### Overview Section
- Total equity units displayed in the overview card
- Small badges showing equity type breakdown appear when multiple packages exist

#### New Equity Breakdown Section
- Dedicated section showing detailed equity package breakdown
- Beautiful gradient cards for each equity type:
  - Cyan gradient for ISO/NSO packages
  - Purple/pink gradient for the TOTAL card
- Displays full name of each equity type
- Shows vesting schedule below the breakdown
- Hover effects on cards

### 3. Data Structure

#### Offer Object
```javascript
{
  equity_units: 20000,              // Total units
  equity_unit_type: 'iso',          // Primary type
  equity_packages: [                // Breakdown array
    {
      equity_units: 15000,
      equity_unit_type: 'iso'
    },
    {
      equity_units: 5000,
      equity_unit_type: 'rsu'
    }
  ]
}
```

### 4. CSS Enhancements

#### New Styles Added
- `.equity-packages-section` - Container for equity packages form
- `.equity-header` - Header with title and add button
- `.equity-package-item` - Individual package input wrapper
- `.equity-package-grid` - Grid layout for package inputs
- `.btn-add-equity` - Add package button styling
- `.btn-remove-equity` - Remove package button styling
- `.equity-total` - Total equity display box
- `.equity-breakdown-section` - Offer view breakdown section
- `.equity-packages-display` - Grid of equity cards
- `.equity-package-card` - Individual equity type card
- `.mini-equity-badge` - Small badges in offer list

## User Experience

### For Recruiters
1. Create offer and scroll to "Compensation" section
2. See "Equity Packages (Mix of Different Types)" subsection
3. Enter units and select type for first package
4. Click "➕ Add Another Package" to add more
5. Enter additional packages as needed
6. See real-time total at the bottom
7. Remove packages with 🗑️ button if needed

### For Candidates
1. View offer and see total equity in overview
2. Small badges show the breakdown in overview (if multiple types)
3. Scroll to "📊 Your Equity Package Breakdown" section
4. See beautiful cards for each equity type with:
   - Equity type badge (ISO/NSO/RSU)
   - Large number showing units
   - Full name of equity type
   - Total card in different color
5. Vesting schedule displayed below

## Example Use Cases

### Example 1: Standard Single Package
```
15,000 ISO
```

### Example 2: Mixed Package
```
Package 1: 10,000 ISO
Package 2: 5,000 RSU
Total: 15,000 units
```

### Example 3: Three-Type Mix
```
Package 1: 10,000 ISO
Package 2: 5,000 NSO  
Package 3: 5,000 RSU
Total: 20,000 units
```

## Technical Notes

- Minimum 1 equity package required
- Total equity calculated by summing all packages
- Primary equity type determined by package with most units
- All validations maintained (required fields, min values)
- Mobile responsive design included
- Smooth animations and transitions added
- Color-coded for easy visual distinction

## Benefits

✅ Flexibility to offer mixed equity compensation
✅ Clear visual breakdown for candidates
✅ Professional and modern UI
✅ Maintains data consistency
✅ Easy to use for recruiters
✅ Transparent for candidates

