import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  filters: Record<string, any>;
}

const initialState: FilterState = {
  filters: {
    floorPlanId: 'd4f9a1b2-c03e-4f5a-8b67-9a0e7f2c3d45',
  },
};

const combinationFilterSlice = createSlice({
  name: 'combinationFilters',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Record<string, any>>) => {
      state.filters = action.payload;
    },
  },
});

export const { setFilters } = combinationFilterSlice.actions;
export default combinationFilterSlice.reducer;
