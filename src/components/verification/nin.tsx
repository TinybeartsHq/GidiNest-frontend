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
  nin: string;
  firstname: string;
  lastname: string;
  dob: string;
  handleNinInputChange: any;
  handleFirstnameChange: any;
  handleLastnameChange: any;
  handleDobChange: any;
  openNinModal: boolean;
  handleCloseNinModal: any;
  verificationStatus: string;
  verificationError?: string | null;
  handleVerifyNin: any;
};

export function NINVerificationModal({
  nin,
  firstname,
  lastname,
  dob,
  handleNinInputChange,
  handleFirstnameChange,
  handleLastnameChange,
  handleDobChange,
  openNinModal,
  handleCloseNinModal,
  verificationStatus,
  verificationError,
  handleVerifyNin,
}: Props) {
  const isFormValid = nin.length === 11 && firstname && lastname && dob;

  return (
    <Dialog
      open={openNinModal}
      onClose={handleCloseNinModal}
      aria-labelledby="nin-verification-title"
      disableEscapeKeyDown={verificationStatus === 'loading'}
      PaperProps={{
        sx: {
          minWidth: { xs: '90%', sm: 500 },
          p: 2,
        },
      }}
    >
      <DialogTitle id="nin-verification-title" sx={{ pb: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6">Verify Your Account with NIN</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 2, pb: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          To unlock all GidiNest features and ensure the security of your funds, please verify your
          account with your National Identification Number (NIN).
        </Typography>

        {(firstname || lastname || dob) && (
          <Alert severity="info" sx={{ mb: 2 }}>
            We&apos;ve pre-filled your details from your profile. Please verify they match your NIN
            exactly or edit them if needed.
          </Alert>
        )}

        <Stack spacing={2}>
          <TextField
            fullWidth
            label="Enter NIN (11 Digits)"
            variant="outlined"
            value={nin}
            onChange={handleNinInputChange}
            inputProps={{ maxLength: 11 }}
            error={verificationStatus === 'error' && nin.length !== 11}
            helperText={
              verificationStatus === 'error' && nin.length !== 11
                ? 'NIN must be 11 digits.'
                : 'Your NIN is secure and used for verification purposes only.'
            }
            disabled={verificationStatus === 'loading'}
          />

          <TextField
            fullWidth
            label="First Name"
            variant="outlined"
            value={firstname}
            onChange={handleFirstnameChange}
            error={verificationStatus === 'error' && !firstname}
            helperText={
              verificationStatus === 'error' && !firstname
                ? 'First name is required.'
                : 'Enter your first name as it appears on your NIN.'
            }
            disabled={verificationStatus === 'loading'}
          />

          <TextField
            fullWidth
            label="Last Name"
            variant="outlined"
            value={lastname}
            onChange={handleLastnameChange}
            error={verificationStatus === 'error' && !lastname}
            helperText={
              verificationStatus === 'error' && !lastname
                ? 'Last name is required.'
                : 'Enter your last name as it appears on your NIN.'
            }
            disabled={verificationStatus === 'loading'}
          />

          <TextField
            fullWidth
            label="Date of Birth"
            type="date"
            variant="outlined"
            value={dob}
            onChange={handleDobChange}
            InputLabelProps={{
              shrink: true,
            }}
            error={verificationStatus === 'error' && !dob}
            helperText={
              verificationStatus === 'error' && !dob
                ? 'Date of birth is required.'
                : 'Enter your date of birth as it appears on your NIN.'
            }
            disabled={verificationStatus === 'loading'}
          />
        </Stack>

        {verificationStatus === 'loading' && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {verificationStatus === 'success' && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Account successfully verified with NIN! 🎉
          </Alert>
        )}

        {verificationStatus === 'error' && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {verificationError || 'Verification failed. Please check your details and try again.'}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCloseNinModal}
          color="inherit"
          disabled={verificationStatus === 'loading'}
        >
          Later
        </Button>
        <Button
          onClick={handleVerifyNin}
          variant="contained"
          color="primary"
          disabled={!isFormValid || verificationStatus === 'loading'}
        >
          {verificationStatus === 'loading' ? 'Verifying...' : 'Verify Now'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
