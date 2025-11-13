# Dashboard Metrics Requirements

## API Endpoint
**GET** `/api/v1/savings/dashboard-analytics`

## Expected Response Format

```json
{
  "status": true,
  "message": "Dashboard analytics retrieved successfully",
  "data": {
    "total_savings_balance": "50000.00",
    "currency": "₦",
    "active_savings_goals": 3,
    "monthly_contributions": "15000.00",
    "goals_achieved_ytd": 2,
    "monthly_contributions_change_percent": 15.5,
    "goals_achieved_ytd_change_percent": 25.0,
    "savings_growth_data": {
      "categories": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      "total_savings_series": [10000, 15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 65000],
      "monthly_deposits_series": [5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000, 5000]
    },
    "goal_progress_data": {
      "categories": ["Education", "Housing", "Health", "Travel", "Emergency"],
      "progress_series": [50000, 30000, 20000, 15000, 10000],
      "target_series": [100000, 500000, 50000, 30000, 50000]
    }
  }
}
```

## Required Fields

### 1. Basic Metrics (Required)
- `total_savings_balance` (string/number): Total balance across all savings goals and wallet
- `currency` (string): Currency symbol (default: "₦")
- `active_savings_goals` (number): Count of active savings goals
- `monthly_contributions` (string/number): Total contributions in current month
- `goals_achieved_ytd` (number): Number of goals completed year-to-date
- `monthly_contributions_change_percent` (number): Percentage change in monthly contributions (can be negative)
- `goals_achieved_ytd_change_percent` (number): Percentage change in goals achieved YTD

### 2. Savings Growth Chart Data (Optional but Recommended)
- `savings_growth_data` (object):
  - `categories` (array of strings): Month labels (e.g., ["Jan", "Feb", "Mar"])
  - `total_savings_series` (array of numbers): Total savings balance over time
  - `monthly_deposits_series` (array of numbers): Monthly deposit amounts

### 3. Goal Progress Chart Data (Optional but Recommended)
- `goal_progress_data` (object):
  - `categories` (array of strings): Goal category names
  - `progress_series` (array of numbers): Current progress amounts
  - `target_series` (array of numbers): Target amounts for each category

## Current Implementation

The dashboard displays:
1. **Total Savings Balance** - Shows total balance with percentage change
2. **Active Savings Goals** - Count of active goals
3. **Monthly Contributions** - Current month contributions with percentage change
4. **Goals Achieved (YTD)** - Year-to-date completed goals count
5. **Savings Growth Over Time** - Bar chart (currently showing placeholder data)
6. **Goal Progress Status** - Horizontal bar chart (currently showing placeholder data)

## Notes

- **IMPORTANT: Months MUST be ordered from January (Jan) to December (Dec)** - NOT starting with December
- If chart data is not provided, the dashboard will show placeholder zeros
- Percentage changes can be positive (increase) or negative (decrease)
- All monetary values should be in the smallest currency unit (e.g., kobo for Naira)
- The frontend handles currency formatting automatically and displays all values in Naira (₦)
- Chart tooltips will display values in Naira format (₦)

