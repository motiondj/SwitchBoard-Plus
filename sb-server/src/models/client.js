module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('online', 'offline', 'running', 'error'),
      defaultValue: 'offline'
    },
    socketId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastSeen: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    metrics: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    config: {
      type: DataTypes.JSON,
      defaultValue: {}
    }
  }, {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['uuid']
      },
      {
        fields: ['socketId']
      }
    ]
  });

  return Client;
}; 