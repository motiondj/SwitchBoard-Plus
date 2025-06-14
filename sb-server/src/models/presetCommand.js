module.exports = (sequelize, DataTypes) => {
  const PresetCommand = sequelize.define('PresetCommand', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    presetId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Presets',
        key: 'id'
      }
    },
    clientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Clients',
        key: 'id'
      }
    },
    command: {
      type: DataTypes.STRING,
      allowNull: false
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('pending', 'running', 'completed', 'error'),
      defaultValue: 'pending'
    },
    result: {
      type: DataTypes.JSON,
      defaultValue: null
    }
  }, {
    timestamps: true,
    indexes: [
      {
        fields: ['presetId', 'clientId']
      },
      {
        fields: ['order']
      }
    ]
  });

  return PresetCommand;
}; 