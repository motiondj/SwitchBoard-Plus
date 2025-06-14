module.exports = {
  // Server Configuration
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',

  // Database Configuration
  database: {
    path: process.env.DB_PATH || './database.sqlite',
    dialect: 'sqlite',
    logging: false
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    file: process.env.LOG_FILE || './logs/server.log'
  },

  // Client Configuration
  client: {
    heartbeatInterval: parseInt(process.env.CLIENT_HEARTBEAT_INTERVAL) || 5000,
    timeout: parseInt(process.env.CLIENT_TIMEOUT) || 15000
  },

  // UDP Configuration
  udp: {
    port: parseInt(process.env.UDP_PORT) || 9999,
    broadcastAddress: process.env.UDP_BROADCAST_ADDRESS || '255.255.255.255'
  }
}; 