import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Box, Alert, Button, CircularProgress } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { _posts } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsNews } from '../analytics-news';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';
import { fetchUserProfile } from '../../../redux/userProfile/userProfile.actions';
import { getSavingsGoals, getDashboardAnalytics } from '../../../redux/savings/savings.actions';

import type { AppDispatch } from '../../../redux/types';

export function OverviewAnalyticsView() {
  
  const { dashboardAnalytics, loading, error } = useSelector((state: any) => state.savings);
  const { profile: userProfile } = useSelector((state: any) => state.profile);
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      await dispatch(fetchUserProfile());
    };

    fetchProfile();
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getDashboardAnalytics());
      dispatch(getSavingsGoals());
    } else if (isAuthenticated === false) {
      router.push('/');
    }
  }, [dispatch, isAuthenticated, router]);

  const formatCurrency = (amount: string | number | null | undefined, currency = '₦') => {
    if (currency == 'NGN') currency = '₦';
    if (amount === null || amount === undefined || amount === '') return `${currency}0`;
    const numericAmount = parseFloat(String(amount));
    if (isNaN(numericAmount)) return `${currency}0`;
    return `${currency}${numericAmount.toLocaleString('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  if (loading && !dashboardAnalytics) {
    return (
      <DashboardContent maxWidth="xl">
        <Box
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}
        >
          <CircularProgress size={60} />
          <Typography variant="h5" sx={{ ml: 2 }}>
            Loading your dashboard...
          </Typography>
        </Box>
      </DashboardContent>
    );
  }

  if (error) {
    return (
      <DashboardContent maxWidth="xl">
        <Alert severity="error" sx={{ my: 4 }}>
          <Typography variant="h6">Error loading dashboard data:</Typography>
          <Typography>{error}</Typography>
          <Button onClick={() => dispatch(getDashboardAnalytics())} sx={{ mt: 1 }}>
            Retry
          </Button>
        </Alert>
      </DashboardContent>
    );
  }

  const analyticsData = dashboardAnalytics || {
    total_savings_balance: '0.00',
    currency: '₦',
    active_savings_goals: 0,
    monthly_contributions: '0',
    goals_achieved_ytd: 0,
    monthly_contributions_change_percent: 0.0,
    goals_achieved_ytd_change_percent: 0.0,
    savings_growth_data: null,
    goal_progress_data: null,
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Welcome {userProfile?.first_name}!
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Total Savings Balance"
            percent={analyticsData.monthly_contributions_change_percent}
            total={formatCurrency(analyticsData.total_savings_balance, analyticsData.currency)}
            icon={<img alt="Savings Balance" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              series: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Active Savings Goals"
            percent={0}
            total={analyticsData.active_savings_goals}
            color="secondary"
            icon={<img alt="Active Goals" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              series: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Monthly Contributions"
            percent={analyticsData.monthly_contributions_change_percent}
            total={formatCurrency(analyticsData.monthly_contributions, analyticsData.currency)}
            color="warning"
            icon={<img alt="Monthly Contributions" src="/assets/icons/glass/ic-glass-buy.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              series: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Goals Achieved (YTD)"
            percent={analyticsData.goals_achieved_ytd_change_percent}
            total={analyticsData.goals_achieved_ytd.toString()}
            color="error"
            icon={<img alt="Goals Achieved" src="/assets/icons/glass/ic-glass-message.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              series: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
          <AnalyticsWebsiteVisits
            title="Savings Growth Over Time"
            subheader={
              analyticsData.savings_growth_data?.categories?.length > 0
                ? "Your savings growth trend"
                : "(Data currently unavailable)"
            }
            chart={{
              categories: analyticsData.savings_growth_data?.categories || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
              series: analyticsData.savings_growth_data
                ? [
                    { 
                      name: 'Total Savings', 
                      data: analyticsData.savings_growth_data.total_savings_series || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
                    },
                    { 
                      name: 'Monthly Deposits', 
                      data: analyticsData.savings_growth_data.monthly_deposits_series || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] 
                    },
                  ]
                : [
                    { name: 'Total Savings', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                    { name: 'Monthly Deposits', data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
                  ],
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
          <AnalyticsConversionRates
            title="Goal Progress Status"
            subheader={
              analyticsData.goal_progress_data?.categories?.length > 0
                ? "Overview of your savings goals"
                : "No goal data available yet"
            }
            chart={{
              categories: analyticsData.goal_progress_data?.categories || ['Education', 'Housing', 'Health', 'Travel', 'Emergency'],
              series: analyticsData.goal_progress_data
                ? [
                    { 
                      name: 'Progress (₦)', 
                      data: analyticsData.goal_progress_data.progress_series || [0, 0, 0, 0, 0] 
                    },
                    { 
                      name: 'Target (₦)', 
                      data: analyticsData.goal_progress_data.target_series || [0, 0, 0, 0, 0] 
                    },
                  ]
                : [
                    { name: 'Progress (₦)', data: [0, 0, 0, 0, 0] },
                    { name: 'Target (₦)', data: [0, 0, 0, 0, 0] },
                  ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
          <AnalyticsNews title="Financial Tips" list={_posts.slice(0, 5)} />
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
