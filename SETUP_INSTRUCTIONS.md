# 🚀 Offer Portal - Setup & Usage Guide

## ✅ Application Status
Your application is now running at: **http://localhost:5173**

## 🎯 What's Been Updated

### Mixed Equity Compensation Feature
The compensation section now supports **multiple equity packages** with different equity types in a single offer!

## 🔗 Quick Start

### Available Routes
1. **`/offer/manage`** - Recruiter dashboard (default landing page)
2. **`/offer/:id`** - Candidate offer view page

### Sample Offer
A sample offer from the provided `sample.json` is pre-loaded:
- Visit: `http://localhost:5173/offer/54002419-f043-4ef6-9a0f-3d991d459bcc`

## 📝 How to Create an Offer with Mixed Equity

### Step 1: Navigate to Management Portal
Go to `http://localhost:5173` or `http://localhost:5173/offer/manage`

### Step 2: Create New Offer
Click the **"➕ Create New Offer"** button

### Step 3: Fill Basic Information
- Candidate details (name, email, position, location)
- Annual salary
- Ownership percentage (in basis points)
- Vesting schedule

### Step 4: Add Equity Packages 📈
This is the new feature!

**Single Package Example:**
```
Package 1: 20,000 ISO
Total: 20,000 units
```

**Mixed Package Example:**
```
Package 1: 15,000 ISO
Package 2: 5,000 RSU
Total: 20,000 units
```

**Steps:**
1. Enter equity units for Package 1 (e.g., 15,000)
2. Select equity type (ISO/NSO/RSU)
3. Click **"➕ Add Another Package"** to add more
4. Enter units for Package 2 (e.g., 5,000)
5. Select different equity type (e.g., RSU)
6. See real-time total calculation
7. Remove packages with 🗑️ button if needed

### Step 5: Complete Form
- Add important dates (start date, expiration)
- Company information
- Manager and recruiter details

### Step 6: Submit
Click **"✨ Create Offer"** to generate the offer

### Step 7: Share with Candidate
- Copy the generated link from the offer card
- Send to candidate via email

## 🎨 What Candidates See

### Overview Section
- Beautiful welcome with confetti 🎊
- Salary and equity details in gradient cards
- When multiple equity types exist, small badges show the breakdown

### Equity Breakdown Section (NEW!)
A dedicated section showing:
- **Individual Cards** for each equity type
  - ISO packages: Cyan gradient
  - NSO packages: Cyan gradient  
  - RSU packages: Cyan gradient
- **Total Card**: Purple/pink gradient showing total equity
- **Vesting Schedule** displayed clearly

### Interactive Calculator 💎
- 10-year equity projections
- Adjustable growth rates
- Salary increases
- Bonus percentages
- Equity refresh rates
- Detailed yearly breakdown table

### Additional Sections
- 🚀 Company highlights and metrics
- 🎁 Benefits and perks
- 💬 Team messages (with video support)
- ✨ Accept/Download actions

## 💡 Example Scenarios

### Scenario 1: Senior Engineer Offer
```
Salary: $180,000
Equity Packages:
  - 25,000 ISO (Incentive Stock Options)
  - 10,000 RSU (Restricted Stock Units)
Total: 35,000 units
Ownership: 0.35%
```

### Scenario 2: Executive Offer
```
Salary: $250,000
Equity Packages:
  - 50,000 ISO
  - 20,000 NSO
  - 15,000 RSU
Total: 85,000 units
Ownership: 0.85%
```

### Scenario 3: Standard Offer
```
Salary: $150,000
Equity Packages:
  - 20,000 ISO
Total: 20,000 units
Ownership: 0.20%
```

## 🎨 UI Features

### Beautiful Design
- ✨ Gradient backgrounds and cards
- 🎊 Confetti animation on offer view
- 🌈 Color-coded equity types
- 💫 Smooth hover effects and transitions
- 📱 Fully responsive (mobile-friendly)

### Interactive Elements
- Real-time total calculation
- Dynamic form fields
- Instant validation
- Copy-to-clipboard for offer links
- Animated page transitions

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📊 Data Structure

### Equity Packages Format
```javascript
{
  equity_units: 35000,              // Total
  equity_unit_type: 'iso',          // Primary
  equity_packages: [
    { equity_units: 25000, equity_unit_type: 'iso' },
    { equity_units: 10000, equity_unit_type: 'rsu' }
  ]
}
```

## 🎯 Key Benefits

### For Recruiters
✅ Flexible compensation packages
✅ Easy-to-use interface
✅ Professional presentations
✅ Shareable links
✅ Real-time previews

### For Candidates
✅ Clear compensation breakdown
✅ Interactive calculator
✅ Beautiful, engaging UI
✅ Transparent equity details
✅ Mobile-friendly viewing

## 📱 Testing the Feature

1. **Create a mixed equity offer:**
   - Go to `/offer/manage`
   - Create new offer with 2-3 equity packages
   - Use different types (ISO, NSO, RSU)

2. **View the offer:**
   - Copy the generated link
   - Open in new tab
   - Scroll through all sections
   - Check the equity breakdown cards
   - Test the calculator

3. **Verify responsive design:**
   - Resize browser window
   - Test on mobile viewport
   - Check all interactions work

## 🚀 Next Steps

The app is ready to use! You can:
1. Create test offers with mixed equity
2. Customize the design/colors in CSS files
3. Add more features as needed
4. Connect to a backend API for persistence
5. Add authentication for recruiters

## 📝 Notes

- Data is stored in React Context (in-memory)
- Refreshing the page will reset to sample data
- To persist data, add localStorage or backend API
- All fields are required for form submission
- Minimum 1 equity package required

---

**Enjoy your new offer portal!** 🎉

For questions about the equity packages feature, see `EQUITY_PACKAGES_FEATURE.md`

