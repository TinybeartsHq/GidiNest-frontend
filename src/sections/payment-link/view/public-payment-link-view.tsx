import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Copy, Check, Users, Target, Calendar } from 'lucide-react';

import {
  Box,
  Card,
  Chip,
  Alert,
  Stack,
  Button,
  Divider,
  Tooltip,
  Container,
  Typography,
  IconButton,
  CardContent,
  LinearProgress,
  CircularProgress,
} from '@mui/material';

import { LinkType } from '../../../redux/paymentLink/paymentLink.types';
import { clearCurrentLink } from '../../../redux/paymentLink/paymentLink.slice';
import { fetchPublicPaymentLink } from '../../../redux/paymentLink/paymentLink.actions';

import type { RootState, AppDispatch } from '../../../redux/store';

export default function PublicPaymentLinkView() {
  const { token } = useParams<{ token: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { currentLink, loading, error } = useSelector(
    (state: RootState) => state.paymentLink
  );

  const [copiedReference, setCopiedReference] = useState(false);
  const [copiedAccountNumber, setCopiedAccountNumber] = useState(false);
  const [paymentReference, setPaymentReference] = useState('');

  useEffect(() => {
    if (token) {
      dispatch(fetchPublicPaymentLink(token));
    }

    return () => {
      dispatch(clearCurrentLink());
    };
  }, [token, dispatch]);

  // Debug: Log the current link data
  useEffect(() => {
    if (currentLink) {
      console.log('Payment Link Data:', currentLink);
      console.log('is_active value:', currentLink.is_active);
      console.log('is_active type:', typeof currentLink.is_active);
    }
  }, [currentLink]);

  useEffect(() => {
    // Generate unique payment reference with timestamp
    if (token) {
      const timestamp = Date.now();
      setPaymentReference(`PL-${token}-${timestamp}`);
    }
  }, [token]);

  const handleCopyReference = async () => {
    try {
      await navigator.clipboard.writeText(paymentReference);
      setCopiedReference(true);
      toast.success('Payment reference copied!');
      setTimeout(() => setCopiedReference(false), 2000);
    } catch (err) {
      toast.error('Failed to copy reference');
    }
  };

  const handleCopyAccountNumber = async () => {
    try {
      await navigator.clipboard.writeText(
        currentLink?.bank_details.account_number || ''
      );
      setCopiedAccountNumber(true);
      toast.success('Account number copied!');
      setTimeout(() => setCopiedAccountNumber(false), 2000);
    } catch (err) {
      toast.error('Failed to copy account number');
    }
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);

  const calculateProgress = () => {
    if (!currentLink || !currentLink.target_amount) return 0;
    return Math.min(
      (currentLink.amount_raised / currentLink.target_amount) * 100,
      100
    );
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

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

  // Check if link is explicitly inactive (default to active if undefined)
  // Only show inactive message if is_active is explicitly false
  const isExplicitlyInactive = currentLink.is_active === false || (currentLink.is_active as any) === 'false';

  if (isExplicitlyInactive) {
    return (
      <Container maxWidth="sm">
        <Box mt={8}>
          <Alert severity="warning">
            This payment link is no longer active.
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
      py={4}
    >
      <Container maxWidth="md">
        {/* Header Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack spacing={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <Chip
                  label={currentLink.link_type.toUpperCase()}
                  color={currentLink.link_type === LinkType.GOAL ? 'primary' : 'secondary'}
                  size="small"
                />
                {currentLink.link_type === LinkType.EVENT && currentLink.event_date && (
                  <Chip
                    icon={<Calendar size={16} />}
                    label={formatDate(currentLink.event_date)}
                    size="small"
                  />
                )}
              </Box>

              <Typography variant="h4" fontWeight="bold">
                {currentLink.title}
              </Typography>

              {currentLink.description && (
                <Typography variant="body1" color="text.secondary">
                  {currentLink.description}
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Progress Section */}
        {currentLink.target_amount && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Stack spacing={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5" fontWeight="bold">
                    {formatCurrency(currentLink.amount_raised)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    of {formatCurrency(currentLink.target_amount)}
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={calculateProgress()}
                  sx={{ height: 10, borderRadius: 5 }}
                />

                <Box display="flex" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Target size={20} />
                    <Typography variant="body2">
                      {calculateProgress().toFixed(1)}% reached
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Users size={20} />
                    <Typography variant="body2">
                      {currentLink.contributors_count} contributors
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* No Target Amount - Simple Stats */}
        {!currentLink.target_amount && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={4} justifyContent="center">
                <Box textAlign="center">
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {formatCurrency(currentLink.amount_raised)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Raised
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box textAlign="center">
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {currentLink.contributors_count}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Contributors
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* Payment Instructions */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              How to Contribute
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              Transfer any amount to the account below and use the unique payment reference
            </Alert>

            <Stack spacing={2.5}>
              {/* Bank Name */}
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Bank Name
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {currentLink.bank_details.bank_name}
                </Typography>
              </Box>

              {/* Account Number */}
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Account Number
                </Typography>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="h6" fontWeight="bold">
                    {currentLink.bank_details.account_number}
                  </Typography>
                  <Tooltip title={copiedAccountNumber ? 'Copied!' : 'Copy'}>
                    <IconButton
                      size="small"
                      onClick={handleCopyAccountNumber}
                      sx={{
                        bgcolor: copiedAccountNumber ? 'success.main' : 'primary.main',
                        color: 'white',
                        '&:hover': {
                          bgcolor: copiedAccountNumber ? 'success.dark' : 'primary.dark',
                        },
                      }}
                    >
                      {copiedAccountNumber ? <Check size={16} /> : <Copy size={16} />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* Account Name */}
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  Account Name
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {currentLink.bank_details.account_name}
                </Typography>
              </Box>

              <Divider />

              {/* Payment Reference */}
              <Box>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight="bold">
                    IMPORTANT: You MUST use this payment reference
                  </Typography>
                </Alert>

                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                  Payment Reference
                </Typography>

                <Box
                  sx={{
                    p: 2,
                    bgcolor: '#f5f5f5',
                    borderRadius: 1,
                    border: '2px dashed',
                    borderColor: 'primary.main',
                  }}
                >
                  <Typography
                    variant="h6"
                    fontFamily="monospace"
                    fontWeight="bold"
                    textAlign="center"
                    sx={{ wordBreak: 'break-all' }}
                  >
                    {paymentReference}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  startIcon={copiedReference ? <Check /> : <Copy />}
                  onClick={handleCopyReference}
                  sx={{ mt: 2 }}
                  color={copiedReference ? 'success' : 'primary'}
                >
                  {copiedReference ? 'Copied!' : 'Copy Payment Reference'}
                </Button>
              </Box>
            </Stack>

            {currentLink.custom_message && (
              <>
                <Divider sx={{ my: 3 }} />
                <Alert severity="success">
                  <Typography variant="body2">
                    {currentLink.custom_message}
                  </Typography>
                </Alert>
              </>
            )}
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
