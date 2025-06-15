import { io } from 'socket.io-client';
import { store } from '../store';
import { clientsSlice } from '../store/slices/clientsSlice';
import { presetsSlice } from '../store/slices/presetsSlice';
import { executionsSlice } from '../store/slices/executionsSlice';
import { showToast } from '../store/slices/uiSlice';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect() {
    if (this.socket) {
      console.log('[WebSocket] 이미 연결되어 있습니다.');
      return;
    }

    console.log('[WebSocket] 연결 시도...');
    this.socket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.socket.on('connect', () => {
      console.log('[WebSocket] 연결 성공');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('[WebSocket] 연결 해제');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('[WebSocket] 연결 에러:', error);
    });

    this.socket.on('client:registered', (client) => {
      console.log('[WebSocket] 클라이언트 등록:', client);
      store.dispatch(clientsSlice.actions.upsertClient(client));
    });

    this.socket.on('client:status', (data) => {
      console.log('[WebSocket] 클라이언트 상태 업데이트:', data);
      store.dispatch(clientsSlice.actions.updateClientStatus(data));
    });

    this.socket.on('preset:status', (data) => {
      console.log('[WebSocket] 프리셋 상태 업데이트:', data);
      store.dispatch(presetsSlice.actions.updatePresetStatus(data));
    });

    this.socket.on('execution:result', (data) => {
      console.log('[WebSocket] 실행 결과:', data);
      store.dispatch(executionsSlice.actions.addExecutionResult(data));
    });
  }

  disconnect() {
    if (this.socket) {
      console.log('[WebSocket] 연결 해제 중...');
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  emit(event, data) {
    if (!this.socket || !this.isConnected) {
      console.error('[WebSocket] 연결되지 않은 상태에서 이벤트 발생 시도');
      return;
    }
    console.log(`[WebSocket] 이벤트 발생: ${event}`, data);
    this.socket.emit(event, data);
  }
}

export const socketService = new SocketService(); 