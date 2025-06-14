import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    loading: false,
    error: null
};

const groupSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {
        setGroups: (state, action) => {
            state.items = action.payload;
        },
        addGroup: (state, action) => {
            state.items.push(action.payload);
        },
        updateGroup: (state, action) => {
            const index = state.items.findIndex(g => g.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        deleteGroup: (state, action) => {
            state.items = state.items.filter(g => g.id !== action.payload);
        }
    }
});

export const { setGroups, addGroup, updateGroup, deleteGroup } = groupSlice.actions;
export default groupSlice.reducer; 