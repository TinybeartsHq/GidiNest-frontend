import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
// For external links like Paystack
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert'; // For info messages in modals
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog'; // For Modals
import Select from '@mui/material/Select'; // For bank selection
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem'; // For select options
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField'; // For form inputs in modals
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel'; // For select label
import AlertTitle from '@mui/material/AlertTitle'; // For alert titles
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle'; // For Modal Title
import FormControl from '@mui/material/FormControl'; // For select
import DialogContent from '@mui/material/DialogContent'; // For Modal Content
import DialogActions from '@mui/material/DialogActions'; // For Modal Actions
import TableContainer from '@mui/material/TableContainer';

import { _products } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

// --- Mock Data (as provided) ---
const _gidiNestSavingsSummary = {
  totalBalance: 750000,
  currency: '₦',
  lastUpdated: 'July 15, 2025',
};

const _gidiNestRecentTransactions = [
  { id: 'tx1', type: 'Deposit', amount: 50000, date: '2025-07-14', description: 'To Education Fund via Bank Transfer' },
  { id: 'tx2', type: 'Withdrawal', amount: 10000, date: '2025-07-13', description: 'From Emergency Buffer' },
  { id: 'tx3', type: 'Deposit', amount: 20000, date: '2025-07-12', description: 'To Vacation Goal via Paystack' },
  { id: 'tx4', type: 'Deposit', amount: 15000, date: '2025-07-10', description: 'To Retirement Plan via Flutterwave' },
  { id: 'tx5', type: 'Withdrawal', amount: 5000, date: '2025-07-09', description: 'General Savings transfer' },
  { id: 'tx6', type: 'Deposit', amount: 30000, date: '2025-07-08', description: 'To New Car Goal via Bank Transfer' },
];

const _gidiNestSavingsGoals = _products.slice(0, 4).map((product, index) => ({
  id: product.id,
  name: product.name,
  currentAmount: product.amount,
  targetAmount: product.amount ? product.amount * 2 : product.amount * 1.5,
  progress: Math.floor((product.amount / (product.amount ? product.amount * 2 : product.amount * 1.5)) * 100),
  icon: product.coverUrl,
  status: product.status === 'popular' ? 'Active' : 'New',
}));

const _nigerianBanks = [
  { value: 'access', label: 'Access Bank' },
  { value: 'zenith', label: 'Zenith Bank' },
  { value: 'gtb', label: 'Guaranty Trust Bank (GTBank)' },
  { value: 'uba', label: 'United Bank for Africa (UBA)' },
  { value: 'firstbank', label: 'First Bank of Nigeria' },
  { value: 'fcmb', label: 'FCMB' },
  { value: 'stanbic', label: 'Stanbic IBTC Bank' },
  { value: 'union', label: 'Union Bank' },
  { value: 'kuda', label: 'Kuda Bank' },
  { value: 'palmpay', label: 'PalmPay (Microfinance Bank)' },
  // Add more banks as needed
];

// ----------------------------------------------------------------------

export function SavingsView() {
  // --- State for Modals ---
  const [openDepositModal, setOpenDepositModal] = useState(false);
  const [openWithdrawModal, setOpenWithdrawModal] = useState(false);
  const [openCreateGoalModal, setOpenCreateGoalModal] = useState(false);

  // --- State for Deposit Form ---
  const [depositAmount, setDepositAmount] = useState('');

  // --- State for Withdrawal Form ---
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalAccountNum, setWithdrawalAccountNum] = useState('');
  const [withdrawalBank, setWithdrawalBank] = useState('');

  // --- State for Create Goal Form ---
  const [goalName, setGoalName] = useState('');
  const [goalTargetAmount, setGoalTargetAmount] = useState('');

  // --- Handlers for Modals ---
  const handleOpenDepositModal = useCallback(() => setOpenDepositModal(true), []);
  const handleCloseDepositModal = useCallback(() => setOpenDepositModal(false), []);

  const handleOpenWithdrawModal = useCallback(() => setOpenWithdrawModal(true), []);
  const handleCloseWithdrawModal = useCallback(() => setOpenWithdrawModal(false), []);

  const handleOpenCreateGoalModal = useCallback(() => setOpenCreateGoalModal(true), []);
  const handleCloseCreateGoalModal = useCallback(() => setOpenCreateGoalModal(false), []);

  // --- Handlers for Form Submissions ---
  const handleSubmitDeposit = useCallback(() => {
    // In a real app, you'd send depositAmount to your API
    console.log('Initiating deposit for:', depositAmount);
    // Logic for integrating with Paystack or showing bank details
    alert(`Deposit of ${_gidiNestSavingsSummary.currency}${depositAmount} initiated! Please follow instructions.`);
    setDepositAmount(''); // Clear form
    handleCloseDepositModal();
  }, [depositAmount, handleCloseDepositModal]);

  const handleSubmitWithdrawal = useCallback(() => {
    // In a real app, send withdrawalAmount, accountNum, bank to API
    console.log(`Initiating withdrawal of ${withdrawalAmount} to ${withdrawalAccountNum} (${withdrawalBank})`);
    alert(`Withdrawal of ${_gidiNestSavingsSummary.currency}${withdrawalAmount} to ${withdrawalAccountNum} initiated. Please note, this transaction is linked to your BVN for security.`);
    setWithdrawalAmount('');
    setWithdrawalAccountNum('');
    setWithdrawalBank('');
    handleCloseWithdrawModal();
  }, [withdrawalAmount, withdrawalAccountNum, withdrawalBank, handleCloseWithdrawModal]);

  const handleSubmitCreateGoal = useCallback(() => {
    // In a real app, send goalName, goalTargetAmount to API
    console.log(`Creating new goal: ${goalName} with target ${_gidiNestSavingsSummary.currency}${goalTargetAmount}`);
    alert(`New savings goal "${goalName}" with a target of ${_gidiNestSavingsSummary.currency}${goalTargetAmount} created!`);
    setGoalName('');
    setGoalTargetAmount('');
    handleCloseCreateGoalModal();
  }, [goalName, goalTargetAmount, handleCloseCreateGoalModal]);


  // --- Unused (from original) ---
  const [sortBy, setSortBy] = useState('newest');
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState({});

  const handleOpenFilter = useCallback(() => { setOpenFilter(true); }, []);
  const handleCloseFilter = useCallback(() => { setOpenFilter(false); }, []);
  const handleSort = useCallback((newSort: string) => { setSortBy(newSort); }, []);
  const handleSetFilters = useCallback((updateState: Partial<any>) => { setFilters((prevValue) => ({ ...prevValue, ...updateState })); }, []);

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 2 }}>
        My Savings Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
        Manage your savings, track your progress, and make financial transactions securely.
      </Typography>

      <Grid container spacing={3}>
        {/* Total Savings Balance Widget */}
        <Grid size={{xs:12,sm:6,md:4}}> {/* Updated 'size' to 'xs', 'sm', 'md' */}
          <AnalyticsWidgetSummary
            title="Total Savings Balance"
            percent={_gidiNestSavingsSummary.totalBalance > 0 ? 0 : 0}
            total={`${_gidiNestSavingsSummary.currency} ${_gidiNestSavingsSummary.totalBalance.toLocaleString()}`}
            icon={<img alt="Savings Balance" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [22, 8, 35, 50, 82, 84, 77, 12],
            }}
          />
        </Grid>

        {/* Deposit & Withdrawal Actions */}
        <Grid size={{ xs: 12, sm: 6, md: 8 }}> {/* Updated 'size' to 'xs', 'sm', 'md' */}
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, ml: 3 }}>Quick Actions</Typography>
            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={handleOpenDepositModal} // Linked to Deposit Modal
                startIcon={<img alt="Deposit" src="/assets/icons/glass/ic-glass-buy.svg" style={{ width: 24, height: 24 }} />}
              >
                Deposit Funds
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={handleOpenWithdrawModal} // Linked to Withdrawal Modal
                startIcon={<img alt="Withdrawal" src="/assets/icons/glass/ic-glass-message.svg" style={{ width: 24, height: 24 }} />}
              >
                Withdraw Funds
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                onClick={handleOpenCreateGoalModal} // Linked to Create Goal Modal
                startIcon={<img alt="New Goal" src="/assets/icons/glass/ic-glass-bag.svg" style={{ width: 24, height: 24 }} />}
              >
                Create New Goal
              </Button>
            </Stack>
          </Card>
        </Grid>

        {/* Savings Goals Overview */}
        <Grid size={{ xs: 12 }}> {/* Updated 'size' to 'xs' */}
          <Typography variant="h5" sx={{ mb: 3, mt: 5 }}>Your Active Savings Goals</Typography>
        </Grid>
        {_gidiNestSavingsGoals.map((goal) => (
          <Grid key={goal.id} size={{ xs :12,sm:6,md:3}}> {/* Updated 'size' to 'xs', 'sm', 'md' */}
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                  <Box component="img" src={goal.icon} alt={goal.name} sx={{ width: 48, height: 48, borderRadius: 1.5, flexShrink: 0 }} />
                  <Box>
                    <Typography variant="subtitle1">{goal.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{goal.status}</Typography>
                  </Box>
                </Stack>
                <Typography variant="h6" sx={{ color: 'primary.main' }}>
                  {_gidiNestSavingsSummary.currency} {goal.currentAmount.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Target: {_gidiNestSavingsSummary.currency} {goal.targetAmount.toLocaleString()}
                </Typography>
                <Box sx={{ mt: 1, height: 8, borderRadius: 1, bgcolor: 'grey.300' }}>
                  <Box sx={{ height: '100%', width: `${goal.progress}%`, borderRadius: 1, bgcolor: 'primary.main' }} />
                </Box>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.secondary' }}>
                  {goal.progress}% progress
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Savings History / Recent Transactions */}
        <Grid size={{xs:12}}> {/* Updated 'size' to 'xs' */}
          <Typography variant="h5" sx={{ mb: 3, mt: 5 }}>Savings Transaction History</Typography>
          <Card>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="savings history table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {_gidiNestRecentTransactions.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {row.date}
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="subtitle2"
                          color={row.type === 'Deposit' ? 'success.main' : 'error.main'}
                        >
                          {row.type}
                        </Typography>
                      </TableCell>
                      <TableCell>{row.description}</TableCell>
                      <TableCell align="right">
                        {_gidiNestSavingsSummary.currency} {row.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="text" color="primary">View All History</Button>
            </Box>
          </Card>
        </Grid>

        <Pagination count={5} color="primary" sx={{ mt: 8, mx: 'auto', mb: 5 }} />
      </Grid>

      {/* --- Deposit Funds Modal --- */}
      <Dialog open={openDepositModal} onClose={handleCloseDepositModal} fullWidth maxWidth="sm">
        <DialogTitle>Deposit Funds to GidiNest</DialogTitle>
        <DialogContent dividers>
          <Alert severity="info" sx={{ mb: 2 }}>
            <AlertTitle>Bank Transfer Details</AlertTitle>
            Please transfer funds to the account below. Your GidiNest wallet will be credited automatically.
            <br />
            <br />
            <strong>Account Name:</strong> GidiNest Holdings
            <br />
            <strong>Account Number:</strong> 1234567890 (Zenith Bank)
            <br />
            <strong>Reference:</strong> Your GidiNest User ID (e.g., GH12345)
          </Alert>

          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Or, Pay with Paystack</Typography>
          <TextField
            autoFocus
            margin="dense"
            label="Amount (₦)"
            type="number"
            fullWidth
            variant="outlined"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            inputProps={{ min: 1 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Powered by Paystack. Securely deposit using your card or bank.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDepositModal} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmitDeposit}
            variant="contained"
            color="primary"
            disabled={!depositAmount || parseFloat(depositAmount) <= 0}
          >
            Proceed with Deposit
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- Withdraw Funds Modal --- */}
      <Dialog open={openWithdrawModal} onClose={handleCloseWithdrawModal} fullWidth maxWidth="sm">
        <DialogTitle>Withdraw Funds from GidiNest</DialogTitle>
        <DialogContent dividers>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <AlertTitle>Important Security Notice</AlertTitle>
            For your security, all withdrawals are processed to bank accounts linked to your BVN. Ensure the account details match your registered information.
          </Alert>

          <TextField
            autoFocus
            margin="dense"
            label="Amount (₦)"
            type="number"
            fullWidth
            variant="outlined"
            value={withdrawalAmount}
            onChange={(e) => setWithdrawalAmount(e.target.value)}
            inputProps={{ min: 1 }}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Account Number"
            type="text"
            fullWidth
            variant="outlined"
            value={withdrawalAccountNum}
            onChange={(e) => setWithdrawalAccountNum(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel id="withdrawal-bank-label">Bank Name</InputLabel>
            <Select
              labelId="withdrawal-bank-label"
              id="withdrawal-bank-select"
              value={withdrawalBank}
              label="Bank Name"
              onChange={(e) => setWithdrawalBank(e.target.value)}
            >
              {_nigerianBanks.map((bank) => (
                <MenuItem key={bank.value} value={bank.value}>
                  {bank.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWithdrawModal} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmitWithdrawal}
            variant="contained"
            color="primary"
            disabled={!withdrawalAmount || parseFloat(withdrawalAmount) <= 0 || !withdrawalAccountNum || !withdrawalBank}
          >
            Submit Withdrawal
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- Create New Savings Goal Modal --- */}
      <Dialog open={openCreateGoalModal} onClose={handleCloseCreateGoalModal} fullWidth maxWidth="sm">
        <DialogTitle>Create a New Savings Goal</DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            margin="dense"
            label="Goal Name (e.g., New Car, Dream Vacation)"
            type="text"
            fullWidth
            variant="outlined"
            value={goalName}
            onChange={(e) => setGoalName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Target Amount (₦)"
            type="number"
            fullWidth
            variant="outlined"
            value={goalTargetAmount}
            onChange={(e) => setGoalTargetAmount(e.target.value)}
            inputProps={{ min: 1 }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Set a clear target to help you stay motivated!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateGoalModal} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmitCreateGoal}
            variant="contained"
            color="primary"
            disabled={!goalName.trim() || !goalTargetAmount || parseFloat(goalTargetAmount) <= 0}
          >
            Create Goal
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}