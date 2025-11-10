import { toast } from 'react-toastify';
import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

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

  const { loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  // State for form inputs
  const [email, setEmail] = useState('');
  const [phone_number, setPhoneNumber] = useState(''); // New state for phone number
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [otp, setOtp] = useState('');
  const [country] = useState('Nigeria');
  const [state, setState] = useState('');

  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [currentStep, setCurrentStep] = useState<'register' | 'otp' | 'phoneNumber' | 'profileDetails' | 'setPassword'>('register');
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


  // --- Step 1: Handle Registration (Send OTP to Email) ---
  const handleRegister = useCallback(async () => {
    dispatch(clearAuthError());

    if (!email || !first_name || !last_name) {
      toast.error('Email, first name, and last name are required');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const registrationData = {
      first_name,
      last_name,
      email,
      phone: '' // Phone will be collected after email verification
    };

    try {
    const result = await dispatch(
      registerUser(registrationData)
    );

    if (result.success) {
      if (result.data?.data?.session_id) {
        setSessionId(result.data.data.session_id);
      } else {
        console.warn('Session ID not found in registration response.');
          toast.warn('Registration successful but session ID missing. Please try again.');
          return;
        }
        toast.success('OTP sent successfully! Please check your email inbox.');
        setCurrentStep('otp');
        setOtp(''); // Clear any previous OTP input
      } else {
        const errorMsg = result.error || 'Failed to send OTP. Please check your information and try again.';
        toast.error(errorMsg);
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'An unexpected error occurred. Please try again.';
      toast.error(errorMsg);
    }
  }, [email, first_name, last_name, dispatch]);


  // --- Step 2: Handle OTP Verification ---
  const handleVerifyOtp = useCallback(async () => {
    dispatch(clearAuthError());

    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP code');
      return;
    }
    
    if (!sessionId) {
      toast.error('Session expired. Please restart registration.');
      setCurrentStep('register');
      return;
    }

    try {
    const result = await dispatch(
      verifyOtp({ session_id: sessionId, otp })
    );

    if (result.success) {
        toast.success('Email verified successfully!');
        setCurrentStep('phoneNumber');
        setOtp(''); // Clear OTP after successful verification
    } else {
        const errorMsg = result.error || 'OTP verification failed. Please check the code and try again.';
        toast.error(errorMsg);
        setOtp(''); // Clear OTP on failure to allow retry
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'An unexpected error occurred. Please try again.';
      toast.error(errorMsg);
      setOtp(''); // Clear OTP on error
    }
  }, [otp, sessionId, dispatch]);


  // --- Step 3: Handle Phone Number Collection ---
  const handlePhoneNumberSubmit = useCallback(() => {
    dispatch(clearAuthError());

    if (!phone_number) {
      toast.error('Phone number is required');
      return;
    }

    if (phone_number.length !== 11) {
      toast.error('Phone number must be 11 digits');
      return;
    }

    setCurrentStep('profileDetails');
  }, [phone_number, dispatch]);

  // --- Step 4: Handle Profile Details Collection ---
  const handleCollectProfileDetails = useCallback(() => {
    dispatch(clearAuthError());
 
    if (!address || !dob) {
      toast.error('Address and date of birth are required.');
      return;
    }

    if (!country || !state) {
      toast.error('Country and state are required.');
      return;
    }

    setCurrentStep('setPassword');
  }, [address, dob, country, state, dispatch]);


  // --- Step 5: Handle Finalizing Signup (Setting Password) ---
  const handleFinalizeSignup = useCallback(async () => {
    dispatch(clearAuthError());

    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match.");
      toast.error("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      toast.error('Password must be at least 8 characters long.');
      return;
    }
    if (!/[0-9]/.test(password) || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setPasswordError('Password must contain at least one number and one special character.');
      toast.error('Password must contain at least one number and one special character.');
      return;
    }
    setPasswordError('');

    if (!sessionId) {
      toast.error('Session expired. Please restart registration.');
      setCurrentStep('register');
      return;
    }

    if (!phone_number) {
      toast.error('Phone number is required. Please go back and provide it.');
      return;
    }

    try {
    const result = await dispatch(
      finalizeSignup({
        session_id: sessionId,
        password,
          phone: phone_number,
        country,
        state,
        address,
        dob
      })
    );

    if (result.success) {
        toast.success('Account created successfully! Redirecting...');
        setTimeout(() => {
      router.push('/dashboard');
        }, 1000);
    } else {
        const errorMsg = result.error || 'Failed to complete registration. Please try again.';
        toast.error(errorMsg);
      }
    } catch (err: any) {
      const errorMsg = err?.message || 'An unexpected error occurred. Please try again.';
      toast.error(errorMsg);
    }
  }, [password, confirmPassword, sessionId, phone_number, country, state, address, dob, dispatch, router]);

 
  const renderRegisterInput = (
    <Box
      component="form"
      onSubmit={(e) => { e.preventDefault(); handleRegister(); }}
      sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}
    >
      <Alert severity="info" sx={{ width: '100%', mb: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
          Important: Accurate Information Required
        </Typography>
        <Typography variant="body2">
          Please provide accurate information as it will be used for KYC (Know Your Customer) verification.
          Ensure your details match your official documents.
        </Typography>
      </Alert>

      <TextField
        fullWidth
        name="email"
        label="Email address"
        value={email}
        placeholder='test@test.com'
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Provide a valid email address. An OTP code will be sent to this email for verification.">
                  <IconButton edge="end" size="small">
                    <InfoOutlinedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          },
        }}
        required
      />

      <TextField
        fullWidth
        name="first_name"
        label="First Name"
        value={first_name}
        onChange={(e) => setFirstName(e.target.value)}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Enter your first name exactly as it appears on your official ID or documents.">
                  <IconButton edge="end" size="small">
                    <InfoOutlinedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          },
        }}
        required
      />
      <TextField
        fullWidth
        name="last_name"
        label="Last Name"
        value={last_name}
        onChange={(e) => setLastName(e.target.value)}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Enter your last name exactly as it appears on your official ID or documents.">
                  <IconButton edge="end" size="small">
                    <InfoOutlinedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          },
        }}
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
        disabled={loading || !email || !first_name || !last_name}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Register & Send OTP'}
      </Button>

      <Box
        sx={{
          mt: 3,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: 1.5,
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          By registering, you agree to our
        </Typography>
        <Link
          component={RouterLink}
          href="/privacy-policy"
          variant="caption"
          sx={{ cursor: 'pointer' }}
        >
          Privacy Policy
        </Link>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          and
        </Typography>
        <Link
          component={RouterLink}
          href="/terms-and-conditions"
          variant="caption"
          sx={{ cursor: 'pointer' }}
        >
          Terms & Conditions
        </Link>
      </Box>
    </Box>
  );

  const renderOtpInput = (
    <Box
      component="form"
      onSubmit={(e) => { e.preventDefault(); handleVerifyOtp(); }}
      sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}
    >
      <Alert severity="info" sx={{ width: '100%', mb: 3 }}>
        <Typography variant="body2">
          {email 
            ? `A 6-digit code has been sent to ${email}. Please check your email inbox and spam folder.`
            : 'A 6-digit code has been sent to your email address.'}
        </Typography>
      </Alert>

      <TextField
        fullWidth
        name="otp"
        label="One-Time Password (OTP)"
        value={otp}
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only numbers, max 6 digits
          setOtp(value);
          dispatch(clearAuthError()); // Clear error when user starts typing
        }}
        sx={{ mb: 3 }}
        slotProps={{ 
          inputLabel: { shrink: true },
          input: {
            inputMode: 'numeric',
            inputProps: {
              pattern: '[0-9]*',
            }
          }
        }}
        error={!!error && otp.length > 0}
        helperText={
          error && otp.length > 0 
            ? error 
            : otp.length === 6 
            ? 'Ready to verify' 
            : `Enter ${6 - otp.length} more digit${6 - otp.length !== 1 ? 's' : ''}`
        }
        required
        autoFocus
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

      <Box sx={{ mt: 2, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Link 
          variant="subtitle2" 
          sx={{ cursor: loading ? 'not-allowed' : 'pointer', textDecoration: 'none', opacity: loading ? 0.6 : 1 }} 
          onClick={async () => {
            if (loading) return;
            dispatch(clearAuthError());
            setOtp('');
            await handleRegister();
          }}
        >
          {loading ? 'Sending...' : 'Resend OTP'}
        </Link>
        <Link 
          variant="caption" 
          sx={{ cursor: 'pointer', textDecoration: 'none', color: 'text.secondary' }} 
          onClick={() => {
            dispatch(clearAuthError());
            setCurrentStep('register');
            setOtp('');
            setSessionId(null);
          }}
        >
          Change email address
        </Link>
      </Box>
    </Box>
  );

  const renderPhoneNumberInput = (
    <Box
      component="form"
      onSubmit={(e) => { e.preventDefault(); handlePhoneNumberSubmit(); }}
      sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}
    >
      <Alert severity="info" sx={{ width: '100%', mb: 3 }}>
        <Typography variant="body2">
          Your email has been verified! Now please provide your phone number for account security and notifications.
        </Typography>
      </Alert>

      <TextField
        fullWidth
        name="phone_number"
        label="Phone Number"
        value={phone_number}
        placeholder='08082737272'
        onChange={(e) => {
          const value = e.target.value.replace(/\D/g, '').slice(0, 11); // Only numbers, max 11 digits
          setPhoneNumber(value);
          dispatch(clearAuthError());
        }}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            inputMode: 'numeric',
            inputProps: {
              pattern: '[0-9]*',
            },
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Enter your active phone number. This will be used for account security and notifications.">
                  <IconButton edge="end" size="small">
                    <InfoOutlinedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          },
        }}
        error={!!error && phone_number.length > 0}
        helperText={
          error && phone_number.length > 0
            ? error
            : phone_number.length === 11
            ? 'Ready to continue'
            : phone_number.length > 0
            ? `Enter ${11 - phone_number.length} more digit${11 - phone_number.length !== 1 ? 's' : ''}`
            : 'Enter your 11-digit phone number'
        }
        required
        autoFocus
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
        disabled={loading || phone_number.length !== 11}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Continue'}
      </Button>

      <Box sx={{ mt: 2, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Link 
          variant="caption" 
          sx={{ cursor: 'pointer', textDecoration: 'none', color: 'text.secondary' }} 
          onClick={() => {
            dispatch(clearAuthError());
            setCurrentStep('otp');
          }}
        >
          Back to OTP verification
      </Link>
      </Box>
    </Box>
  );

  const renderProfileDetailsInput = (
    <Box
      component="form"
      onSubmit={(e) => { e.preventDefault(); handleCollectProfileDetails(); }}
      sx={{ display: 'flex', alignItems: 'flex-end', flexDirection: 'column' }}
    >
      <Alert severity="info" sx={{ width: '100%', mb: 3 }}>
        <Typography variant="body2">
          Provide accurate personal details. This information must match your government-issued ID for successful KYC verification.
        </Typography>
      </Alert>

      <TextField
        fullWidth
        label="Date of Birth"
        name="dob"
        type="date"
        value={dob}
        onChange={(e) => setDob(e.target.value)}
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Enter your date of birth as it appears on your official ID or birth certificate.">
                  <IconButton edge="end" size="small">
                    <InfoOutlinedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          },
        }}
        required
      />


      <FormControl fullWidth sx={{ mb: 3 }} required disabled={!country}>
        <InputLabel>State / Province</InputLabel>
        <Select
          name="state"
          value={state}
          label="State / Province"
          onChange={(e) => setState(e.target.value)}
          endAdornment={
            <InputAdornment position="end" sx={{ mr: 3 }}>
              <Tooltip title="Select your state of residence as shown on your official documents.">
                <IconButton edge="end" size="small">
                  <InfoOutlinedIcon sx={{ fontSize: 20 }} />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          }
        >
          {country && countryStateData[country as keyof typeof countryStateData]?.map((s) => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </Select>
      </FormControl>


      <TextField
        fullWidth
        name="address"
        label="Home Address"
        value={address}
        type="text"
        onChange={(e) => {
          setAddress(e.target.value)
         }
        }
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title="Enter your complete residential address. This should match your utility bills or proof of address documents.">
                  <IconButton edge="end" size="small">
                    <InfoOutlinedIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          },
        }}
        required
      />

{/* 
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
        
          <MenuItem value="Nigeria">Nigeria</MenuItem>
        </Select>
      </FormControl> */}

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

      <Box
        sx={{
          mt: 3,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          gap: 1.5,
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          By completing registration, you agree to our
        </Typography>
        <Link
          component={RouterLink}
          href="/privacy-policy"
          variant="caption"
          sx={{ cursor: 'pointer' }}
        >
          Privacy Policy
        </Link>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          and
        </Typography>
        <Link
          component={RouterLink}
          href="/terms-and-conditions"
          variant="caption"
          sx={{ cursor: 'pointer' }}
        >
          Terms & Conditions
        </Link>
      </Box>
    </Box>
  );

  const renderContent = () => {
    switch (currentStep) {
      case 'register':
        return renderRegisterInput;
      case 'otp':
        return renderOtpInput;
      case 'phoneNumber':
        return renderPhoneNumberInput;
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
          {currentStep === 'otp' && 'Verify Your Email'}
          {currentStep === 'phoneNumber' && 'Add Phone Number'}
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
              <Link variant="subtitle2" sx={{ ml: 0.5, cursor: 'pointer' }} onClick={() => router.push('/')}>
                Sign in
              </Link>
            </>
          )}
          {currentStep === 'otp' && email && `Enter the OTP sent to ${email}`}
          {currentStep === 'phoneNumber' && 'Please provide your phone number for account security.'}
          {currentStep === 'profileDetails' && 'Just a few more details to get started.'}
          {currentStep === 'setPassword' && 'Please set a strong password for your account.'}
        </Typography>
      </Box>

      {renderContent()}
    </>
  );
}
