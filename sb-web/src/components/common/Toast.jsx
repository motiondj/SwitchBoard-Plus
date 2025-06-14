import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { hideToast } from '../../store/slices/uiSlice';

const Toast = () => {
    const dispatch = useDispatch();
    const { toast } = useSelector((state) => state.ui);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') return;
        dispatch(hideToast());
    };

    return (
        <Snackbar
            open={!!toast}
            autoHideDuration={6000}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert
                onClose={handleClose}
                severity={toast?.severity || 'info'}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {toast?.message}
            </Alert>
        </Snackbar>
    );
};

export default Toast; 