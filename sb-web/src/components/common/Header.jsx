import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../store/slices/uiSlice';
import { Brightness4 as DarkModeIcon, Brightness7 as LightModeIcon } from '@mui/icons-material';

const Header = () => {
    const dispatch = useDispatch();
    const isDarkMode = useSelector((state) => state.ui.isDarkMode);
    const connectedClients = useSelector((state) => 
        state.clients.items.filter(client => client.status === 'online').length
    );

    return (
        <div className="header">
            <div className="header-content">
                <h1>⚡ Switchboard Plus</h1>
                <div className="status-info">
                    <div>서버 상태: <span style={{ color: '#4CAF50' }}>● 연결됨</span></div>
                    <div>시간: <span id="current-time">{new Date().toLocaleTimeString('ko-KR')}</span></div>
                    <div>연결된 클라이언트: {connectedClients}</div>
                    <button 
                        className="btn btn-secondary btn-small"
                        onClick={() => dispatch(toggleTheme())}
                    >
                        {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Header; 