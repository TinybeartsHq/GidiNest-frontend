import { useState, useCallback } from 'react';

import Link from '@mui/material/Link';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { useTheme } from '@mui/material/styles'; 
import Typography from '@mui/material/Typography';
 

export type TransactionProps = {
  id: string;  
  description: string;  
  transaction_type: 'credit' | 'debit'; 
  created_at: string; 
  wallet_account_number: number;  
  amount: number;
}

type TransactionTableRowProps = {
  row: TransactionProps;
};

export function TransactionTableRow({
  row,
}: TransactionTableRowProps) {
  const theme = useTheme();  

  const {
    description,
    transaction_type, 
    created_at,  
    wallet_account_number,
    amount
  } = row;

  const [open, setOpen] = useState(null);

  const handleOpenMenu = useCallback((event: any) => {
    setOpen(event.currentTarget);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setOpen(null);
  }, []);


  const transactionTypeColor = transaction_type === 'credit' ? theme.palette.success.main : theme.palette.error.main;

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
      return 'solar:eye-bold'; 
    }
    return 'solar:eye-bold';  
  };

  return (
    <TableRow hover>


      {/* Description & Category */}
      <TableCell sx={{ minWidth: 220 }}>
        <Link
          color="inherit"
          underline="hover"
          noWrap
          variant="body2"
          sx={{
            fontWeight: 'fontWeightMedium',
            display: 'block',  
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            maxWidth: 'calc(40ch)', 
          }}
          title={description}  
        >
          {description}
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
          {new Date(created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {new Date(created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
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
