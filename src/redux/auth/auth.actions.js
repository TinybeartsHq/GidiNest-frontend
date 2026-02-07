// src/redux/auth/auth.actions.js
import apiClient from '../../utils/apiClient';
import {
    LOGOUT,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    REGISTER_REQUEST,
    REGISTER_SUCCESS,
    REGISTER_FAILURE,
    CLEAR_AUTH_ERROR,
    SET_AUTHENTICATED,
    VERIFY_OTP_REQUEST,
    VERIFY_OTP_SUCCESS,
    VERIFY_OTP_FAILURE,
    REQUEST_OTP_REQUEST,
    REQUEST_OTP_SUCCESS,
    REQUEST_OTP_FAILURE,
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAILURE,
    FINALIZE_SIGNUP_REQUEST,
    FINALIZE_SIGNUP_SUCCESS,
    FINALIZE_SIGNUP_FAILURE,
    VERIFY_RESET_OTP_REQUEST,
    VERIFY_RESET_OTP_SUCCESS,
    VERIFY_RESET_OTP_FAILURE,
} from './auth.types';

// --- Login Actions (Existing) ---
export const loginRequest = () => ({ type: LOGIN_REQUEST });
export const loginSuccess = (userData, token) => ({
    type: LOGIN_SUCCESS,
    payload: { user: userData, token },
});
export const loginFailure = (error) => ({ type: LOGIN_FAILURE, payload: error });
export const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return { type: LOGOUT };
};

export const loginUser = (credentials) => async (dispatch) => {
    dispatch(loginRequest());
    try {
        const response = await apiClient.post('onboarding/login', credentials);
      
        const user = response.data.data.user
        const refresh = response.data.data.token.refresh
        const access = response.data.data.token.access

        localStorage.setItem('accessToken', access);
        localStorage.setItem('user', JSON.stringify(user));
        if (refresh) {
            localStorage.setItem('refreshToken', refresh);
        }
        dispatch(loginSuccess(user, access));
        return true;
    } catch (error) {
        const errorMessage = error.response?.data?.detail || error.message || 'Login failed';
        dispatch(loginFailure(errorMessage));
        return false;
    }
};

export const checkAuthStatus = () => (dispatch) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        dispatch({ type: SET_AUTHENTICATED, payload: true });
    } else {
        dispatch({ type: SET_AUTHENTICATED, payload: false });
    }
};

export const clearAuthError = () => ({ type: CLEAR_AUTH_ERROR });

// --- New Registration Flow Actions ---

// Initiate Registration (Step 1: User provides email, name, password)
export const registerUser = (userData) => async (dispatch) => {
    dispatch({ type: REGISTER_REQUEST });
    try {
        const response = await apiClient.post('onboarding/register/initiate', userData);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: response.data.message || 'Registration initiated successfully. Check your email for OTP.',
        });
        return { success: true, data: response.data };
    } catch (error) {
        let errorMessage = 'Failed to send OTP. Please try again.';
        
        if (error.response) {
            // Server responded with error status
            const responseData = error.response.data;
            
            // Handle validation errors (422)
            if (error.response.status === 422 && responseData.errors) {
                // Format validation errors into a readable message
                const validationErrors = Object.entries(responseData.errors)
                    .map(([field, messages]) => {
                        const fieldName = field.replace(/_/g, ' ');
                        const messageList = Array.isArray(messages) ? messages.join(', ') : messages;
                        return `${fieldName}: ${messageList}`;
                    })
                    .join('; ');
                
                errorMessage = validationErrors || responseData.detail || responseData.message || 'Validation failed. Please check your input.';
            } else {
                errorMessage = responseData?.detail 
                    || responseData?.message 
                    || responseData?.error 
                    || `Server error: ${error.response.status}`;
            }
        } else if (error.request) {
            // Request made but no response received (network error, timeout, etc.)
            if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                errorMessage = 'Request timed out. Please check your internet connection and try again.';
            } else {
                errorMessage = 'Network error: Unable to reach the server. Please check your internet connection.';
            }
        } else {
            // Something else happened
            errorMessage = error.message || 'An unexpected error occurred. Please try again.';
        }

        dispatch({ type: REGISTER_FAILURE, payload: errorMessage });
        return { success: false, error: errorMessage };
    }
};

// Verify OTP (Step 2: User provides OTP and email/user_id)
export const verifyOtp = (otpData) => async (dispatch) => {
    dispatch({ type: VERIFY_OTP_REQUEST });
    try {
        const response = await apiClient.post('onboarding/register/verify-otp', otpData);
        dispatch({
            type: VERIFY_OTP_SUCCESS,
            payload: response.data.message || 'OTP verified successfully. Proceed to finalize signup.',
        });
        return { success: true, data: response.data };
    } catch (error) {
        let errorMessage = 'OTP verification failed. Please check the code and try again.';
        
        if (error.response) {
            // Server responded with error status
            const status = error.response.status;
            const data = error.response.data;
            
            if (status === 400 || status === 422) {
                // Bad request - likely invalid OTP
                errorMessage = data?.detail 
                    || data?.message 
                    || data?.error 
                    || 'Invalid OTP code. Please check and try again.';
            } else if (status === 404) {
                errorMessage = 'Session not found. Please restart registration.';
            } else if (status === 410) {
                errorMessage = 'OTP has expired. Please request a new code.';
            } else {
                errorMessage = data?.detail 
                    || data?.message 
                    || data?.error 
                    || `Server error: ${status}`;
            }
        } else if (error.request) {
            // Request made but no response received
            if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                errorMessage = 'Request timed out. Please check your internet connection and try again.';
            } else {
                errorMessage = 'Network error: Unable to reach the server. Please check your internet connection.';
            }
        } else {
            // Something else happened
            errorMessage = error.message || 'An unexpected error occurred. Please try again.';
        }

        dispatch({ type: VERIFY_OTP_FAILURE, payload: errorMessage });
        return { success: false, error: errorMessage };
    }
};


export const activateUserByEmail = (emailData) => async (dispatch) => {
    dispatch({ type: VERIFY_OTP_REQUEST });
    try {
        const response = await apiClient.post('onboarding/register/email/activation', emailData);
        // Assuming API returns a temporary token or confirms email activation success
        dispatch({
            type: VERIFY_OTP_SUCCESS,
            payload: response.data.message || 'Email Activated successfully. Proceed to finalize login.',
        });
        return { success: true, data: response.data };
    } catch (error) {
        const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.response?.data?.error || error.message || 'Email Activation failed.';
        dispatch({ type: VERIFY_OTP_FAILURE, payload: errorMessage });
        return { success: false, error: errorMessage };
    }
};






// Finalize Signup (Step 3: User provides remaining details if any, and potentially temporary token from OTP)
export const finalizeSignup = (finalData) => async (dispatch) => {
    dispatch({ type: FINALIZE_SIGNUP_REQUEST });
    try {
        const response = await apiClient.post('onboarding/register/complete', finalData);

        const user = response.data.data.user
        const refresh = response.data.data.token.refresh

        localStorage.setItem('accessToken', response.data.data.token.access);
        if (refresh) {
            localStorage.setItem('refreshToken', response.data.data.token.refresh);
        }
        dispatch({
            type: FINALIZE_SIGNUP_SUCCESS,
            payload: { user, message: response.data.message || 'Signup completed successfully.' },
        });
        dispatch({ type: SET_AUTHENTICATED, payload: true });
        return { success: true, data: response.data };
    } catch (error) {
        let errorMessage = 'Failed to complete registration. Please try again.';
        
        if (error.response) {
            const responseData = error.response.data;
            const status = error.response.status;
            
            // Check if response is HTML (server error page)
            if (typeof responseData === 'string' && responseData.includes('<!doctype html>')) {
                errorMessage = `Server error (${status}): The server encountered an internal error. Please check that all required fields are filled correctly and try again. If the problem persists, please contact support.`;
            } else if (typeof responseData === 'object' && responseData !== null) {
                // Handle validation errors (422)
                if (status === 422 && responseData.errors) {
                    const validationErrors = Object.entries(responseData.errors)
                        .map(([field, messages]) => {
                            const fieldName = field.replace(/_/g, ' ');
                            const messageList = Array.isArray(messages) ? messages.join(', ') : messages;
                            return `${fieldName}: ${messageList}`;
                        })
                        .join('; ');
                    
                    errorMessage = validationErrors || responseData.detail || responseData.message || 'Validation failed. Please check your input.';
                } else {
                    // Try to extract error message from various possible fields
                    errorMessage = responseData?.detail 
                        || responseData?.message 
                        || responseData?.error 
                        || responseData?.error_message
                        || `Server error: ${status}`;
                }
            } else {
                errorMessage = `Server error (${status}): Please try again or contact support if the problem persists.`;
            }
        } else if (error.request) {
            // Request made but no response received
            if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                errorMessage = 'Request timed out. Please check your internet connection and try again.';
            } else {
                errorMessage = 'Network error: Unable to reach the server. Please check your internet connection.';
            }
        } else {
            // Something else happened
            errorMessage = error.message || 'An unexpected error occurred. Please try again.';
        }

        dispatch({ type: FINALIZE_SIGNUP_FAILURE, payload: errorMessage });
        return { success: false, error: errorMessage };
    }
};

// --- Password Reset Actions ---

// Request OTP (Step 1: User provides email to receive OTP)
export const requestPasswordResetOtp = (emailData) => async (dispatch) => {
    dispatch({ type: REQUEST_OTP_REQUEST });
    try {
        const response = await apiClient.post('onboarding/request-otp', emailData);
        dispatch({
            type: REQUEST_OTP_SUCCESS,
            payload: response.data.message || 'OTP sent successfully. Check your email.',
        });
        return { success: true, data: response.data };
    } catch (error) {
        let errorMessage = 'Failed to send OTP. Please try again.';
        
        if (error.response) {
            errorMessage = error.response?.data?.detail 
                || error.response?.data?.message 
                || error.response?.data?.error 
                || `Server error: ${error.response.status}`;
        } else if (error.request) {
            if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                errorMessage = 'Request timed out. Please check your internet connection and try again.';
            } else {
                errorMessage = 'Network error: Unable to reach the server. Please check your internet connection.';
            }
        } else {
            errorMessage = error.message || 'An unexpected error occurred. Please try again.';
        }

        dispatch({ type: REQUEST_OTP_FAILURE, payload: errorMessage });
        return { success: false, error: errorMessage };
    }
};

// Verify Reset OTP (Step 2: User provides email and OTP)
export const verifyPasswordResetOtp = (otpData) => async (dispatch) => {
    dispatch({ type: VERIFY_RESET_OTP_REQUEST });
    try {
        const response = await apiClient.post('onboarding/verify-otp', otpData);
        dispatch({
            type: VERIFY_RESET_OTP_SUCCESS,
            payload: response.data.message || 'OTP verified successfully.',
        });
        return { success: true, data: response.data };
    } catch (error) {
        let errorMessage = 'OTP verification failed. Please check the code and try again.';
        
        if (error.response) {
            const status = error.response.status;
            const data = error.response.data;
            
            if (status === 400 || status === 422) {
                errorMessage = data?.detail 
                    || data?.message 
                    || data?.error 
                    || 'Invalid OTP code. Please check and try again.';
            } else if (status === 404) {
                errorMessage = 'Session not found. Please request a new OTP.';
            } else if (status === 410) {
                errorMessage = 'OTP has expired. Please request a new code.';
            } else {
                errorMessage = data?.detail 
                    || data?.message 
                    || data?.error 
                    || `Server error: ${status}`;
            }
        } else if (error.request) {
            if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                errorMessage = 'Request timed out. Please check your internet connection and try again.';
            } else {
                errorMessage = 'Network error: Unable to reach the server. Please check your internet connection.';
            }
        } else {
            errorMessage = error.message || 'An unexpected error occurred. Please try again.';
        }

        dispatch({ type: VERIFY_RESET_OTP_FAILURE, payload: errorMessage });
        return { success: false, error: errorMessage };
    }
};

// Reset Password (Step 3: User provides email, OTP, and new password)
export const resetPassword = (resetData) => async (dispatch) => {
    dispatch({ type: RESET_PASSWORD_REQUEST });
    try {
        const response = await apiClient.post('onboarding/reset-password', resetData);
        dispatch({
            type: RESET_PASSWORD_SUCCESS,
            payload: response.data.message || 'Password reset successfully.',
        });
        return { success: true, data: response.data };
    } catch (error) {
        let errorMessage = 'Password reset failed. Please try again.';
        
        if (error.response) {
            errorMessage = error.response?.data?.detail 
                || error.response?.data?.message 
                || error.response?.data?.error 
                || `Server error: ${error.response.status}`;
        } else if (error.request) {
            if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                errorMessage = 'Request timed out. Please check your internet connection and try again.';
            } else {
                errorMessage = 'Network error: Unable to reach the server. Please check your internet connection.';
            }
        } else {
            errorMessage = error.message || 'An unexpected error occurred. Please try again.';
        }

        dispatch({ type: RESET_PASSWORD_FAILURE, payload: errorMessage });
        return { success: false, error: errorMessage };
    }
};