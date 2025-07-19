// src/redux/community/community.reducer.ts

import {
    CREATE_POST_REQUEST,
    CREATE_POST_SUCCESS,
    CREATE_POST_FAILURE,
    ADD_COMMENT_REQUEST,
    ADD_COMMENT_SUCCESS,
    ADD_COMMENT_FAILURE,
    CLEAR_COMMUNITY_ERROR,
    FETCH_SINGLE_POST_REQUEST,
    FETCH_SINGLE_POST_SUCCESS,
    FETCH_SINGLE_POST_FAILURE,
    FETCH_COMMUNITY_FEED_REQUEST,
    FETCH_COMMUNITY_FEED_SUCCESS,
    FETCH_COMMUNITY_FEED_FAILURE,
} from './community.types';

interface Comment {
    id: string;
    content: string;
    author: {
        id: string;
        username: string;
    };
    createdAt: string;
}

export interface Post {
    id: string;
    title: string;
    content: string; // Keep this as the main content field
    author: {
        id: string;
        name: string;
        avatarUrl?: string; // Add optional avatarUrl to match IPostItem's author structure
    };
    created_at: string;

    comments: Comment[];
    likes: string[];

    // --- Added fields to satisfy IPostItem ---
    coverUrl?: string;     // Optional, as community posts might not always have a cover
    views_count?: string;   // Optional
    description?: string;  // Can be mapped from 'content' or be a separate summary
    likes_count?: string;  // Optional
    category?: string;     // Optional
    // If IPostItem has a 'name' for author, you might need to map 'username' to 'name' or adjust IPostItem
    // --- End Added fields ---
}

export interface CommunityState {
    feed: Post[];
    selectedPost: Post | null;
    loading: boolean;
    error: string | null;
}

const initialState: CommunityState = {
    feed: [],
    selectedPost: null,
    loading: false,
    error: null,
};

const communityReducer = (state = initialState, action: any): CommunityState => {
    switch (action.type) {
        case FETCH_COMMUNITY_FEED_REQUEST:
        case FETCH_SINGLE_POST_REQUEST:
        case CREATE_POST_REQUEST:
        case ADD_COMMENT_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case FETCH_COMMUNITY_FEED_SUCCESS:
            return {
                ...state,
                loading: false,
                feed: action.payload,
            };

        case FETCH_SINGLE_POST_SUCCESS:
            return {
                ...state,
                loading: false,
                selectedPost: action.payload.data as Post,
            };

        case CREATE_POST_SUCCESS:
            return {
                ...state,
                loading: false,
                feed: [action.payload as Post, ...state.feed],
            };

        case ADD_COMMENT_SUCCESS:
            { const newComment = action.payload.comment as Comment;

            const updatedFeedWithComment = state.feed.map((post) =>
                post.id === action.payload.postId
                    ? {
                        ...post,
                        comments: [...post.comments, newComment],
                    }
                    : post
            );
 
            return {
                ...state,
                loading: false,
                feed: updatedFeedWithComment
            }; }

        case FETCH_COMMUNITY_FEED_FAILURE:
        case FETCH_SINGLE_POST_FAILURE:
        case CREATE_POST_FAILURE:
        case ADD_COMMENT_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case CLEAR_COMMUNITY_ERROR:
            return {
                ...state,
                error: null,
            };

        default:
            return state;
    }
};

export default communityReducer;