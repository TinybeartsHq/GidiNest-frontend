// src/redux/userProfile/userProfile.actions.ts

import type { Dispatch } from 'redux';

import apiClient from '../../utils/apiClient'; // Assuming you have an Axios instance for API calls
import {
    UPDATE_BVN_REQUEST,
    UPDATE_BVN_SUCCESS,
    UPDATE_BVN_FAILURE,
    UPDATE_NIN_REQUEST,
    UPDATE_NIN_SUCCESS,
    UPDATE_NIN_FAILURE,
    CLEAR_USER_PROFILE_ERROR,
    FETCH_USER_PROFILE_REQUEST,
    FETCH_USER_PROFILE_SUCCESS,
    FETCH_USER_PROFILE_FAILURE,
    UPDATE_USER_PROFILE_REQUEST,
    UPDATE_USER_PROFILE_SUCCESS,
    UPDATE_USER_PROFILE_FAILURE,
} from './userProfile.types';

// Define the shape of the user profile data that comes from your API
// This should match your backend's user profile structure
export interface UserProfileData {
    id: string;
    image: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    bvn: string;
    has_bvn?: boolean;
    account_tier: 'Basic' | 'Standard' | 'Premium' | 'Tier 1' | 'Tier 2' | 'Tier 3'; // Support both old and new tier names
    dob: string; // YYYY-MM-DD format usually
    is_verified: boolean;
    email_verified?: boolean;

    // NIN-related fields
    nin?: string;
    nin_first_name?: string;
    nin_last_name?: string;
    nin_phone?: string;
    nin_dob?: string;
    nin_gender?: string;
    nin_marital_status?: string;
    nin_nationality?: string;
    nin_residential_address?: string;
    nin_state_of_residence?: string;
    has_nin?: boolean;

    // Add any other fields your user profile might have
}

// Action to fetch a user's profile
export const fetchUserProfile = () => async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_USER_PROFILE_REQUEST });
    try {
        const response = await apiClient.get<UserProfileData>(`account/profile`); // Adjust API endpoint
        dispatch({
            type: FETCH_USER_PROFILE_SUCCESS,
            payload: response.data,
        });
        return { success: true, data: response.data };
    } catch (error: any) {
        let errorMessage = 'Failed to fetch user profile';

        if (error.response) {
            // Server responded with error status
            errorMessage = error.response?.data?.message || `Server error: ${error.response.status}`;
        } else if (error.request) {
            // Request made but no response received
            errorMessage = 'Network error: Unable to reach the server. Please check your internet connection.';
        } else {
            // Something else happened
            errorMessage = error.message || 'An unexpected error occurred';
        }

        dispatch({
            type: FETCH_USER_PROFILE_FAILURE,
            payload: errorMessage,
        });
        return { success: false, error: errorMessage };
    }
};

// Action to update a user's profile
export const updateUserProfile = ( profileData: Partial<UserProfileData>) => async (dispatch: Dispatch) => {
    dispatch({ type: UPDATE_USER_PROFILE_REQUEST });
    try {
        const response = await apiClient.put<UserProfileData>(`account/profile`, {...profileData,address:"not avaliable"}); // Adjust API endpoint
        dispatch({
            type: UPDATE_USER_PROFILE_SUCCESS,
            payload: response.data, // Payload is the updated profile
        });
    
        return { success: true, data: response.data };
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to update user profile';
        dispatch({
            type: UPDATE_USER_PROFILE_FAILURE,
            payload: errorMessage,
        });
        return { success: false, error: errorMessage };
    }
};


// Action to update a user's bvn
export const updateBVN = (bvn: string) => async (dispatch: Dispatch) => {
    dispatch({ type: UPDATE_BVN_REQUEST });
    try {
        const response = await apiClient.post<UserProfileData>(`account/bvn-update`, { bvn }); // Adjust API endpoint
        dispatch({
            type: UPDATE_BVN_SUCCESS,
            payload: response.data, // Payload is the updated profile
        });

        return { success: true, data: response.data };
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to update user bvn';
        dispatch({
            type: UPDATE_BVN_FAILURE,
            payload: errorMessage,
        });
        return { success: false, error: errorMessage };
    }
};

// Action to update a user's NIN
export const updateNIN = (ninData: { nin: string; firstname: string; lastname: string; dob: string }) => async (dispatch: Dispatch) => {
    dispatch({ type: UPDATE_NIN_REQUEST });
    try {
        const response = await apiClient.post<UserProfileData>(`account/nin-update`, ninData); // Adjust API endpoint
        dispatch({
            type: UPDATE_NIN_SUCCESS,
            payload: response.data, // Payload is the updated profile
        });

        return { success: true, data: response.data };
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to update user NIN';
        dispatch({
            type: UPDATE_NIN_FAILURE,
            payload: errorMessage,
        });
        return { success: false, error: errorMessage };
    }
};



export const clearUserProfileError = () => ({
    type: CLEAR_USER_PROFILE_ERROR,
});