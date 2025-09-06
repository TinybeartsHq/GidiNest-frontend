// React Router Link
// React Router Link
import { useSelector, useDispatch } from 'react-redux';
import { useMemo, useState, useEffect, useCallback } from 'react';

import {Chip} from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Select from '@mui/material/Select';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import AlertTitle from '@mui/material/AlertTitle';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { FundsActionModal } from './fundmodal';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
// Import your Redux actions
import {
  getWallet,
  getSavingsGoals,
  createSavingsGoal,
  clearSavingsError,
  getRecentTransactions,
  initiateWalletWithdrawal,
  initiateWithdrawal
} from '../../../redux/savings/savings.actions';

// Import your AppDispatch type
import type { AppDispatch } from '../../../redux/types'; // Make sure you have this type defined for dispatch

// --- Mock Data (for banks, will likely come from an API in a real app or a static config) ---
const _nigerianBanks = [
  { value: 'access', label: 'Access Bank', code: '044' },
  { value: 'zenith', label: 'Zenith Bank', code: '057' },
  { value: 'gtb', label: 'Guaranty Trust Bank (GTBank)', code: '058' },
  { value: 'uba', label: 'United Bank for Africa (UBA)', code: '033' },
  { value: 'firstbank', label: 'First Bank of Nigeria', code: '011' },
  { value: 'fcmb', label: 'FCMB', code: '214' },
  { value: 'stanbic', label: 'Stanbic IBTC Bank', code: '221' },
  { value: 'union', label: 'Union Bank', code: '032' },
  { value: 'kuda', label: 'Kuda Bank', code: '000027' },
  { value: 'palmpay', label: 'PalmPay (Microfinance Bank)', code: '120001' },
  // Add more banks as needed
];


export function SavingsView() {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  // Select data and loading/error states from Redux store
  const {
    summary,
    goals, // This should be populated by getSavingsGoals action
    transactions,
    wallet,
    loading,
    error,
  } = useSelector((state: any) => state.savings); // Adjust 'state.savings' to your actual Redux state path

  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated); // Assuming auth state exists

  // --- State for Modals ---
  const [openDepositModal, setOpenDepositModal] = useState(false);
  const [openWithdrawModal, setOpenWithdrawModal] = useState(false);
  const [openCreateGoalModal, setOpenCreateGoalModal] = useState(false);
  const [openGoalInfoModal, setOpenGoalInfoModal] = useState(false);
  const [openFundsModal, setOpenFundsModal] = useState(false);

  // --- State for Deposit Form ---
  const [depositAmount, setDepositAmount] = useState('');

  // --- State for Withdrawal Form ---
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalAccountNum, setWithdrawalAccountNum] = useState('');
  const [withdrawalBank, setWithdrawalBank] = useState(''); // Stores the 'value' (e.g., 'zenith')
  const [withdrawalBankCode, setWithdrawalBankCode] = useState(''); // Stores the 'code' (e.g., '057')

  // --- State for Create Goal Form ---
  const [goalName, setGoalName] = useState('');
  const [goalTargetAmount, setGoalTargetAmount] = useState('');
  const [actionType, setActionType] = useState<'add' | 'withdraw'>('add'); // 'add' or 'withdraw'
  const [goalData, setGoalData] = useState<any>(null);

  
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getWallet());
      dispatch(getSavingsGoals());
      dispatch(getRecentTransactions());
    } else if (isAuthenticated === false) {
      router.push('/sign-in');
    }
  }, [dispatch, isAuthenticated, router]);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearSavingsError());
      }, 5000); // Clear error message after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  // --- Handlers for Modals ---
  const handleOpenDepositModal = useCallback(() => setOpenDepositModal(true), []);
  const handleCloseDepositModal = useCallback(() => {
    setOpenDepositModal(false);
    setDepositAmount(''); // Clear form on close
  }, []);

  const handleOpenWithdrawModal = useCallback(() => setOpenWithdrawModal(true), []);
  const handleCloseWithdrawModal = useCallback(() => {
    setOpenWithdrawModal(false);
    setWithdrawalAmount('');
    setWithdrawalAccountNum('');
    setWithdrawalBank('');
    setWithdrawalBankCode('');
  }, []);


  const handleCloseGoalInfoModal = useCallback(() => {
    setOpenGoalInfoModal(false)
  }, []);

  const handleOpenAddFundsModal = () => {
    // open another modal or trigger action to add funds from wallet
    setActionType('add');
    setOpenFundsModal(true);
  };
  const handleWithdrawToWallet = async () => {
    // API call to withdraw goal funds into user's wallet
    setActionType('withdraw');
    setOpenFundsModal(true);
  };


  

  const handleOpenCreateGoalModal = useCallback(() => setOpenCreateGoalModal(true), []);
  const handleCloseCreateGoalModal = useCallback(() => {
    setOpenCreateGoalModal(false);
    setGoalName('');
    setGoalTargetAmount('');
  }, []);

  const handleSubmitWithdrawal = useCallback(async () => {
    if (parseFloat(withdrawalAmount) <= 0 || isNaN(parseFloat(withdrawalAmount)) || !withdrawalAccountNum || !withdrawalBankCode) {
      alert('Please fill in all withdrawal details.');
      return;
    }

    // Call the Redux action for withdrawal
    const result = await dispatch(initiateWalletWithdrawal({
      amount: parseFloat(withdrawalAmount),
      account_number: withdrawalAccountNum,
      bank_name: withdrawalBankCode,
    }));
 
    if (result.success) {
      alert(`Withdrawal of ${summary?.currency}${withdrawalAmount} to ${withdrawalAccountNum} initiated. Please note, this transaction is linked to your BVN for security.`);
      dispatch(getRecentTransactions()); // Refresh transactions
      handleCloseWithdrawModal();
    } else {
      alert(`Withdrawal failed: ${result.error || 'An unknown error occurred.'}`);
    }
  }, [withdrawalAmount, withdrawalAccountNum, withdrawalBankCode, handleCloseWithdrawModal, dispatch, summary?.currency]);

  const handleSubmitCreateGoal = useCallback(async () => {
    if (!goalName.trim() || parseFloat(goalTargetAmount) <= 0 || isNaN(parseFloat(goalTargetAmount))) {
      alert('Please provide a valid goal name and target amount.');
      return;
    }

    // Call the Redux action to create a goal
    const result = await dispatch(createSavingsGoal({
      name: goalName,
      target_amount: parseFloat(goalTargetAmount),
    }));

    if (result.success) {
      // alert(`New savings goal "${goalName}" with a target of ${summary?.currency}${parseFloat(goalTargetAmount).toLocaleString()} created!`);
      handleCloseCreateGoalModal();
      dispatch(getSavingsGoals()); // Refresh goals list to show the new goal
    } else {
      alert(`Failed to create goal: ${result.error || 'An unknown error occurred.'}`);
    }
  }, [goalName, goalTargetAmount, handleCloseCreateGoalModal, dispatch, summary?.currency]);

  // Helper function to format currency
  const formatCurrency = useCallback((amount: number | null | undefined, currency = '₦') => {
    if (amount === null || amount === undefined) return `${currency}0`;
    const numericAmount = parseFloat(String(amount));
    if (isNaN(numericAmount)) return `${currency}0`;
    return `${currency}${numericAmount.toLocaleString('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }, []);

  // Handle bank selection to also set the bank code for withdrawal
  const handleWithdrawalBankChange = useCallback((event: { target: { value: string; }; }) => {
    const selectedBankValue = event.target.value;
    setWithdrawalBank(selectedBankValue);
    const bank = _nigerianBanks.find(b => b.label === selectedBankValue);
    if (bank) {
      setWithdrawalBankCode(bank.label);
    } else {
      setWithdrawalBankCode('');
    }
  }, []);

  const currentSummary = summary || { totalBalance: 0, currency: '₦', lastUpdated: 'N/A' };

   
  const goalsWithImages = useMemo(() => goals.map((goal: any) => ({
      ...goal,
      icon: `/assets/images/cover/cover-${Math.floor(Math.random() * 24) + 1}.webp`
    })), [goals]);

 

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 2 }}>
        My Savings Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
        Manage your savings, track your progress, and make financial transactions securely.
      </Typography>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Total Savings Balance Widget */}
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <AnalyticsWidgetSummary
            title="Gidinest Wallet Balance"
            percent={0}
            total={formatCurrency(wallet?.wallet?.balance, currentSummary.currency)}
            icon={<img alt="Savings Balance" src="/assets/icons/glass/ic-glass-bag.svg" />}
            chart={{
              categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
              series: [0, 0, 0, 0, 0, 0, 0, 0],
            }}
          />
        </Grid>

        {/* Deposit & Withdrawal Actions */}
        <Grid size={{ xs: 12, sm: 6, md: 8 }}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, ml: 3 }}>Quick Actions</Typography>
            <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap">
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={handleOpenDepositModal}
                startIcon={<img alt="Deposit" src="/assets/icons/glass/ic-glass-buy.svg" style={{ width: 24, height: 24 }} />}
              >
                Deposit Funds
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={handleOpenWithdrawModal}
                startIcon={<img alt="Withdrawal" src="/assets/icons/glass/ic-glass-message.svg" style={{ width: 24, height: 24 }} />}
              >
                Withdraw Funds
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                onClick={handleOpenCreateGoalModal}
                startIcon={<img alt="New Goal" src="/assets/icons/glass/ic-glass-bag.svg" style={{ width: 24, height: 24 }} />}
              >
                Create New Goal
              </Button>
            </Stack>
          </Card>
        </Grid>

        {/* Savings Goals Overview */}
        <Grid size={{ xs: 12, }}>
          <Typography variant="h5" sx={{ mb: 3, mt: 5 }}>Your Active Savings Goals</Typography>
        </Grid>
        {goals.length === 0 && !loading ? (
          <Grid size={{ xs: 12 }}>
            <Alert severity="info">
              You haven&apos;t created any savings goals yet. Click &quot;Create New Goal&quot; to get started! 🚀
            </Alert>
          </Grid>
        ) : (
            goalsWithImages.map((goal: any) => (
              <Grid key={goal.id} size={{ xs: 12, sm:6, lg:3 }}>
                <Card
                  onClick={() => {
                    setGoalData(goal);
                    setOpenGoalInfoModal(true);
                  }}
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 6,
                    },
                  }}
                >
                  <CardContent>
                    {/* Header: Goal Name & Status */}
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 500 }}>
                        {goal.name}
                      </Typography>
                      <Chip
                        label={goal.status || 'Active'}
                        color={goal.status?.toLowerCase() === 'paused' ? 'warning' : 'success'}
                        size="small"
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </Stack>

                    {/* Amounts */}
                    <Stack spacing={0.5} sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Current Balance
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {formatCurrency(goal.currentAmount, currentSummary.currency)}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        Target: {formatCurrency(goal.target_amount, currentSummary.currency)}
                      </Typography>
                    </Stack>

                    {/* Progress Bar */}
                    <Box sx={{ mt: 1 }}>
                      <Box sx={{ height: 8, borderRadius: 1, bgcolor: 'grey.300' }}>
                        <Box
                          sx={{
                            height: '100%',
                            width: `${Math.min(100, Math.floor((goal.currentAmount / goal.targetAmount) * 100)) || 0}%`,
                            borderRadius: 1,
                            bgcolor: 'primary.main',
                            transition: 'width 0.3s ease-in-out',
                          }}
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                        {Math.min(100, Math.floor((goal.currentAmount / goal.targetAmount) * 100)) || 0}% progress
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))

        )}

        {/* Savings History / Recent Transactions */}
        <Grid size={{ xs: 12 }}>
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
                  {transactions.length === 0 && !loading ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                          No recent transactions found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    transactions.map((row: any) => ( // Ensure your API returns transactions in this structure
                      <TableRow
                        key={row.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {new Date(row.date).toLocaleDateString()} {/* Format date */}
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
                          {formatCurrency(row.amount, currentSummary.currency)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="text" color="primary">View All History</Button>
            </Box>
          </Card>
        </Grid>

        {/* Pagination (currently static, needs dynamic update based on API) */}
        <Pagination count={1} color="primary" sx={{ mt: 8, mx: 'auto', mb: 5 }} />

      </Grid>

      {/* --- Deposit Funds Modal --- */}
      <Dialog open={openDepositModal} onClose={handleCloseDepositModal} fullWidth maxWidth="sm">
        <DialogTitle>Deposit Funds to your GidiNest Wallet</DialogTitle>
        <DialogContent dividers>
          <Alert severity="info" sx={{ mb: 2 }}>
            <AlertTitle>Bank Transfer Details</AlertTitle>
            Please transfer funds to the account below. Your GidiNest wallet will be credited automatically.
            <br />
            <br />
            <strong>Account Name:</strong> {wallet?.wallet?.account_name}
            <br />
            <strong>Account Number:</strong> {wallet?.wallet?.account_number}
            <br />
            <strong>Bank Name:</strong> {wallet?.wallet?.bank}

          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDepositModal} color="inherit">
            Cancel
          </Button>
     
        </DialogActions>
      </Dialog>

      {/* --- Withdraw Funds Modal --- */}
      <Dialog open={openWithdrawModal} onClose={handleCloseWithdrawModal} fullWidth maxWidth="sm">
        <DialogTitle>Withdraw Funds from GidiNest Wallet</DialogTitle>
        <DialogContent dividers>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <AlertTitle>Important Security Notice</AlertTitle>
            For your security, all withdrawals are processed to bank accounts linked to your BVN. Ensure the account details match your registered information.
          </Alert>

          <TextField
            autoFocus
            margin="dense"
            label="Enter Amount (₦)"
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
              onChange={handleWithdrawalBankChange}
            >
              {_nigerianBanks.map((bank) => (
                <MenuItem key={bank.value} value={bank.label}>
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
            disabled={!withdrawalAmount || parseFloat(withdrawalAmount) <= 0 || !withdrawalAccountNum || !withdrawalBank || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Withdrawal'}
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
            Set a clear target to help you stay motivated! ✨
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
            disabled={!goalName.trim() || !goalTargetAmount || parseFloat(goalTargetAmount) <= 0 || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Goal'}
          </Button>
        </DialogActions>
      </Dialog>
   
      <Dialog
        open={openGoalInfoModal}
        onClose={handleCloseGoalInfoModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Savings Goal Details</DialogTitle>

        <DialogContent dividers>
          {/* Goal Info */}
          <Typography variant="h6" gutterBottom>{goalData?.name}</Typography>

          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">Target Amount:</Typography>
              <Typography variant="subtitle1" color="primary">
                ₦{Number(goalData?.target_amount).toLocaleString()}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">Current Amount:</Typography>
              <Typography variant="subtitle1" color="success.main">
                ₦{Number(goalData?.amount).toLocaleString()}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">Interest Rate:</Typography>
              <Typography variant="subtitle1">
                {goalData?.interest_rate || 0}% / annum
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">Accrued Interest:</Typography>
              <Typography variant="subtitle1">
                ₦{Number(goalData?.accrued_interest || 0).toLocaleString()}
              </Typography>
            </Box>
          </Stack>

          {/* Optional: Progress Bar */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Progress: {Math.floor((goalData?.amount / goalData?.target_amount) * 100) || 0}%
            </Typography>
            <Box sx={{ height: 8, borderRadius: 1, bgcolor: 'grey.300' }}>
              <Box sx={{
                width: `${Math.min(100, Math.floor((goalData?.amount / goalData?.target_amount) * 100))}%`,
                bgcolor: 'primary.main',
                height: '100%',
                borderRadius: 1
              }} />
            </Box>
          </Box>

          {/* Add / Withdraw Actions */}
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Actions
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenAddFundsModal} // opens modal or triggers flow to add from Gidinest wallet
              >
                Add Funds
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleWithdrawToWallet} // triggers withdraw to wallet
              >
                Withdraw
              </Button>
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseGoalInfoModal} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>



      {openFundsModal && <FundsActionModal
        open={openFundsModal}
        onClose={() => setOpenFundsModal(false)}
        actionType={actionType} // or "withdraw"
        walletBalance={wallet?.wallet?.balance}
        goalBalance={goalData?.amount}
        goalId={goalData?.id}
        loading={loading}
        onSubmit={async (amount: any) => {
 
          try {
            if (actionType === 'add') {

              // Call the Redux action for contribution
              const result = await dispatch(initiateWithdrawal({
                goal_id: goalData?.id,
                amount: parseFloat(amount),
                transaction_type: "contribution",
                description: `Contribution to ${goalData.name} savings goal`,
              }));

              if (result.success) {
                alert(`Deposit of ${summary?.currency}${amount} to ${goalData.name} initiated.`);
             
              } else {
                alert(`Deposit failed: ${result.error || 'An unknown error occurred.'}`);
              }
            } else {
              // Call the Redux action for withdrawal
              const result = await dispatch(initiateWithdrawal({
                goal_id: goalData?.id,
                amount: parseFloat(amount),
                transaction_type: "withdrawal",
                description: `Contribution to ${goalData.name} savings goal`,
              }));

              if (result.success) {
                alert(`Withdrawal of ${summary?.currency}${amount} from ${goalData.name} initiated.`);

              } else {
                alert(`Withdrawal failed: ${result.error || 'An unknown error occurred.'}`);
              }
            }
          } catch (err: any) {
            alert('An error occurred. Please try again.');
            console.error('Funds action error:', err);
          } finally {
            dispatch(getRecentTransactions()); // Refresh transactions
            setOpenFundsModal(false)
          }
        }}
      />
}




    </DashboardContent>
  );
}