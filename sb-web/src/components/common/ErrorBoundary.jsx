import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { showToast } from '../../store/slices/uiSlice';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({
            error,
            errorInfo
        });

        // 에러 로깅
        console.error('Error Boundary caught an error:', error, errorInfo);

        // onError 콜백 호출
        if (this.props.onError) {
            this.props.onError(error);
        }
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        minHeight: '400px',
                        p: 3,
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h5" color="error" gutterBottom>
                        오류가 발생했습니다
                    </Typography>
                    <Typography variant="body1" color="text.secondary" paragraph>
                        죄송합니다. 예기치 않은 오류가 발생했습니다.
                    </Typography>
                    {import.meta.env.MODE === 'development' && (
                        <Box
                            sx={{
                                mt: 2,
                                p: 2,
                                bgcolor: 'grey.100',
                                borderRadius: 1,
                                maxWidth: '100%',
                                overflow: 'auto'
                            }}
                        >
                            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
                                {this.state.error && this.state.error.toString()}
                            </Typography>
                            <Typography variant="body2" component="pre" sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </Typography>
                        </Box>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => window.location.reload()}
                        sx={{ mt: 3 }}
                    >
                        페이지 새로고침
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
}

// 에러 바운더리 래퍼 컴포넌트
export const ErrorBoundaryWrapper = ({ children }) => {
    const dispatch = useDispatch();

    const handleError = (error) => {
        dispatch(showToast({
            message: '오류가 발생했습니다. 페이지를 새로고침해주세요.',
            severity: 'error'
        }));
    };

    return (
        <ErrorBoundary onError={handleError}>
            {children}
        </ErrorBoundary>
    );
};

export default ErrorBoundary; 