import os
import logging
from logging.handlers import RotatingFileHandler
from typing import Optional

def setup_logger(
    name: str = 'switchboard',
    log_dir: str = 'logs',
    level: int = logging.INFO,
    max_bytes: int = 10 * 1024 * 1024,  # 10MB
    backup_count: int = 5
) -> logging.Logger:
    """로거 설정

    Args:
        name: 로거 이름
        log_dir: 로그 파일 디렉토리
        level: 로깅 레벨
        max_bytes: 로그 파일 최대 크기
        backup_count: 백업 파일 개수

    Returns:
        logging.Logger: 설정된 로거
    """
    # 로그 디렉토리 생성
    if not os.path.exists(log_dir):
        os.makedirs(log_dir)

    # 로거 생성
    logger = logging.getLogger(name)
    logger.setLevel(level)

    # 이미 핸들러가 있다면 제거
    if logger.handlers:
        logger.handlers.clear()

    # 파일 핸들러 설정
    log_file = os.path.join(log_dir, f'{name}.log')
    file_handler = RotatingFileHandler(
        log_file,
        maxBytes=max_bytes,
        backupCount=backup_count,
        encoding='utf-8'
    )
    file_handler.setLevel(level)

    # 콘솔 핸들러 설정
    console_handler = logging.StreamHandler()
    console_handler.setLevel(level)

    # 포맷터 설정
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    file_handler.setFormatter(formatter)
    console_handler.setFormatter(formatter)

    # 핸들러 추가
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)

    return logger

def get_logger(name: str = 'switchboard') -> logging.Logger:
    """로거 가져오기

    Args:
        name: 로거 이름

    Returns:
        logging.Logger: 로거
    """
    return logging.getLogger(name) 