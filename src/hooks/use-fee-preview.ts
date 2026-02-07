import { useState, useEffect, useRef } from 'react';

import apiClientV2 from '../utils/apiClientV2';

export type FeeType = 'transfer' | 'deposit' | 'payment_link';

export interface FeeBreakdownData {
  fee_breakdown: Record<string, number>;
  net_amount: number;
  total_fee: number;
  [key: string]: any;
}

export function useFeePreview(amount: number, type: FeeType) {
  const [feeData, setFeeData] = useState<FeeBreakdownData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear previous timer
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    // Reset when amount is invalid
    if (!amount || amount <= 0 || isNaN(amount)) {
      setFeeData(null);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Debounce the API call by 500ms
    timerRef.current = setTimeout(async () => {
      try {
        const response = await apiClientV2.get('/wallet/9psb/fees/preview', {
          params: { amount, type },
        });

        const data = response.data?.data || response.data;

        // Compute total_fee from fee_breakdown if not provided
        let totalFee = data.total_fee;
        if (totalFee === undefined && data.fee_breakdown) {
          totalFee = Object.values(data.fee_breakdown).reduce(
            (sum: number, val: any) => sum + (typeof val === 'number' ? val : 0),
            0
          );
        }

        setFeeData({
          ...data,
          total_fee: totalFee ?? 0,
        });
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          'Unable to fetch fee preview';
        setError(msg);
        setFeeData(null);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [amount, type]);

  return { feeData, loading, error };
}
