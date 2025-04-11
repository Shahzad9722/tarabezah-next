import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  filters: Record<string, any>;
}

const initialState: FilterState = {
  filters: {
    floorPlanId: '',
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
