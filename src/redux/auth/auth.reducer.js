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
    REQUEST_OTP_REQUEST,
    REQUEST_OTP_FAILURE,
    REQUEST_OTP_SUCCESS,
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

const initialState = {
    token: localStorage.getItem('accessToken') || null,
    isAuthenticated: !!localStorage.getItem('accessToken'),
    user: null,
    loading: false,
    error: null,
    registrationMessage: null,  
    otpVerified: false,  
    signupFinalized: false
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
        case REGISTER_REQUEST:
        case VERIFY_OTP_REQUEST:
        case FINALIZE_SIGNUP_REQUEST:
        case REQUEST_OTP_REQUEST:
        case VERIFY_RESET_OTP_REQUEST:
        case RESET_PASSWORD_REQUEST:
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
                registrationMessage: action.payload,  
                error: null,
            };

        case VERIFY_OTP_SUCCESS:
            return {
                ...state,
                loading: false,
                otpVerified: true,
                registrationMessage: action.payload, 
                error: null,
            };

        case FINALIZE_SIGNUP_SUCCESS:
            return {
                ...state,
                token: action.payload.user ? state.token : null,  
                isAuthenticated: true,  
                user: action.payload.user, 
                loading: false,
                error: null,
                registrationMessage: action.payload.message, 
                otpVerified: true, 
                signupFinalized: true, 
            };
        
        case REQUEST_OTP_SUCCESS:
        case VERIFY_RESET_OTP_SUCCESS:
        case RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                loading: false,
                error: null,
            };

        case LOGIN_FAILURE:
        case REGISTER_FAILURE:
        case VERIFY_OTP_FAILURE:
        case REQUEST_OTP_FAILURE:
        case FINALIZE_SIGNUP_FAILURE:
        case VERIFY_RESET_OTP_FAILURE:
        case RESET_PASSWORD_FAILURE:
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