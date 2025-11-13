import { createAsyncThunk } from '@reduxjs/toolkit';

import apiClientV2 from '../../utils/apiClientV2';

import type {
  PaymentLink,
  PaymentLinkAnalytics,
  CreateGoalLinkRequest,
  CreateEventLinkRequest,
  UpdatePaymentLinkRequest,
} from './paymentLink.types';

// Fetch all payment links for the current user
export const fetchMyPaymentLinks = createAsyncThunk(
  'paymentLink/fetchMyLinks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClientV2.get('/wallet/payment-links/my-links');
      return response.data.data as PaymentLink[];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch payment links'
      );
    }
  }
);

// Fetch public payment link details (no auth required)
export const fetchPublicPaymentLink = createAsyncThunk(
  'paymentLink/fetchPublicLink',
  async (token: string, { rejectWithValue }) => {
    try {
      // Build the full URL
      const baseURL = apiClientV2.defaults.baseURL || '/api/v2/';
      const url = baseURL.startsWith('http')
        ? `${baseURL}wallet/payment-links/${token}/`
        : `${window.location.origin}${baseURL}wallet/payment-links/${token}/`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Payment link not found');
      }

      const data = await response.json();
      return data.data as PaymentLink;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Failed to fetch payment link'
      );
    }
  }
);

// Fetch payment link analytics
export const fetchPaymentLinkAnalytics = createAsyncThunk(
  'paymentLink/fetchAnalytics',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await apiClientV2.get(
        `/wallet/payment-links/${token}/analytics`
      );
      return response.data.data as PaymentLinkAnalytics;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch analytics'
      );
    }
  }
);

// Create goal-based payment link
export const createGoalLink = createAsyncThunk(
  'paymentLink/createGoalLink',
  async (data: CreateGoalLinkRequest, { rejectWithValue }) => {
    try {
      const response = await apiClientV2.post(
        '/wallet/payment-links/create-goal-link',
        data
      );
      return response.data.data as PaymentLink;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create goal link'
      );
    }
  }
);

// Create event-based payment link
export const createEventLink = createAsyncThunk(
  'paymentLink/createEventLink',
  async (data: CreateEventLinkRequest, { rejectWithValue }) => {
    try {
      const response = await apiClientV2.post(
        '/wallet/payment-links/create-event-link',
        data
      );
      return response.data.data as PaymentLink;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create event link'
      );
    }
  }
);

// Update payment link
export const updatePaymentLink = createAsyncThunk(
  'paymentLink/updateLink',
  async (
    { token, data }: { token: string; data: UpdatePaymentLinkRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClientV2.patch(
        `/wallet/payment-links/${token}/update`,
        data
      );
      return response.data.data as PaymentLink;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update payment link'
      );
    }
  }
);

// Delete payment link
export const deletePaymentLink = createAsyncThunk(
  'paymentLink/deleteLink',
  async (token: string, { rejectWithValue }) => {
    try {
      await apiClientV2.delete(`/wallet/payment-links/${token}/delete`);
      return token;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete payment link'
      );
    }
  }
);

// Toggle payment link status (activate/deactivate)
export const togglePaymentLinkStatus = createAsyncThunk(
  'paymentLink/toggleStatus',
  async (
    { token, isActive }: { token: string; isActive: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClientV2.patch(
        `/wallet/payment-links/${token}/update`,
        { is_active: isActive }
      );
      return response.data.data as PaymentLink;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to toggle link status'
      );
    }
  }
);
