// src/redux/rootReducer.js
import { combineReducers } from 'redux';

import authReducer from './auth/auth.reducer';
// import walletReducer from './wallet/wallet.reducer';
import savingsReducer from './savings/savings.reducer';
import communityReducer from './community/community.reducer';
import userProfileReducer from './userProfile/userProfile.reducer';

const rootReducer = combineReducers({
    auth: authReducer,
    savings: savingsReducer,
    community: communityReducer,
    profile: userProfileReducer
    // wallet: walletReducer,
    // Add other feature reducers here
});

export default rootReducer;