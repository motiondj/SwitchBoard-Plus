import { io } from 'socket.io-client';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { showToast } from '../slices/uiSlice';
import {
    clientAdded,
    clientUpdated,
    metricsUpdated,
    clientDisconnected
} from '../slices/clientsSlice';

let socket = null;

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

export const connectSocket = createAsyncThunk(
    'socket/connect',
    async (_, { dispatch }) => {
        if (socket) {
            socket.disconnect();
        }

        socket = io(SOCKET_URL, {
            transports: ['polling', 'websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            timeout: 20000,
            autoConnect: true
        });

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
            dispatch(showToast({
                message: '서버에 연결되었습니다.',
                severity: 'success'
            }));
        });

        socket.on('connect_error', (error) => {
            console.error('Socket connection error:', error);
            dispatch(showToast({
                message: '서버 연결 중 오류가 발생했습니다.',
                severity: 'error'
            }));
        });

        socket.on('error', (error) => {
            console.error('Socket error:', error);
            dispatch(showToast({
                message: '소켓 통신 중 오류가 발생했습니다.',
                severity: 'error'
            }));
        });

        socket.on('disconnect', (reason) => {
            console.log('Socket disconnected:', reason);
            dispatch(showToast({
                message: '서버와의 연결이 끊어졌습니다.',
                severity: 'warning'
            }));
        });

        socket.on('client:status', (data) => {
            console.log('[WebSocket] 클라이언트 상태 업데이트 이벤트 수신:', data);
            dispatch(clientUpdated(data));
        });

        socket.on('client:metrics', (data) => {
            console.log('Received client metrics update:', data);
            dispatch(metricsUpdated(data));
        });

        socket.on('client:registered', (data) => {
            console.log('[WebSocket] 클라이언트 등록 이벤트 수신:', data);
            dispatch(clientAdded(data));
            dispatch(showToast({
                message: `새로운 클라이언트가 등록되었습니다: ${data.name}`,
                severity: 'info'
            }));
        });

        socket.on('preset:status', (data) => {
            console.log('[WebSocket] 프리셋 상태 업데이트 이벤트 수신:', data);
            dispatch({ type: 'presets/updateStatus', payload: data });
        });

        socket.on('execution:result', (data) => {
            console.log('[WebSocket] 실행 결과 이벤트 수신:', data);
            dispatch({ type: 'presets/updateExecutionResult', payload: data });
        });

        socket.on('client:disconnected', (data) => {
            console.log('Client disconnected:', data);
            dispatch(clientDisconnected(data.uuid));
            dispatch(showToast({
                message: `클라이언트 연결이 끊어졌습니다: ${data.name}`,
                severity: 'warning'
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