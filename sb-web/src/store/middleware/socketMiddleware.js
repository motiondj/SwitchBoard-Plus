import { io } from 'socket.io-client';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { showToast } from '../slices/uiSlice';
import {
    clientAdded,
    clientUpdated,
    metricsUpdated
} from '../slices/clientsSlice';

let socket = null;

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

export const connectSocket = createAsyncThunk(
    'socket/connect',
    async (_, { dispatch }) => {
        if (socket) {
            socket.disconnect();
        }

        socket = io(SOCKET_URL);

        socket.on('connect', () => {
            console.log('Socket connected');
            dispatch(showToast({
                message: '서버에 연결되었습니다.',
                severity: 'success'
            }));
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            dispatch(showToast({
                message: '서버와의 연결이 끊어졌습니다.',
                severity: 'error'
            }));
        });

        socket.on('client:status', (data) => {
            dispatch(clientUpdated(data));
        });

        socket.on('client:metrics', (data) => {
            dispatch(metricsUpdated(data));
        });

        socket.on('client:registered', (data) => {
            dispatch(clientAdded(data));
            dispatch(showToast({
                message: `새로운 클라이언트가 등록되었습니다: ${data.name}`,
                severity: 'info'
            }));
        });

        socket.on('preset:status', (data) => {
            dispatch({ type: 'presets/updateStatus', payload: data });
        });

        socket.on('execution:result', (data) => {
            dispatch({ type: 'presets/updateExecutionResult', payload: data });
        });

        socket.on('client:disconnected', (clientId) => {
            dispatch(showToast({
                message: '클라이언트가 연결 해제되었습니다.',
                severity: 'warning'
            }));
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
            dispatch(showToast({
                message: '소켓 통신 중 오류가 발생했습니다.',
                severity: 'error'
            }));
        });

        return socket;
    }
);

export const socketMiddleware = () => (next) => (action) => {
    if (action.type === 'socket/disconnect' && socket) {
        socket.disconnect();
        socket = null;
    }
    return next(action);
};

export const emitCommand = (command) => {
    if (socket && socket.connected) {
        socket.emit('command', command);
    }
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
}; 