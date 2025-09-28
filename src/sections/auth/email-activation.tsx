import { useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Box, Alert, Button, Typography, CircularProgress } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

import { activateUserByEmail } from '../../redux/auth/auth.actions'; // Make sure this exists

import type { AppDispatch } from '../../redux/types';


export function EmailActivationView() {
  const { id } = useParams(); // Grabs the UUID from the URL
  const dispatch: AppDispatch = useDispatch();

  const router = useRouter();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const activate = async () => {
      try {
        const result = await dispatch(activateUserByEmail({session_id:id}));
        if (result.success) {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMessage(result.error || 'Activation failed.');
        }
      } catch (err) {
        setStatus('error');
        setErrorMessage('Something went wrong. Please try again later.');
      }
    };

    if (id) activate();
  }, [dispatch, id]);

  return (
    <Box sx={{ maxWidth: 500, margin: 'auto', mt: 10, textAlign: 'center' }}>
      {status === 'loading' && (
        <>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>Activating your account...</Typography>
        </>
      )}

      {status === 'success' && (
        <>
          <Iconify icon="solar:check-circle-bold" width={64} color="green" />
          <Typography variant="h5" sx={{ mt: 2 }}>Activation Successful 🎉</Typography>
          <Typography variant="body2" sx={{ mt: 1, mb: 3 }}>
            Your account has been successfully activated. You can now log in.
          </Typography>
          <Button variant="contained" onClick={() => router.push('/')}>
            Proceed to Login
          </Button>
        </>
      )}

      {status === 'error' && (
        <>
          <Iconify icon="mingcute:close-line" width={64} color="red" />
          <Typography variant="h5" sx={{ mt: 2, color: 'error.main' }}>Activation Failed</Typography>
          <Alert severity="error" sx={{ mt: 2, mb: 3 }}>{errorMessage}</Alert>
          <Button variant="outlined" onClick={() => router.push('/')}>
            Back to Home
          </Button>
        </>
      )}
    </Box>
  );
}
