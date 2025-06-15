const { Sequelize } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './sb-server/database.sqlite'
});

async function addColumn() {
  await sequelize.query("ALTER TABLE Presets ADD COLUMN selectedGroups TEXT;");
  console.log('selectedGroups 컬럼 추가 완료');
  await sequelize.close();
}

addColumn(); 