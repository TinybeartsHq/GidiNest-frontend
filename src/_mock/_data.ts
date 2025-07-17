import {
  _id,
  _price, // Will be repurposed for financial amounts
  _times,
  _company, // Will be repurposed for financial entities or goal types
  _boolean,
  _fullName, // Will remain for user names
  _taskNames, // Will be repurposed for financial tasks
  _postTitles, // Will be repurposed for financial tips titles
  _description, // Will be repurposed for financial descriptions
  _productNames, // Not directly used in GidiNest context, but keeping for completeness if needed elsewhere
} from './_mock'; // Assuming _mock contains helpers for generating random data

// ----------------------------------------------------------------------

export const _myAccount = {
  displayName: 'Olamide Financial', // A more Nigerian-sounding name
  email: 'olamide.f@gidinest.cc', // GidiNest domain
  photoURL: '/assets/images/avatar/avatar-gidinest-user.webp', // Placeholder for a GidiNest-specific user avatar
};

// ----------------------------------------------------------------------

export const _users = [...Array(24)].map((_, index) => ({
  id: _id(index),
  name: _fullName(index), // Generic full name is fine
  // Repurposing 'company' for 'savingsGoalType' or 'financialAdvisor'
  financialRole: _company(index % 5), // Using a limited set for financial roles/entities
  isVerified: _boolean(index),
  avatarUrl: `/assets/images/avatar/avatar-${index + 1}.webp`, // Keeping generic avatars for now
  status: index % 4 ? 'active' : 'inactive', // Changed 'banned' to 'inactive'
  phoneNumber: '08084828184',
  email: 'sdjkjd@kjks.com',
  role:
    [
      'Individual Saver',
      'Family Head',
      'Small Business Owner',
      'Financial Coach',
      'Investment Planner',
      'Pension Contributor',
      'Student Saver',
      'Retirement Planner',
      'Emergency Fund Builder',
      'New Parent Saver',
    ][index] || 'Individual Saver', // More relevant roles
}));


 
  export type TransactionProps = {
    id: string;
    avatarUrl: string; // Will generate based on _fullName
    name: string; // Repurposed for Transaction Description/Title (_postTitles)
    company: string; // Repurposed for Transaction Category/Source/Destination (_company)
    role: string; // Repurposed for Transaction Type (Debit/Credit)
    isVerified: boolean; // Repurposed for a transaction verification status (_boolean)
    status: 'Completed' | 'Pending' | 'Failed'; // Actual transaction status
    createdAt: string; // Repurposed for Transaction Date/Time (_times)
    balance: number; // Repurposed for Transaction Amount (_price)
    email: string; // Repurposed for Transaction Reference ID
    phoneNumber: string; // Repurposed for a conceptual involved party phone
    address: string; // Repurposed for detailed transaction notes (_description)
  };

  // This array will now be used by the TransactionsView component.
  // It explicitly constructs objects that match the TransactionProps interface.
export const _transactions_data: TransactionProps[] = Array.from({ length: 24 }).map((_, index) => {
    const transactionType = index % 3 === 0 ? 'Credit' : 'Debit'; // Vary types
    const transactionStatus = _boolean(index)
      ? 'Completed' // If _boolean is true, mark as Completed
      : index % 2 === 0
        ? 'Pending' // Otherwise, alternate between Pending and Failed
        : 'Failed';

    return {
      id: _id(index),
      avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`, // Example avatar URL
      name: _postTitles(index), // Transaction Description
      company: _company(index), // Transaction Category
      role: transactionType, // 'Debit' or 'Credit'
      isVerified: _boolean(index), // Whether transaction is verified/finalized
      status: transactionStatus, // 'Completed', 'Pending', 'Failed'
      createdAt: _times(index), // Transaction Date/Time
      balance: _price(index), // Transaction Amount
      email: `TXN-${_id(index).substring(_id(index).length - 6)}@gidinest.com`, // Example: Transaction Reference ID
      phoneNumber: `+234${index}87654321`, // Example: Conceptual initiator/recipient phone
      address: _description(index), // Detailed notes for the transaction
    };
  });

// ----------------------------------------------------------------------

export const _posts = [...Array(23)].map((_, index) => ({
  id: _id(index),
  title: _postTitles(index), // Keeping original helper for variety, assume it generates suitable financial tips
  description: _description(index), // Assuming this generates relevant descriptions
  coverUrl: `/assets/images/cover/cover-${index + 1}.webp`, // Placeholder for finance-related cover images
  totalViews: Math.floor(Math.random() * 10000) + 1000, // Randomized views
  totalComments: Math.floor(Math.random() * 1000) + 100, // Randomized comments
  totalShares: Math.floor(Math.random() * 500) + 50, // Randomized shares
  totalFavorites: Math.floor(Math.random() * 1500) + 200, // Randomized favorites
  postedAt: _times(index),
  author: {
    name: _fullName(index),
    avatarUrl: `/assets/images/avatar/avatar-${index + 1}.webp`,
  },
}));

// ----------------------------------------------------------------------

const GIDINEST_COLORS = [
  '#00AB55', // Green for growth/success
  '#36B37E', // Lighter Green
  '#FFC107', // Amber for warnings/attention
  '#FFAB00', // Lighter Amber
  '#00B8D9', // Teal for innovation
  '#006B70', // Darker Teal
  '#637381', // Grey for neutrality
  '#919EAB', // Lighter Grey
];

export const _products = [...Array(24)].map((_, index) => {
  const setIndex = index + 1;

  return {
    id: _id(index),
    amount: _price(index), // 'price' renamed to 'amount' for financial context
    name: _productNames(index), // Assume _productNames can generate financial product names (e.g., "Fixed Deposit Plan", "Education Savings Account")
    // priceSale repurposed as a special offer amount or bonus rate
    specialOfferAmount: setIndex % 3 ? null : _price(index),
    // coverUrl might represent an icon or graphic for the savings plan
    coverUrl: `/assets/images/cover/cover-${setIndex}.webp`, // Placeholder for plan specific images
    colors: // Representing associated colors for product categories
      (setIndex === 1 && GIDINEST_COLORS.slice(0, 2)) ||
      (setIndex === 2 && GIDINEST_COLORS.slice(1, 3)) ||
      (setIndex === 3 && GIDINEST_COLORS.slice(2, 4)) ||
      (setIndex === 4 && GIDINEST_COLORS.slice(3, 6)) ||
      (setIndex === 23 && GIDINEST_COLORS.slice(4, 6)) ||
      (setIndex === 24 && GIDINEST_COLORS.slice(5, 6)) ||
      GIDINEST_COLORS,
    status: // Status reflecting plan availability or new offers
      ([1, 3, 5].includes(setIndex) && 'popular') || ([4, 8, 12].includes(setIndex) && 'new') || '',
  };
});

// ----------------------------------------------------------------------

export const _langs = [
  {
    value: 'en',
    label: 'English',
    icon: '/assets/icons/flags/ic-flag-en.svg', // English is primary
  },
  {
    value: 'ha',
    label: 'Hausa',
    icon: '/assets/icons/flags/ic-flag-ng.svg', // Nigerian flag for local languages
  },
  {
    value: 'ig',
    label: 'Igbo',
    icon: '/assets/icons/flags/ic-flag-ng.svg',
  },
  {
    value: 'yo',
    label: 'Yoruba',
    icon: '/assets/icons/flags/ic-flag-ng.svg',
  },
];

// ----------------------------------------------------------------------

export const _timeline = [...Array(5)].map((_, index) => ({
  id: _id(index),
  title: [
    'Deposited ₦4,220 into Emergency Fund',
    'Goal "Education Fund" 80% funded!',
    'Withdrawal of ₦5,000 from General Savings',
    'New Savings Goal created: "House Downpayment"',
    'Received ₦10,000 bonus into Investment Account',
  ][index],
  type: `financial-event-${index + 1}`, // More descriptive type
  time: _times(index),
}));

export const _traffic = [
  // Repurposing traffic sources to financial goal categories or top performing goals
  {
    value: 'education',
    label: 'Education Fund',
    total: 91200, // Amount saved towards this goal
  },
  {
    value: 'housing',
    label: 'House Downpayment',
    total: 195000,
  },
  {
    value: 'emergency',
    label: 'Emergency Fund',
    total: 69800,
  },
  {
    value: 'retirement',
    label: 'Retirement Savings',
    total: 84900,
  },
  {
    value: 'travel',
    label: 'Travel Savings',
    total: 35000,
  },
];

export const _tasks = Array.from({ length: 5 }, (_, index) => ({
  id: _id(index),
  name: [
    'Review Q3 Savings Goals',
    'Set Up Auto-Deposit for Next Month',
    'Research GidiNest Investment Options',
    'Update "Baby Needs" Goal Budget',
    'Complete Financial Literacy Module 3',
  ][index],
  completed: _boolean(index % 2), // Randomly mark as true/false
}));

// ----------------------------------------------------------------------

export const _notifications = [
  {
    id: _id(1),
    title: 'Your deposit was successful!',
    description: '₦5,000 added to your Emergency Fund',
    avatarUrl: null, // No avatar needed for this type
    type: 'deposit-success',
    postedAt: _times(1),
    isUnRead: true,
  },
  {
    id: _id(2),
    title: _fullName(2), // Assuming a contact for a financial advisor or family member
    description: 'sent you a new savings challenge!',
    avatarUrl: '/assets/images/avatar/avatar-3.webp', // Generic avatar for a person
    type: 'challenge-invite',
    postedAt: _times(2),
    isUnRead: true,
  },
  {
    id: _id(3),
    title: 'New message from GidiNest Support',
    description: 'You have 2 unread messages regarding your account',
    avatarUrl: '/assets/icons/gidinest/ic-support.svg', // Placeholder for support icon
    type: 'support-message',
    postedAt: _times(3),
    isUnRead: false,
  },
  {
    id: _id(4),
    title: 'Goal "New Home" is 50% funded!',
    description: 'Keep up the great work!',
    avatarUrl: '/assets/icons/gidinest/ic-goal-achieved.svg', // Placeholder for achievement icon
    type: 'goal-progress',
    postedAt: _times(4),
    isUnRead: false,
  },
  {
    id: _id(5),
    title: 'Upcoming Bill Reminder',
    description: 'Your utility bill of ₦15,000 is due in 3 days',
    avatarUrl: null, // No avatar needed for this type
    type: 'bill-reminder',
    postedAt: _times(5),
    isUnRead: false,
  },
];