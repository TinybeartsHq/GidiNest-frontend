// src/redux/auth/auth.reducer.js
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
    FINALIZE_SIGNUP_REQUEST,
    FINALIZE_SIGNUP_SUCCESS,
    FINALIZE_SIGNUP_FAILURE,
} from './auth.types';

const initialState = {
    token: localStorage.getItem('accessToken') || null,
    isAuthenticated: !!localStorage.getItem('accessToken'),
    user: null,
    loading: false,
    error: null,
    registrationMessage: null, // Message after initial registration step
    otpVerified: false,        // Status after OTP verification
    signupFinalized: false,    // Status after final signup step
    // tempUserId: null,         // If your backend returns a temporary ID for the user session during signup
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
        case REGISTER_REQUEST:
        case VERIFY_OTP_REQUEST:
        case FINALIZE_SIGNUP_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
                // Clear specific messages/statuses when a new flow starts
                registrationMessage: null,
                otpVerified: false,
                signupFinalized: false,
            };

        case LOGIN_SUCCESS:
            return {
                ...state,
                token: action.payload.token,
                isAuthenticated: true,
                user: action.payload.user,
                loading: false,
                error: null,
                registrationMessage: null,
                otpVerified: false,
                signupFinalized: false,
            };

        case REGISTER_SUCCESS:
            return {
                ...state,
                loading: false,
                registrationMessage: action.payload, // Store the success message from registration
                error: null,
                // tempUserId: action.payload.user_id || null, // If backend returns temporary user ID
            };

        case VERIFY_OTP_SUCCESS:
            return {
                ...state,
                loading: false,
                otpVerified: true,
                registrationMessage: action.payload, // Can update message here too
                error: null,
            };

        case FINALIZE_SIGNUP_SUCCESS:
            return {
                ...state,
                token: action.payload.user ? state.token : null, // Token should be set from localStorage in action
                isAuthenticated: true, // Set isAuthenticated to true upon finalization
                user: action.payload.user, // User data on finalization
                loading: false,
                error: null,
                registrationMessage: action.payload.message, // Store the success message from finalization
                otpVerified: true, // Remains true
                signupFinalized: true, // Set true on completion
            };

        case LOGIN_FAILURE:
        case REGISTER_FAILURE:
        case VERIFY_OTP_FAILURE:
        case FINALIZE_SIGNUP_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
                // Reset specific statuses if flow failed
                otpVerified: action.type === VERIFY_OTP_FAILURE ? false : state.otpVerified,
                signupFinalized: action.type === FINALIZE_SIGNUP_FAILURE ? false : state.signupFinalized,
            };

        case LOGOUT:
            return {
                ...initialState, // Reset to initial state
                token: null,
                isAuthenticated: false,
            };

        case SET_AUTHENTICATED:
            return {
                ...state,
                isAuthenticated: action.payload,
            };

        case CLEAR_AUTH_ERROR:
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
};

export default authReducer;