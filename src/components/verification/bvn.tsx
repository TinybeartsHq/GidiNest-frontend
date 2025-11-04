/* eslint-disable react-hooks/exhaustive-deps */
import type { CardProps } from '@mui/material/Card';

import { useState } from 'react';

import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { Box, Alert, Stack, Button, TextField, CircularProgress } from '@mui/material';

type Props = CardProps & {
  bvn: string;
  handleBvnInputChange:any;
  openBvnModal: boolean;
  handleCloseBvnModal: any;
  verificationStatus: string;
  verificationError?: string | null;
  handleVerifyBvn: any;
};

export function BVNVerificationModal({
  bvn,
  handleBvnInputChange,
  openBvnModal,
  handleCloseBvnModal,
  verificationStatus,
  verificationError,
  handleVerifyBvn,
}: Props) {
  
  return (
    <Dialog
      open={openBvnModal}
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
          To unlock all GidiNest features and ensure the security of your funds, please verify your
          account with your Bank Verification Number (BVN).
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
            verificationStatus === 'error' && bvn.length !== 11
              ? 'BVN must be 11 digits.'
              : 'Your BVN is secure and used for verification purposes only.'
          }
          sx={{
            mb: 2,
            '& input:-webkit-autofill': {
              WebkitBoxShadow: '0 0 0 100px transparent inset',
              WebkitTextFillColor: 'inherit',
            },
          }}
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
            {verificationError || 'Verification failed. Please check your BVN and try again.'}
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
  );
}
