import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface SelectedItemsState {
	selectedItems: any[];
}

const initialState: SelectedItemsState = {
	selectedItems: [],
};

const combinationsSlice = createSlice({
	name: "combinations",
	initialState,
	reducers: {
		addSelectedItems: (state, action: PayloadAction<any[]>) => {
			state.selectedItems = [...state.selectedItems, ...action.payload];
		},
		removeSelectedItem: (state, action: PayloadAction<string>) => {
			state.selectedItems = state.selectedItems.filter(
				(item) => item.id !== action.payload
			);
		},
	},
});

export const {addSelectedItems, removeSelectedItem} = combinationsSlice.actions;
export default combinationsSlice.reducer;
