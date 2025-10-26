import { useDispatch, useSelector } from 'react-redux';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

import {
  requestPasswordResetOtp,
  verifyPasswordResetOtp,
  resetPassword,
  clearAuthError,
} from '../../redux/auth/auth.actions';

import type { RootState, AppDispatch } from '../../redux/types';

export function ForgotPasswordView() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  // State management
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Step 1: Request OTP
  const handleRequestOtp = useCallback(async () => {
    if (!email) {
      return;
    }

    dispatch(clearAuthError());
    const result = await dispatch(requestPasswordResetOtp({ email }));

    if (result.success) {
      setSuccessMessage('OTP sent to your email. Please check your inbox.');
      setStep('otp');
    }
  }, [email, dispatch]);

  // Step 2: Verify OTP
  const handleVerifyOtp = useCallback(async () => {
    if (!email || !otp) {
      return;
    }

    dispatch(clearAuthError());
    const result = await dispatch(verifyPasswordResetOtp({ email, otp }));

    if (result.success) {
      setSuccessMessage('OTP verified successfully. Please set your new password.');
      setStep('password');
    }
  }, [email, otp, dispatch]);

  // Step 3: Reset Password
  const handleResetPassword = useCallback(async () => {
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords don't match.");
      return;
    }

    if (!email || !otp || !newPassword) {
      return;
    }

    dispatch(clearAuthError());
    const result = await dispatch(
      resetPassword({ email, otp, new_password: newPassword })
    );

    if (result.success) {
      setSuccessMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    }
  }, [email, otp, newPassword, confirmPassword, dispatch, router]);

  // Render Step 1: Email Input
  const renderEmailForm = (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleRequestOtp();
      }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <TextField
        fullWidth
        name="email"
        label="Email address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        slotProps={{
          inputLabel: { shrink: true },
        }}
        required
      />

      {successMessage && (
        <Alert severity="success">{successMessage}</Alert>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      <Button
        fullWidth
        size="large"
        type="submit"
        color="primary"
        variant="contained"
        disabled={loading || !email}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
      </Button>
    </Box>
  );

  // Render Step 2: OTP Input
  const renderOtpForm = (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleVerifyOtp();
      }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <TextField
        fullWidth
        name="otp"
        label="OTP Code"
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter the 6-digit code"
        slotProps={{
          inputLabel: { shrink: true },
        }}
        required
      />

      {successMessage && (
        <Alert severity="success">{successMessage}</Alert>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      <Button
        fullWidth
        size="large"
        type="submit"
        color="primary"
        variant="contained"
        disabled={loading || !otp}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
      </Button>

      <Button
        fullWidth
        size="large"
        color="inherit"
        variant="text"
        onClick={() => setStep('email')}
      >
        Back to Email
      </Button>
    </Box>
  );

  // Render Step 3: New Password Input
  const renderPasswordForm = (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleResetPassword();
      }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <TextField
        fullWidth
        name="newPassword"
        label="New Password"
        type={showPassword ? 'text' : 'password'}
        value={newPassword}
        onChange={(e) => {
          setNewPassword(e.target.value);
          setPasswordError('');
        }}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        helperText="Password must be at least 8 characters long, contain a number, and a special character."
        required
      />

      <TextField
        fullWidth
        name="confirmPassword"
        label="Confirm Password"
        type={showPassword ? 'text' : 'password'}
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          setPasswordError('');
        }}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        error={!!passwordError}
        helperText={passwordError}
        required
      />

      {successMessage && (
        <Alert severity="success">{successMessage}</Alert>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      <Button
        fullWidth
        size="large"
        type="submit"
        color="primary"
        variant="contained"
        disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Reset Password'}
      </Button>

      <Button
        fullWidth
        size="large"
        color="inherit"
        variant="text"
        onClick={() => setStep('otp')}
      >
        Back to OTP
      </Button>
    </Box>
  );

  // Main render based on current step
  const renderCurrentStep = () => {
    switch (step) {
      case 'email':
        return renderEmailForm;
      case 'otp':
        return renderOtpForm;
      case 'password':
        return renderPasswordForm;
      default:
        return renderEmailForm;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'email':
        return 'Forgot Password';
      case 'otp':
        return 'Verify OTP';
      case 'password':
        return 'Set New Password';
      default:
        return 'Forgot Password';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'email':
        return 'Enter your email address to receive an OTP code.';
      case 'otp':
        return 'Enter the OTP code sent to your email.';
      case 'password':
        return 'Create a strong password for your account.';
      default:
        return 'Enter your email address to receive an OTP code.';
    }
  };

  return (
    <>
      <Box
        sx={{
          gap: 1.5,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mb: 5,
        }}
      >
        <Typography variant="h5">{getStepTitle()}</Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
          }}
        >
          {getStepDescription()}
        </Typography>
      </Box>
      {renderCurrentStep()}
    </>
  );
}
