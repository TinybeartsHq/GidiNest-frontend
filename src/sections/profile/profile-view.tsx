/* eslint-disable consistent-return */
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect, useCallback } from 'react';
import { Save, PenTool, XCircle, ShieldCheck, AlertCircle } from 'lucide-react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert'; // For errors
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import AlertTitle from '@mui/material/AlertTitle';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';

import {
  fetchUserProfile,
  updateUserProfile,
  type UserProfileData,
  clearUserProfileError,
} from '../../redux/userProfile/userProfile.actions';

import type { AppDispatch } from '../../redux/types';

export function UserProfileView() {
  const theme = useTheme();
  const dispatch: AppDispatch = useDispatch();

  const {
    profile: userProfile,
    loading,
    error,
    updating,
  } = useSelector((state: any) => state.profile);

  const [isEditing, setIsEditing] = useState(false);

  const [editedProfile, setEditedProfile] = useState<UserProfileData | null>(null);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  useEffect(() => {
    if (userProfile) {
      setEditedProfile(userProfile);
    }
  }, [userProfile]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearUserProfileError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  const handleEditToggle = useCallback(() => {
    setIsEditing((prev) => !prev);
    if (isEditing && userProfile) {
      setEditedProfile(userProfile);
    }
  }, [isEditing, userProfile]);

  const handleFieldChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedProfile((prev) => (prev ? { ...prev, [name]: value } : null));
  }, []);

  const handleSaveProfile = useCallback(async () => {
    if (editedProfile) {
      const result = await dispatch(updateUserProfile(editedProfile));
      if (result.success) {
        setIsEditing(false);
        toast('Profile Updated successfull');
      }
    }
  }, [editedProfile, dispatch]);

  if (loading && !userProfile) {
    return (
      <DashboardContent>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="calc(100vh - 200px)"
        >
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading profile...
          </Typography>
        </Box>
      </DashboardContent>
    );
  }

  if (error) {
    return (
      <DashboardContent>
        <Alert severity="error">
          <AlertTitle>Error Loading Profile</AlertTitle>
          <Typography>{error}</Typography>
        </Alert>
        <Button onClick={() => dispatch(fetchUserProfile())} sx={{ mt: 2 }}>
          Try Again
        </Button>
      </DashboardContent>
    );
  }

  if (!userProfile && !loading && !error) {
    // No profile data after loading
    return (
      <DashboardContent>
        <Alert severity="warning">
          <AlertTitle>Profile Not Found</AlertTitle>
          <Typography>
            Your user profile could not be loaded. Please ensure you are logged in correctly.
          </Typography>
        </Alert>
      </DashboardContent>
    );
  }

  if (!userProfile) {
    return null;
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Basic':
        return 'default';
      case 'Standard':
        return 'info';
      case 'Premium':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          My Profile
        </Typography>
        <Button
          variant="contained"
          color={isEditing ? 'error' : 'primary'}
          startIcon={isEditing ? <XCircle size={18} /> : <PenTool size={18} />}
          onClick={handleEditToggle}
          disabled={loading || updating}
        >
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </Button>
      </Box>

      {updating && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>Updating Profile</AlertTitle>
          Your profile is being updated...
        </Alert>
      )}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => dispatch(fetchUserProfile())}
            >
              Retry
            </Button>
          }
        >
          <AlertTitle>Error Loading Profile</AlertTitle>
          {error}
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Please check your internet connection or try again later.
          </Typography>
        </Alert>
      )}

      <Card component={Paper} elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
        <Grid container spacing={4}>
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Avatar
              alt={`${userProfile.first_name} ${userProfile.last_name}`}
              src={
                'data:image/png;base64,' + userProfile?.image ||
                '/assets/images/avatars/avatar_default.jpg'
              } // Fallback avatar
              sx={{
                width: 120,
                height: 120,
                mb: 2,
                border: `4px solid ${theme.palette.background.paper}`,
                boxShadow: theme.shadows[3],
              }}
            />
            <Typography variant="h6" gutterBottom>
              {userProfile.first_name} {userProfile.last_name}
            </Typography>
            <Chip
              label={`Tier: ${userProfile.account_tier}`}
              color={getTierColor(userProfile.account_tier)}
              sx={{ mb: 1 }}
            />

            {/* Verification Status Section */}
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Verification Status
              </Typography>

              {/* BVN Verification */}
              {(userProfile?.has_bvn || userProfile?.bvn) && (
                <Chip
                  label={userProfile?.has_bvn ? `BVN Verified ${userProfile?.bvn ? `(${userProfile.bvn})` : ''}` : 'BVN Not Verified'}
                  color={userProfile?.has_bvn ? 'success' : 'warning'}
                  icon={userProfile?.has_bvn ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
                  sx={{ mb: 1, mr: 1 }}
                  size="small"
                />
              )}

              {/* NIN Verification */}
              {(userProfile?.has_nin || userProfile?.nin) && (
                <Chip
                  label={userProfile?.has_nin ? `NIN Verified ${userProfile?.nin ? `(${userProfile.nin})` : ''}` : 'NIN Not Verified'}
                  color={userProfile?.has_nin ? 'success' : 'warning'}
                  icon={userProfile?.has_nin ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
                  sx={{ mb: 1, mr: 1 }}
                  size="small"
                />
              )}

              {/* Show alert if neither is verified */}
              {!userProfile?.has_bvn && !userProfile?.has_nin && !userProfile?.bvn && !userProfile?.nin && (
                <Chip
                  label="No ID Verification"
                  color="error"
                  icon={<AlertCircle size={18} />}
                  sx={{ mb: 1, mr: 1 }}
                  size="small"
                />
              )}

              {/* Email Verification */}
              <Chip
                label={userProfile.email_verified ? 'Email Verified' : 'Email Not Verified'}
                color={userProfile.email_verified ? 'success' : 'warning'}
                icon={
                  userProfile.email_verified ? <ShieldCheck size={18} /> : <AlertCircle size={18} />
                }
                sx={{ mb: 1 }}
                size="small"
              />
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            {/* Account Tier & Limits Section */}
            <Box sx={{ mb: 4, p: 3, backgroundColor: 'background.neutral', borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Account Tier & Limits
              </Typography>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Current Tier
                    </Typography>
                    <Typography variant="h6" color="primary">
                      {userProfile.account_tier}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Transaction Limit
                    </Typography>
                    <Typography variant="h6">
                      {userProfile.account_tier === 'Basic' && '₦50,000/day'}
                      {userProfile.account_tier === 'Standard' && '₦200,000/day'}
                      {userProfile.account_tier === 'Premium' && 'Unlimited'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Account Balance Limit
                    </Typography>
                    <Typography variant="h6">
                      {userProfile.account_tier === 'Basic' && '₦300,000'}
                      {userProfile.account_tier === 'Standard' && '₦5,000,000'}
                      {userProfile.account_tier === 'Premium' && 'Unlimited'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Verification Status
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {userProfile?.has_bvn && userProfile?.has_nin && '✓ Fully Verified (BVN + NIN)'}
                      {userProfile?.has_bvn && !userProfile?.has_nin && '✓ BVN Verified'}
                      {!userProfile?.has_bvn && userProfile?.has_nin && '✓ NIN Verified'}
                      {!userProfile?.has_bvn && !userProfile?.has_nin && '⚠ Not Verified'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Upgrade Options */}
              {(!userProfile?.has_bvn || !userProfile?.has_nin) && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  <AlertTitle>Upgrade Your Account</AlertTitle>
                  {!userProfile?.has_bvn && !userProfile?.has_nin && (
                    'Verify your account with BVN or NIN to increase your transaction limits and access more features.'
                  )}
                  {userProfile?.has_bvn && !userProfile?.has_nin && (
                    'Add NIN verification to unlock higher transaction limits and get fully verified status.'
                  )}
                  {!userProfile?.has_bvn && userProfile?.has_nin && (
                    'Add BVN verification to unlock higher transaction limits and get fully verified status.'
                  )}
                </Alert>
              )}

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                {!userProfile?.has_bvn && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                      // Navigate to savings page or open BVN modal
                      window.location.href = '/savings?verify=bvn';
                    }}
                    startIcon={<ShieldCheck size={18} />}
                  >
                    Verify with BVN
                  </Button>
                )}
                {!userProfile?.has_nin && (
                  <Button
                    variant={userProfile?.has_bvn ? 'outlined' : 'contained'}
                    color="primary"
                    onClick={() => {
                      // Navigate to savings page or open NIN modal
                      window.location.href = '/savings?verify=nin';
                    }}
                    startIcon={<ShieldCheck size={18} />}
                  >
                    Verify with NIN
                  </Button>
                )}
              </Stack>
            </Box>

            <Typography variant="h5" sx={{ mb: 3 }}>
              Personal Information
            </Typography>

            {/* Added Note */}
            <Alert severity="info" sx={{ mb: 3 }}>
              Important: Please ensure these details match the information on your BVN or NIN to avoid
              verification issues.
            </Alert>

            {/* Show verification success message */}
            {(userProfile?.has_bvn || userProfile?.has_nin) && (
              <Alert severity="success" sx={{ mb: 3 }}>
                <AlertTitle>Account Verified</AlertTitle>
                Your account has been verified with{' '}
                {userProfile?.has_bvn && userProfile?.has_nin
                  ? 'both BVN and NIN'
                  : userProfile?.has_bvn
                    ? 'BVN'
                    : 'NIN'}
                . Your information is secure and protected.
              </Alert>
            )}

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={editedProfile?.first_name || ''}
                  onChange={handleFieldChange}
                  disabled={!isEditing || updating}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  value={editedProfile?.last_name || ''}
                  onChange={handleFieldChange}
                  disabled={!isEditing || updating}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={editedProfile?.email || ''}
                  onChange={handleFieldChange}
                  disabled
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={editedProfile?.phone || ''}
                  onChange={handleFieldChange}
                  disabled
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={editedProfile?.dob || ''}
                  onChange={handleFieldChange}
                  disabled
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="BVN"
                  name="bvn"
                  value={editedProfile?.bvn || 'Not provided'}
                  onChange={handleFieldChange}
                  disabled
                  helperText={
                    editedProfile?.has_bvn
                      ? '✓ BVN verified and cannot be edited.'
                      : 'BVN not verified. Go to Savings to verify.'
                  }
                  InputProps={{
                    sx: {
                      backgroundColor: editedProfile?.has_bvn
                        ? 'success.lighter'
                        : 'background.paper',
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="NIN"
                  name="nin"
                  value={editedProfile?.nin || 'Not provided'}
                  onChange={handleFieldChange}
                  disabled
                  helperText={
                    editedProfile?.has_nin
                      ? '✓ NIN verified and cannot be edited.'
                      : 'NIN not verified. Go to Savings to verify.'
                  }
                  InputProps={{
                    sx: {
                      backgroundColor: editedProfile?.has_nin
                        ? 'success.lighter'
                        : 'background.paper',
                    },
                  }}
                />
              </Grid>
            </Grid>
            {isEditing && (
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveProfile}
                  startIcon={<Save size={18} />}
                  disabled={updating}
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            )}

            {/* Additional NIN Verification Details */}
            {userProfile?.has_nin && (userProfile?.nin_dob || userProfile?.nin_gender || userProfile?.nin_marital_status) && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  NIN Verification Details
                </Typography>
                <Grid container spacing={3}>
                  {userProfile?.nin_first_name && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="NIN First Name"
                        value={userProfile.nin_first_name}
                        disabled
                        size="small"
                      />
                    </Grid>
                  )}
                  {userProfile?.nin_last_name && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="NIN Last Name"
                        value={userProfile.nin_last_name}
                        disabled
                        size="small"
                      />
                    </Grid>
                  )}
                  {userProfile?.nin_dob && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="NIN Date of Birth"
                        value={userProfile.nin_dob}
                        disabled
                        size="small"
                      />
                    </Grid>
                  )}
                  {userProfile?.nin_gender && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Gender"
                        value={userProfile.nin_gender}
                        disabled
                        size="small"
                      />
                    </Grid>
                  )}
                  {userProfile?.nin_phone && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="NIN Phone"
                        value={userProfile.nin_phone}
                        disabled
                        size="small"
                      />
                    </Grid>
                  )}
                  {userProfile?.nin_marital_status && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Marital Status"
                        value={userProfile.nin_marital_status}
                        disabled
                        size="small"
                      />
                    </Grid>
                  )}
                  {userProfile?.nin_nationality && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Nationality"
                        value={userProfile.nin_nationality}
                        disabled
                        size="small"
                      />
                    </Grid>
                  )}
                  {userProfile?.nin_state_of_residence && (
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="State of Residence"
                        value={userProfile.nin_state_of_residence}
                        disabled
                        size="small"
                      />
                    </Grid>
                  )}
                  {userProfile?.nin_residential_address && (
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Residential Address"
                        value={userProfile.nin_residential_address}
                        disabled
                        multiline
                        rows={2}
                        size="small"
                      />
                    </Grid>
                  )}
                </Grid>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                  This information was retrieved from your NIN verification and cannot be edited directly.
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Card>
    </DashboardContent>
  );
}
