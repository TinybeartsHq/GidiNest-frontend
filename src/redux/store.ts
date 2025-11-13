// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit'; // Import configureStore

import rootReducer from './rootReducer';

const store = configureStore({
    reducer: rootReducer, // configureStore takes a reducer object
    // middleware is automatically set up with Redux Thunk by default.
    // You can add custom middleware here if needed:
    // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(myCustomMiddleware),
    devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools Extension in development
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;