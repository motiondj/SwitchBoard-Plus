import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    loading: false,
    error: null
};

const clientSlice = createSlice({
    name: 'clients',
    initialState,
    reducers: {
        setClients: (state, action) => {
            state.items = action.payload;
        },
        refreshClients: (state) => {
            state.loading = true;
        },
        refreshClientsSuccess: (state, action) => {
            state.items = action.payload;
            state.loading = false;
            state.error = null;
        },
        refreshClientsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const { setClients, refreshClients, refreshClientsSuccess, refreshClientsFailure } = clientSlice.actions;
export default clientSlice.reducer; 