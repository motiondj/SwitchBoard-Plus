import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { connectSocket, disconnectSocket } from '../store/middleware/socketMiddleware';

export const useSocket = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // 컴포넌트 마운트 시 소켓 연결
    dispatch(connectSocket());

    // 컴포넌트 언마운트 시 소켓 연결 해제
    return () => {
      dispatch(disconnectSocket());
    };
  }, [dispatch]);
}; 