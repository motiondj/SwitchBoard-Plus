const config = require('./default');

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: config.dbPath,
    logging: false
  },
  test: {
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false
  },
  production: {
    dialect: 'sqlite',
    storage: config.dbPath,
    logging: false
  }
}; 