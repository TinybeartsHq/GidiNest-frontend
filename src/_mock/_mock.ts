export const _id = (index: number) => `gdn-id-7a-cc88-49d5-b1c8-1d-a80c2d7b${index}`; // GidiNest-specific ID prefix

export const _times = (index: number) => {
  const dates = [
    '07/15/2025', // Yesterday
    '07/14/2025', // Day before yesterday
    '07/12/2025',
    '07/10/2025',
    '07/08/2025',
    '07/05/2025',
    '07/03/2025',
    '06/30/2025',
    '06/28/2025',
    '06/25/2025',
    '06/22/2025',
    '06/20/2025',
    '06/18/2025',
    '06/15/2025',
    '06/10/2025',
    '06/05/2025',
    '05/30/2025',
    '05/25/2025',
    '05/20/2025',
    '05/15/2025',
    '05/10/2025',
    '05/05/2025',
    '04/30/2025',
    '04/25/2025',
  ];
  return dates[index];
};

export const _fullName = (index: number) =>
  [
    'Aisha Abubakar',
    'Segun Oladipo',
    'Funke Adebayo',
    'Chinedu Okoro',
    'Zainab Bello',
    'Kwame Mensah',
    'Ngozi Eze',
    'Tunde Badmus',
    'Fatima Ibrahim',
    'Kofi Adewale',
    'Bola Ahmed',
    'Musa Danjuma',
    'Amarachi Okeke',
    'Dayo Olubayo',
    'Halima Sani',
    'Emeka Nnadi',
    'Jumoke Alabi',
    'Obinna Chukwu',
    'Yusuf Suleiman',
    'Blessing Osagie',
    'Kemi Davies',
    'David Effiong',
    'Sandra Ezeh',
    'Peter Obi',
  ][index];

export const _price = (index: number) =>
  [
    50000.00, // Naira amounts for financial contexts
    12500.50,
    75000.00,
    2500.00,
    100000.00,
    30000.00,
    800.00, // Small amount, e.g., for micro-savings
    45000.00,
    1500.00,
    60000.00,
    7500.00,
    12000.00,
    90000.00,
    1800.00,
    35000.00,
    2200.00,
    5000.00,
    80000.00,
    1000.00,
    40000.00,
    6500.00,
    28000.00,
    5500.00,
    150000.00, // Larger amount
  ][index];

export const _company = (index: number) =>
  [
    'GidiNest Financial Advisory', // Financial service provider
    'Local Savings Cooperative',
    'Future Investments Ltd.',
    'PensionPlus Nigeria',
    'MicroFinance Innovations',
    'Youth Savings Network',
    'Homeownership Fund',
    'HealthShield Savings',
    'Education Trust Fund',
    'Agric-Invest Solutions',
    'Digital Wallet Services',
    'Community Contribution Scheme',
    'Estate Planning Partners',
    'Startup Seed Fund',
    'Tech-Enabled Savings',
    'Eco-Friendly Investments',
    'Diaspora Remit Savings',
    'Small Business Growth Loans',
    'Family Wealth Management',
    'Retirement Security Plan',
    'Fixed Income Portfolio',
    'Flexible Savings Solutions',
    'Impact Investment Group',
    'Asset Management Hub',
  ][index];

export const _boolean = (index: number) =>
  [
    true, // Account Verified / Goal Active
    false, // Account Unverified / Goal Inactive
    true,
    true,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    true,
    false,
    true,
    false,
    true,
    false,
    true,
    true,
    false,
    true,
    false,
    true,
    true,
  ][index];

export const _postTitles = (index: number) =>
  [
    '5 Smart Ways to Save for Your Child’s Education in Nigeria', // Financial Tip
    'Understanding the Power of Compound Interest with GidiNest', // Financial Education
    'Your Step-by-Step Guide to Creating an Emergency Fund', // Financial Guide
    'Navigating Inflation: Protecting Your Naira Savings', // Economic Insight
    'Building a Strong Credit Score in Nigeria: What You Need to Know', // Financial Literacy
    'Top Investment Opportunities for Young Nigerians in 2025', // Investment Advice
    'How GidiNest Helps You Achieve Your Homeownership Dreams', // GidiNest Feature
    'The Importance of Budgeting: Your First Step to Financial Freedom', // Budgeting Tips
    'Understanding Different Savings Plans: Which One is Right for You?', // Product Comparison
    'Securing Your Retirement: A GidiNest Guide', // Retirement Planning
    'Debt Management Strategies for a Healthier Financial Future', // Debt Management
    'Micro-Savings: Small Steps to Big Financial Wins', // Savings Strategy
    'Choosing the Best Digital Payment Gateway for Your Transactions', // Payment Systems
    'Diversifying Your Portfolio: Beyond Basic Savings', // Investment Diversification
    'GidiNest Security Features: Protecting Your Funds', // Security
    'Real-Life Success Stories: How Nigerians are Saving with GidiNest', // Testimonials
    'The Future of Personal Finance in Nigeria', // Industry Trends
    'Community Forum: Share Your Savings Tips!', // Community Engagement
    'Understanding the Naira Exchange Rate Impact on Your Investments', // Economic Impact
    'GidiNest Mobile App: Features to Optimize Your Savings', // App Feature
    'Why a Family Savings Goal is Essential for Every Household', // Family Finance
    'Mastering Your Money: Financial Habits for Success', // Financial Habits
    'Benefits of Automated Savings Plans', // Automation Benefits
    'How to Choose Your First Investment Product', // Beginner Investments
  ][index];

export const _description = (index: number) =>
  [
    'Learn how to set up dedicated education savings accounts and explore investment options for your child\'s future.', // Detail for financial tip
    'Discover how your money can grow exponentially over time, even with small, consistent contributions.',
    'A comprehensive guide to building a robust emergency fund to cover unexpected expenses and provide peace of mind.',
    'Strategies to safeguard your savings from the effects of inflation and maintain your purchasing power.',
    'Essential steps and practices to improve and maintain a healthy credit score in the Nigerian financial landscape.',
    'Explore high-potential investment avenues like mutual funds, real estate, and tech stocks suitable for Nigerians.',
    'Find out how GidiNest\'s tailored savings plans and expert advice can accelerate your journey to owning a home.',
    'Unlock the secrets to effective budgeting that empowers you to control your spending and increase your savings.',
    'A breakdown of various savings accounts, from fixed deposits to target savings, to help you make informed decisions.',
    'Comprehensive guidance on planning for a secure and comfortable retirement, starting today with GidiNest.',
    'Practical steps and expert advice on managing and reducing debt to achieve financial freedom faster.',
    'Explore the impact of saving small amounts consistently and how it adds up to significant financial gains.',
    'A detailed comparison of payment gateways like Paystack and Flutterwave for seamless deposit and withdrawal experiences.',
    'Strategies for spreading your investments across different asset classes to minimize risk and maximize returns.',
    'Understand the robust security measures GidiNest employs to ensure the safety and integrity of your financial data.',
    'Inspiring stories from real GidiNest users who have successfully achieved their financial milestones.',
    'An overview of emerging trends and technologies shaping the future of personal finance services in Nigeria.',
    'Join our forum to exchange valuable savings strategies and financial insights with fellow GidiNest users.',
    'Analyze how fluctuations in the Naira exchange rate can influence the value of your local and foreign investments.',
    'A deep dive into the user-friendly features of the GidiNest mobile app designed to simplify your savings journey.',
    'Understand why setting collective financial goals for your family can foster financial stability and collaboration.',
    'Cultivate healthy money habits, from tracking expenses to regular savings, for a prosperous financial life.',
    'Discover how automating your savings can remove the guesswork and ensure you consistently hit your financial targets.',
    'A beginner-friendly guide to choosing your first investment product based on your risk tolerance and financial goals.',
  ][index];

export const _taskNames = (index: number) =>
  [
    `Review Monthly Budget`, // Financial task
    `Deposit into Education Goal`, // Savings action
    `Check Investment Portfolio`, // Investment action
    `Set Up New Savings Goal`, // Goal management
    `Read GidiNest Financial Tip`, // Educational task
    `Update Profile Information`, // Account management
    `Pay Utility Bill`, // Bill payment reminder
    `Transfer Funds to Main Account`, // Fund transfer
    `Verify Account Details`, // Security/Compliance task
    `Participate in Community Poll`, // Community engagement
    `Complete Financial Literacy Module`, // Learning
    `Schedule Withdrawal`, // Withdrawal planning
    `Review Loan Application Status`, // Loan management
    `Refer a Friend to GidiNest`, // Referral program
    `Adjust Auto-Deposit Amount`, // Automation adjustment
    `Check Upcoming Reminders`, // Reminder management
    `Report Transaction Issue`, // Support task
    `Explore New Investment Products`, // Product exploration
    `Submit Tax Documents`, // Tax related
    `Update Emergency Fund Target`, // Goal adjustment
    `Analyze Spending Habits`, // Financial analysis
    `Secure Two-Factor Authentication`, // Security enhancement
    `Plan Holiday Savings`, // Specific savings goal
    `Provide App Feedback`, // Feedback
  ][index];

export const _productNames = (index: number) =>
  [
    'Fixed Deposit Plan (6 Months)', // Financial Product/Savings Plan
    'Education Savings Account',
    'Target Savings Goal (House)',
    'Emergency Buffer Fund',
    'Retirement Investment Portfolio',
    'Flexible Savings Account',
    'Travel Fund Goal (Dubai)',
    'Children\'s Future Plan',
    'Health Savings Plan',
    'Wedding Savings Goal',
    'Car Purchase Fund',
    'Small Business Startup Loan',
    'Diapers & Baby Essentials Fund',
    'Monthly Bills Automation',
    'Investment Growth Fund (Low Risk)',
    'GidiNest Premium Savings',
    'Smart Saver Account',
    'Personal Loan (Quick)',
    'Diaspora Investment Plan',
    'Community Contribution Pool',
    'Digital Wallet Balance',
    'Fixed Deposit Plan (12 Months)',
    'Micro-Investment Option',
    'Long-Term Wealth Builder',
  ][index];