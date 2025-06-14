module.exports = {
  database: {
    dialect: 'sqlite',
    storage: './switchboard.sqlite',
    logging: true
  },
  server: {
    port: 3000,
    host: '0.0.0.0'
  },
  udp: {
    port: 9999,
    broadcast: true
  }
}; 