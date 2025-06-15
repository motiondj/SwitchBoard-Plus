import { configureStore } from '@reduxjs/toolkit';
import clientsReducer from './slices/clientsSlice';
import presetsReducer from './slices/presetsSlice';
import groupReducer from './slices/groupSlice';
import uiReducer from './slices/uiSlice';
import { socketMiddleware } from './middleware/socketMiddleware';

const store = configureStore({
    reducer: {
        clients: clientsReducer,
        presets: presetsReducer,
        groups: groupReducer,
        ui: uiReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }).concat(socketMiddleware)
});

export default store; 