const { logger } = require('../utils/logger');

// 에러 응답 포맷
const errorResponse = (res, status, message, error = null) => {
    const response = {
        success: false,
        message,
        timestamp: new Date().toISOString()
    };

    if (error && process.env.NODE_ENV === 'development') {
        response.error = {
            name: error.name,
            message: error.message,
            stack: error.stack
        };
    }

    return res.status(status).json(response);
};

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // 개발 환경에서는 상세 에러 정보 제공
    if (process.env.NODE_ENV === 'development') {
        logger.error('Error 💥', {
            error: err,
            stack: err.stack,
            path: req.path,
            method: req.method
        });

        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } 
    // 프로덕션 환경에서는 제한된 정보만 제공
    else {
        // 운영 에러인 경우에만 클라이언트에 전송
        if (err.isOperational) {
            logger.error('Operational Error 💥', {
                error: err,
                path: req.path,
                method: req.method
            });

            res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        } 
        // 프로그래밍 에러는 클라이언트에 노출하지 않음
        else {
            logger.error('Programming Error 💥', {
                error: err,
                path: req.path,
                method: req.method
            });

            res.status(500).json({
                status: 'error',
                message: 'Something went wrong'
            });
        }
    }
};

// 404 에러 핸들러
const notFoundHandler = (req, res) => {
    logger.warn('404 Not Found:', {
        path: req.path,
        method: req.method
    });

    return errorResponse(res, 404, '요청한 리소스를 찾을 수 없습니다');
};

// 비동기 에러 래퍼
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = {
    AppError,
    errorHandler,
    notFoundHandler,
    asyncHandler
}; 