import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import type { FeeBreakdownData } from '../../hooks/use-fee-preview';

interface FeeBreakdownProps {
  feeData: FeeBreakdownData | null;
  loading: boolean;
  error: string | null;
  /** Label for the net amount row, e.g. "Recipient gets" or "You receive" */
  netAmountLabel?: string;
}

const FEE_LABEL_MAP: Record<string, string> = {
  fee: 'Transfer Fee',
  transfer_fee: 'Transfer Fee',
  vat: 'VAT (7.5%)',
  emtl: 'EMTL',
  commission: 'Commission',
  platform_fee: 'Platform Fee',
  service_charge: 'Service Charge',
};

function formatNaira(value: number): string {
  return `₦${value.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function humanizeKey(key: string): string {
  return FEE_LABEL_MAP[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function FeeBreakdown({
  feeData,
  loading,
  error,
  netAmountLabel = 'Net amount',
}: FeeBreakdownProps) {
  if (loading) {
    return (
      <Box display="flex" alignItems="center" gap={1} py={1}>
        <CircularProgress size={16} />
        <Typography variant="caption" color="text.secondary">
          Calculating fees...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="warning" sx={{ py: 0.5, my: 1 }}>
        {error}
      </Alert>
    );
  }

  if (!feeData || !feeData.fee_breakdown) {
    return null;
  }

  const breakdownEntries = Object.entries(feeData.fee_breakdown).filter(
    ([, value]) => typeof value === 'number' && value > 0
  );

  if (breakdownEntries.length === 0 && feeData.total_fee === 0) {
    return (
      <Alert severity="success" sx={{ py: 0.5, my: 1 }}>
        No fees apply to this transaction.
      </Alert>
    );
  }

  return (
    <Box
      sx={{
        bgcolor: 'grey.50',
        borderRadius: 1,
        p: 1.5,
        my: 1,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Fee Breakdown
      </Typography>

      <Stack spacing={0.5}>
        {breakdownEntries.map(([key, value]) => (
          <Box key={key} display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              {humanizeKey(key)}
            </Typography>
            <Typography variant="body2">{formatNaira(value as number)}</Typography>
          </Box>
        ))}

        {feeData.total_fee > 0 && breakdownEntries.length > 1 && (
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" fontWeight={600}>
              Total Fees
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {formatNaira(feeData.total_fee)}
            </Typography>
          </Box>
        )}
      </Stack>

      <Divider sx={{ my: 1 }} />

      <Box display="flex" justifyContent="space-between">
        <Typography variant="subtitle2" color="success.main">
          {netAmountLabel}
        </Typography>
        <Typography variant="subtitle2" color="success.main">
          {formatNaira(feeData.net_amount)}
        </Typography>
      </Box>
    </Box>
  );
}
