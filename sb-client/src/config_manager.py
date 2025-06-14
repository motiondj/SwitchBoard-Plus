import os
import json
import logging
from typing import Dict, Any

class ConfigManager:
    def __init__(self, config_path: str = 'config.json'):
        self.config_path = config_path
        self.config = self._load_default_config()
        self._load_config()

    def _load_default_config(self) -> Dict[str, Any]:
        """기본 설정을 반환합니다."""
        return {
            'server': {
                'host': 'localhost',
                'port': 3000,
                'udp_port': 9999
            },
            'client': {
                'name': 'nDisplay Client',
                'auto_start': False,
                'log_level': 'INFO'
            },
            'unreal': {
                'engine_path': '',
                'project_path': '',
                'arguments': ''
            }
        }

    def _load_config(self) -> None:
        """설정 파일을 로드합니다."""
        try:
            if os.path.exists(self.config_path):
                with open(self.config_path, 'r', encoding='utf-8') as f:
                    loaded_config = json.load(f)
                    self.config.update(loaded_config)
            else:
                self.save_config()
        except Exception as e:
            logging.error(f'설정 파일 로드 중 오류 발생: {e}')
            self.save_config()

    def save_config(self) -> None:
        """현재 설정을 파일에 저장합니다."""
        try:
            with open(self.config_path, 'w', encoding='utf-8') as f:
                json.dump(self.config, f, indent=4, ensure_ascii=False)
        except Exception as e:
            logging.error(f'설정 파일 저장 중 오류 발생: {e}')

    def get(self, key: str, default: Any = None) -> Any:
        """설정 값을 가져옵니다."""
        keys = key.split('.')
        value = self.config
        for k in keys:
            if isinstance(value, dict):
                value = value.get(k)
            else:
                return default
            if value is None:
                return default
        return value

    def set(self, key: str, value: Any) -> None:
        """설정 값을 설정합니다."""
        keys = key.split('.')
        config = self.config
        for k in keys[:-1]:
            if k not in config:
                config[k] = {}
            config = config[k]
        config[keys[-1]] = value
        self.save_config()

    def update(self, config_dict: Dict[str, Any]) -> None:
        """여러 설정을 한 번에 업데이트합니다."""
        self.config.update(config_dict)
        self.save_config() 