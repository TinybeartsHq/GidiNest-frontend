import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector to access auth state

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert'; // For error messages
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress'; // For loading indicator

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

import { loginUser } from '../../redux/auth/auth.actions'; // Adjust path

import type { RootState, AppDispatch } from '../../redux/types'; // Adjust path to your types.ts file


export function SignInView() {
  const router = useRouter();
  const dispatch: AppDispatch = useDispatch();

  // Access loading and error state from Redux auth reducer
  const { loading, error } = useSelector((state: RootState) => state.auth);

  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = useCallback(async () => {
    // Basic validation
    if (!email || !password) {
      // You might want to dispatch a local error action or set a local state for validation errors
      console.error('Email and password are required.');
      return;
    }

    const credentials = {
      login_type:"password",
      email,    // Use state variable
      password, // Use state variable
    };

    const loginSuccessful = await dispatch(loginUser(credentials));

    if (loginSuccessful) {
      console.log('User signed in successfully!');
      router.push('/'); // Redirect to home/dashboard on successful sign-in
    } else {
      console.error('Sign-in failed. Error handled by Redux state.');
      // Error message will be displayed via the Alert component
    }
  }, [dispatch, router, email, password]); // Add email and password to dependencies

  const renderForm = (
    <Box
      component="form" // Use form element for better semantics and accessibility
      onSubmit={(e) => {
        e.preventDefault(); // Prevent default form submission
        handleSignIn();
      }}
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
        value={email} // Controlled component: bind value to state
        onChange={(e) => setEmail(e.target.value)} // Update state on change
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
        required // Make field required
      />

      <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
        Forgot password?
      </Link>

      <TextField
        fullWidth
        name="password"
        label="Password"
        value={password} // Controlled component: bind value to state
        onChange={(e) => setPassword(e.target.value)} // Update state on change
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
        required // Make field required
      />

      {/* Display error message from Redux state */}
      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        fullWidth
        size="large"
        type="submit" // Set type to submit for form submission
        color="primary"
        variant="contained"
        disabled={loading} // Disable button while loading
      // onClick={handleSignIn} // No longer needed if type="submit" on form
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