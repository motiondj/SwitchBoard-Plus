import os
import json
import logging
from pathlib import Path

class Config:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.config = self._load_default_config()
        self.config_path = self._get_config_path()
        self._load_config()

    def _get_config_path(self):
        # 사용자 홈 디렉토리에 설정 파일 저장
        home = Path.home()
        config_dir = home / '.switchboard-plus'
        config_dir.mkdir(exist_ok=True)
        return config_dir / 'config.json'

    def _load_default_config(self):
        return {
            'server': {
                'host': 'localhost',
                'port': 3000,
                'heartbeat_interval': 5  # 초
            },
            'process': {
                'command': 'nDisplay.exe',
                'working_dir': os.getcwd(),
                'environment': {
                    'DISPLAY_CONFIG': 'config.xml'
                }
            },
            'logging': {
                'level': 'INFO',
                'file': 'switchboard-plus.log',
                'max_size': 1024 * 1024,  # 1MB
                'backup_count': 5
            }
        }

    def _load_config(self):
        try:
            if self.config_path.exists():
                with open(self.config_path, 'r', encoding='utf-8') as f:
                    loaded_config = json.load(f)
                    self._update_config(loaded_config)
                self.logger.info("설정 파일을 로드했습니다.")
            else:
                self.save()
                self.logger.info("기본 설정 파일을 생성했습니다.")
        except Exception as e:
            self.logger.error(f"설정 파일 로드 실패: {str(e)}")

    def _update_config(self, new_config):
        def update_dict(d, u):
            for k, v in u.items():
                if isinstance(v, dict) and k in d and isinstance(d[k], dict):
                    update_dict(d[k], v)
                else:
                    d[k] = v

        update_dict(self.config, new_config)

    def save(self):
        try:
            with open(self.config_path, 'w', encoding='utf-8') as f:
                json.dump(self.config, f, indent=4, ensure_ascii=False)
            self.logger.info("설정 파일을 저장했습니다.")
            return True
        except Exception as e:
            self.logger.error(f"설정 파일 저장 실패: {str(e)}")
            return False

    def get(self, key, default=None):
        keys = key.split('.')
        value = self.config
        for k in keys:
            if isinstance(value, dict):
                value = value.get(k)
            else:
                return default
        return value if value is not None else default

    def set(self, key, value):
        keys = key.split('.')
        config = self.config
        for k in keys[:-1]:
            if k not in config:
                config[k] = {}
            config = config[k]
        config[keys[-1]] = value
        return self.save()

    def get_all(self):
        return self.config.copy() 