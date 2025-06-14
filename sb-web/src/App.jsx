import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import { connectSocket } from './store/middleware/socketMiddleware';
import { fetchClients } from './store/slices/clientsSlice';
import { fetchPresets } from './store/slices/presetsSlice';
import { fetchGroups } from './store/slices/groupsSlice';
import { setLoading, setLoadingMessage } from './store/slices/uiSlice';
import './App.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        dispatch(setLoading(true));
        dispatch(setLoadingMessage('초기화 중...'));

        // Socket 연결 초기화
        await dispatch(connectSocket());

        // 초기 데이터 로드
        try {
          await dispatch(fetchClients()).unwrap();
        } catch (error) {
          console.error('클라이언트 데이터 로드 실패:', error);
        }

        try {
          await dispatch(fetchPresets()).unwrap();
        } catch (error) {
          console.error('프리셋 데이터 로드 실패:', error);
        }

        try {
          await dispatch(fetchGroups()).unwrap();
        } catch (error) {
          console.error('그룹 데이터 로드 실패:', error);
        }

        dispatch(setLoadingMessage(null));
        dispatch(setLoading(false));
      } catch (error) {
        console.error('초기화 중 오류 발생:', error);
        dispatch(setLoadingMessage('초기화 중 오류가 발생했습니다.'));
        dispatch(setLoading(false));
      }
    };

    initializeApp();

    // 컴포넌트 언마운트 시 정리
    return () => {
      dispatch({ type: 'socket/disconnect' });
    };
  }, [dispatch]);

  return (
    <div className="app">
      <Layout>
        <main className="main">
          <Dashboard />
        </main>
      </Layout>
    </div>
  );
}

export default App; 