module.exports = {
  server: {
    port: 4000,
    host: '0.0.0.0'
  },
  database: {
    dialect: 'sqlite',
    storage: './switchboard.sqlite',
    logging: true
  },
  udp: {
    port: 9999,
    broadcast: true
  }
}; 