const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config/default.js');
const logger = require('../utils/logger');

const db = {};
const sequelize = new Sequelize(config.database);

// 모델 파일들을 로드
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== 'index.js' &&
      file.slice(-3) === '.js'
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// 모델 간의 관계 설정
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Preset과 PresetCommand 관계 설정
db.Preset.hasMany(db.PresetCommand, {
  foreignKey: 'presetId',
  as: 'PresetCommands'
});
db.PresetCommand.belongsTo(db.Preset, {
  foreignKey: 'presetId',
  as: 'Preset'
});

// Client와 PresetCommand 관계 설정
db.Client.hasMany(db.PresetCommand, {
  foreignKey: 'clientId',
  as: 'PresetCommands'
});
db.PresetCommand.belongsTo(db.Client, {
  foreignKey: 'clientId',
  as: 'Client'
});

// Group과 Client 관계 설정
db.Group.belongsToMany(db.Client, {
  through: db.GroupMember,
  foreignKey: 'groupId',
  otherKey: 'clientId',
  as: 'Clients'
});
db.Client.belongsToMany(db.Group, {
  through: db.GroupMember,
  foreignKey: 'clientId',
  otherKey: 'groupId',
  as: 'Groups'
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db; 