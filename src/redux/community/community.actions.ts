// src/redux/community/community.actions.ts

import type { Dispatch } from 'redux';

import apiClient from '../../utils/apiClient'; // Import the configured apiClient
import {
    CREATE_POST_REQUEST,
    CREATE_POST_SUCCESS,
    CREATE_POST_FAILURE,
    ADD_COMMENT_REQUEST,
    ADD_COMMENT_SUCCESS,
    ADD_COMMENT_FAILURE,
    CLEAR_COMMUNITY_ERROR,
    // New action types for single post fetch
    FETCH_SINGLE_POST_REQUEST,
    FETCH_SINGLE_POST_SUCCESS,
    FETCH_SINGLE_POST_FAILURE,
    FETCH_COMMUNITY_FEED_REQUEST,
    FETCH_COMMUNITY_FEED_SUCCESS,
    FETCH_COMMUNITY_FEED_FAILURE,
} from './community.types';

// --- Action Creators ---

// Action to fetch the community feed
export const fetchCommunityFeed = () => async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_COMMUNITY_FEED_REQUEST });
    try {
        const response = await apiClient.get('community/posts'); // Assuming this fetches all posts for the feed
        dispatch({
            type: FETCH_COMMUNITY_FEED_SUCCESS,
            payload: response.data.data, // Assuming response.data contains the feed array
        });
    } catch (error: any) {
        dispatch({
            type: FETCH_COMMUNITY_FEED_FAILURE,
            payload: error.response?.data?.message || error.message || 'Failed to fetch community feed',
        });
    }
};

// Action to fetch a single post by ID
export const fetchSinglePost = (postId: string) => async (dispatch: Dispatch) => {
    dispatch({ type: FETCH_SINGLE_POST_REQUEST });
    try {
        const response = await apiClient.get(`community/posts/${postId}`); // API endpoint for a single post
        dispatch({
            type: FETCH_SINGLE_POST_SUCCESS,
            payload: response.data, // Assuming response.data contains the single post object
        });
        return { success: true, post: response.data }; // Return success and data for component use
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || `Failed to fetch post ${postId}`;
        dispatch({
            type: FETCH_SINGLE_POST_FAILURE,
            payload: errorMessage,
        });
        return { success: false, error: errorMessage }; // Return error for component use
    }
};


// Action to create a new post
export const createPost = (postData: { title: string; content: string; userId: string }) => async (dispatch: Dispatch) => {
    dispatch({ type: CREATE_POST_REQUEST });
    try {
        const response = await apiClient.post('community/posts', postData);
        dispatch({
            type: CREATE_POST_SUCCESS,
            payload: response.data, // Assuming response.data contains the newly created post
        });
        return { success: true, post: response.data };
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to create post';
        dispatch({
            type: CREATE_POST_FAILURE,
            payload: errorMessage,
        });
        return { success: false, error: errorMessage };
    }
};

// Action to add a comment to a post
export const addComment = (postId: string, commentData: { content: string; }) => async (dispatch: Dispatch) => {
    dispatch({ type: ADD_COMMENT_REQUEST });
    try {
        const response = await apiClient.post(`community/posts/${postId}/comments`, commentData);
        dispatch({
            type: ADD_COMMENT_SUCCESS,
            payload: { postId, comment: response.data }, // Assuming response.data is the new comment
        });
        return { success: true, comment: response.data };
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to add comment';
        dispatch({
            type: ADD_COMMENT_FAILURE,
            payload: errorMessage,
        });
        return { success: false, error: errorMessage };
    }
};

// Action to clear any community-related error messages
export const clearCommunityError = () => ({
    type: CLEAR_COMMUNITY_ERROR,
});

// You can add more actions for updating, deleting posts/comments, liking, joining groups, etc.