import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

import { loginUser } from '../../redux/auth/auth.actions';

import type { RootState, AppDispatch } from '../../redux/types';


export function SignInView() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  const { loading, error } = useSelector((state: RootState) => state.auth);

  // State for login type and identifier
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = useCallback(async () => {
    // Basic validation
    if (!loginIdentifier || !password) {
      console.error('Email/Phone number and password are required.');
      return;
    }

    const credentials = {
      login_type: 'password',
      password,
      login_with: loginType,
      email: loginType === 'email' ? loginIdentifier: "",
      phone: loginType === 'phone' ? loginIdentifier : "",
      
    
    };

    const loginSuccessful = await dispatch(loginUser(credentials));

    if (loginSuccessful) {
      console.log('User signed in successfully!');
      router.push('/');
    } else {
      console.error('Sign-in failed. Error handled by Redux state.');
    }
  }, [dispatch, router, loginIdentifier, password, loginType]);

  const handleLoginTypeToggle = (event: React.MouseEvent<HTMLElement>, newLoginType: 'email' | 'phone') => {
    if (newLoginType !== null) {
      setLoginType(newLoginType);
      setLoginIdentifier(''); // Clear identifier when toggling type
    }
  };

  const renderForm = (
    <Box
      component="form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSignIn();
      }}
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
      }}
    >
      {/* Login Type Toggle */}
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 3 }}>
        <ToggleButtonGroup
          value={loginType}
          exclusive
          onChange={handleLoginTypeToggle}
          aria-label="login type"
          fullWidth
        >
          <ToggleButton value="email" aria-label="sign in with email" sx={{ flexGrow: 1 }}>
            Email
          </ToggleButton>
          <ToggleButton value="phone" aria-label="sign in with phone number" sx={{ flexGrow: 1 }}>
            Phone Number
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Dynamic Login Identifier Field */}
      <TextField
        fullWidth
        name={loginType === 'email' ? 'email' : 'phone_number'}
        label={loginType === 'email' ? 'Email address' : 'Phone Number'}
        value={loginIdentifier}
        onChange={(e) => setLoginIdentifier(e.target.value)}
        type={loginType === 'email' ? 'email' : 'tel'} // 'tel' is better for mobile keyboards
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
        required
      />

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Forgot password?
      </Link>

      <TextField
        fullWidth
        name="password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type={showPassword ? 'text' : 'password'}
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
        sx={{ mb: 3 }}
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
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign in'}
      </Button>
    </Box>
  );

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
        <Typography variant="h5">Sign in</Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
          }}
        >
          Don’t have an account?
          <Link
            variant="subtitle2"
            sx={{ ml: 0.5, cursor: 'pointer' }}
            onClick={() => router.push('/register')}
          >
            Get started
          </Link>
        </Typography>
      </Box>
      {renderForm}
    </>
  );
}