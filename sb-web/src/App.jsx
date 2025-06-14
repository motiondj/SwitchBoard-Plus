import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Header from './components/common/Header';
import Dashboard from './components/dashboard/Dashboard';
import Toast from './components/common/Toast';
import { connectSocket } from './store/middleware/socketMiddleware';
// import { fetchClients } from './store/slices/clientsSlice';
// import { fetchPresets } from './store/slices/presetsSlice';
// import { fetchGroups } from './store/slices/groupsSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Socket 연결 초기화
    dispatch(connectSocket());

    // 초기 데이터 로드 (샘플 데이터만 사용)
    // dispatch(fetchClients());
    // dispatch(fetchPresets());
    // dispatch(fetchGroups());

    // 컴포넌트 언마운트 시 정리
    return () => {
      dispatch({ type: 'socket/disconnect' });
    };
  }, [dispatch]);

  return (
    <div>
      <Header />
      <div className="container">
        <Dashboard />
      </div>
      <Toast />
    </div>
  );
}

export default App; 