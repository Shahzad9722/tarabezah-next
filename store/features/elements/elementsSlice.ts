import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchElements = createAsyncThunk('elements/fetchAll', async (_, {rejectWithValue}) => {
  try {
    const config = {
      method: 'post',
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/v1/ElementService/GetAll`,
      headers: {},
      data: '',
    };

    const response = await axios.request(config);
    return response.data as unknown as any[];
  } catch (error: any) {
    return rejectWithValue(error.response?.data || 'Failed to fetch elements');
  }
});

const elementsSlice = createSlice({
  name: 'elements',
  initialState: {
    items: [] as any[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchElements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchElements.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchElements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default elementsSlice.reducer;
