import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import clientsReducer from './slices/clientsSlice';
import presetsReducer from './slices/presetsSlice';
import groupsReducer from './slices/groupsSlice';
import { socketMiddleware } from './middleware/socketMiddleware';

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        clients: clientsReducer,
        presets: presetsReducer,
        groups: groupsReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }).concat(socketMiddleware)
}); 