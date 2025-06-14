import { configureStore } from '@reduxjs/toolkit';
import clientReducer from './slices/clientSlice';
import presetReducer from './slices/presetSlice';
import groupReducer from './slices/groupSlice';
import uiReducer from './slices/uiSlice';
import { socketMiddleware } from './middleware/socketMiddleware';

const store = configureStore({
    reducer: {
        clients: clientReducer,
        presets: presetReducer,
        groups: groupReducer,
        ui: uiReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }).concat(socketMiddleware)
});

export default store; 