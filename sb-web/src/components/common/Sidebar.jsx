import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Divider,
    Box
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Computer as ComputerIcon,
    PlaylistPlay as PresetIcon,
    Group as GroupIcon,
    Settings as SettingsIcon
} from '@mui/icons-material';

const menuItems = [
    { text: '대시보드', icon: <DashboardIcon />, path: '/' },
    { text: '클라이언트', icon: <ComputerIcon />, path: '/clients' },
    { text: '프리셋', icon: <PresetIcon />, path: '/presets' },
    { text: '그룹', icon: <GroupIcon />, path: '/groups' },
    { text: '설정', icon: <SettingsIcon />, path: '/settings' }
];

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 240,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 240,
                    boxSizing: 'border-box',
                    mt: 8,
                    bgcolor: 'background.paper'
                }
            }}
        >
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton
                                selected={location.pathname === item.path}
                                onClick={() => navigate(item.path)}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
                <Divider />
            </Box>
        </Drawer>
    );
}

export default Sidebar; 