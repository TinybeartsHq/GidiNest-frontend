import { createSlice } from '@reduxjs/toolkit';

import {
  createGoalLink,
  createEventLink,
  updatePaymentLink,
  deletePaymentLink,
  fetchMyPaymentLinks,
  fetchPublicPaymentLink,
  togglePaymentLinkStatus,
  fetchPaymentLinkAnalytics,
} from './paymentLink.actions';

import type { PaymentLinkState } from './paymentLink.types';

const initialState: PaymentLinkState = {
  paymentLinks: [],
  currentLink: null,
  analytics: null,
  loading: false,
  error: null,
  createLinkSuccess: false,
  updateLinkSuccess: false,
};

const paymentLinkSlice = createSlice({
  name: 'paymentLink',
  initialState,
  reducers: {
    clearCurrentLink: (state) => {
      state.currentLink = null;
      state.analytics = null;
      state.error = null;
    },
    clearCreateSuccess: (state) => {
      state.createLinkSuccess = false;
    },
    clearUpdateSuccess: (state) => {
      state.updateLinkSuccess = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch my payment links
    builder
      .addCase(fetchMyPaymentLinks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyPaymentLinks.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentLinks = action.payload;
      })
      .addCase(fetchMyPaymentLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch public payment link
    builder
      .addCase(fetchPublicPaymentLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicPaymentLink.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLink = action.payload;
      })
      .addCase(fetchPublicPaymentLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch analytics
    builder
      .addCase(fetchPaymentLinkAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaymentLinkAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(fetchPaymentLinkAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create goal link
    builder
      .addCase(createGoalLink.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createLinkSuccess = false;
      })
      .addCase(createGoalLink.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentLinks.unshift(action.payload);
        state.currentLink = action.payload;
        state.createLinkSuccess = true;
      })
      .addCase(createGoalLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.createLinkSuccess = false;
      });

    // Create event link
    builder
      .addCase(createEventLink.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createLinkSuccess = false;
      })
      .addCase(createEventLink.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentLinks.unshift(action.payload);
        state.currentLink = action.payload;
        state.createLinkSuccess = true;
      })
      .addCase(createEventLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.createLinkSuccess = false;
      });

    // Update payment link
    builder
      .addCase(updatePaymentLink.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateLinkSuccess = false;
      })
      .addCase(updatePaymentLink.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.paymentLinks.findIndex(
          (link) => link.token === action.payload.token
        );
        if (index !== -1) {
          state.paymentLinks[index] = action.payload;
        }
        if (state.currentLink?.token === action.payload.token) {
          state.currentLink = action.payload;
        }
        state.updateLinkSuccess = true;
      })
      .addCase(updatePaymentLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.updateLinkSuccess = false;
      });

    // Delete payment link
    builder
      .addCase(deletePaymentLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePaymentLink.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentLinks = state.paymentLinks.filter(
          (link) => link.token !== action.payload
        );
        if (state.currentLink?.token === action.payload) {
          state.currentLink = null;
        }
      })
      .addCase(deletePaymentLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Toggle status
    builder
      .addCase(togglePaymentLinkStatus.pending, (state) => {
        state.error = null;
      })
      .addCase(togglePaymentLinkStatus.fulfilled, (state, action) => {
        const index = state.paymentLinks.findIndex(
          (link) => link.token === action.payload.token
        );
        if (index !== -1) {
          state.paymentLinks[index] = action.payload;
        }
        if (state.currentLink?.token === action.payload.token) {
          state.currentLink = action.payload;
        }
      })
      .addCase(togglePaymentLinkStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {
  clearCurrentLink,
  clearCreateSuccess,
  clearUpdateSuccess,
  clearError,
} = paymentLinkSlice.actions;

export default paymentLinkSlice.reducer;
