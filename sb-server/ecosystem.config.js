module.exports = {
  apps: [{
    name: 'switchboard-plus-server',
    script: 'src/server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development',
      PORT: 3001,
      DB_PATH: './data/switchboard.db',
      LOG_LEVEL: 'debug'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3001,
      DB_PATH: './data/switchboard.db',
      LOG_LEVEL: 'info'
    }
  }]
}; 