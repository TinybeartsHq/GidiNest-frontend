import React, { useState, useEffect, useCallback } from 'react';

import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog'; // Import Dialog for the modal
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Box, Alert, Slide, Stack, Button, TextField, CircularProgress } from '@mui/material';

// Sticking to ONLY these existing mock data imports
import { _posts, _tasks, _traffic } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { AnalyticsNews } from '../analytics-news';
import { AnalyticsTasks } from '../analytics-tasks';
import { AnalyticsCurrentVisits } from '../analytics-current-visits';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site';
import { AnalyticsCurrentSubject } from '../analytics-current-subject';
import { AnalyticsConversionRates } from '../analytics-conversion-rates';



export function OverviewAnalyticsView() {

  // State to manage modal visibility
    const [openBvnModal, setOpenBvnModal] = useState(false);
    // State for BVN input
    const [bvn, setBvn] = useState('');
    // State for verification status (e.g., 'idle', 'loading', 'success', 'error')
    const [verificationStatus, setVerificationStatus] = useState('idle');
    // State to simulate user verification status (this would come from auth context/backend)
    const [isAccountVerified, setIsAccountVerified] = useState(false); // Assume unverified initially for demo
  
    // Effect to check verification status on component mount
    useEffect(() => {
      // Simulate fetching user's verification status from a backend
      const checkVerificationStatus = () => {
        // In a real app: fetch from API
        // For simulation: assume user is NOT verified unless they've just completed the process
        const storedVerification = localStorage.getItem('gidinest_account_verified');
        if (storedVerification === 'true') {
          setIsAccountVerified(true);
        } else {
          setIsAccountVerified(false);
          setOpenBvnModal(true); // Open modal if not verified
        }
      };
  
      checkVerificationStatus();
    }, []); // Empty dependency array ensures this runs once on mount
  
    const handleBvnInputChange = useCallback((event: { target: { value: string; }; }) => {
      // Allow only numbers and limit length to 11 for BVN
      const value = event.target.value.replace(/\D/g, ''); // Remove non-digits
      if (value.length <= 11) {
        setBvn(value);
      }
    }, []);
  
    const handleVerifyBvn = useCallback(() => {
      if (bvn.length !== 11) {
        setVerificationStatus('error');
        return;
      }
  
      setVerificationStatus('loading');
  
      // Simulate API call for BVN verification
      setTimeout(() => {
        // Simulate success or failure randomly, or based on a specific BVN
        const isBvnValid = bvn === '12345678901' || Math.random() > 0.5; // Example: '12345678901' is always valid
  
        if (isBvnValid) {
          setVerificationStatus('success');
          setIsAccountVerified(true);
          localStorage.setItem('gidinest_account_verified', 'true'); // Persist verification
          setTimeout(() => setOpenBvnModal(false), 1500); // Close modal after success message
        } else {
          setVerificationStatus('error');
          setIsAccountVerified(false);
          localStorage.setItem('gidinest_account_verified', 'false'); // Persist verification failed
        }
      }, 2000); // Simulate network delay
    }, [bvn]);
  
    const handleCloseBvnModal = useCallback(() => {
      if (verificationStatus !== 'loading') { // Prevent closing during verification
        setOpenBvnModal(false);
        setVerificationStatus('idle'); // Reset status when closing
        setBvn(''); // Clear BVN input
      }
    }, [verificationStatus]);


  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
        Welcome to your GidiNest! 👋
      </Typography>

      <Grid container spacing={3}>
        {/* Row 1: Key Financial Summaries - Repurposing existing data structure */}
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Total Savings Balance (₦)" // GidiNest title
            percent={2.6}
            total={714000}
            icon={<img alt="Weekly sales" src="/assets/icons/glass/ic-glass-bag.svg" />} // Original icon path
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Active Savings Goals" // GidiNest title
            percent={-0.1}
            total={6} // Small number for active goals
            color="secondary"
            icon={<img alt="New users" src="/assets/icons/glass/ic-glass-users.svg" />} // Original icon path
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 47, 40, 62, 73, 30, 23, 54],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Monthly Contributions (₦)" // GidiNest title
            percent={2.8}
            total={1723315} // Can represent accumulated monthly contributions
            color="warning"
            icon={<img alt="Purchase orders" src="/assets/icons/glass/ic-glass-buy.svg" />} // Original icon path
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [40, 70, 50, 28, 70, 75, 7, 64],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Goals Achieved (YTD)" // GidiNest title
            percent={3.6}
            total={234} // Can represent number of goals achieved
            color="error" // Reusing 'error' color
            icon={<img alt="Messages" src="/assets/icons/glass/ic-glass-message.svg" />} // Original icon path
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [56, 30, 23, 54, 47, 40, 62, 73],
            }}
          />
        </Grid>

        {/* Row 2: Charts for Savings Distribution and Growth - Repurposing existing data structure */}
        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentVisits
            title="Savings Distribution by Goal" // GidiNest title
            chart={{
              series: [
                { label: 'Education Fund', value: 3500 }, // Repurposing labels for goals
                { label: 'Home Savings', value: 2500 },
                { label: 'Emergency Fund', value: 1500 },
                { label: 'Travel Fund', value: 500 },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsWebsiteVisits
            title="Savings Growth Over Time" // GidiNest title
            subheader="(+15%) than last quarter" // Financial subheader
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
              series: [
                { name: 'Total Savings', data: [43, 33, 22, 37, 67, 68, 37, 24, 55] }, // Repurposing series names
                { name: 'Monthly Deposits', data: [51, 70, 47, 67, 40, 37, 24, 70, 24] },
              ],
            }}
          />
        </Grid>

        {/* Row 3: Goal Progress and Categories Performance - Repurposing existing data structure */}
        <Grid size={{ xs: 12, md: 6, lg: 8 }}>
          <AnalyticsConversionRates
            title="Goal Progress Status" // GidiNest title
            subheader="Overview of your savings goals" // Financial subheader
            chart={{
              categories: ['Education', 'Housing', 'Health', 'Travel', 'Emergency'], // Repurposing categories
              series: [
                { name: 'Progress (₦)', data: [44, 55, 41, 64, 22] }, // Repurposing series data
                { name: 'Target (₦)', data: [53, 32, 33, 52, 13] },
              ],
            }}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6, lg: 4 }}>
          <AnalyticsCurrentSubject
            title="Savings Categories Performance" // GidiNest title
            chart={{
              categories: ['Education', 'Housing', 'Health', 'Travel', 'Lifestyle', 'Investments'], // Repurposing categories
              series: [
                { name: 'Efficiency Score', data: [80, 50, 30, 40, 100, 20] }, // Repurposing series names and data
                { name: 'Goal Attainment', data: [20, 30, 40, 80, 20, 80] },
                { name: 'Savings Rate', data: [44, 76, 78, 13, 43, 10] },
              ],
            }}
          />
        </Grid>

        {/* Row 4: Financial Tips and Recent Activity - Using _posts and _timeline */}
        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
          <AnalyticsNews title="GidiNest Financial Tips" list={_posts.slice(0, 5)} /> {/* Using _posts */}
        </Grid>


        {/* Row 5: Top Savings Goal Categories and Upcoming Financial Reminders - Using _traffic and _tasks */}
        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
          <AnalyticsTrafficBySite title="Top Savings Goal Categories" list={_traffic} /> {/* Using _traffic */}
        </Grid>

        <Grid size={{ xs: 12, md: 12, lg: 12 }}>
          <AnalyticsTasks title="Upcoming Financial Reminders" list={_tasks} /> {/* Using _tasks */}
        </Grid>
      </Grid>





      {/* BVN Verification Modal */}
      <Dialog
        open={openBvnModal && !isAccountVerified} // Only open if not verified
        onClose={handleCloseBvnModal}
        aria-labelledby="bvn-verification-title"
 
        disableEscapeKeyDown={verificationStatus === 'loading'} // Prevent closing during loading
        PaperProps={{
          sx: {
            minWidth: { xs: '90%', sm: 400 }, // Responsive width
            p: 2, // Padding
          },
        }}
      >
        <DialogTitle id="bvn-verification-title" sx={{ pb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            {/* <Iconify icon="eva:trending-down-fill" width={28} color="primary.main" /> */}
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