/* eslint-disable react-hooks/exhaustive-deps */
import type { CardProps } from '@mui/material/Card';

import { useState, useEffect } from 'react';

import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Box, Alert, Stack, Button, TextField, CircularProgress } from '@mui/material';

type Props = CardProps & {
  mode: 'setup' | 'verify' | 'update'; // setup for first time, verify for withdrawal, update for changing PIN
  openPinModal: boolean;
  handleClosePinModal: () => void;
  pinStatus: string; // 'idle' | 'loading' | 'success' | 'error'
  pinError?: string | null;
  handleSetPin?: (pin: string, oldPin?: string) => Promise<void>;
  handleVerifyPin?: (pin: string) => Promise<void>;
  onPinVerified?: () => void; // Callback when PIN is verified successfully
  onPinSet?: () => void; // Callback when PIN is set successfully
};

export function TransactionPinModal({
  mode,
  openPinModal,
  handleClosePinModal,
  pinStatus,
  pinError,
  handleSetPin,
  handleVerifyPin,
  onPinVerified,
  onPinSet,
}: Props) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [oldPin, setOldPin] = useState('');

  const handlePinInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 4) {
      setPin(value);
    }
  };

  const handleConfirmPinInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 4) {
      setConfirmPin(value);
    }
  };

  const handleOldPinInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/\D/g, ''); // Only allow digits
    if (value.length <= 4) {
      setOldPin(value);
    }
  };

  const handleSubmit = async () => {
    if (mode === 'verify') {
      if (pin.length !== 4) {
        return;
      }
      if (handleVerifyPin) {
        await handleVerifyPin(pin);
      }
    } else if (mode === 'setup') {
      if (pin.length !== 4 || confirmPin.length !== 4) {
        return;
      }
      if (pin !== confirmPin) {
        return;
      }
      if (handleSetPin) {
        await handleSetPin(pin);
      }
    } else if (mode === 'update') {
      if (pin.length !== 4 || confirmPin.length !== 4 || oldPin.length !== 4) {
        return;
      }
      if (pin !== confirmPin) {
        return;
      }
      if (handleSetPin) {
        await handleSetPin(pin, oldPin);
      }
    }
  };

  const handleClose = () => {
    if (pinStatus !== 'loading') {
      setPin('');
      setConfirmPin('');
      setOldPin('');
      handleClosePinModal();
    }
  };

  // Reset form when modal closes
  const handleModalClose = () => {
    if (pinStatus === 'success') {
      if (mode === 'verify' && onPinVerified) {
        onPinVerified();
      } else if ((mode === 'setup' || mode === 'update') && onPinSet) {
        onPinSet();
      }
    }
    handleClose();
  };

  // Reset form fields when modal opens/closes
  useEffect(() => {
    if (!openPinModal) {
      setPin('');
      setConfirmPin('');
      setOldPin('');
    }
  }, [openPinModal]);

  const getTitle = () => {
    if (mode === 'setup') return 'Set Transaction PIN';
    if (mode === 'verify') return 'Verify Transaction PIN';
    return 'Update Transaction PIN';
  };

  const getDescription = () => {
    if (mode === 'setup') {
      return 'Set up a 4-digit transaction PIN to secure your withdrawals. You will need this PIN for all withdrawal transactions.';
    }
    if (mode === 'verify') {
      return 'Please enter your 4-digit transaction PIN to proceed with the withdrawal.';
    }
    return 'Update your transaction PIN. You will need to enter your current PIN and choose a new one.';
  };

  const isFormValid = () => {
    if (mode === 'verify') {
      return pin.length === 4;
    }
    if (mode === 'setup') {
      return pin.length === 4 && confirmPin.length === 4 && pin === confirmPin;
    }
    // update mode
    return pin.length === 4 && confirmPin.length === 4 && oldPin.length === 4 && pin === confirmPin;
  };

  return (
    <Dialog
      open={openPinModal}
      onClose={handleModalClose}
      aria-labelledby="transaction-pin-title"
      disableEscapeKeyDown={pinStatus === 'loading'}
      PaperProps={{
        sx: {
          minWidth: { xs: '90%', sm: 400 },
          p: 2,
        },
      }}
    >
      <DialogTitle id="transaction-pin-title" sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6">{getTitle()}</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 2, pb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {getDescription()}
        </Typography>

        {mode === 'update' && (
          <TextField
            fullWidth
            label="Current PIN"
            type="password"
            variant="outlined"
            value={oldPin}
            onChange={handleOldPinInputChange}
            inputProps={{ maxLength: 4, inputMode: 'numeric', pattern: '[0-9]*' }}
            error={pinStatus === 'error' && oldPin.length !== 4}
            helperText={oldPin.length !== 4 ? 'Enter your current 4-digit PIN' : ''}
            sx={{
              mb: 2,
              '& input:-webkit-autofill': {
                WebkitBoxShadow: '0 0 0 100px transparent inset',
                WebkitTextFillColor: 'inherit',
              },
            }}
            disabled={pinStatus === 'loading'}
          />
        )}

        <TextField
          fullWidth
          label={mode === 'verify' ? 'Enter PIN' : 'New PIN'}
          type="password"
          variant="outlined"
          value={pin}
          onChange={handlePinInputChange}
          inputProps={{ maxLength: 4, inputMode: 'numeric', pattern: '[0-9]*' }}
          error={pinStatus === 'error' && pin.length !== 4}
          helperText={
            pinStatus === 'error' && pin.length !== 4
              ? 'PIN must be 4 digits.'
              : mode === 'verify'
                ? 'Enter your 4-digit transaction PIN'
                : 'Enter a 4-digit PIN'
          }
          sx={{
            mb: mode === 'setup' || mode === 'update' ? 2 : 0,
            '& input:-webkit-autofill': {
              WebkitBoxShadow: '0 0 0 100px transparent inset',
              WebkitTextFillColor: 'inherit',
            },
          }}
          disabled={pinStatus === 'loading'}
        />

        {(mode === 'setup' || mode === 'update') && (
          <TextField
            fullWidth
            label="Confirm PIN"
            type="password"
            variant="outlined"
            value={confirmPin}
            onChange={handleConfirmPinInputChange}
            inputProps={{ maxLength: 4, inputMode: 'numeric', pattern: '[0-9]*' }}
            error={pin !== confirmPin && confirmPin.length === 4}
            helperText={
              pin !== confirmPin && confirmPin.length === 4
                ? 'PINs do not match'
                : 'Re-enter your PIN to confirm'
            }
            sx={{
              mb: 2,
              mt: 2,
              '& input:-webkit-autofill': {
                WebkitBoxShadow: '0 0 0 100px transparent inset',
                WebkitTextFillColor: 'inherit',
              },
            }}
            disabled={pinStatus === 'loading'}
          />
        )}

        {pinStatus === 'loading' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {pinStatus === 'success' && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {mode === 'verify' ? 'PIN verified successfully! 🎉' : 'PIN set successfully! 🎉'}
          </Alert>
        )}

        {pinStatus === 'error' && pin.length === 4 && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {pinError || (mode === 'verify' ? 'Invalid PIN. Please try again.' : 'Failed to set PIN. Please try again.')}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleModalClose}
          color="inherit"
          disabled={pinStatus === 'loading'}
        >
          {mode === 'verify' ? 'Cancel' : 'Later'}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!isFormValid() || pinStatus === 'loading'}
        >
          {pinStatus === 'loading'
            ? mode === 'verify'
              ? 'Verifying...'
              : 'Setting...'
            : mode === 'verify'
              ? 'Verify'
              : mode === 'setup'
                ? 'Set PIN'
                : 'Update PIN'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

