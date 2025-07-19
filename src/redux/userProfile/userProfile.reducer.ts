// src/redux/userProfile/userProfile.reducer.ts

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
    UPDATE_USER_PROFILE_FAILURE


} from './userProfile.types';

import type { UserProfileData } from './userProfile.actions';

export interface UserProfileState {
    profile: UserProfileData | null;
    loading: boolean;
    error: string | null;
    updating: boolean; // For showing a separate loader during update
}

const initialState: UserProfileState = {
    profile: null,
    loading: false,
    error: null,
    updating: false,
};

const userProfileReducer = (state = initialState, action: any): UserProfileState => {
    switch (action.type) {
        case FETCH_USER_PROFILE_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_USER_PROFILE_SUCCESS:
            return {
                ...state,
                loading: false,
                profile: action.payload,
                error: null,
            };
        case FETCH_USER_PROFILE_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case UPDATE_USER_PROFILE_REQUEST:
            return {
                ...state,
                updating: true,
                error: null,
            };
        case UPDATE_USER_PROFILE_SUCCESS:
            return {
                ...state,
                updating: false,
                error: null,
            };
        case UPDATE_USER_PROFILE_FAILURE:
            return {
                ...state,
                updating: false,
                error: action.payload,
            };
        case UPDATE_BVN_REQUEST:
            return {
                ...state,
                updating: true,
                error: null,
            };
        case UPDATE_BVN_SUCCESS:
            return {
                ...state,
                updating: false,
                error: null,
            };
        case UPDATE_BVN_FAILURE:
            return {
                ...state,
                updating: false,
                error: action.payload,
            };

        case CLEAR_USER_PROFILE_ERROR:
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
};

export default userProfileReducer;