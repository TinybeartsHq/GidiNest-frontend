import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Users,
  Award,
  Clock,
  ArrowLeft,
  TrendingUp,
  DollarSign,
} from 'lucide-react';

import Grid from '@mui/material/Grid';
import {
  Box,
  Card,
  Chip,
  List,
  Stack,
  Alert,
  Button,
  Divider,
  ListItem,
  Container,
  Typography,
  CardContent,
  ListItemText,
  CircularProgress,
} from '@mui/material';

import { clearCurrentLink } from '../../../redux/paymentLink/paymentLink.slice';
import { fetchPaymentLinkAnalytics } from '../../../redux/paymentLink/paymentLink.actions';

import type { RootState, AppDispatch } from '../../../redux/store';

export default function AnalyticsView() {
  const { token } = useParams<{ token: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { analytics, currentLink, loading, error } = useSelector(
    (state: RootState) => state.paymentLink
  );

  useEffect(() => {
    if (token) {
      dispatch(fetchPaymentLinkAnalytics(token));
    }

    return () => {
      dispatch(clearCurrentLink());
    };
  }, [token, dispatch]);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

  const formatDateTime = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  if (loading) {
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

  if (error || !analytics) {
    return (
      <Container maxWidth="lg">
        <Box py={4}>
          <Button
            startIcon={<ArrowLeft />}
            onClick={() => navigate('/payment-links')}
            sx={{ mb: 2 }}
          >
            Back to My Links
          </Button>
          <Alert severity="error">{error || 'Failed to load analytics'}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
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
            Payment Link Analytics
          </Typography>
          {currentLink && (
            <Typography variant="body2" color="text.secondary">
              {currentLink.title}
            </Typography>
          )}
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: 'primary.light',
                      borderRadius: 2,
                      display: 'flex',
                    }}
                  >
                    <DollarSign size={24} color="#fff" />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {formatCurrency(analytics.total_amount)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Raised
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: 'success.light',
                      borderRadius: 2,
                      display: 'flex',
                    }}
                  >
                    <Users size={24} color="#fff" />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {analytics.total_contributions}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Total Contributors
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: 'info.light',
                      borderRadius: 2,
                      display: 'flex',
                    }}
                  >
                    <TrendingUp size={24} color="#fff" />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {formatCurrency(analytics.average_contribution)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Average Amount
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      p: 1.5,
                      bgcolor: 'warning.light',
                      borderRadius: 2,
                      display: 'flex',
                    }}
                  >
                    <Award size={24} color="#fff" />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight="bold">
                      {analytics.top_contributors?.length || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Top Contributors
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Daily Stats Table */}
        {analytics.daily_stats && analytics.daily_stats.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Daily Contribution Breakdown
              </Typography>
              <Divider sx={{ my: 2 }} />
              <List>
                {analytics.daily_stats.slice(0, 10).map((stat: { date: string; amount: number; count: number }, index: number) => (
                  <ListItem
                    key={index}
                    sx={{
                      bgcolor: 'action.hover',
                      borderRadius: 1,
                      mb: 1,
                    }}
                  >
                    <ListItemText
                      primary={formatDate(stat.date)}
                      secondary={`${stat.count} contribution${stat.count !== 1 ? 's' : ''}`}
                    />
                    <Typography variant="h6" fontWeight="bold" color="primary">
                      {formatCurrency(stat.amount)}
                    </Typography>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        <Grid container spacing={3}>
          {/* Top Contributors */}
          {analytics.top_contributors && analytics.top_contributors.length > 0 && (
            <Grid size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    mb={2}
                  >
                    <Award size={20} />
                    <Typography variant="h6" fontWeight="bold">
                      Top Contributors
                    </Typography>
                  </Stack>
                  <Divider sx={{ mb: 2 }} />
                  <List>
                    {analytics.top_contributors.map((contributor: any, index: number) => (
                      <ListItem
                        key={contributor.id}
                        sx={{
                          bgcolor: index === 0 ? 'action.hover' : 'transparent',
                          borderRadius: 1,
                          mb: 1,
                        }}
                      >
                        <ListItemText
                          primary={
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Chip
                                label={`#${index + 1}`}
                                size="small"
                                color={index === 0 ? 'primary' : 'default'}
                              />
                              <Typography variant="body2" fontWeight="medium">
                                {contributor.is_anonymous
                                  ? 'Anonymous'
                                  : contributor.contributor_name || 'Anonymous'}
                              </Typography>
                            </Stack>
                          }
                          secondary={formatDateTime(contributor.timestamp)}
                        />
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          color="primary"
                        >
                          {formatCurrency(contributor.amount)}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}

          {/* Recent Contributions */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                  <Clock size={20} />
                  <Typography variant="h6" fontWeight="bold">
                    Recent Contributions
                  </Typography>
                </Stack>
                <Divider sx={{ mb: 2 }} />
                {analytics.recent_contributions.length === 0 ? (
                  <Box textAlign="center" py={4}>
                    <Typography variant="body2" color="text.secondary">
                      No contributions yet
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {analytics.recent_contributions.map((contribution: any) => (
                      <ListItem
                        key={contribution.id}
                        sx={{
                          bgcolor: 'action.hover',
                          borderRadius: 1,
                          mb: 1,
                        }}
                      >
                        <ListItemText
                          primary={
                            <Typography variant="body2" fontWeight="medium">
                              {contribution.is_anonymous
                                ? 'Anonymous'
                                : contribution.contributor_name || 'Anonymous'}
                            </Typography>
                          }
                          secondary={formatDateTime(contribution.timestamp)}
                        />
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="primary"
                        >
                          {formatCurrency(contribution.amount)}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
