import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle, Home, Share2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Box,
  Card,
  Stack,
  Alert,
  Button,
  Container,
  Typography,
  CardContent,
  CircularProgress,
} from '@mui/material';

import { clearCurrentLink } from '../../../redux/paymentLink/paymentLink.slice';
import { fetchPublicPaymentLink } from '../../../redux/paymentLink/paymentLink.actions';

import type { RootState, AppDispatch } from '../../../redux/store';

export default function PaymentConfirmationView() {
  const { token } = useParams<{ token: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { currentLink, loading, error } = useSelector(
    (state: RootState) => state.paymentLink
  );

  useEffect(() => {
    if (token) {
      dispatch(fetchPublicPaymentLink(token));
    }

    return () => {
      dispatch(clearCurrentLink());
    };
  }, [token, dispatch]);

  const handleShare = () => {
    const url = `${window.location.origin}/pay/${token}`;
    const text = `I just contributed to: ${currentLink?.title}\n\nJoin me in supporting this cause: ${url}`;

    if (navigator.share) {
      navigator
        .share({
          title: currentLink?.title || 'Payment Link',
          text,
          url,
        })
        .catch(() => {
          // Fallback to copy
          navigator.clipboard.writeText(url);
        });
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="#f5f5f5"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error || !currentLink) {
    return (
      <Container maxWidth="sm">
        <Box mt={8}>
          <Alert severity="error">
            {error || 'Payment link not found'}
          </Alert>
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => navigate('/')}
          >
            Go to Home
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box
      minHeight="100vh"
      bgcolor="#f5f5f5"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={4}
    >
      <Container maxWidth="sm">
        <Card>
          <CardContent>
            <Stack spacing={3} alignItems="center" textAlign="center" py={4}>
              {/* Success Icon */}
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: 'success.light',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CheckCircle size={48} color="#fff" />
              </Box>

              {/* Success Message */}
              <Typography variant="h4" fontWeight="bold" color="success.main">
                Payment Confirmed!
              </Typography>

              <Typography variant="body1" color="text.secondary">
                Your contribution to <strong>{currentLink.title}</strong> has been successfully
                received and confirmed.
              </Typography>

              {/* Custom Thank You Message */}
              {currentLink.custom_message && (
                <Alert severity="success" sx={{ width: '100%', textAlign: 'left' }}>
                  <Typography variant="body2">
                    {currentLink.custom_message}
                  </Typography>
                </Alert>
              )}

              {/* Action Buttons */}
              <Stack spacing={2} width="100%" mt={2}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<Share2 />}
                  onClick={handleShare}
                >
                  Share This Cause
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Home />}
                  onClick={() => navigate('/')}
                >
                  Go to Home
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <Box textAlign="center" py={2}>
          <Typography variant="caption" color="text.secondary">
            Powered by GidiNest
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
