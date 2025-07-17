import { useState, useCallback } from 'react';

import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import { useTheme } from '@mui/material/styles'; // Import useTheme for theme access
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

// DEFINE AND EXPORT TransactionProps HERE
export type TransactionProps = {
  id: string; // Unique ID for the row (original user ID, or a true unique transaction ID)
  avatarUrl: string; // Used for icon or initials related to the transaction
  name: string; // Repurposed for Transaction Description/Title
  company: string; // Repurposed for Transaction Category/Source/Destination (e.g., "Food", "Transport")
  role: string; // Repurposed for Transaction Type (e.g., 'Debit', 'Credit')
  isVerified: boolean; // Repurposed for a transaction verification status (e.g., confirmed by bank)
  status: 'Completed' | 'Pending' | 'Failed'; // Actual transaction status
  createdAt: string; // Repurposed for Transaction Date/Time
  balance: number; // Repurposed for Transaction Amount
  email: string; // Can be a transaction reference or payer's email
  phoneNumber: string; // Can be a conceptual phone number related to the transaction
  address: string; // Can be detailed transaction notes
};

type TransactionTableRowProps = {
  row: TransactionProps;
  selected: boolean;
  onSelectRow: () => void;
};

export function TransactionTableRow({
  row,
  selected,
  onSelectRow,
}: TransactionTableRowProps) {
  const theme = useTheme(); // Access the theme for consistent colors

  const {
    id,
    avatarUrl,
    name, // Transaction Description
    company, // Transaction Category
    role, // Transaction Type (Debit/Credit)
    // isVerified, // Not directly displayed, but part of the type
    status,
    createdAt, // Date & Time
    balance,
  } = row;

  const [open, setOpen] = useState(null);

  const handleOpenMenu = useCallback((event: any) => {
    setOpen(event.currentTarget);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setOpen(null);
  }, []);

  // Determine color for transaction type
  const transactionTypeColor = role === 'Credit' ? theme.palette.success.main : theme.palette.error.main;
  // Determine color for transaction status
  const transactionStatusColor =
    status === 'Completed'
      ? theme.palette.success.main
      : status === 'Pending'
        ? theme.palette.warning.main
        : theme.palette.error.main;

  const getStatusChipColor = (currentStatus: 'Completed' | 'Pending' | 'Failed') => {
    switch (currentStatus) {
      case 'Completed':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTransactionTypeIcon = (type: string) => {
    if (type === 'Credit') {
      return 'solar:eye-bold'; // Icon for money coming in
    }
    return 'solar:eye-bold'; // Icon for money going out
  };

  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onChange={onSelectRow} />
      </TableCell>

      {/* Transaction ID & Avatar/Icon */}
      <TableCell sx={{ minWidth: 160 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          
          <Typography variant="subtitle2" noWrap>
            {id.substring(id.length - 8).toUpperCase()} {/* Short Transaction ID */}
          </Typography>
        </Stack>
      </TableCell>

      {/* Description & Category */}
      <TableCell sx={{ minWidth: 220 }}>
        <Link color="inherit" underline="hover" noWrap variant="body2" sx={{ fontWeight: 'fontWeightMedium' }}>
          {name} {/* Main description, bolder for prominence */}
        </Link>
        <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
          {company} {/* Sub-description/category */}
        </Typography>
      </TableCell>

      {/* Date & Time */}
      <TableCell sx={{ minWidth: 120 }}>
        <Typography variant="body2" noWrap>
          {new Date(createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {new Date(createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
        </Typography>
      </TableCell>

      {/* Amount & Type */}
      <TableCell align="right" sx={{ minWidth: 140 }}>
        <Typography variant="subtitle1" sx={{ color: transactionTypeColor, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
      
          ₦{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Typography>
      
      </TableCell>

      {/* Status */}
      <TableCell align="center" sx={{ minWidth: 100 }}>
        <Chip
          label={status}
          color={getStatusChipColor(status)}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      </TableCell>

      {/* Actions */}
      <TableCell align="right" sx={{ width: 40 }}>
        <IconButton onClick={handleOpenMenu}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>

      {/* Popover Menu */}
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 160, p: 0 }, // Slightly wider popover
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="solar:settings-bold-duotone" sx={{ mr: 2 }} /> {/* New icon for View Details */}
          View Details
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="solar:settings-bold-duotone" sx={{ mr: 2 }} /> {/* New icon for Dispute */}
          Dispute
        </MenuItem>
      </Popover>
    </TableRow>
  );
}
