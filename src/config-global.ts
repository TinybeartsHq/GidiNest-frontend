import packageJson from '../package.json';

export type ConfigValue = {
  appName: string;
  appVersion: string;
};

export const CONFIG: ConfigValue = {
  appName: 'Gidinest',
  appVersion: packageJson.version,
};

// Account Tier Configuration
export type TierLimits = {
  dailyTransactionLimit: number | null; // Daily transaction limit (null means unlimited)
  cumulativeTransactionLimit: number | null; // Cumulative transaction limit (null means unlimited)
  balanceLimit: number | null; // Wallet balance limit (null means unlimited)
  requirements: string; // KYC requirements for this tier
};

export type AccountTier = 'Tier 1' | 'Tier 2' | 'Tier 3';

export const ACCOUNT_TIER_LIMITS: Record<AccountTier, TierLimits> = {
  'Tier 1': {
    dailyTransactionLimit: 50000, // ₦50,000 per day
    cumulativeTransactionLimit: 300000, // ₦300,000 cumulative
    balanceLimit: 300000, // ₦300,000 max balance
    requirements: 'BVN or NIN',
  },
  'Tier 2': {
    dailyTransactionLimit: 100000, // ₦100,000 per day
    cumulativeTransactionLimit: 500000, // ₦500,000 cumulative
    balanceLimit: 500000, // ₦500,000 max balance
    requirements: 'BVN and NIN',
  },
  'Tier 3': {
    dailyTransactionLimit: null, // Unlimited
    cumulativeTransactionLimit: null, // Unlimited
    balanceLimit: null, // Unlimited
    requirements: 'BVN and NIN + Proof of Address',
  },
};

// Helper function to format currency
export const formatTierLimit = (amount: number | null, currency = '₦'): string => {
  if (amount === null) {
    return 'Unlimited';
  }
  return `${currency}${amount.toLocaleString('en-NG')}`;
};

// Helper function to get tier limits with formatted strings
export const getTierLimits = (tier: AccountTier | string | undefined) => {
  // Map old tier names to new tier names for backward compatibility
  const tierMapping: Record<string, AccountTier> = {
    'Basic': 'Tier 1',
    'Standard': 'Tier 2',
    'Premium': 'Tier 3',
    'Tier 1': 'Tier 1',
    'Tier 2': 'Tier 2',
    'Tier 3': 'Tier 3',
  };

  // Normalize the tier value - handle undefined, null, or unexpected values
  const mappedTier = tier ? tierMapping[tier] || 'Tier 1' : 'Tier 1';
  const limits = ACCOUNT_TIER_LIMITS[mappedTier];

  return {
    ...limits,
    dailyTransactionLimitFormatted: `${formatTierLimit(limits.dailyTransactionLimit)}/day`,
    cumulativeTransactionLimitFormatted: formatTierLimit(limits.cumulativeTransactionLimit),
    balanceLimitFormatted: formatTierLimit(limits.balanceLimit),
  };
};
