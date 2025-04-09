import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '@/services/api';

// Define the AuthState interface
interface AuthState {
  user: any;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// Helper function to safely access localStorage
const getLocalStorageItem = (key: string): string | null => {
  return typeof window !== 'undefined' ? localStorage.getItem(key) : null;
};

// Initialize state
const initialState: AuthState = {
  user: null,
  token: getLocalStorageItem('authToken') || '',
  loading: false,
  error: null
};

// Define the login async thunk
export const login = createAsyncThunk<
  { user: any; token: string }, // Success return type
  { username: string; password: string }, // Arguments type
  { rejectValue: string } // Error return type
>(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const data:any = await authService.login(credentials);
      return { user: data.user, token: data.token };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

// Create authSlice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
        localStorage.removeItem('isAuthenticated');
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ user: any; token: string }>) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        if (typeof window !== 'undefined') {
          localStorage.setItem('authToken', action.payload.token);
          localStorage.setItem('isAuthenticated', 'true');
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });
  }
});

// Export actions and reducer
export const { logout } = authSlice.actions;
export default authSlice.reducer;
