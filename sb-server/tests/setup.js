const { sequelize } = require('../src/models');

// 테스트 전에 데이터베이스 초기화
beforeAll(async () => {
  await sequelize.sync({ force: true });
});

// 테스트 후에 데이터베이스 연결 종료
afterAll(async () => {
  await sequelize.close();
});

// 각 테스트 후에 데이터베이스 초기화
afterEach(async () => {
  await sequelize.truncate({ cascade: true });
}); 