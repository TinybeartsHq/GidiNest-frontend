import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Copy, Check, Users, Target, Calendar, Send } from 'lucide-react';

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
  TextField,
  Typography,
  IconButton,
  CardContent,
  InputAdornment,
  LinearProgress,
  CircularProgress,
} from '@mui/material';

import { LinkType } from '../../../redux/paymentLink/paymentLink.types';
import { clearCurrentLink } from '../../../redux/paymentLink/paymentLink.slice';
import { fetchPublicPaymentLink, confirmPaymentContribution } from '../../../redux/paymentLink/paymentLink.actions';

import type { RootState, AppDispatch } from '../../../redux/store';

export default function PublicPaymentLinkView() {
  const { token } = useParams<{ token: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { currentLink, loading, error, confirmingPayment } = useSelector(
    (state: RootState) => state.paymentLink
  );

  const [copiedAccountNumber, setCopiedAccountNumber] = useState(false);
  const [showConfirmForm, setShowConfirmForm] = useState(false);
  const [contributorName, setContributorName] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (token) {
      dispatch(fetchPublicPaymentLink(token));
    }

    return () => {
      dispatch(clearCurrentLink());
    };
  }, [token, dispatch]);

  const handleConfirmPayment = async () => {
    if (!contributorName.trim()) {
      toast.error('Please enter your name');
      return;
    }
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    if (!token) return;

    try {
      await dispatch(
        confirmPaymentContribution({
          token,
          data: { contributor_name: contributorName.trim(), amount: parsedAmount },
        })
      ).unwrap();
      toast.success('Contribution confirmed!');
      navigate(`/pay/${token}/confirmed`);
    } catch (err: any) {
      toast.error(err || 'Failed to confirm payment');
    }
  };

  const handleCopyAccountNumber = async () => {
    try {
      const accountNumber = currentLink?.bank_details?.account_number;
      if (!accountNumber) {
        toast.error('Account number not available');
        return;
      }
      await navigator.clipboard.writeText(accountNumber);
      setCopiedAccountNumber(true);
      toast.success('Account number copied!');
      setTimeout(() => setCopiedAccountNumber(false), 2000);
    } catch (err) {
      toast.error('Failed to copy account number');
    }
  };

  const formatCurrency = (amount: number | undefined | null) => {
    const safeAmount = amount || 0;
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(safeAmount);
  };

  const calculateProgress = () => {
    if (!currentLink || !currentLink.target_amount) return 0;
    const amountRaised = currentLink.amount_raised || 0;
    return Math.min(
      (amountRaised / currentLink.target_amount) * 100,
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
                      {currentLink.contributors_count || 0} contributors
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
                    {currentLink.contributors_count || 0}
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

            {!currentLink.bank_details ? (
              <Alert severity="warning" sx={{ mb: 3 }}>
                Bank account details are not yet configured for this payment link.
                Please contact the link owner.
              </Alert>
            ) : (
              <>
                <Alert severity="info" sx={{ mb: 3 }}>
                  Transfer to the account below, then come back and tap &quot;I&apos;ve sent the money&quot;
                </Alert>

                <Stack spacing={2.5}>
                  {/* Step 1: Bank Details */}
                  <Typography variant="subtitle2" color="text.secondary">
                    Step 1: Transfer to this account
                  </Typography>

                  {/* Bank Name */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Bank Name
                    </Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {currentLink.bank_details.bank_name || 'Not provided'}
                    </Typography>
                  </Box>

                  {/* Account Number */}
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Account Number
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6" fontWeight="bold">
                        {currentLink.bank_details.account_number || 'Not provided'}
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
                      {currentLink.bank_details.account_name || 'Not provided'}
                    </Typography>
                  </Box>

                  <Divider />

                  {/* Step 2: Confirm Payment */}
                  <Typography variant="subtitle2" color="text.secondary">
                    Step 2: Confirm your transfer
                  </Typography>

                  {!showConfirmForm ? (
                    <Button
                      variant="contained"
                      fullWidth
                      size="large"
                      startIcon={<Send size={20} />}
                      onClick={() => setShowConfirmForm(true)}
                      sx={{ mt: 1 }}
                    >
                      I&apos;ve sent the money
                    </Button>
                  ) : (
                    <Stack spacing={2}>
                      <TextField
                        label="Your Name"
                        value={contributorName}
                        onChange={(e) => setContributorName(e.target.value)}
                        fullWidth
                        placeholder="Enter your name"
                      />
                      <TextField
                        label="Amount Sent"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        fullWidth
                        type="number"
                        placeholder="0"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">&#8358;</InputAdornment>
                          ),
                        }}
                      />
                      <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handleConfirmPayment}
                        disabled={confirmingPayment}
                        startIcon={
                          confirmingPayment ? (
                            <CircularProgress size={20} color="inherit" />
                          ) : (
                            <Check size={20} />
                          )
                        }
                      >
                        {confirmingPayment ? 'Confirming...' : 'Confirm Payment'}
                      </Button>
                      <Button
                        variant="text"
                        fullWidth
                        onClick={() => setShowConfirmForm(false)}
                        disabled={confirmingPayment}
                      >
                        Cancel
                      </Button>
                    </Stack>
                  )}
                </Stack>
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
