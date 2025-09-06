import { useSelector, useDispatch } from 'react-redux'; // Import Redux hooks
import React, { useState, useEffect, useCallback } from 'react';
// Import specific Lucide icons
import { Save, PenTool, XCircle, ShieldCheck, AlertCircle } from 'lucide-react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert'; // For errors
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import AlertTitle from '@mui/material/AlertTitle'; // For errors
import CircularProgress from '@mui/material/CircularProgress'; // For loading

// Removed _users mock as data comes from Redux/API
import { DashboardContent } from 'src/layouts/dashboard';

// Import Redux actions and types
import {
  fetchUserProfile,
  updateUserProfile,
  type UserProfileData, // Import the UserProfileData type from your actions
  clearUserProfileError,
} from '../../../redux/userProfile/userProfile.actions';

import type { AppDispatch } from '../../../redux/types'; // Assuming AppDispatch and AppState are here

// ----------------------------------------------------------------------

// UserProfileProps is now UserProfileData from Redux actions
// type UserProfileProps = { /* ... */ }; // Remove this if it's identical to UserProfileData

// Remove mock data fetching function
// const fetchCurrentUserProfile = (): UserProfileProps => { /* ... */ };

export function UserProfileView() {
  const theme = useTheme();
  const dispatch: AppDispatch = useDispatch();

  // Get user profile data and state from Redux store
  const { profile: userProfile, loading, error, updating } = useSelector((state: any) => state.profile);


  const [isEditing, setIsEditing] = useState(false);
  // Edited profile state, initialized from userProfile when available
  const [editedProfile, setEditedProfile] = useState<UserProfileData | null>(null);

  // Effect to fetch user profile when component mounts or loggedInUser changes
  useEffect(() => {
    dispatch(fetchUserProfile());

  }, [dispatch]); // Re-fetch if loggedInUser ID changes

  // Sync Redux profile with local editedProfile when Redux profile updates
  useEffect(() => {
    console.log(userProfile)
    if (userProfile) {
      setEditedProfile(userProfile);
    }
  }, [userProfile]);

  // Effect to clear errors after a delay
  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearUserProfileError());
      }, 5000); // Clear error message after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);


  const handleEditToggle = useCallback(() => {
    setIsEditing((prev) => !prev);
    if (isEditing && userProfile) {
      // If was editing and cancelled, revert editedProfile to original userProfile
      setEditedProfile(userProfile);
    }
  }, [isEditing, userProfile]);

  const handleFieldChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditedProfile((prev) => (prev ? { ...prev, [name]: value } : null));
  }, []);

  const handleSaveProfile = useCallback(async () => {
    if (editedProfile) {
      // Dispatch the update action
      const result = await dispatch(updateUserProfile(editedProfile));
      if (result.success) {
        setIsEditing(false); // Exit editing mode on successful save
        // The Redux reducer will update userProfile, and the useEffect will resync editedProfile
      }
      // Error handling is managed by Redux state, which will display the Alert
    }
  }, [editedProfile, dispatch]);


  // --- Render Loading, Error, Not Found States ---
  if (loading && !userProfile) {
    return (
      <DashboardContent>
        <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 200px)">
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>Loading profile...</Typography>
        </Box>
      </DashboardContent>
    );
  }

  if (error) {
    return (
      <DashboardContent>
        <Alert severity="error">
          <AlertTitle>Error Loading Profile</AlertTitle>
          <Typography>{error}</Typography> {/* error from redux is string */}
        </Alert>
        <Button onClick={() => dispatch(fetchUserProfile())} sx={{ mt: 2 }}>Try Again</Button>
      </DashboardContent>
    );
  }

  if (!userProfile && !loading && !error) { // No profile data after loading
    return (
      <DashboardContent>
        <Alert severity="warning">
          <AlertTitle>Profile Not Found</AlertTitle>
          <Typography>Your user profile could not be loaded. Please ensure you are logged in correctly.</Typography>
        </Alert>
      </DashboardContent>
    );
  }

  // If userProfile exists, render the form
  if (!userProfile) { // This case should theoretically be covered by the above, but as a fallback
    return null;
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Basic':
        return 'default';
      case 'Standard':
        return 'info'; // Changed from primary for more distinction
      case 'Premium':
        return 'success'; // Changed from primary for more distinction
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
          disabled={loading || updating} // Disable during loading/updating
        >
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </Button>
      </Box>

      {/* Update Alert */}
      {updating && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <AlertTitle>Updating Profile</AlertTitle>
          Your profile is being updated...
        </Alert>
      )}
      {error && ( // Display error during update or initial fetch
        <Alert severity="error" sx={{ mb: 3 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      <Card component={Paper} elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
        <Grid container spacing={4}>
          <Grid
 
            size={{ xs: 12, md: 4 }}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <Avatar
              alt={`${userProfile.first_name} ${userProfile.last_name}`}
              src={"data:image/png;base64," + userProfile?.image || '/assets/images/avatars/avatar_default.jpg'} // Fallback avatar
              sx={{ width: 120, height: 120, mb: 2, border: `4px solid ${theme.palette.background.paper}`, boxShadow: theme.shadows[3] }}
            />
            <Typography variant="h6" gutterBottom>
              {userProfile.first_name} {userProfile.last_name}
            </Typography>
            <Chip
              label={`Tier: ${userProfile.account_tier}`}
              color={getTierColor(userProfile.account_tier)}
              sx={{ mb: 1 }}
            />
            <Chip
              label={userProfile.has_bvn ? 'BVN Verified' : 'BVN Not Verified'}
              color={userProfile.has_bvn ? 'success' : 'warning'}
              icon={userProfile.has_bvn ? <ShieldCheck size={18} /> : <AlertCircle size={18} />}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Personal Information
            </Typography>

            {/* Added Note */}
            <Alert severity="info" sx={{ mb: 3 }}>
              Important: Please ensure these details match the information on your BVN to avoid verification issues.
            </Alert>

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
              <Grid size={{ xs: 12, sm: 6 }} >
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={editedProfile?.email || ''}
                  onChange={handleFieldChange}
                  disabled={!isEditing || updating}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }} >
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phone"
                  value={editedProfile?.phone || ''}
                  onChange={handleFieldChange}
                  disabled
                  // disabled={!isEditing || updating}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }} >
                <TextField
                  fullWidth
                  label="Date of Birth"
                  name="dob"
                  type="date"
                  value={editedProfile?.dob || ''}
                  onChange={handleFieldChange}
                  disabled
                  // disabled={!isEditing || updating}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }} >
                <TextField
                  fullWidth
                  label="BVN"
                  name="bvn"
                  value={editedProfile?.bvn || ''}
                  onChange={handleFieldChange}
                  disabled // BVN is typically not editable
                  helperText="BVN cannot be edited directly."
                />
              </Grid>
            </Grid>
            {
              isEditing && (
                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSaveProfile}
                    startIcon={<Save size={18} />}
                    disabled={updating} // Disable save button during update
                  >
                    {updating ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              )
            }
          </Grid >
        </Grid >
      </Card >
    </DashboardContent >
  );
}