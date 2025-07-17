import React, { useState, useEffect, useCallback } from 'react';
// Import specific Lucide icons
import { Save, PenTool, XCircle, ShieldCheck, AlertCircle } from 'lucide-react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

// If you still need Iconify for other parts, keep this import.
// For the specific icons in this view, we're using Lucide directly.
// import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type UserProfileProps = {
  id: string;
  avatarUrl: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  bvn: string;
  accountTier: 'Basic' | 'Standard' | 'Premium';
  dob: string;
  isVerified: boolean;
};

const fetchCurrentUserProfile = (): UserProfileProps => {
  const mockUser = _users[0];

  const [firstName = 'John', lastName = 'Doe'] = mockUser.name.split(' ');

  return {
    id: mockUser.id,
    avatarUrl: mockUser.avatarUrl,
    firstName,
    lastName,
    email: mockUser.email,
    phoneNumber: mockUser.phoneNumber,
    bvn: '22112345678',
    accountTier: 'Standard',
    dob: '1990-07-17',
    isVerified: mockUser.isVerified,
  };
};

export function UserProfileView() {
  const theme = useTheme();
  const [userProfile, setUserProfile] = useState<UserProfileProps | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfileProps | null>(null);

  useEffect(() => {
    const profileData = fetchCurrentUserProfile();
    setUserProfile(profileData);
    setEditedProfile(profileData);
  }, []);

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

  const handleSaveProfile = useCallback(() => {
    console.log('Saving profile:', editedProfile);
    if (editedProfile) {
      setUserProfile(editedProfile);
      setIsEditing(false);
    }
  }, [editedProfile]);

  if (!userProfile) {
    return (
      <DashboardContent>
        <Typography variant="h6" sx={{ mt: 5, textAlign: 'center' }}>
          Loading profile...
        </Typography>
      </DashboardContent>
    );
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Basic':
        return 'default';
      case 'Standard':
      case 'Premium':
        return 'primary';
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
          // Directly use Lucide components here
          startIcon={isEditing ? <XCircle size={18} /> : <PenTool size={18} />} // Lucide icons
          onClick={handleEditToggle}
        >
          {isEditing ? 'Cancel Edit' : 'Edit Profile'}
        </Button>
      </Box>

      <Card component={Paper} elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
        <Grid container spacing={4}>
          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
          >
            <Avatar
              alt={userProfile.firstName}
              src={userProfile.avatarUrl}
              sx={{ width: 120, height: 120, mb: 2, border: `4px solid #fff`, boxShadow: theme.shadows[3] }}
            />
            <Typography variant="h6" gutterBottom>
              {userProfile.firstName} {userProfile.lastName}
            </Typography>
            <Chip
              label={`Tier: ${userProfile.accountTier}`}
              color={getTierColor(userProfile.accountTier)}
              sx={{ mb: 1 }}
            />
            <Chip
              label={userProfile.isVerified ? 'BVN Verified' : 'BVN Not Verified'}
              color={userProfile.isVerified ? 'success' : 'warning'}
              // Directly use Lucide components here
              icon={userProfile.isVerified ? <ShieldCheck size={18} /> : <AlertCircle size={18} />} // Lucide icons
            />
          </Grid>

          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Personal Information
            </Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={editedProfile?.firstName || ''}
                  onChange={handleFieldChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={editedProfile?.lastName || ''}
                  onChange={handleFieldChange}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6}} >
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={editedProfile?.email || ''}
                  onChange={handleFieldChange}
                  disabled={!isEditing}
                />
              </Grid>
            <Grid size={{ xs: 12, sm: 6}} >
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={editedProfile?.phoneNumber || ''}
                onChange={handleFieldChange}
                disabled={!isEditing}
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
              disabled={!isEditing}
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
            disabled
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
          startIcon={<Save size={18} />} // Lucide Save icon
        >
          Save Changes
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