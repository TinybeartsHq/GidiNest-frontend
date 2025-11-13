import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Target, Calendar, ArrowLeft } from 'lucide-react';

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
  ToggleButton,
  InputAdornment,
  FormControlLabel,
  CircularProgress,
  ToggleButtonGroup,
} from '@mui/material';

import { LinkType } from '../../../redux/paymentLink/paymentLink.types';
import { clearCreateSuccess } from '../../../redux/paymentLink/paymentLink.slice';
import {
  createGoalLink,
  createEventLink,
} from '../../../redux/paymentLink/paymentLink.actions';

import type { RootState, AppDispatch } from '../../../redux/store';

export default function CreateLinkView() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading, error, createLinkSuccess, currentLink } = useSelector(
    (state: RootState) => state.paymentLink
  );

  const [linkType, setLinkType] = useState<LinkType>(LinkType.GOAL);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetAmount: '',
    eventDate: '',
    expiresAt: '',
    allowAnonymous: true,
    showContributors: true,
    customMessage: '',
  });

  const handleLinkTypeChange = (
    event: React.MouseEvent<HTMLElement>,
    newType: LinkType | null
  ) => {
    if (newType !== null) {
      setLinkType(newType);
      // Clear type-specific fields when switching
      if (newType === LinkType.GOAL) {
        setFormData((prev) => ({ ...prev, eventDate: '' }));
      }
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (linkType === LinkType.GOAL) {
      if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
        toast.error('Please enter a valid target amount');
        return;
      }
    }

    if (linkType === LinkType.EVENT && !formData.eventDate) {
      toast.error('Please select an event date');
      return;
    }

    try {
      if (linkType === LinkType.GOAL) {
        await dispatch(
          createGoalLink({
            title: formData.title,
            description: formData.description || undefined,
            target_amount: parseFloat(formData.targetAmount),
            allow_anonymous: formData.allowAnonymous,
            show_contributors: formData.showContributors,
            custom_message: formData.customMessage || undefined,
            expires_at: formData.expiresAt || undefined,
          })
        ).unwrap();
      } else {
        await dispatch(
          createEventLink({
            title: formData.title,
            description: formData.description || undefined,
            event_date: formData.eventDate,
            target_amount: formData.targetAmount
              ? parseFloat(formData.targetAmount)
              : undefined,
            allow_anonymous: formData.allowAnonymous,
            show_contributors: formData.showContributors,
            custom_message: formData.customMessage || undefined,
          })
        ).unwrap();
      }

      toast.success('Payment link created successfully!');

      // Navigate to the newly created link's page after a short delay
      setTimeout(() => {
        dispatch(clearCreateSuccess());
        navigate('/payment-links');
      }, 1500);
    } catch (err: any) {
      toast.error(err || 'Failed to create payment link');
    }
  };

  const getTodayDate = () => new Date().toISOString().split('T')[0];

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
            Create Payment Link
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Generate a shareable link to collect contributions
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {/* Link Type Selection */}
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Link Type
                </Typography>
                <ToggleButtonGroup
                  value={linkType}
                  exclusive
                  onChange={handleLinkTypeChange}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  <ToggleButton value={LinkType.GOAL}>
                    <Box textAlign="center" py={1}>
                      <Target size={24} style={{ marginBottom: 8 }} />
                      <Typography variant="body2" fontWeight="medium">
                        Goal-Based
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Set a target amount to reach
                      </Typography>
                    </Box>
                  </ToggleButton>
                  <ToggleButton value={LinkType.EVENT}>
                    <Box textAlign="center" py={1}>
                      <Calendar size={24} style={{ marginBottom: 8 }} />
                      <Typography variant="body2" fontWeight="medium">
                        Event-Based
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Collect for a specific event
                      </Typography>
                    </Box>
                  </ToggleButton>
                </ToggleButtonGroup>
              </CardContent>
            </Card>

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
                    helperText="Give your payment link a clear, descriptive title"
                  />

                  <TextField
                    label="Description (Optional)"
                    placeholder="Tell people what this is for..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                    helperText="Add context to help contributors understand the purpose"
                  />

                  {linkType === LinkType.GOAL && (
                    <TextField
                      label="Target Amount"
                      type="number"
                      placeholder="0"
                      value={formData.targetAmount}
                      onChange={(e) => handleInputChange('targetAmount', e.target.value)}
                      required
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">₦</InputAdornment>
                        ),
                      }}
                      helperText="The total amount you're aiming to raise"
                    />
                  )}

                  {linkType === LinkType.EVENT && (
                    <>
                      <TextField
                        label="Event Date"
                        type="date"
                        value={formData.eventDate}
                        onChange={(e) => handleInputChange('eventDate', e.target.value)}
                        required
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ min: getTodayDate() }}
                        helperText="When is your event happening?"
                      />

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
                    </>
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
                  {linkType === LinkType.GOAL && (
                    <TextField
                      label="Expiration Date (Optional)"
                      type="date"
                      value={formData.expiresAt}
                      onChange={(e) => handleInputChange('expiresAt', e.target.value)}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ min: getTodayDate() }}
                      helperText="When should this link stop accepting contributions?"
                    />
                  )}

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
                    onChange={(e) => handleInputChange('customMessage', e.target.value)}
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
            {createLinkSuccess && currentLink && (
              <Alert severity="success">
                Payment link created successfully! Redirecting to your links...
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
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? 'Creating...' : 'Create Payment Link'}
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Container>
  );
}
