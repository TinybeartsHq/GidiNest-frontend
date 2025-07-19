import type { AnyAction } from 'redux';
// src/redux/types.ts
import type { ThunkAction, ThunkDispatch } from 'redux-thunk';

import type rootReducer from './rootReducer'; // Adjust path as necessary

// Define your RootState type by inferring it from your rootReducer
export type RootState = ReturnType<typeof rootReducer>;

// Define your AppDispatch type for dispatching Thunks
// It says: ThunkDispatch can dispatch AnyAction (plain objects) and also ThunkActions
// ThunkAction<ReturnType, State, ExtraThunkArg, BasicAction>
export type AppDispatch = ThunkDispatch<RootState, undefined, AnyAction>;

// Define your AppThunk type for creating Thunks
// This helps in typing the action creator functions themselves
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    undefined,
    AnyAction
>;