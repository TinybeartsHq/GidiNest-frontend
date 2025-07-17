import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton'; // Required for password visibility toggle
import InputAdornment from '@mui/material/InputAdornment'; // Required for password visibility

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify'; // Assuming Iconify is still used for eye icons

// ----------------------------------------------------------------------

export function SignUpView() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // State to manage the current step of the sign-up process
  const [currentStep, setCurrentStep] = useState('email'); // 'email', 'otp', 'setPassword'

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // New state for confirm password visibility
  const [passwordError, setPasswordError] = useState('');

  const handleSendOtp = useCallback(() => {
    // In a real application, you would send an API request here
    // to your backend to send an OTP to the provided email.
    console.log('Sending OTP to:', email);
    // Simulate OTP sent successfully
    setCurrentStep('otp'); // Move to the OTP verification step
    // You might want to add a timer for OTP resend functionality here
  }, [email]);

  const handleVerifyOtp = useCallback(() => {
    // In a real application, you would send an API request here
    // to your backend to verify the entered OTP.
    console.log('Verifying OTP:', otp, 'for email:', email);
    // Simulate OTP verification success
    // On successful verification, move to the password setup step
    setCurrentStep('setPassword');
  }, [otp, email]); // router is no longer needed here since we are not navigating away

  const handleSetPassword = useCallback(() => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match.");
      return;
    }

    // In a real application, you would send an API request here
    // to your backend to save the user's new password, along with their email.
    console.log('Setting password:', password, 'for email:', email);

    // Simulate password set successfully
    // On successful password setup, navigate to the dashboard or a success page
    router.push('/'); // Navigate to the home/dashboard page after setting password
  }, [password, confirmPassword, email, router]);

  const renderEmailInput = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
      }}
    >
      <TextField
        fullWidth
        name="email"
        label="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />

      <Button
        fullWidth
        size="large"
        variant="contained"
        color="primary"
        onClick={handleSendOtp}
        disabled={!email} // Disable button if email is empty
      >
        Send OTP
      </Button>
    </Box>
  );

  const renderOtpInput = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
      }}
    >
      <TextField
        fullWidth
        name="otp"
        label="One-Time Password (OTP)"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
        helperText="A 6-digit code has been sent to your email."
      />

      <Button
        fullWidth
        size="large"
        variant="contained"
        color="primary"
        onClick={handleVerifyOtp}
        disabled={otp.length !== 6} // Disable button if OTP is not 6 digits (assuming 6 digits)
      >
        Verify OTP
      </Button>

      <Link
        variant="body2"
        color="primary"
        sx={{ mt: 1.5, cursor: 'pointer' }}
        onClick={handleSendOtp} // Allow resending OTP
      >
        Resend OTP
      </Link>
    </Box>
  );

  const renderSetPasswordForm = (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
      }}
    >
      <TextField
        fullWidth
        name="password"
        label="New Password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setPasswordError(''); // Clear error on change
        }}
        sx={{ mb: 3 }}
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
      />

      <TextField
        fullWidth
        name="confirmPassword"
        label="Confirm Password"
        type={showConfirmPassword ? 'text' : 'password'}
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          setPasswordError(''); // Clear error on change
        }}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                  <Iconify icon={showConfirmPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
        error={!!passwordError}
        helperText={passwordError}
      />

      <Button
        fullWidth
        size="large"
        type="submit"
        color="primary"
        variant="contained"
        onClick={handleSetPassword}
        // Disable if passwords don't match or are empty, or if password error exists
        disabled={!password || !confirmPassword || password !== confirmPassword || !!passwordError}
      >
        Set Password
      </Button>
    </Box>
  );

  const renderContent = () => {
    switch (currentStep) {
      case 'email':
        return renderEmailInput;
      case 'otp':
        return renderOtpInput;
      case 'setPassword':
        return renderSetPasswordForm;
      default:
        return renderEmailInput;
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
        <Typography variant="h5">
          {currentStep === 'email' && 'Sign up'}
          {currentStep === 'otp' && 'Verify Your Email'}
          {currentStep === 'setPassword' && 'Set Your Password'}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          {currentStep === 'email' && (
            <>
              Already have an account?
              <Link variant="subtitle2" sx={{ ml: 0.5 }} onClick={() => router.push('/sign-in')}>
                Sign in
              </Link>
            </>
          )}
          {currentStep === 'otp' && 'Enter the code sent to your email.'}
          {currentStep === 'setPassword' && 'Please set a strong password for your account.'}
        </Typography>
      </Box>

      {renderContent()}
    </>
  );
}