/* eslint-disable react-hooks/exhaustive-deps */
import { toast } from 'react-toastify';
import { ShieldCheck } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect, useCallback, useMemo } from 'react';

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
import { ContentCopy } from '@mui/icons-material';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import { Chip, Tooltip, Divider, IconButton, LinearProgress } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { useFeePreview } from 'src/hooks/use-fee-preview';

import { DashboardContent } from 'src/layouts/dashboard';

import { FeeBreakdown } from 'src/components/fee-breakdown';
import { BVNVerificationModal } from 'src/components/verification/bvn';
import { NINVerificationModal } from 'src/components/verification/nin';
import { TransactionPinModal } from 'src/components/verification/transaction-pin';

import { FundsActionModal } from './fundmodal';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import { updateBVN, updateNIN, fetchUserProfile } from '../../../redux/userProfile/userProfile.actions';
import {
  getBanks,
  getWallet,
  getSavingsGoals,
  createSavingsGoal,
  setTransactionPin,
  initiateWithdrawal,
  deleteSavingsGoals,
  validateAccountNumber,
  getRecentTransactions,
  getTransactionPinStatus,
  initiateWalletWithdrawal,
  getRecentSavingTransactions,
} from '../../../redux/savings/savings.actions';

import type { AppDispatch } from '../../../redux/types';

export function SavingsView() {
  const dispatch: AppDispatch = useDispatch();
  const router = useRouter();

  const { summary, goals, savings_transactions, transactions, wallet, banks, loading, error } = useSelector(
    (state: any) => state.savings
  );

  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

  const [openDepositModal, setOpenDepositModal] = useState(false);
  const [openWithdrawModal, setOpenWithdrawModal] = useState(false);
  const [openCreateGoalModal, setOpenCreateGoalModal] = useState(false);
  const [openGoalInfoModal, setOpenGoalInfoModal] = useState(false);
  const [openFundsModal, setOpenFundsModal] = useState(false);

  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalAccountNum, setWithdrawalAccountNum] = useState('');
  const [withdrawalAccountName, setWithdrawalAccountName] = useState('');
  const [withdrawalBank, setWithdrawalBank] = useState('');
  const [withdrawalBankCode, setWithdrawalBankCode] = useState('');
  const [withdrawalBankMainName, setWithdrawalBankMainName] = useState('');
  const [withdrawalPin, setWithdrawalPin] = useState(''); // PIN input in withdrawal form

  const [goalName, setGoalName] = useState('');
  const [goalTargetAmount, setGoalTargetAmount] = useState('');
  const [actionType, setActionType] = useState<'add' | 'withdraw'>('add'); // 'add' or 'withdraw'
  const [goalData, setGoalData] = useState<any>(null);

  const [openBvnModal, setOpenBvnModal] = useState(false);
  const [bvn, setBvn] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('idle');
  const [verificationError, setVerificationError] = useState(null);
  const [isAccountVerified, setIsAccountVerified] = useState(false);

  // NIN verification states
  const [openNinModal, setOpenNinModal] = useState(false);
  const [nin, setNin] = useState('');
  const [ninFirstname, setNinFirstname] = useState('');
  const [ninLastname, setNinLastname] = useState('');
  const [ninDob, setNinDob] = useState('');
  const [ninVerificationStatus, setNinVerificationStatus] = useState('idle');
  const [ninVerificationError, setNinVerificationError] = useState(null);
  const [isNinAccountVerified, setIsNinAccountVerified] = useState(false);
  const [showVerificationChoice, setShowVerificationChoice] = useState(false);

  // Transaction PIN states
  const [openPinModal, setOpenPinModal] = useState(false);
  const [pinModalMode, setPinModalMode] = useState<'setup' | 'update'>('setup');
  const [pinStatus, setPinStatus] = useState('idle');
  const [pinError, setPinError] = useState<string | null>(null);
  const [hasTransactionPin, setHasTransactionPin] = useState(false); // Track if PIN is set

  const handleBvnInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBvn(event.target.value);
  };

  // NIN input handlers
  const handleNinInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNin(event.target.value);
  };

  const handleNinFirstnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNinFirstname(event.target.value);
  };

  const handleNinLastnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNinLastname(event.target.value);
  };

  const handleNinDobChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNinDob(event.target.value);
  };

  const { profile: userProfile } = useSelector((state: any) => state.profile);

  // Pre-fill NIN form with user profile data when modal opens
  useEffect(() => {
    if (openNinModal) {
      if (userProfile) {
        // Pre-fill with profile data
        if (userProfile.first_name) {
          setNinFirstname(userProfile.first_name);
        }
        if (userProfile.last_name) {
          setNinLastname(userProfile.last_name);
        }
        if (userProfile.dob) {
          setNinDob(userProfile.dob);
        }
      }
    }
  }, [openNinModal, userProfile]);

  // Auto-trigger verification modal only for first-time users with no verification
  useEffect(() => {
    if (userProfile && !userProfile.has_bvn && !userProfile.has_nin && wallet?.wallet?.account_number) {
      // Only show once per session to avoid annoyance
      try {
        const hasShownModal = sessionStorage.getItem('verificationModalShown');
        if (!hasShownModal) {
          setShowVerificationChoice(true);
          sessionStorage.setItem('verificationModalShown', 'true');
        }
      } catch {
        // sessionStorage may not be available in private browsing
        setShowVerificationChoice(true);
      }
    }
  }, [userProfile, wallet]);

  // Check if transaction PIN is set from wallet balance endpoint or status endpoint
  useEffect(() => {
    const checkPinStatus = async () => {
      // Check multiple possible field paths in wallet response
      const pinFromWallet = wallet?.wallet?.transaction_pin_set
        || wallet?.transaction_pin_set
        || wallet?.wallet?.has_transaction_pin
        || wallet?.has_transaction_pin;

      if (pinFromWallet !== undefined) {
        setHasTransactionPin(Boolean(pinFromWallet));
        return;
      }
      
      // If not found, check status endpoint as fallback
      const statusResult = await dispatch(getTransactionPinStatus());
      if (statusResult.success && statusResult.data) {
        // Check multiple possible field names
        const statusPinSet = statusResult.data.transaction_pin_set
          || statusResult.data.has_transaction_pin
          || statusResult.data.pin_set;
        if (statusPinSet !== undefined) {
          setHasTransactionPin(Boolean(statusPinSet));
        }
      }
    };
    
    if (wallet) {
      checkPinStatus();
    }
  }, [wallet, dispatch]);

  // Handle URL parameters for verification
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const verifyType = urlParams.get('verify');

    if (verifyType === 'bvn' && !userProfile?.has_bvn) {
      setOpenBvnModal(true);
      // Clean URL
      window.history.replaceState({}, '', '/savings');
    } else if (verifyType === 'nin' && !userProfile?.has_nin) {
      setOpenNinModal(true);
      // Clean URL
      window.history.replaceState({}, '', '/savings');
    } else if (verifyType) {
      // If user clicks verify button but already verified, show choice dialog
      setShowVerificationChoice(true);
      window.history.replaceState({}, '', '/savings');
    }
  }, [userProfile]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    function startPolling() {
      clearInterval(intervalId);
      if (document.visibilityState === 'visible') {
        intervalId = setInterval(() => {
          dispatch(getWallet());
        }, 10000);
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === 'visible') {
        dispatch(getWallet());
        startPolling();
      } else {
        clearInterval(intervalId);
      }
    }

    if (isAuthenticated) {
      dispatch(fetchUserProfile()); // Fetch user profile to ensure it's loaded
      dispatch(getWallet());
      dispatch(getSavingsGoals());
      dispatch(getRecentSavingTransactions()); // Savings goal transactions
      dispatch(getRecentTransactions()); // Wallet transactions
      dispatch(getBanks()); // Fetch banks list from API
      startPolling();
      document.addEventListener('visibilitychange', handleVisibilityChange);
    } else if (isAuthenticated === false) {
      router.push('/');
    }

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, dispatch, router]);

  // Clear account name when account number or bank changes
  useEffect(() => {
    if (withdrawalAccountName) {
      setWithdrawalAccountName('');
    }
  }, [withdrawalAccountNum, withdrawalBankCode]);

  const handleOpenDepositModal = useCallback(() => setOpenDepositModal(true), []);
  const handleCloseDepositModal = useCallback(() => {
    setOpenDepositModal(false);
  }, []);

  const handleOpenWithdrawModal = useCallback(async () => {
    // Check if PIN is set from wallet balance endpoint or status endpoint
    // Check multiple possible field paths
    const pinFromWallet = wallet?.wallet?.transaction_pin_set 
      || wallet?.transaction_pin_set 
      || wallet?.wallet?.has_transaction_pin
      || wallet?.has_transaction_pin;
    
    let pinIsSet = pinFromWallet || hasTransactionPin;

    // If not found in wallet, check status endpoint as fallback
    if (!pinIsSet) {
      const statusResult = await dispatch(getTransactionPinStatus());
      if (statusResult.success && statusResult.data) {
        // Check multiple possible field names
        const statusPinSet = statusResult.data.transaction_pin_set
          || statusResult.data.has_transaction_pin
          || statusResult.data.pin_set;
        if (statusPinSet !== undefined) {
          pinIsSet = Boolean(statusPinSet);
          setHasTransactionPin(pinIsSet);
        }
      }
    }
    
    if (!pinIsSet) {
      // Show PIN setup modal first
      setPinModalMode('setup');
      setOpenPinModal(true);
      // Don't open withdrawal modal yet - wait for PIN setup
    } else {
      // PIN is set, open withdrawal modal with PIN input field
      setOpenWithdrawModal(true);
    }
  }, [wallet, hasTransactionPin, dispatch]);
  const handleCloseWithdrawModal = useCallback(() => {
    setOpenWithdrawModal(false);
    setWithdrawalAmount('');
    setWithdrawalAccountNum('');
    setWithdrawalBank('');
    setWithdrawalBankCode('');
    setWithdrawalAccountName('');
    setWithdrawalPin(''); // Clear PIN input
  }, []);

  const handleCloseGoalInfoModal = useCallback(() => {
    setOpenGoalInfoModal(false);
  }, []);

  const handleOpenAddFundsModal = () => {
    setActionType('add');
    setOpenFundsModal(true);
  };

  const handleWithdrawToWallet = async () => {
    setActionType('withdraw');
    setOpenFundsModal(true);
  };

  const handleSavingPlanDelete = async () => {
    if (goalData?.amount > 0) {
      toast.error(
        'You cannot delete a savings plan with a positive balance. Please withdraw the funds first.',
        { autoClose: 6000 }
      );
      return;
    }
    const isConfirmed = window.confirm(
      `Are you sure you want to delete the savings plan "${goalData?.name}"? This action cannot be undone.`
    );

    if (!isConfirmed) {
      return;
    }

    const result = await dispatch(deleteSavingsGoals(goalData.id));

    if (result.success) {
      toast(`Savings goal "${goalData.name}" deleted successfully.`);
      dispatch(getSavingsGoals());
      handleCloseGoalInfoModal();
    } else {
      toast.error(`Failed to delete savings goal: ${result.error || 'An unknown error occurred.'}`, { autoClose: 6000 });
    }
  };

  const handleOpenCreateGoalModal = useCallback(() => setOpenCreateGoalModal(true), []);
  const handleCloseCreateGoalModal = useCallback(() => {
    setOpenCreateGoalModal(false);
    setGoalName('');
    setGoalTargetAmount('');
  }, []);

  // Helper function to normalize names for comparison (handles case, extra spaces, order variations)
  const normalizeName = useCallback((name: string): string => {
    if (!name) return '';
    return name
      .toUpperCase()
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .split(' ')
      .filter(part => part.length > 0) // Remove empty parts
      .sort() // Sort parts alphabetically for order-independent comparison
      .join(' ');
  }, []);

  const handleSubmitWithdrawal = useCallback(async () => {
    if (
      parseFloat(withdrawalAmount) <= 0 ||
      isNaN(parseFloat(withdrawalAmount)) ||
      !withdrawalAccountNum ||
      !withdrawalBankCode
    ) {
      toast.error('Please fill in all withdrawal details.', { autoClose: 5000 });
      return;
    }

    // Check if PIN is set and required - check multiple possible field paths
    const pinIsSet = wallet?.wallet?.transaction_pin_set 
      || wallet?.transaction_pin_set 
      || wallet?.wallet?.has_transaction_pin
      || wallet?.has_transaction_pin
      || hasTransactionPin;
    if (pinIsSet && (!withdrawalPin || withdrawalPin.length !== 4)) {
      toast.error('Please enter your 4-digit transaction PIN.', { autoClose: 5000 });
      return;
    }

    if (!withdrawalAccountName) {
      const result = await dispatch(
        validateAccountNumber({
          account_number: withdrawalAccountNum,
          bank_code: withdrawalBankCode,
        })
      );

      if (result.success) {
        setWithdrawalAccountName(result?.data?.data?.account_name);
        toast.success(`Account validated: ${result?.data?.data?.account_name}`);
      } else {
        toast.error(`Account validation failed: ${result.error || 'Invalid account number or bank'}`);
      }
    } else {
      // Proceed with withdrawal - include transaction_pin if PIN is set
      const withdrawalData: any = {
        amount: parseFloat(withdrawalAmount),
        account_number: withdrawalAccountNum,
        bank_name: withdrawalBankMainName,
        account_name: withdrawalAccountName,
        bank_code: withdrawalBankCode,
      };

      // Include transaction_pin if PIN is set
      if (pinIsSet && withdrawalPin) {
        withdrawalData.transaction_pin = withdrawalPin;
      }

      const result = await dispatch(initiateWalletWithdrawal(withdrawalData));

      if (result.success) {
        toast.success(
          `Withdrawal of ₦${parseFloat(withdrawalAmount).toLocaleString()} to ${withdrawalAccountName} initiated successfully!`
        );
        dispatch(getRecentSavingTransactions());
        handleCloseWithdrawModal();
      } else {
        // Display detailed error message from backend
        const errorMsg = result.error || 'Please try again or contact support';
        toast.error(`Withdrawal failed: ${errorMsg}`, { autoClose: 8000 });
      }
    }
  }, [
    withdrawalAmount,
    withdrawalAccountNum,
    withdrawalBankCode,
    withdrawalAccountName,
    withdrawalBankMainName,
    withdrawalPin,
    handleCloseWithdrawModal,
    dispatch,
    summary?.currency,
    wallet,
    hasTransactionPin,
    normalizeName,
    userProfile,
  ]);

  const handleSubmitCreateGoal = useCallback(async () => {
    if (
      !goalName.trim() ||
      parseFloat(goalTargetAmount) <= 0 ||
      isNaN(parseFloat(goalTargetAmount))
    ) {
      toast.error('Please provide a valid goal name and target amount.', { autoClose: 5000 });
      return;
    }

    const result = await dispatch(
      createSavingsGoal({
        name: goalName,
        target_amount: parseFloat(goalTargetAmount),
      })
    );

    if (result.success) {
      toast(`New savings goal "${goalName} created`);

      handleCloseCreateGoalModal();
      dispatch(getSavingsGoals());
    } else {
      toast.error(`Failed to create goal: ${result.error || 'An unknown error occurred.'}`, { autoClose: 6000 });
    }
  }, [goalName, goalTargetAmount, handleCloseCreateGoalModal, dispatch, summary?.currency]);

  const formatCurrency = useCallback((amount: number | null | undefined, currency = '₦') => {
    if (amount === null || amount === undefined) return `${currency}0`;
    const numericAmount = parseFloat(String(amount));
    if (isNaN(numericAmount)) return `${currency}0`;
    return `${currency}${numericAmount.toLocaleString('en-NG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }, []);

  const handleWithdrawalBankChange = useCallback((event: { target: { value: string } }) => {
    const selectedBankValue = event.target.value;
    setWithdrawalBank(selectedBankValue);
    const bank = banks.find((b: any) => b.bankcode === selectedBankValue);
    if (bank) {
      setWithdrawalBankCode(bank.bankcode);
      setWithdrawalBankMainName(bank.bankname);
    } else {
      setWithdrawalBankCode('');
    }
  }, [banks]);

  const handleCloseBvnModal = useCallback(() => {
    if (verificationStatus !== 'loading') {
      setOpenBvnModal(false);
      setVerificationStatus('idle');
      setBvn('');
    }
  }, [verificationStatus]);

  // Transaction PIN handlers
  const handleClosePinModal = useCallback(() => {
    if (pinStatus !== 'loading') {
      setOpenPinModal(false);
      setPinStatus('idle');
      setPinError(null);
    }
  }, [pinStatus]);

  const handleSetPin = useCallback(async (pin: string, oldPin?: string) => {
    setPinStatus('loading');
    setPinError(null);

    // Prepare PIN data - if oldPin is provided, include it (for update), otherwise just pin (for setup)
    const pinData = oldPin ? { pin, old_pin: oldPin } : { pin };

    const result = await dispatch(setTransactionPin(pinData));

    if (result.success) {
      setPinStatus('success');
      setHasTransactionPin(true);
      toast.success('Transaction PIN set successfully!');
      
      // Refresh wallet balance to update transaction_pin_set status
      dispatch(getWallet());
      
      // If PIN was set during withdrawal flow, open withdrawal modal after a short delay
      if (pinModalMode === 'setup') {
        setTimeout(() => {
          setOpenPinModal(false);
          setPinStatus('idle');
          setOpenWithdrawModal(true);
        }, 1000);
      } else {
        // If updating PIN, just close the modal
        setTimeout(() => {
          setOpenPinModal(false);
          setPinStatus('idle');
        }, 1000);
      }
    } else {
      setPinStatus('error');
      setPinError(result.error || 'Failed to set PIN');
    }
  }, [dispatch, pinModalMode]);

  const handlePinSet = useCallback(() => {
    // This is called when PIN setup succeeds
    // The withdrawal modal will open automatically in handleSetPin
  }, []);

  const handleVerifyBvn = useCallback(async () => {
    if (bvn.length !== 11) {
      setVerificationStatus('error');
      return;
    }

    setVerificationStatus('loading');

    const result = await dispatch(updateBVN(bvn));

    if (result.success) {
      setVerificationStatus('success');
      setIsAccountVerified(true);

      toast('Account verified successfully');

      await dispatch(fetchUserProfile());
    } else {
      setVerificationStatus('error');
      setVerificationError(result.error);
      setIsAccountVerified(false);
    }
  }, [bvn, dispatch]);

  // NIN verification handlers
  const handleCloseNinModal = useCallback(() => {
    if (ninVerificationStatus !== 'loading') {
      setOpenNinModal(false);
      setNinVerificationStatus('idle');
      setNin('');
      setNinFirstname('');
      setNinLastname('');
      setNinDob('');
    }
  }, [ninVerificationStatus]);

  const handleVerifyNin = useCallback(async () => {
    if (nin.length !== 11 || !ninFirstname || !ninLastname || !ninDob) {
      setNinVerificationStatus('error');
      return;
    }

    setNinVerificationStatus('loading');

    const result = await dispatch(updateNIN({
      nin,
      firstname: ninFirstname,
      lastname: ninLastname,
      dob: ninDob,
    }));

    if (result.success) {
      setNinVerificationStatus('success');
      setIsNinAccountVerified(true);

      toast('Account verified successfully with NIN');

      await dispatch(fetchUserProfile());
    } else {
      setNinVerificationStatus('error');
      setNinVerificationError(result.error);
      setIsNinAccountVerified(false);
    }
  }, [nin, ninFirstname, ninLastname, ninDob, dispatch]);

  // Fee preview for withdrawal modal
  const withdrawalFee = useFeePreview(parseFloat(withdrawalAmount) || 0, 'transfer');

  const currentSummary = summary || { totalBalance: 0, currency: '₦', lastUpdated: 'N/A' };

  const goalsWithImages = useMemo(
    () =>
      goals.map((goal: any) => ({
        ...goal,
        icon: `/assets/images/cover/cover-${Math.floor(Math.random() * 24) + 1}.webp`,
      })),
    [goals]
  );

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 2 }}>
        My Savings Overview
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
        Manage your savings, track your progress, and make financial transactions securely.
      </Typography>

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
            title="GidiNest Wallet Balance"
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
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              p: 3,
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, ml: 3 }}>
              Quick Actions
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              justifyContent="center"
              flexWrap="wrap"
              sx={{
                '@media (max-width: 600px)': {
                  justifyContent: 'center',
                },
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={handleOpenDepositModal}
                startIcon={
                  <img
                    alt="Deposit"
                    src="/assets/icons/glass/ic-glass-buy.svg"
                    style={{ width: 24, height: 24 }}
                  />
                }
                sx={{
                  mb: { xs: 2, sm: 0 },
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                Deposit Funds
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                size="large"
                onClick={handleOpenWithdrawModal}
                startIcon={
                  <img
                    alt="Withdrawal"
                    src="/assets/icons/glass/ic-glass-message.svg"
                    style={{ width: 24, height: 24 }}
                  />
                }
                sx={{
                  mb: { xs: 2, sm: 0 },
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                Withdraw Funds
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                onClick={handleOpenCreateGoalModal}
                startIcon={
                  <img
                    alt="New Goal"
                    src="/assets/icons/glass/ic-glass-bag.svg"
                    style={{ width: 24, height: 24 }}
                  />
                }
                sx={{
                  mb: { xs: 2, sm: 0 },
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                Create New Goal
              </Button>
            </Stack>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Typography variant="h5" sx={{ mb: 3, mt: 5 }}>
            Your Active Savings Goals
          </Typography>
        </Grid>
        {goals.length === 0 && !loading ? (
          <Grid size={{ xs: 12 }}>
            <Alert severity="info">
              You haven&apos;t created any savings goals yet. Click &quot;Create New Goal&quot; to
              get started! 🚀
            </Alert>
          </Grid>
        ) : (
          goalsWithImages.map((goal: any) => (
            <Grid key={goal.id} size={{ xs: 12, sm: 6, lg: 3 }}>
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
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 1 }}
                  >
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
                      {formatCurrency(goal.amount, currentSummary.currency)}
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
                          width: `${Math.min(100, Math.floor((goal.amount / goal.target_amount) * 100)) || 0}%`,
                          borderRadius: 1,
                          bgcolor: 'primary.main',
                          transition: 'width 0.3s ease-in-out',
                        }}
                      />
                    </Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5, display: 'block' }}
                    >
                      {Math.min(100, Math.floor((goal.amount / goal.target_amount) * 100)) || 0}%
                      progress
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}

        {/* Savings History / Recent Transactions */}
        <Grid size={{ xs: 12 }}>
          <Typography variant="h5" sx={{ mb: 3, mt: 5 }}>
            {savings_transactions && savings_transactions.length > 0 ? 'Savings' : 'Wallet'} Transaction History
          </Typography>
          {savings_transactions && savings_transactions.length === 0 && transactions && transactions.length > 0 && (
            <Alert severity="info" sx={{ mb: 2 }}>
              No savings goal transactions yet. Showing wallet transactions instead.
            </Alert>
          )}
          <Card>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="transaction history table">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell align="right">Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                          Loading transactions...
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (savings_transactions && savings_transactions.length > 0 ? savings_transactions : transactions || []).length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center">
                        <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                          No transactions found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    (savings_transactions && savings_transactions.length > 0 ? savings_transactions : transactions || []).map((row: any) => (
                      <TableRow
                        key={row.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {new Date(row.created_at || row.timestamp).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="subtitle2"
                            color={
                              (row.transaction_type === 'contribution' || row.transaction_type === 'credit')
                                ? 'success.main'
                                : 'error.main'
                            }
                            sx={{ textTransform: 'capitalize' }}
                          >
                            {row.transaction_type}
                          </Typography>
                        </TableCell>
                        <TableCell>{row.description}</TableCell>
                        <TableCell align="right">
                          ₦{parseFloat(row.amount).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>

        <Pagination count={1} color="primary" sx={{ mt: 8, mx: 'auto', mb: 5 }} />
      </Grid>

      <Dialog open={openDepositModal} onClose={handleCloseDepositModal} fullWidth maxWidth="sm">
        <DialogTitle>Deposit Funds to your GidiNest Wallet</DialogTitle>

        <DialogContent dividers>
          <Alert severity="info" sx={{ mb: 3 }}>
            <AlertTitle>Bank Transfer Details</AlertTitle>
            Please transfer funds to the account below. Your GidiNest wallet will be credited
            automatically.
          </Alert>

          <Alert severity="warning" sx={{ mb: 3 }}>
            An Electronic Money Transfer Levy (EMTL) of ₦50 applies to deposits of ₦10,000 and
            above. This fee is deducted from the deposited amount.
          </Alert>

          <Box
            sx={{
              backgroundColor: '#f5f5f5',
              borderRadius: 2,
              p: 2,
              mb: 2,
              border: '1px solid #ddd',
            }}
          >
            <Stack spacing={2}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Account Name
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {wallet?.wallet?.account_name || '—'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Account Number
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography variant="h6" fontWeight="bold">
                    {wallet?.wallet?.account_number || '—'}
                  </Typography>
                  <Tooltip title="Copy account number">
                    <IconButton
                      onClick={() =>
                        navigator.clipboard.writeText(wallet?.wallet?.account_number || '')
                      }
                      size="small"
                    >
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Bank Name
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {wallet?.wallet?.bank || '—'}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDepositModal} color="inherit">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openWithdrawModal} onClose={handleCloseWithdrawModal} fullWidth maxWidth="sm">
        <DialogTitle>Withdraw Funds from GidiNest Wallet</DialogTitle>
        <DialogContent dividers>
          <Alert severity="warning" sx={{ mb: 2 }}>
            <AlertTitle>Important Security Notice</AlertTitle>
            For your security, all withdrawals are processed to bank accounts linked to your BVN.
            Ensure the account details match your registered information.
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

          <FeeBreakdown
            feeData={withdrawalFee.feeData}
            loading={withdrawalFee.loading}
            error={withdrawalFee.error}
            netAmountLabel="Recipient receives"
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
              {banks && banks.length > 0 ? (
                banks.map((bank: any) => (
                  <MenuItem key={bank.bankcode} value={bank.bankcode}>
                    {bank.bankname}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>
                  Loading banks...
                </MenuItem>
              )}
            </Select>
          </FormControl>

          {withdrawalAccountName && (
            <TextField
              margin="dense"
              label="Account Name"
              type="text"
              fullWidth
              variant="outlined"
              value={withdrawalAccountName}
              disabled
              sx={{ mb: 2 }}
            />
          )}

          {/* Transaction PIN input - only show if PIN is set */}
          {(wallet?.wallet?.transaction_pin_set 
            || wallet?.transaction_pin_set 
            || wallet?.wallet?.has_transaction_pin
            || wallet?.has_transaction_pin
            || hasTransactionPin) && (
            <TextField
              margin="dense"
              label="Transaction PIN (4 digits)"
              type="password"
              fullWidth
              variant="outlined"
              value={withdrawalPin}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                if (value.length <= 4) {
                  setWithdrawalPin(value);
                }
              }}
              inputProps={{ maxLength: 4, inputMode: 'numeric', pattern: '[0-9]*' }}
              helperText="Enter your 4-digit transaction PIN to authorize this withdrawal"
              sx={{ mb: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseWithdrawModal} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSubmitWithdrawal}
            variant="contained"
            color="primary"
            disabled={
              !withdrawalAmount ||
              parseFloat(withdrawalAmount) <= 0 ||
              !withdrawalAccountNum ||
              !withdrawalBank ||
              loading ||
              ((wallet?.wallet?.transaction_pin_set 
                || wallet?.transaction_pin_set 
                || wallet?.wallet?.has_transaction_pin
                || wallet?.has_transaction_pin
                || hasTransactionPin) && (!withdrawalPin || withdrawalPin.length !== 4))
            }
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : withdrawalAccountName ? (
              'Submit Withdrawal'
            ) : (
              'Validate Account'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- Create New Savings Goal Modal --- */}
      <Dialog
        open={openCreateGoalModal}
        onClose={handleCloseCreateGoalModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Create a New Savings Goal</DialogTitle>
        <DialogContent dividers>
          <TextField
            autoFocus
            margin="dense"
            label="Goal Name (e.g., Baby Crib, Hospital bills)"
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
            disabled={
              !goalName.trim() || !goalTargetAmount || parseFloat(goalTargetAmount) <= 0 || loading
            }
          >
            {loading ? <CircularProgress size={24} /> : 'Create Goal'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- View Savings Goal Modal --- */}
      <Dialog open={openGoalInfoModal} onClose={handleCloseGoalInfoModal} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.3rem', pb: 0 }}>
          Savings Goal Overview
        </DialogTitle>

        <DialogContent dividers sx={{ pt: 2 }}>
          {/* Goal Name */}
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {goalData?.name || 'Unnamed Goal'}
          </Typography>

          {/* Goal Info Grid */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid sx={{ xs: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Target Amount
              </Typography>
              <Typography variant="subtitle1" color="primary" fontWeight={500}>
                ₦{Number(goalData?.target_amount || 0).toLocaleString()}
              </Typography>
            </Grid>

            <Grid sx={{ xs: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Current Amount
              </Typography>
              <Typography variant="subtitle1" color="success.main" fontWeight={500}>
                ₦{Number(goalData?.amount || 0).toLocaleString()}
              </Typography>
            </Grid>

            <Grid sx={{ xs: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Interest Rate
              </Typography>
              <Typography variant="subtitle1">
                {goalData?.interest_rate || 0}%{' '}
                <Typography variant="caption" component="span">
                  / annum
                </Typography>
              </Typography>
            </Grid>

            <Grid sx={{ xs: 6 }}>
              <Typography variant="body2" color="text.secondary">
                Accrued Interest
              </Typography>
              <Typography variant="subtitle1">
                ₦{Number(goalData?.accrued_interest || 0).toLocaleString()}
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 2 }} />

          {/* Progress Bar */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Progress: {Math.floor((goalData?.amount / goalData?.target_amount) * 100) || 0}%
            </Typography>

            <LinearProgress
              variant="determinate"
              value={Math.min(100, Math.floor((goalData?.amount / goalData?.target_amount) * 100))}
              sx={{
                height: 10,
                borderRadius: 5,
                backgroundColor: 'grey.300',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: 'primary.main',
                },
              }}
            />
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Actions */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
              Available Actions
            </Typography>

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={3}
              flexWrap="wrap"
              sx={{
                '@media (max-width: 600px)': {
                  justifyContent: 'center',
                },
              }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleOpenAddFundsModal}
                fullWidth
                sx={{
                  mb: { xs: 2, sm: 0 },
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                Add Funds
              </Button>
              <Button
                variant="outlined"
                color="info"
                onClick={handleWithdrawToWallet}
                fullWidth
                sx={{
                  mb: { xs: 2, sm: 0 },
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                Withdraw
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={handleSavingPlanDelete}
                fullWidth
                sx={{
                  mb: { xs: 2, sm: 0 },
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                Delete Plan
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

      {openFundsModal && (
        <FundsActionModal
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
                const result = await dispatch(
                  initiateWithdrawal({
                    goal_id: goalData?.id,
                    amount: parseFloat(amount),
                    transaction_type: 'contribution',
                    description: `Contribution to ${goalData.name} savings goal`,
                  })
                );

                if (result.success) {
                  toast(`Deposit of ${amount} to ${goalData.name} initiated.`);
                  dispatch(getWallet());
                  dispatch(getSavingsGoals());
                  dispatch(getRecentSavingTransactions());
                } else {
                  const errorMsg = result.error || 'An unknown error occurred.';
                  toast.error(`Deposit failed: ${errorMsg}`, { autoClose: 8000 });
                }
              } else {
                const result = await dispatch(
                  initiateWithdrawal({
                    goal_id: goalData?.id,
                    amount: parseFloat(amount),
                    transaction_type: 'withdrawal',
                    description: `Withdrawal from ${goalData.name} savings goal`,
                  })
                );

                if (result.success) {
                  toast(`Withdrawal of ${amount} from ${goalData.name} initiated.`);

                  dispatch(getWallet());
                  dispatch(getSavingsGoals());
                  dispatch(getRecentSavingTransactions());
                } else {
                  const errorMsg = result.error || 'An unknown error occurred.';
                  toast.error(`Withdrawal failed: ${errorMsg}`, { autoClose: 8000 });
                }
              }
            } catch (err: any) {
              toast.error('An error occurred. Please try again.', { autoClose: 6000 });
            } finally {
              dispatch(getRecentSavingTransactions());
              setOpenFundsModal(false);
            }
          }}
        />
      )}

      <BVNVerificationModal
        bvn={bvn}
        handleCloseBvnModal={handleCloseBvnModal}
        openBvnModal={openBvnModal && !isAccountVerified}
        verificationError={verificationError}
        verificationStatus={verificationStatus}
        handleVerifyBvn={handleVerifyBvn}
        handleBvnInputChange={handleBvnInputChange}
      />

      <NINVerificationModal
        nin={nin}
        firstname={ninFirstname}
        lastname={ninLastname}
        dob={ninDob}
        handleNinInputChange={handleNinInputChange}
        handleFirstnameChange={handleNinFirstnameChange}
        handleLastnameChange={handleNinLastnameChange}
        handleDobChange={handleNinDobChange}
        openNinModal={openNinModal && !isNinAccountVerified}
        handleCloseNinModal={handleCloseNinModal}
        verificationStatus={ninVerificationStatus}
        verificationError={ninVerificationError}
        handleVerifyNin={handleVerifyNin}
      />

      <TransactionPinModal
        mode={pinModalMode}
        openPinModal={openPinModal}
        handleClosePinModal={handleClosePinModal}
        pinStatus={pinStatus}
        pinError={pinError}
        handleSetPin={handleSetPin}
        onPinSet={handlePinSet}
      />

      {/* Verification Choice Dialog */}
      <Dialog
        open={showVerificationChoice}
        onClose={() => setShowVerificationChoice(false)}
        aria-labelledby="verification-choice-title"
        PaperProps={{
          sx: {
            minWidth: { xs: '90%', sm: 400 },
            p: 2,
          },
        }}
      >
        <DialogTitle id="verification-choice-title" sx={{ pb: 1 }}>
          <Typography variant="h6">
            {!userProfile?.has_bvn && !userProfile?.has_nin && 'Account Verification Required'}
            {userProfile?.has_bvn && !userProfile?.has_nin && 'Add NIN Verification'}
            {!userProfile?.has_bvn && userProfile?.has_nin && 'Add BVN Verification'}
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 2, pb: 2 }}>
          {/* Show current verification status if any */}
          {(userProfile?.has_bvn || userProfile?.has_nin) && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <AlertTitle>Current Status</AlertTitle>
              You have verified with {userProfile?.has_bvn ? 'BVN' : 'NIN'}. Add{' '}
              {userProfile?.has_bvn ? 'NIN' : 'BVN'} verification to upgrade your account tier and
              increase transaction limits.
            </Alert>
          )}

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {!userProfile?.has_bvn && !userProfile?.has_nin &&
              'To unlock all GidiNest features and ensure the security of your funds, please verify your account. You can choose to verify with either your BVN or NIN.'}
            {(userProfile?.has_bvn || userProfile?.has_nin) &&
              'Choose an additional verification method to fully secure your account and unlock higher limits.'}
          </Typography>

          <Stack spacing={2}>
            {!userProfile?.has_bvn && (
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => {
                  setShowVerificationChoice(false);
                  setOpenBvnModal(true);
                }}
                startIcon={<ShieldCheck size={18} />}
              >
                {userProfile?.has_nin ? 'Add BVN Verification' : 'Verify with BVN'}
              </Button>
            )}
            {!userProfile?.has_nin && (
              <Button
                variant={userProfile?.has_bvn ? 'contained' : 'outlined'}
                color="primary"
                fullWidth
                onClick={() => {
                  setShowVerificationChoice(false);
                  setOpenNinModal(true);
                }}
                startIcon={<ShieldCheck size={18} />}
              >
                {userProfile?.has_bvn ? 'Add NIN Verification' : 'Verify with NIN'}
              </Button>
            )}
          </Stack>

          {/* Show benefits of full verification */}
          {(userProfile?.has_bvn || userProfile?.has_nin) && !(userProfile?.has_bvn && userProfile?.has_nin) && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: 'background.neutral', borderRadius: 1 }}>
              <Typography variant="caption" fontWeight={600} display="block" gutterBottom>
                Benefits of Full Verification:
              </Typography>
              <Typography variant="caption" display="block">
                • Higher daily transaction limits
              </Typography>
              <Typography variant="caption" display="block">
                • Increased account balance cap
              </Typography>
              <Typography variant="caption" display="block">
                • Priority customer support
              </Typography>
              <Typography variant="caption" display="block">
                • Access to premium features
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowVerificationChoice(false)} color="inherit">
            {userProfile?.has_bvn || userProfile?.has_nin ? 'Maybe Later' : 'Later'}
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}
