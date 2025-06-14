const { sequelize } = require('./src/models');

// 테스트 전에 데이터베이스 동기화
beforeAll(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
  } catch (error) {
    console.error('데이터베이스 동기화 실패:', error);
    throw error;
  }
});

// 테스트 후에 데이터베이스 연결 종료
afterAll(async () => {
  try {
    await sequelize.close();
  } catch (error) {
    console.error('데이터베이스 연결 종료 실패:', error);
    throw error;
  }
}); 