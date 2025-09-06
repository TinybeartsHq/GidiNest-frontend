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
  goal_name: string; // Repurposed for Transaction Description/Title
  transaction_type: 'contribution' | 'withdrawal'; // Actual transaction status
  timestamp: string; // Repurposed for Transaction Date/Time
  goal_current_amount: number; // Repurposed for Transaction Amount
  amount: number; // Transaction Amount
}

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
    goal_name,
    transaction_type, // Transaction Description
    timestamp, // Transaction Category
    goal_current_amount, // Transaction Type (Debit/Credit)
    amount
  } = row;

  const [open, setOpen] = useState(null);

  const handleOpenMenu = useCallback((event: any) => {
    setOpen(event.currentTarget);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setOpen(null);
  }, []);

  // Determine color for transaction type
  const transactionTypeColor = transaction_type === 'contribution' ? theme.palette.success.main : theme.palette.error.main;
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

    

      {/* Description & Category */}
      <TableCell sx={{ minWidth: 220 }}>
        <Link color="inherit" underline="hover" noWrap variant="body2" sx={{ fontWeight: 'fontWeightMedium' }}>
          {goal_name} {/* Main description, bolder for prominence */}
        </Link>
   
      </TableCell>

      {/* Transaction ID & Avatar/Icon */}

      <TableCell align="left" sx={{ minWidth: 120 }}>
        <Typography variant="subtitle1" sx={{ color: transactionTypeColor, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', textCapitalize: 'capitalize' }}>

          {transaction_type}
        </Typography>

      </TableCell>

      {/* Date & Time */}
      <TableCell sx={{ minWidth: 120 }}>
        <Typography variant="body2" noWrap>
          {new Date(timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {new Date(timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
        </Typography>
      </TableCell>

      

      {/* Amount & Type */}
      <TableCell align="right" sx={{ minWidth: 140 }}>
        <Typography variant="subtitle1" sx={{ color: transactionTypeColor, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
      
          ₦{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </Typography>
      
      </TableCell>

      {/* Status */}
      {/* <TableCell align="center" sx={{ minWidth: 100 }}>
        <Chip
          label={status}
          color={getStatusChipColor(status)}
          size="small"
          sx={{ textTransform: 'capitalize' }}
        />
      </TableCell> */}

      {/* Actions */}
      {/* <TableCell align="right" sx={{ width: 40 }}>
        <IconButton onClick={handleOpenMenu}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell> */}

      {/* Popover Menu */}
      {/* <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 160, p: 0 },  
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="solar:settings-bold-duotone" sx={{ mr: 2 }} /> 
          View Details
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>  
          Dispute
        </MenuItem>
      </Popover> */}
    </TableRow>
  );
}
