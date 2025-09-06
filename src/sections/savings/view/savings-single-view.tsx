import type { AppDispatch } from 'src/redux/types';

import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import AlertTitle from '@mui/material/AlertTitle';
import CardContent from '@mui/material/CardContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';
import { Chip, TextField, DialogActions } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

// Import your Redux actions for a single goal
// You will need to create these actions
import { AnalyticsWidgetSummary } from '../analytics-widget-summary';

// --- Mock Data ---
// In a real app, this would come from your API
const MOCK_GOAL_TRANSACTIONS = [
    { id: 't1', date: '2025-09-01', type: 'Deposit', description: 'Monthly contribution', amount: 50000 },
    { id: 't2', date: '2025-08-15', type: 'Withdrawal', description: 'Emergency withdrawal', amount: 15000 },
    { id: 't3', date: '2025-08-01', type: 'Deposit', description: 'Initial contribution', amount: 25000 },
];
const MOCK_INTEREST_DATA = [
    { id: 'i1', date: '2025-09-01', description: 'September interest payout', amount: 250.50 },
    { id: 'i2', date: '2025-08-01', description: 'August interest payout', amount: 180.25 },
];

export function SingleSavingsGoalView() {
    const { goalId } = useParams(); // Get the goalId from the URL
    const dispatch: AppDispatch = useDispatch();

    // Select data from Redux store
    const {
        goals, // Assuming all goals are in the store
        loading,
        error,
    } = useSelector((state: any) => state.savings); // Adjust 'state.savings' to your actual Redux state path

    // Find the specific goal from the list
    const goal = useMemo(() => goals.find((g: any) => g.id === goalId), [goals, goalId]);

    // --- State for Modals and Forms ---
    const [openWithdrawModal, setOpenWithdrawModal] = useState(false);
    const [openDepositModal, setOpenDepositModal] = useState(false);
    const [depositAmount, setDepositAmount] = useState('');
    const [withdrawalAmount, setWithdrawalAmount] = useState('');

    // --- Data for this specific goal ---
    const transactions = MOCK_GOAL_TRANSACTIONS; // Replace with a real Redux state fetch
    const interestAccrued = MOCK_INTEREST_DATA; // Replace with a real Redux state fetch

    useEffect(() => {
        // In a real app, you would dispatch an action here to fetch the specific goal's data
        // dispatch(getSavingsGoalDetails(goalId));
        // dispatch(getGoalTransactions(goalId));
    }, [dispatch, goalId]);

    const handleOpenWithdrawModal = useCallback(() => setOpenWithdrawModal(true), []);
    const handleCloseWithdrawModal = useCallback(() => setOpenWithdrawModal(false), []);

    const handleOpenDepositModal = useCallback(() => setOpenDepositModal(true), []);
    const handleCloseDepositModal = useCallback(() => setOpenDepositModal(false), []);

    const handleSubmitWithdrawal = useCallback(async () => {
        if (parseFloat(withdrawalAmount) <= 0 || isNaN(parseFloat(withdrawalAmount))) {
            alert('Please enter a valid withdrawal amount.');
            return;
        }
        // Implement your withdrawal logic here
        console.log(`Withdrawing ${withdrawalAmount} from goal ${goalId}`);
        // Await dispatch(initiateGoalWithdrawal({ goalId, amount: parseFloat(withdrawalAmount) }));
        handleCloseWithdrawModal();
    }, [withdrawalAmount, handleCloseWithdrawModal, goalId]);

    const handleSubmitDeposit = useCallback(async () => {
        if (parseFloat(depositAmount) <= 0 || isNaN(parseFloat(depositAmount))) {
            alert('Please enter a valid deposit amount.');
            return;
        }
        // Implement your deposit logic here
        console.log(`Depositing ${depositAmount} to goal ${goalId}`);
        // Await dispatch(initiateGoalDeposit({ goalId, amount: parseFloat(depositAmount) }));
        handleCloseDepositModal();
    }, [depositAmount, handleCloseDepositModal, goalId]);

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

    if (!goal) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                {loading ? <CircularProgress /> : (
                    <Alert severity="error">
                        <AlertTitle>Goal Not Found</AlertTitle>
                        The savings goal you are looking for does not exist.
                    </Alert>
                )}
            </Box>
        );
    }

    const progressPercent = Math.min(100, Math.floor((goal.currentAmount / goal.target_amount) * 100)) || 0;
    const goalCurrency = goal.currency || '₦';

    return (
        <DashboardContent>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography variant="h4" gutterBottom>
                    {goal.name}
                </Typography>
                <Stack direction="row" spacing={1}>
                    <Button variant="contained" color="primary" onClick={handleOpenDepositModal}>
                        Deposit
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleOpenWithdrawModal}>
                        Withdraw
                    </Button>
                </Stack>
            </Stack>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 5 }}>
                Track your progress, view transaction history, and manage your goal.
            </Typography>

            {/* Error Alert */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    <AlertTitle>Error</AlertTitle>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Goal Summary Widget */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Typography variant="h6" sx={{ mb: 1 }}>Goal Progress</Typography>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h3" color="primary.main">{formatCurrency(goal.currentAmount, goalCurrency)}</Typography>
                                <Typography variant="body2" color="text.secondary">out of a target of {formatCurrency(goal.target_amount, goalCurrency)}</Typography>
                            </Box>
                            <Box sx={{ mt: 1, height: 10, borderRadius: 1, bgcolor: 'grey.300' }}>
                                <Box sx={{
                                    height: '100%',
                                    width: `${progressPercent}%`,
                                    borderRadius: 1,
                                    bgcolor: 'primary.main'
                                }} />
                            </Box>
                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5, color: 'text.secondary' }}>
                                {progressPercent}% completed
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Interest Accrued Widget */}
                <Grid size={{ xs: 12, md: 4 }} >
                    <AnalyticsWidgetSummary
                        title="Total Interest Earned"
                        percent={10} // Placeholder, can be calculated dynamically
                        total={formatCurrency(interestAccrued.reduce((sum, item) => sum + item.amount, 0), goalCurrency)}
                        icon={<img alt="Interest" src="/assets/icons/glass/ic_glass_archive.svg" />}
                        sx={{ height: '100%' }} chart={{
                            series: [],
                            categories: [],
                            options: undefined
                        }}                    />
                </Grid>

                {/* Recent Transactions Table */}
                <Grid size={{ xs: 12}}>
                    <Typography variant="h5" sx={{ mb: 3, mt: 5 }}>Recent Transactions</Typography>
                    <Card>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {transactions.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                                                    No recent transactions for this goal.
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        transactions.map((row: any) => (
                                            <TableRow key={row.id}>
                                                <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={row.type}
                                                        color={row.type === 'Deposit' ? 'success' : 'error'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>{row.description}</TableCell>
                                                <TableCell align="right">
                                                    {formatCurrency(row.amount, goalCurrency)}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Card>
                </Grid>
            </Grid>

            {/* --- Deposit Modal (specific to this goal) --- */}
            <Dialog open={openDepositModal} onClose={handleCloseDepositModal} fullWidth maxWidth="sm">
                <DialogTitle>Deposit to {goal.name}</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        You are about to deposit funds to this savings goal.
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Amount"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        inputProps={{ min: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDepositModal} color="inherit">Cancel</Button>
                    <Button
                        onClick={handleSubmitDeposit}
                        variant="contained"
                        color="primary"
                        disabled={!depositAmount || parseFloat(depositAmount) <= 0}
                    >
                        Deposit
                    </Button>
                </DialogActions>
            </Dialog>

            {/* --- Withdrawal Modal (specific to this goal) --- */}
            <Dialog open={openWithdrawModal} onClose={handleCloseWithdrawModal} fullWidth maxWidth="sm">
                <DialogTitle>Withdraw from {goal.name}</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        You are about to withdraw funds from this savings goal.
                    </Typography>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Amount"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={withdrawalAmount}
                        onChange={(e) => setWithdrawalAmount(e.target.value)}
                        inputProps={{ min: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseWithdrawModal} color="inherit">Cancel</Button>
                    <Button
                        onClick={handleSubmitWithdrawal}
                        variant="contained"
                        color="primary"
                        disabled={!withdrawalAmount || parseFloat(withdrawalAmount) <= 0}
                    >
                        Withdraw
                    </Button>
                </DialogActions>
            </Dialog>
        </DashboardContent>
    );
}