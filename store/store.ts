import {configureStore} from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import elementsReducer from './features/elements/elementsSlice';
import combinationsReducer from './features/combinations/combinationsSlice';
import combinationFilterReducer from './features/combination-filters/combinationFilterSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    elements: elementsReducer,
    combinations: combinationsReducer,
    combinationFilter: combinationFilterReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;