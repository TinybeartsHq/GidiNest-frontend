// src/redux/userProfile/userProfile.actions.ts

import type { Dispatch } from 'redux';

import apiClient from '../../utils/apiClient'; // Assuming you have an Axios instance for API calls
import {
    UPDATE_BVN_REQUEST,
    UPDATE_BVN_SUCCESS,
    UPDATE_BVN_FAILURE,
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
    phone_number: string;
    bvn: string;
    account_tier: 'Basic' | 'Standard' | 'Premium';
    dob: string; // YYYY-MM-DD format usually
    is_verified: boolean;
    
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
        const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch user profile';
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



export const clearUserProfileError = () => ({
    type: CLEAR_USER_PROFILE_ERROR,
});