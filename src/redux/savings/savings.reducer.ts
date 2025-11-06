// src/redux/savings/savings.reducer.js
import {
    GET_WALLET_REQUEST,
    GET_WALLET_SUCCESS,
    GET_WALLET_FAILURE,
    CLEAR_SAVINGS_ERROR,
    INITIATE_DEPOSIT_REQUEST,
    INITIATE_DEPOSIT_SUCCESS,
    INITIATE_DEPOSIT_FAILURE,
    GET_SAVINGS_GOALS_REQUEST,
    GET_SAVINGS_GOALS_SUCCESS,
    GET_SAVINGS_GOALS_FAILURE,
    // New types for SavingsView
    GET_SAVINGS_SUMMARY_REQUEST,
    GET_SAVINGS_SUMMARY_SUCCESS,
    GET_SAVINGS_SUMMARY_FAILURE,
    CREATE_SAVINGS_GOAL_REQUEST,
    CREATE_SAVINGS_GOAL_SUCCESS,
    CREATE_SAVINGS_GOAL_FAILURE,
    INITIATE_WITHDRAWAL_REQUEST,
    INITIATE_WITHDRAWAL_SUCCESS,
    INITIATE_WITHDRAWAL_FAILURE,
    GET_DASHBOARD_ANALYTICS_REQUEST,
    GET_DASHBOARD_ANALYTICS_SUCCESS,
    GET_DASHBOARD_ANALYTICS_FAILURE,

    GET_RECENT_TRANSACTIONS_REQUEST,
    GET_RECENT_TRANSACTIONS_SUCCESS,
    GET_RECENT_TRANSACTIONS_FAILURE,


    INITIATE_WALLET_WITHDRAWAL_SUCCESS,
    INITIATE_WALLET_WITHDRAWAL_REQUEST,
    INITIATE_WALLET_WITHDRAWAL_FAILURE,

    DELETE_SAVINGS_GOAL_REQUEST,
    DELETE_SAVINGS_GOAL_SUCCESS,
    DELETE_SAVINGS_GOAL_FAILURE,
 


    GET_SAVINGS_RECENT_TRANSACTIONS_REQUEST,
    GET_SAVINGS_RECENT_TRANSACTIONS_SUCCESS,
    GET_SAVINGS_RECENT_TRANSACTIONS_FAILURE,

    GET_BANKS_REQUEST,
    GET_BANKS_SUCCESS,
    GET_BANKS_FAILURE,

    SET_TRANSACTION_PIN_REQUEST,
    SET_TRANSACTION_PIN_SUCCESS,
    SET_TRANSACTION_PIN_FAILURE,
    VERIFY_TRANSACTION_PIN_REQUEST,
    VERIFY_TRANSACTION_PIN_SUCCESS,
    VERIFY_TRANSACTION_PIN_FAILURE,

} from './savings.types';

const initialState = {
    dashboardAnalytics: null,
    savingsGoals: [], // Renamed for clarity to avoid conflict with `goals` in SavingsView
    summary: null, // New: For total balance, etc.
    goals: [],     // New: For individual savings goals in SavingsView
    transactions: [],
    savings_transactions: [],
    banks: [],     // New: For list of banks from API
    loading: false,
    error: null,
};

const savingsReducer = (state = initialState, action: { type: any; payload: any; }) => {
    switch (action.type) {
        // Dashboard Analytics
        case GET_DASHBOARD_ANALYTICS_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_DASHBOARD_ANALYTICS_SUCCESS:
            return { ...state, loading: false, dashboardAnalytics: action.payload };
        case GET_DASHBOARD_ANALYTICS_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // Savings Goals (from Dashboard, keep if needed)
        case GET_SAVINGS_GOALS_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_SAVINGS_GOALS_SUCCESS:
            return { ...state, loading: false, savingsGoals: action.payload, goals: action.payload }; // Update both
        case GET_SAVINGS_GOALS_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // --- New Reducer Cases for SavingsView ---
        case GET_SAVINGS_SUMMARY_REQUEST:
        case GET_RECENT_TRANSACTIONS_REQUEST:
        case GET_SAVINGS_RECENT_TRANSACTIONS_REQUEST:
        case CREATE_SAVINGS_GOAL_REQUEST:
        case INITIATE_DEPOSIT_REQUEST:
        case INITIATE_WITHDRAWAL_REQUEST:
        case INITIATE_WALLET_WITHDRAWAL_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_WALLET_REQUEST:
            return { ...state, error: null };
        case GET_SAVINGS_SUMMARY_SUCCESS:
            return { ...state, loading: false, summary: action.payload };
        case GET_RECENT_TRANSACTIONS_SUCCESS:
            return { ...state, loading: false, transactions: action.payload };
        case GET_SAVINGS_RECENT_TRANSACTIONS_SUCCESS:
            return { ...state, loading: false, savings_transactions: action.payload };
        case CREATE_SAVINGS_GOAL_SUCCESS:
            return { ...state, loading: false, goals: [...state.goals, action.payload] }; // Add new goal to array
        case GET_WALLET_SUCCESS:
            return { ...state, loading: false, wallet: action.payload };
        case INITIATE_DEPOSIT_SUCCESS:
        case INITIATE_WITHDRAWAL_SUCCESS:
        case INITIATE_WALLET_WITHDRAWAL_SUCCESS:
            return { ...state, loading: false };
        case GET_SAVINGS_SUMMARY_FAILURE:
        case GET_RECENT_TRANSACTIONS_FAILURE:
        case GET_SAVINGS_RECENT_TRANSACTIONS_FAILURE:
        case CREATE_SAVINGS_GOAL_FAILURE:
        case INITIATE_DEPOSIT_FAILURE:
        case INITIATE_WITHDRAWAL_FAILURE:
        case INITIATE_WALLET_WITHDRAWAL_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case GET_WALLET_FAILURE:
            return { ...state, error: action.payload };
        
        case DELETE_SAVINGS_GOAL_REQUEST:
            return { ...state, loading: true, error: null };
        case DELETE_SAVINGS_GOAL_SUCCESS:
            return {
                ...state,
                loading: false,
                goals: state.goals.filter((goal: { id: any; }) => goal.id !== action.payload), // Remove deleted goal
            };
        case DELETE_SAVINGS_GOAL_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // Banks
        case GET_BANKS_REQUEST:
            return { ...state, loading: true, error: null };
        case GET_BANKS_SUCCESS:
            return { ...state, loading: false, banks: action.payload };
        case GET_BANKS_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // Transaction PIN
        case SET_TRANSACTION_PIN_REQUEST:
        case VERIFY_TRANSACTION_PIN_REQUEST:
            return { ...state, loading: true, error: null };
        case SET_TRANSACTION_PIN_SUCCESS:
        case VERIFY_TRANSACTION_PIN_SUCCESS:
            return { ...state, loading: false };
        case SET_TRANSACTION_PIN_FAILURE:
        case VERIFY_TRANSACTION_PIN_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case CLEAR_SAVINGS_ERROR:
            return { ...state, error: null };

        default:
            return state;
    }
};

export default savingsReducer;