import { useState } from 'react';

import {
  Dialog,
  Button,
  TextField,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';

interface FundsActionModalProps {
  open: boolean;
  onClose: () => void;
  actionType: 'add' | 'withdraw'; // determines the mode
  walletBalance: number;          // Gidinest wallet balance
  goalBalance: number;            // Savings goal current balance
  goalId: string | number;
  onSubmit: (amount: number) => Promise<void>; // submission handler
  loading: boolean;
}

export const FundsActionModal = ({
  open,
  onClose,
  actionType,
  walletBalance,
  goalBalance,
  goalId,
  onSubmit,
  loading,
}: FundsActionModalProps) => {
  const [amount, setAmount] = useState('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleAction = async () => {
    const parsed = parseFloat(amount);
    if (!isNaN(parsed) && parsed > 0) {
      await onSubmit(parsed);
    }
  };

  const availableBalance = actionType === 'add' ? walletBalance : goalBalance;
  const actionLabel = actionType === 'add' ? 'Add to Goal' : 'Withdraw to Wallet';

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>{actionLabel}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {actionType === 'add'
            ? `Available in Gidinest Wallet: ₦${walletBalance.toLocaleString()}`
            : `Available in Goal: ₦${goalBalance.toLocaleString()}`}
        </Typography>

        <TextField
          label="Amount (₦)"
          type="number"
          fullWidth
          variant="outlined"
          value={amount}
          onChange={handleAmountChange}
          inputProps={{ min: 1 }}
          sx={{ mt: 1 }}
        />

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {actionType === 'add'
            ? 'This will deduct money from your wallet into your savings goal.'
            : 'This will move money from your goal into your wallet.'}
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleAction}
          disabled={
            loading ||
            !amount ||
            parseFloat(amount) <= 0 ||
            parseFloat(amount) > availableBalance
          }
          variant="contained"
          color={actionType === 'add' ? 'primary' : 'secondary'}
        >
          {loading ? <CircularProgress size={24} /> : actionLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
