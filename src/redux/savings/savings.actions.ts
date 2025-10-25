import apiClient from '../../utils/apiClient'; // Import the configured apiClient
import {
    CLEAR_SAVINGS_ERROR, // To clear errors
    INITIATE_DEPOSIT_REQUEST,
    INITIATE_DEPOSIT_SUCCESS,
    INITIATE_DEPOSIT_FAILURE,
    GET_SAVINGS_GOALS_REQUEST,
    GET_SAVINGS_GOALS_SUCCESS,
    GET_SAVINGS_GOALS_FAILURE,
    // Add new action types for SavingsView
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

    GET_WALLET_REQUEST,
    GET_WALLET_SUCCESS,
    GET_WALLET_FAILURE,

    INITIATE_WALLET_WITHDRAWAL_REQUEST,
    INITIATE_WALLET_WITHDRAWAL_SUCCESS,
    INITIATE_WALLET_WITHDRAWAL_FAILURE,
    DELETE_SAVINGS_GOAL_REQUEST,
    DELETE_SAVINGS_GOAL_SUCCESS,
    DELETE_SAVINGS_GOAL_FAILURE,

    GET_SAVINGS_RECENT_TRANSACTIONS_REQUEST,
    GET_SAVINGS_RECENT_TRANSACTIONS_SUCCESS,
    GET_SAVINGS_RECENT_TRANSACTIONS_FAILURE,   


} from './savings.types';

// Action to get dashboard analytics
export const getDashboardAnalytics = () => async (dispatch: (arg0: { type: string; payload?: any; }) => void) => {
    dispatch({ type: GET_DASHBOARD_ANALYTICS_REQUEST });
    try {
        const response = await apiClient.get('savings/dashboard-analytics'); // Use apiClient
        if (response.data.status) {
            dispatch({
                type: GET_DASHBOARD_ANALYTICS_SUCCESS,
                payload: response.data.data,
            });
        } else {
            dispatch({
                type: GET_DASHBOARD_ANALYTICS_FAILURE,
                payload: response.data.message || 'Failed to fetch dashboard analytics.',
            });
        }
    } catch (error:any) {
        console.error('Error fetching dashboard analytics:', error.response ? error.response.data : error.message);
        dispatch({
            type: GET_DASHBOARD_ANALYTICS_FAILURE,
            payload: error.response?.data?.detail || error.message || 'Network Error',
        });
    }
};

// Action to get all savings goals
export const getSavingsGoals = () => async (dispatch: (arg0: { type: string; payload?: any; }) => void) => {
    dispatch({ type: GET_SAVINGS_GOALS_REQUEST });
    try {
        const response = await apiClient.get('savings/goals'); // Use apiClient
        if (response.data.status) {
            dispatch({
                type: GET_SAVINGS_GOALS_SUCCESS,
                payload: response.data.data,
            });
        } else {
            dispatch({
                type: GET_SAVINGS_GOALS_FAILURE,
                payload: response.data.message || 'Failed to fetch savings goals.',
            });
        }
    } catch (error:any) {
        console.error('Error fetching savings goals:', error.response ? error.response.data : error.message);
        dispatch({
            type: GET_SAVINGS_GOALS_FAILURE,
            payload: error.response?.data?.detail || error.message || 'Network Error',
        });
    }
};


export const deleteSavingsGoals = (goal_id: any) => async (dispatch: (arg0: { type: string; payload?: any; }) => void) => {
    dispatch({ type: DELETE_SAVINGS_GOAL_REQUEST });
    try {
        const response = await apiClient.delete(`savings/goals/${goal_id}`); // Use apiClient
        console.log(response)
        if (response.data.status) {
            dispatch({
                type: DELETE_SAVINGS_GOAL_SUCCESS,
                payload: goal_id,
            });
            return { success: true };
        } else {
            dispatch({
                type: DELETE_SAVINGS_GOAL_FAILURE,
                payload: response.data.message || 'Failed to delete savings goals.',
            });
            return { success: false, error: response.data.message };
        }
    } catch (error: any) {
        dispatch({
            type: DELETE_SAVINGS_GOAL_FAILURE,
            payload: error.response?.data?.detail || error.message || 'Network Error',
        });
        return { success: false, error: error.response?.data?.detail || error.message || 'Network Error', };
    }
};


// Action to get all wallet info
export const getWallet = () => async (dispatch: (arg0: { type: string; payload?: any; }) => void) => {
    dispatch({ type: GET_WALLET_REQUEST });
    try {
        const response = await apiClient.get('wallet/balance'); // Use apiClient
        if (response.data.status) {
            dispatch({
                type: GET_WALLET_SUCCESS,
                payload: response.data.data,
            });
        } else {
            dispatch({
                type: GET_WALLET_FAILURE,
                payload: response.data.message || 'Failed to fetch savings goals.',
            });
        }
    } catch (error: any) {
        console.error('Error fetching wallet:', error.response ? error.response.data : error.message);
        dispatch({
            type: GET_WALLET_FAILURE,
            payload: error.response?.data?.detail || error.message || 'Network Error',
        });
    }
};

// Action to get savings summary
export const getSavingsSummary = () => async (dispatch: (arg0: { type: string; payload?: any; }) => void) => {
    dispatch({ type: GET_SAVINGS_SUMMARY_REQUEST });
    try {
        const response = await apiClient.get('savings/summary'); // Example endpoint
        if (response.data.status) {
            dispatch({
                type: GET_SAVINGS_SUMMARY_SUCCESS,
                payload: response.data.data,
            });
        } else {
            dispatch({
                type: GET_SAVINGS_SUMMARY_FAILURE,
                payload: response.data.message || 'Failed to fetch savings summary.',
            });
        }
    } catch (error:any) {
        console.error('Error fetching savings summary:', error.response ? error.response.data : error.message);
        dispatch({
            type: GET_SAVINGS_SUMMARY_FAILURE,
            payload: error.response?.data?.detail || error.message || 'Network Error',
        });
    }
};

// Action to get recent transactions
export const getRecentTransactions = (page?: any, rowsPerPage?: any, orderBy?: string, order?: string, filterName?: string) => async (dispatch: (arg0: { type: string; payload?: any; }) => void) => {
    dispatch({ type: GET_RECENT_TRANSACTIONS_REQUEST });
    try {
        const response = await apiClient.get('wallet/history'); // Example endpoint
        if (response.data.status) {
            dispatch({
                type: GET_RECENT_TRANSACTIONS_SUCCESS,
                payload: response.data.data.transactions,
            });
        } else {
            dispatch({
                type: GET_RECENT_TRANSACTIONS_FAILURE,
                payload: response.data.message || 'Failed to fetch recent transactions.',
            });
        }
    } catch (error:any) {
        console.error('Error fetching recent transactions:', error.response ? error.response.data : error.message);
        dispatch({
            type: GET_RECENT_TRANSACTIONS_FAILURE,
            payload: error.response?.data?.detail || error.message || 'Network Error',
        });
    }
};


export const getRecentSavingTransactions = (page?: any, rowsPerPage?: any, orderBy?: string, order?: string, filterName?: string) => async (dispatch: (arg0: { type: string; payload?: any; }) => void) => {
    dispatch({ type: GET_SAVINGS_RECENT_TRANSACTIONS_REQUEST });
    try {
        const response = await apiClient.get('savings/history/all'); // Example endpoint
        if (response.data.status) {
            dispatch({
                type: GET_SAVINGS_RECENT_TRANSACTIONS_SUCCESS,
                payload: response.data.data,
            });
        } else {
            dispatch({
                type: GET_SAVINGS_RECENT_TRANSACTIONS_FAILURE,
                payload: response.data.message || 'Failed to fetch recent transactions.',
            });
        }
    } catch (error: any) {
        console.error('Error fetching recent transactions:', error.response ? error.response.data : error.message);
        dispatch({
            type: GET_SAVINGS_RECENT_TRANSACTIONS_FAILURE,
            payload: error.response?.data?.detail || error.message || 'Network Error',
        });
    }
};


// Action to create a savings goal
export const createSavingsGoal = (goalData: any) => async (dispatch: (arg0: { type: string; payload?: any; }) => void) => {
    dispatch({ type: CREATE_SAVINGS_GOAL_REQUEST });
    try {
        const response = await apiClient.post('savings/goals', goalData); // Example endpoint
        if (response.data.status) {
            dispatch({
                type: CREATE_SAVINGS_GOAL_SUCCESS,
                payload: response.data.data, // Expect the newly created goal back
            });
            return { success: true }; // Indicate success for UI handling
        } else {
            dispatch({
                type: CREATE_SAVINGS_GOAL_FAILURE,
                payload: response.data.message || 'Failed to create savings goal.',
            });
            return { success: false, error: response.data.message }; // Indicate failure
        }
    } catch (error:any) {
        console.error('Error creating savings goal:', error.response ? error.response.data : error.message);
        dispatch({
            type: CREATE_SAVINGS_GOAL_FAILURE,
            payload: error.response?.data?.detail || error.message || 'Network Error',
        });
        return { success: false, error: error.response?.data?.detail || error.message || 'Network Error' };
    }
};

// Action to initiate deposit
export const initiateDeposit = (depositData: any) => async (dispatch: (arg0: { type: string; payload?: any; }) => void) => {
    dispatch({ type: INITIATE_DEPOSIT_REQUEST });
    try {
        // For Paystack, this would typically trigger the payment popup client-side.
        // If your backend needs to record the initiation or provide a payment link for bank transfers,
        // you'd make an API call here.
        // Example if backend returns a payment URL for Paystack checkout:
        // const response = await apiClient.post('payments/initiate-deposit', depositData);
        // if (response.data.status && response.data.data.paymentUrl) {
        //   window.open(response.data.data.paymentUrl, '_blank'); // Open Paystack checkout
        //   dispatch({ type: INITIATE_DEPOSIT_SUCCESS });
        // } else {
        //   dispatch({
        //     type: INITIATE_DEPOSIT_FAILURE,
        //     payload: response.data.message || 'Failed to initiate deposit.',
        //   });
        // }

        // For this implementation, we'll assume the Paystack logic is handled entirely client-side
        // by usePaystackPayment hook, and we only dispatch success when it completes.
        // The actual wallet funding will happen via backend webhooks from Paystack.
        dispatch({ type: INITIATE_DEPOSIT_SUCCESS });
        return { success: true };
    } catch (error:any) {
        console.error('Error initiating deposit:', error.response ? error.response.data : error.message);
        dispatch({
            type: INITIATE_DEPOSIT_FAILURE,
            payload: error.response?.data?.detail || error.message || 'Network Error',
        });
        return { success: false, error: error.response?.data?.detail || error.message || 'Network Error' };
    }
};

// Action to initiate withdrawal
export const initiateWithdrawal = (withdrawalData: any) => async (dispatch: (arg0: { type: string; payload?: any; }) => void) => {
    dispatch({ type: INITIATE_WITHDRAWAL_REQUEST });
    try {
        const response = await apiClient.post('savings/goals/contribute-withdraw', withdrawalData); // Example endpoint
        if (response.data.status) {
            dispatch({
                type: INITIATE_WITHDRAWAL_SUCCESS,
                payload: response.data.data, // Maybe a transaction reference
            });
            return { success: true };
        } else {
            dispatch({
                type: INITIATE_WITHDRAWAL_FAILURE,
                payload: response.data.message || 'Failed to initiate withdrawal.',
            });
            return { success: false, error: response.data.message };
        }
    } catch (error:any) {
        console.error('Error initiating withdrawal:', error.response ? error.response.data : error.message);
        dispatch({
            type: INITIATE_WITHDRAWAL_FAILURE,
            payload: error.response?.data?.detail || error.message || 'Network Error',
        });
        return { success: false, error: error.response?.data?.detail || error.message || 'Network Error' };
    }
};


// Action to initiate withdrawal
export const initiateWalletWithdrawal = (withdrawalData: any) => async (dispatch: (arg0: { type: string; payload?: any; }) => void) => {
    dispatch({ type: INITIATE_WALLET_WITHDRAWAL_REQUEST });
    try {
        const response = await apiClient.post('wallet/withdraw/request', withdrawalData); // Example endpoint

        if (response.data.status) {
            dispatch({
                type: INITIATE_WALLET_WITHDRAWAL_SUCCESS,
                payload: response.data.data,
            });

            return { success: true };

        } else {

            dispatch({
                type: INITIATE_WALLET_WITHDRAWAL_FAILURE,
                payload: response.data.message || 'Failed to initiate withdrawal.',
            });

            return { success: false, error: response.data.message };
        }
    }catch (error: any) {
        console.error('Error initiating withdrawal:', error.response ? error.response.data : error.message);
        dispatch({
            type: INITIATE_WALLET_WITHDRAWAL_FAILURE,
            payload: error.response?.data?.detail || error.message || 'Network Error',
        });
        return { success: false, error: error.response?.data?.detail || error.message || 'Network Error' };
    }
};



// Action to validate account
export const validateAccountNumber = (accountData: any) => async (dispatch: (arg0: { type: string; payload?: any; }) => void) => {
    dispatch({ type: INITIATE_WALLET_WITHDRAWAL_REQUEST });
    try {
        const response = await apiClient.post('wallet/resolve-bank-account', accountData); // Example endpoint

        if (response.data.status) {
            dispatch({
                type: INITIATE_WALLET_WITHDRAWAL_SUCCESS,
                payload: response.data.data,
            });

            return { success: true, data: response.data };

        } else {

            dispatch({
                type: INITIATE_WALLET_WITHDRAWAL_FAILURE,
                payload: response.data.detail || 'Failed to validating account.',
            });

            return { success: false, error: response.data.message };
        }
    } catch (error: any) {
        console.error('Error validating account:', error.response ? error.response.data : error.message);
        dispatch({
            type: INITIATE_WALLET_WITHDRAWAL_FAILURE,
            payload: error.response?.data?.detail || error.message || 'Network Error',
        });
        return { success: false, error: error.response?.data?.detail || error.message || 'Network Error' };
    }
};


 