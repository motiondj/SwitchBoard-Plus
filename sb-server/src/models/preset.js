module.exports = (sequelize, DataTypes) => {
  const Preset = sequelize.define('Preset', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('idle', 'running', 'error'),
      defaultValue: 'idle'
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lastRun: {
      type: DataTypes.DATE,
      allowNull: true
    },
    config: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    selectedGroups: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    timestamps: true
  });

  return Preset;
}; 