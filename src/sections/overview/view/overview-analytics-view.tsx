import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect, useCallback } from 'react';

import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Box, Alert, Stack, Button, TextField, CircularProgress } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

// Sticking to ONLY these existing mock data imports
import { _posts, _tasks, _traffic } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsNews } from '../analytics-news';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';
import { updateBVN ,
  fetchUserProfile
} from '../../../redux/userProfile/userProfile.actions';
import { getSavingsGoals, getDashboardAnalytics, } from '../../../redux/savings/savings.actions';

import type { AppDispatch } from '../../../redux/types';

export function OverviewAnalyticsView() {
  // State to manage modal visibility
  const [openBvnModal, setOpenBvnModal] = useState(false);
  // State for BVN input
  const [bvn, setBvn] = useState('');
  // State for verification status (e.g., 'idle', 'loading', 'success', 'error')
  const [verificationStatus, setVerificationStatus] = useState('idle');
  // State to simulate user verification status (this would come from auth context/backend)
  const [isAccountVerified, setIsAccountVerified] = useState(false); // Assume unverified initially for demo

  // Get data and status from Redux store
  const { dashboardAnalytics, loading, error } = useSelector((state: any) => state.savings);
  const { profile: userProfile} = useSelector((state: any) => state.profile);
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
    if (userProfile && !userProfile.has_bvn) {
      setOpenBvnModal(true);
    }
  }, [userProfile]);
 

  const handleBvnInputChange = useCallback((event: { target: { value: string; }; }) => {
    const value = event.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
      setBvn(value);
    }
  }, []);

  const handleVerifyBvn = useCallback(async () => {
    if (bvn.length !== 11) {
      setVerificationStatus('error');
      return;
    }

    setVerificationStatus('loading');

    const result = await dispatch(updateBVN(bvn));
    if (result.success) {
      setVerificationStatus('success');// Exit editing mode on successful save
      setIsAccountVerified(true);

      await dispatch(fetchUserProfile());
      
      // The Redux reducer will update userProfile, and the useEffect will resync editedProfile
    }
    else{
      setVerificationStatus('error');
      setIsAccountVerified(false);
    }

 
  }, [bvn]);

  const handleCloseBvnModal = useCallback(() => {
    if (verificationStatus !== 'loading') {
      setOpenBvnModal(false);
      setVerificationStatus('idle');
      setBvn('');
    }
  }, [verificationStatus]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getDashboardAnalytics());
      dispatch(getSavingsGoals());
    } else if (isAuthenticated === false) {
      router.push('/');
    }
  }, [dispatch, isAuthenticated, router]);


  const formatCurrency = (amount: string | number | null | undefined, currency = '₦') => {
    console.log(amount)
    if (currency == "NGN") currency = '₦'
    if (amount === null || amount === undefined) return `${currency}0`;
    const numericAmount = parseFloat(String(amount));
    return `${currency}${numericAmount.toLocaleString('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  if (loading && !dashboardAnalytics) {
    return (
      <DashboardContent maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress size={60} />
          <Typography variant="h5" sx={{ ml: 2 }}>Loading your dashboard...</Typography>
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
          <Button onClick={() => dispatch(getDashboardAnalytics())} sx={{ mt: 1 }}>Retry</Button>
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
  };

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Welcome {userProfile?.first_name}!
      </Typography>

      <Grid container spacing={3}>
        {/* Row 1: Key Financial Summaries - Populated with Redux data */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Total Savings Balance"
            percent={analyticsData.monthly_contributions_change_percent} // Using a relevant percentage
            total={formatCurrency(analyticsData.total_savings_balance, analyticsData.currency)}
            icon={<img alt="Savings Balance" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [0, 0, 0, 0, 0, 0, 0, 0], // Set to zeros
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Active Savings Goals"
            percent={0} // No direct percentage from API for this, setting to 0
            total={analyticsData.active_savings_goals}
            color="secondary"
            icon={<img alt="Active Goals" src="/assets/icons/glass/ic-glass-users.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [0, 0, 0, 0, 0, 0, 0, 0], // Set to zeros
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
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [0, 0, 0, 0, 0, 0, 0, 0], // Set to zeros
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
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [0, 0, 0, 0, 0, 0, 0, 0], // Set to zeros
            }}
          />
        </Grid>

        {/* Row 2: Charts for Savings Distribution and Growth - Set to zeros/empty */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentVisits
            title="Savings Distribution by Goal"
            chart={{
              series: [
                { label: 'Education Fund', value: 0 },
                { label: 'Home Savings', value: 0 },
                { label: 'Emergency Fund', value: 0 },
                { label: 'Travel Fund', value: 0 },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsWebsiteVisits
            title="Savings Growth Over Time"
            subheader="(Data currently unavailable)"
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [
                { name: 'Total Savings', data: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
                { name: 'Monthly Deposits', data: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
              ],
            }}
          />
        </Grid>

        {/* Row 3: Goal Progress and Categories Performance - Set to zeros/empty */}
        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsConversionRates
            title="Goal Progress Status"
            subheader="Overview of your savings goals"
            chart={{
              categories: ['Education', 'Housing', 'Health', 'Travel', 'Emergency'],
              series: [
                { name: 'Progress (₦)', data: [0, 0, 0, 0, 0] },
                { name: 'Target (₦)', data: [0, 0, 0, 0, 0] },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentSubject
            title="Savings Categories Performance"
            chart={{
              categories: ['Education', 'Housing', 'Health', 'Travel', 'Lifestyle', 'Investments'],
              series: [
                { name: 'Efficiency Score', data: [0, 0, 0, 0, 0, 0] },
                { name: 'Goal Attainment', data: [0, 0, 0, 0, 0, 0] },
                { name: 'Savings Rate', data: [0, 0, 0, 0, 0, 0] },
              ],
            }}
          />
        </Grid>

        {/* Row 4: Financial Tips and Recent Activity - Using _posts and _timeline */}
        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
          <AnalyticsNews title="Financial Tips" list={_posts.slice(0, 5)} />
        </Grid>

        {/* Row 5: Top Savings Goal Categories and Upcoming Financial Reminders - Using _traffic and _tasks */}
        {/* <Grid size={{ xs: 12, md: 12, lg: 12 }}>
          <AnalyticsTrafficBySite title="Top Savings Goal Categories" list={_traffic} />
        </Grid>

        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
          <AnalyticsTasks title="Upcoming Financial Reminders" list={_tasks} />
        </Grid> */}
      </Grid>

      {/* BVN Verification Modal */}
      <Dialog
        open={openBvnModal && !isAccountVerified}
        onClose={handleCloseBvnModal}
        aria-labelledby="bvn-verification-title"
        disableEscapeKeyDown={verificationStatus === 'loading'}
        PaperProps={{
          sx: {
            minWidth: { xs: '90%', sm: 400 },
            p: 2,
          },
        }}
      >
        <DialogTitle id="bvn-verification-title" sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6">Verify Your Account</Typography>
          </Stack>
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 2, pb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            To unlock all GidiNest features and ensure the security of your funds, please verify your account with your Bank Verification Number (BVN).
          </Typography>
          <TextField
            fullWidth
            label="Enter BVN (11 Digits)"
            variant="outlined"
            value={bvn}
            onChange={handleBvnInputChange}
            inputProps={{ maxLength: 11 }}
            error={verificationStatus === 'error' && bvn.length !== 11}
            helperText={
              (verificationStatus === 'error' && bvn.length !== 11)
                ? 'BVN must be 11 digits.'
                : 'Your BVN is secure and used for verification purposes only.'
            }
            sx={{ mb: 2 }}
            disabled={verificationStatus === 'loading'}
          />

          {verificationStatus === 'loading' && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
              <CircularProgress />
            </Box>
          )}

          {verificationStatus === 'success' && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Account successfully verified! 🎉
            </Alert>
          )}

          {verificationStatus === 'error' && bvn.length === 11 && (
            <Alert severity="error" sx={{ mb: 2 }}>
              Verification failed. Please check your BVN and try again.
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseBvnModal}
            color="inherit"
            disabled={verificationStatus === 'loading'}
          >
            Later
          </Button>
          <Button
            onClick={handleVerifyBvn}
            variant="contained"
            color="primary"
            disabled={bvn.length !== 11 || verificationStatus === 'loading'}
          >
            {verificationStatus === 'loading' ? 'Verifying...' : 'Verify Now'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}