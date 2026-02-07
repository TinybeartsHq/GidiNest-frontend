import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import {
  Box,
  Card,
  Stack,
  Alert,
  Button,
  Switch,
  Container,
  TextField,
  Typography,
  CardContent,
  InputAdornment,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';

import { LinkType } from '../../../redux/paymentLink/paymentLink.types';
import { clearUpdateSuccess } from '../../../redux/paymentLink/paymentLink.slice';
import {
  updatePaymentLink,
  fetchMyPaymentLinks,
} from '../../../redux/paymentLink/paymentLink.actions';

import type { RootState, AppDispatch } from '../../../redux/store';

export default function EditLinkView() {
  const { token } = useParams<{ token: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { paymentLinks, loading, error, updateLinkSuccess } = useSelector(
    (state: RootState) => state.paymentLink
  );

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    isActive: true,
    allowAnonymous: true,
    showContributors: true,
    customMessage: '',
  });

  const [currentLink, setCurrentLink] = useState<any>(null);

  useEffect(() => {
    if (paymentLinks.length === 0) {
      dispatch(fetchMyPaymentLinks());
    }
  }, [dispatch, paymentLinks.length]);

  useEffect(() => {
    const link = paymentLinks.find((l: any) => l.token === token);
    if (link) {
      setCurrentLink(link);
      setFormData({
        title: link.title,
        description: link.description || '',
        targetAmount: link.target_amount?.toString() || '',
        isActive: link.is_active,
        allowAnonymous: link.allow_anonymous,
        showContributors: link.show_contributors,
        customMessage: link.custom_message || '',
      });
    }
  }, [paymentLinks, token]);

  useEffect(() => {
    if (updateLinkSuccess) {
      toast.success('Gift registry updated successfully!');
      setTimeout(() => {
        dispatch(clearUpdateSuccess());
        navigate('/payment-links');
      }, 1500);
    }
  }, [updateLinkSuccess, dispatch, navigate]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error('Invalid gift registry');
      return;
    }

    // Validation
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    try {
      const updateData: any = {
        title: formData.title,
        description: formData.description || undefined,
        is_active: formData.isActive,
        allow_anonymous: formData.allowAnonymous,
        show_contributors: formData.showContributors,
        custom_message: formData.customMessage || undefined,
      };

      // Only include target_amount if it's changed and valid
      if (formData.targetAmount && parseFloat(formData.targetAmount) > 0) {
        updateData.target_amount = parseFloat(formData.targetAmount);
      }

      await dispatch(
        updatePaymentLink({
          token,
          data: updateData,
        })
      ).unwrap();
    } catch (err: any) {
      toast.error(err || 'Failed to update gift registry');
    }
  };

  if (loading && !currentLink) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!currentLink && paymentLinks.length > 0) {
    return (
      <Container maxWidth="md">
        <Box py={4}>
          <Button
            startIcon={<ArrowLeft />}
            onClick={() => navigate('/payment-links')}
            sx={{ mb: 2 }}
          >
            Back to My Links
          </Button>
          <Alert severity="error">Gift registry not found</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box py={4}>
        {/* Header */}
        <Box mb={4}>
          <Button
            startIcon={<ArrowLeft />}
            onClick={() => navigate('/payment-links')}
            sx={{ mb: 2 }}
          >
            Back to My Links
          </Button>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Edit Gift Registry
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update your gift registry details
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Basic Information */}
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Basic Information
                </Typography>

                <Stack spacing={2.5} mt={2}>
                  <TextField
                    label="Title"
                    placeholder="e.g., Baby Shower Contributions"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    required
                    fullWidth
                    helperText="Give your gift registry a clear, descriptive title"
                  />

                  <TextField
                    label="Description (Optional)"
                    placeholder="Tell people what this is for..."
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange('description', e.target.value)
                    }
                    multiline
                    rows={3}
                    fullWidth
                    helperText="Add context to help contributors understand the purpose"
                  />

                  {currentLink?.link_type === LinkType.GOAL && (
                    <TextField
                      label="Target Amount"
                      type="number"
                      placeholder="0"
                      value={formData.targetAmount}
                      onChange={(e) =>
                        handleInputChange('targetAmount', e.target.value)
                      }
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₦</InputAdornment>
                        ),
                      }}
                      helperText="The total amount you're aiming to raise"
                    />
                  )}

                  {currentLink?.link_type === LinkType.EVENT && (
                    <TextField
                      label="Target Amount (Optional)"
                      type="number"
                      placeholder="0"
                      value={formData.targetAmount}
                      onChange={(e) =>
                        handleInputChange('targetAmount', e.target.value)
                      }
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₦</InputAdornment>
                        ),
                      }}
                      helperText="Optional: Set a target if you have a specific goal"
                    />
                  )}
                </Stack>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Settings
                </Typography>

                <Stack spacing={2.5} mt={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isActive}
                        onChange={(e) =>
                          handleInputChange('isActive', e.target.checked)
                        }
                      />
                    }
                    label="Active (accepting contributions)"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.allowAnonymous}
                        onChange={(e) =>
                          handleInputChange('allowAnonymous', e.target.checked)
                        }
                      />
                    }
                    label="Allow anonymous contributions"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.showContributors}
                        onChange={(e) =>
                          handleInputChange('showContributors', e.target.checked)
                        }
                      />
                    }
                    label="Show contributors list on public page"
                  />

                  <TextField
                    label="Custom Thank You Message (Optional)"
                    placeholder="e.g., Thank you for your generous contribution!"
                    value={formData.customMessage}
                    onChange={(e) =>
                      handleInputChange('customMessage', e.target.value)
                    }
                    multiline
                    rows={2}
                    fullWidth
                    helperText="A message to display to contributors"
                  />
                </Stack>
              </CardContent>
            </Card>

            {/* Error Display */}
            {error && (
              <Alert severity="error" onClose={() => {}}>
                {error}
              </Alert>
            )}

            {/* Success Message */}
            {updateLinkSuccess && (
              <Alert severity="success">
                Gift registry updated successfully! Redirecting...
              </Alert>
            )}

            {/* Submit Button */}
            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/payment-links')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Container>
  );
}
