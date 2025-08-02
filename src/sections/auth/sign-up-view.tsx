import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

import {
  verifyOtp,
  registerUser,
  finalizeSignup,
  clearAuthError,
} from '../../redux/auth/auth.actions';

import type { RootState, AppDispatch } from '../../redux/types';

export function SignUpView() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const { loading, error, registrationMessage, otpVerified } = useSelector(
    (state: RootState) => state.auth
  );

  // State for form inputs
  const [email, setEmail] = useState('');
  const [phone_number, setPhoneNumber] = useState(''); // New state for phone number
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [otp, setOtp] = useState('');
  const [country, setCountry] = useState('');
  const [state, setState] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [currentStep, setCurrentStep] = useState<'register' | 'otp' | 'profileDetails' | 'setPassword'>('register');
  const [sessionId, setSessionId] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');


  const countryStateData = {
    'Nigeria': [
      'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
      'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo',
      'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
      'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers',
      'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
    ],
  };


  // --- Step 1: Handle Registration (Send OTP) ---
  const handleRegister = useCallback(async () => {
    dispatch(clearAuthError());

    if ((!email && !phone_number) || !first_name || !last_name) {
      console.error('Email or phone number, first name, and last name are required for registration.');
      return;
    }

    const registrationData = {
      first_name,
      last_name,
      phone:phone_number,
      email
    };

    const result = await dispatch(
      registerUser(registrationData)
    );

    if (result.success) {
      if (result.data?.data?.session_id) {
        setSessionId(result.data.data.session_id);
      } else {
        console.warn('Session ID not found in registration response.');
      }
      setCurrentStep('otp');
    } else {
      console.error('Registration failed:', result.error);
    }
  }, [email, phone_number, first_name, last_name, dispatch]);


  // --- Step 2: Handle OTP Verification ---
  const handleVerifyOtp = useCallback(async () => {
    dispatch(clearAuthError());

    if (otp.length !== 6) {
      console.error('OTP must be 6 digits long.');
      return;
    }
    if (!sessionId) {
      console.error('Session ID missing for OTP verification. Please restart registration.');
      return;
    }

    const result = await dispatch(
      verifyOtp({ session_id: sessionId, otp })
    );

    if (result.success) {
      setCurrentStep('profileDetails');
    } else {
      console.error('OTP verification failed:', result.error);
    }
  }, [otp, sessionId, dispatch]);


  // --- Step 3: Handle Profile Details Collection (New Step) ---
  const handleCollectProfileDetails = useCallback(() => {
    dispatch(clearAuthError());

    if (!country || !state) {
      console.error('Country and State are required.');
      return;
    }

    setCurrentStep('setPassword');
  }, [country, state, dispatch]);


  // --- Step 4: Handle Finalizing Signup (Setting Password) ---
  const handleFinalizeSignup = useCallback(async () => {
    dispatch(clearAuthError());

    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      return;
    }
    if (!/[0-9]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setPasswordError('Password must contain at least one number and one special character.');
      return;
    }
    setPasswordError('');

    if (!sessionId) {
      console.error('Session ID missing for signup finalization. Please restart registration.');
      return;
    }

    const result = await dispatch(
      finalizeSignup({
        session_id: sessionId,
        password,
        country,
        state,
      })
    );

    if (result.success) {
      console.log('User signed up and logged in successfully!');
      router.push('/');
    } else {
      console.error('Signup finalization failed:', result.error);
    }
  }, [password, confirmPassword, sessionId, country, state, dispatch, router]);


  // --- Render Forms based on currentStep ---

  const renderRegisterInput = (
    <Box
      component="form"
      onSubmit={(e) => { e.preventDefault(); handleRegister(); }}
      sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}
    >
      <TextField
        fullWidth
        name="phone_number"
        label="Phone Number"
        value={phone_number}
        placeholder='08082737272'
        onChange={(e) => setPhoneNumber(e.target.value)}
        sx={{ mb: 3 }}
        slotProps={{ inputLabel: { shrink: true } }}
        required
      />
      <TextField
        fullWidth
        name="email"
        label="Email address"
        value={email}
        placeholder='test@test.com'
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 3 }}
        slotProps={{ inputLabel: { shrink: true } }}
        required
      />
    
      <TextField
        fullWidth
        name="first_name"
        label="First Name"
        value={first_name}
        onChange={(e) => setFirstName(e.target.value)}
        sx={{ mb: 3 }}
        slotProps={{ inputLabel: { shrink: true } }}
        required
      />
      <TextField
        fullWidth
        name="last_name"
        label="Last Name"
        value={last_name}
        onChange={(e) => setLastName(e.target.value)}
        sx={{ mb: 3 }}
        slotProps={{ inputLabel: { shrink: true } }}
        required
      />

      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        fullWidth
        size="large"
        variant="contained"
        color="primary"
        type="submit"
        disabled={loading || (!email && !phone_number) || !first_name || !last_name}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Register & Send OTP'}
      </Button>
    </Box>
  );

  const renderOtpInput = (
    <Box
      component="form"
      onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }}
      sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}
    >
      <TextField
        fullWidth
        name="otp"
        label="One-Time Password (OTP)"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        sx={{ mb: 3 }}
        slotProps={{ inputLabel: { shrink: true } }}
        helperText={registrationMessage || "A 6-digit code has been sent to your provided contact methods."}
        required
      />

      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        fullWidth
        size="large"
        variant="contained"
        color="primary"
        type="submit"
        disabled={loading || otp.length !== 6}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
      </Button>

      <Link variant="subtitle2" sx={{ ml: 0.5, cursor: 'pointer' }} onClick={() => handleRegister()} >
        Resend OTP
      </Link>
    </Box>
  );

  const renderProfileDetailsInput = (
    <Box
      component="form"
      onSubmit={(e) => { e.preventDefault(); handleCollectProfileDetails(); }}
      sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}
    >

      <FormControl fullWidth sx={{ mb: 3 }} required>
        <InputLabel>Country</InputLabel>
        <Select
          name="country"
          value={country}
          label="Country"
          onChange={(e) => {
            setCountry(e.target.value);
            setState('');
          }}
        >
          <MenuItem value="Ghana">Ghana</MenuItem>
          <MenuItem value="Kenya">Kenya</MenuItem>
          <MenuItem value="Nigeria">Nigeria</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }} required disabled={!country}>
        <InputLabel>State / Province</InputLabel>
        <Select
          name="state"
          value={state}
          label="State / Province"
          onChange={(e) => setState(e.target.value)}
        >
          {country && countryStateData[country as keyof typeof countryStateData]?.map((s) => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        fullWidth
        size="large"
        variant="contained"
        color="primary"
        type="submit"
        disabled={loading || !country || !state}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Continue'}
      </Button>
    </Box>
  );


  const renderSetPasswordForm = (
    <Box
      component="form"
      onSubmit={(e) => { e.preventDefault(); handleFinalizeSignup(); }}
      sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}
    >
      <TextField
        fullWidth
        name="password"
        label="New Password"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setPasswordError('');
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
        required
      />

      <TextField
        fullWidth
        name="confirmPassword"
        label="Confirm Password"
        type={showConfirmPassword ? 'text' : 'password'}
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          setPasswordError('');
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
        helperText={passwordError || (password && confirmPassword && password !== confirmPassword ? "Passwords do not match." : "")}
        required
      />

      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        fullWidth
        size="large"
        type="submit"
        color="primary"
        variant="contained"
        disabled={loading || !password || !confirmPassword || password !== confirmPassword || !!passwordError}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Set Password'}
      </Button>
    </Box>
  );

  const renderContent = () => {
    switch (currentStep) {
      case 'register':
        return renderRegisterInput;
      case 'otp':
        return renderOtpInput;
      case 'profileDetails':
        return renderProfileDetailsInput;
      case 'setPassword':
        return renderSetPasswordForm;
      default:
        return renderRegisterInput;
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
          {currentStep === 'register' && 'Sign up'}
          {currentStep === 'otp' && 'Verify Your Account'}
          {currentStep === 'profileDetails' && 'Tell Us More'}
          {currentStep === 'setPassword' && 'Set Your Password'}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          {currentStep === 'register' && (
            <>
              Already have an account?
              <Link variant="subtitle2" sx={{ ml: 0.5, cursor: 'pointer' }} onClick={() => router.push('/sign-in')}>
                Sign in
              </Link>
            </>
          )}
          {currentStep === 'otp' && 'Enter the code sent to your provided contact methods.'}
          {currentStep === 'profileDetails' && 'Just a few more details to get started.'}
          {currentStep === 'setPassword' && 'Please set a strong password for your account.'}
        </Typography>
      </Box>

      {renderContent()}
    </>
  );
}