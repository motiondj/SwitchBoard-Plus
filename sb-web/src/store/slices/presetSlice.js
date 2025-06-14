import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    loading: false,
    error: null
};

const presetSlice = createSlice({
    name: 'presets',
    initialState,
    reducers: {
        setPresets: (state, action) => {
            state.items = action.payload;
        },
        executePreset: (state, action) => {
            const preset = state.items.find(p => p.id === action.payload);
            if (preset) {
                preset.status = 'active';
            }
        },
        stopPreset: (state, action) => {
            const preset = state.items.find(p => p.id === action.payload);
            if (preset) {
                preset.status = 'inactive';
            }
        },
        addPreset: (state, action) => {
            state.items.push(action.payload);
        },
        updatePreset: (state, action) => {
            const index = state.items.findIndex(p => p.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        },
        deletePreset: (state, action) => {
            state.items = state.items.filter(p => p.id !== action.payload);
        }
    }
});

export const { 
    setPresets, 
    executePreset, 
    stopPreset, 
    addPreset, 
    updatePreset, 
    deletePreset 
} = presetSlice.actions;

export default presetSlice.reducer; 