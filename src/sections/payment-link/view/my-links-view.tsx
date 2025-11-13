import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Plus,
  Copy,
  Edit,
  Users,
  Share2,
  Trash2,
  Target,
  Calendar,
  BarChart3,
  MoreVertical,
  ExternalLink,
} from 'lucide-react';

import {
  Box,
  Card,
  Chip,
  Menu,
  Stack,
  Alert,
  Button,
  Dialog,
  Switch,
  MenuItem,
  Container,
  Typography,
  IconButton,
  CardContent,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  CircularProgress,
} from '@mui/material';

import { LinkType } from '../../../redux/paymentLink/paymentLink.types';
import {
  deletePaymentLink,
  fetchMyPaymentLinks,
  togglePaymentLinkStatus,
} from '../../../redux/paymentLink/paymentLink.actions';

import type { RootState, AppDispatch } from '../../../redux/store';
import type { PaymentLink} from '../../../redux/paymentLink/paymentLink.types';

export default function MyLinksView() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { paymentLinks, loading, error } = useSelector(
    (state: RootState) => state.paymentLink
  );

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedLink, setSelectedLink] = useState<PaymentLink | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMyPaymentLinks());
  }, [dispatch]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, link: PaymentLink) => {
    setAnchorEl(event.currentTarget);
    setSelectedLink(link);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCopyLink = async (link: PaymentLink) => {
    const url = `${window.location.origin}/pay/${link.token}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Payment link copied!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
    handleMenuClose();
  };

  const handleShare = (link: PaymentLink) => {
    const url = `${window.location.origin}/pay/${link.token}`;
    const text = `${link.title}\n\nContribute here: ${url}`;

    if (navigator.share) {
      navigator
        .share({
          title: link.title,
          text,
          url,
        })
        .catch(() => {
          // Fallback to copy
          handleCopyLink(link);
        });
    } else {
      handleCopyLink(link);
    }
    handleMenuClose();
  };

  const handleViewAnalytics = (link: PaymentLink) => {
    navigate(`/payment-links/${link.token}/analytics`);
    handleMenuClose();
  };

  const handleEdit = (link: PaymentLink) => {
    navigate(`/payment-links/${link.token}/edit`);
    handleMenuClose();
  };

  const handleToggleStatus = async (link: PaymentLink) => {
    try {
      await dispatch(
        togglePaymentLinkStatus({
          token: link.token,
          isActive: !link.is_active,
        })
      ).unwrap();
      toast.success(
        `Payment link ${link.is_active ? 'deactivated' : 'activated'} successfully`
      );
    } catch (err: any) {
      toast.error(err || 'Failed to toggle link status');
    }
  };

  const handleDeleteClick = (link: PaymentLink) => {
    setSelectedLink(link);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedLink) return;

    try {
      await dispatch(deletePaymentLink(selectedLink.token)).unwrap();
      toast.success('Payment link deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedLink(null);
    } catch (err: any) {
      toast.error(err || 'Failed to delete payment link');
    }
  };

  const handleViewPublicPage = (link: PaymentLink) => {
    window.open(`/pay/${link.token}`, '_blank');
    handleMenuClose();
  };

  const formatCurrency = (amount: number) => new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
    }).format(amount);

  const calculateProgress = (link: PaymentLink) => {
    if (!link.target_amount) return 0;
    return Math.min((link.amount_raised / link.target_amount) * 100, 100);
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  if (loading && paymentLinks.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              My Payment Links
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create and manage your payment collection links
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Plus />}
            onClick={() => navigate('/payment-links/create')}
            size="large"
          >
            Create Link
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Empty State */}
        {paymentLinks.length === 0 && !loading && (
          <Card>
            <CardContent>
              <Box textAlign="center" py={6}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No payment links yet
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Create your first payment link to start collecting contributions
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Plus />}
                  onClick={() => navigate('/payment-links/create')}
                >
                  Create Your First Link
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Payment Links List */}
        <Stack spacing={3}>
          {paymentLinks.map((link: PaymentLink) => (
            <Card key={link.id}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                  <Box flex={1}>
                    {/* Header */}
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Chip
                        label={link.link_type.toUpperCase()}
                        color={link.link_type === LinkType.GOAL ? 'primary' : 'secondary'}
                        size="small"
                      />
                      <Chip
                        label={link.is_active ? 'Active' : 'Inactive'}
                        color={link.is_active ? 'success' : 'default'}
                        size="small"
                      />
                      {link.link_type === LinkType.EVENT && link.event_date && (
                        <Chip
                          icon={<Calendar size={14} />}
                          label={formatDate(link.event_date)}
                          size="small"
                        />
                      )}
                    </Box>

                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                      {link.title}
                    </Typography>

                    {link.description && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mb: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {link.description}
                      </Typography>
                    )}

                    {/* Progress Bar (if target amount exists) */}
                    {link.target_amount && (
                      <Box mb={2}>
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={1}
                        >
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(link.amount_raised)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            of {formatCurrency(link.target_amount)}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={calculateProgress(link)}
                          sx={{ height: 6, borderRadius: 3 }}
                        />
                      </Box>
                    )}

                    {/* Stats */}
                    <Box display="flex" gap={3} mt={2}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Target size={18} color="#666" />
                        <Typography variant="body2" color="text.secondary">
                          {formatCurrency(link.amount_raised)} raised
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Users size={18} color="#666" />
                        <Typography variant="body2" color="text.secondary">
                          {link.contributors_count} contributors
                        </Typography>
                      </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box display="flex" gap={1} mt={2}>
                      <Button
                        size="small"
                        startIcon={<Copy size={16} />}
                        onClick={() => handleCopyLink(link)}
                      >
                        Copy Link
                      </Button>
                      <Button
                        size="small"
                        startIcon={<Share2 size={16} />}
                        onClick={() => handleShare(link)}
                      >
                        Share
                      </Button>
                      <Button
                        size="small"
                        startIcon={<BarChart3 size={16} />}
                        onClick={() => handleViewAnalytics(link)}
                      >
                        Analytics
                      </Button>
                    </Box>
                  </Box>

                  {/* Menu */}
                  <Box>
                    <IconButton onClick={(e) => handleMenuOpen(e, link)}>
                      <MoreVertical size={20} />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => selectedLink && handleViewPublicPage(selectedLink)}>
            <ExternalLink size={18} style={{ marginRight: 8 }} />
            View Public Page
          </MenuItem>
          <MenuItem onClick={() => selectedLink && handleEdit(selectedLink)}>
            <Edit size={18} style={{ marginRight: 8 }} />
            Edit
          </MenuItem>
          <MenuItem onClick={() => selectedLink && handleToggleStatus(selectedLink)}>
            <Switch
              size="small"
              checked={selectedLink?.is_active}
              sx={{ mr: 1 }}
            />
            {selectedLink?.is_active ? 'Deactivate' : 'Activate'}
          </MenuItem>
          <MenuItem
            onClick={() => selectedLink && handleDeleteClick(selectedLink)}
            sx={{ color: 'error.main' }}
          >
            <Trash2 size={18} style={{ marginRight: 8 }} />
            Delete
          </MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Delete Payment Link?</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete &ldquo;{selectedLink?.title}&rdquo;? This action cannot
              be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
}
