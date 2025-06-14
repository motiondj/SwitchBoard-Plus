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
    lastRun: {
      type: DataTypes.DATE,
      allowNull: true
    },
    config: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    timestamps: true
  });

  return Preset;
}; 