'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Clients 테이블
    await queryInterface.createTable('Clients', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      uuid: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      ip: {
        type: Sequelize.STRING,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('online', 'offline', 'error'),
        defaultValue: 'offline'
      },
      lastSeen: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      metrics: {
        type: Sequelize.JSON,
        defaultValue: {}
      },
      config: {
        type: Sequelize.JSON,
        defaultValue: {}
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Presets 테이블
    await queryInterface.createTable('Presets', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('idle', 'running', 'error'),
        defaultValue: 'idle'
      },
      lastRun: {
        type: Sequelize.DATE,
        allowNull: true
      },
      config: {
        type: Sequelize.JSON,
        defaultValue: {}
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // PresetCommands 테이블
    await queryInterface.createTable('PresetCommands', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      presetId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Presets',
          key: 'id'
        }
      },
      clientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Clients',
          key: 'id'
        }
      },
      command: {
        type: Sequelize.STRING,
        allowNull: false
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      status: {
        type: Sequelize.ENUM('pending', 'running', 'completed', 'error'),
        defaultValue: 'pending'
      },
      result: {
        type: Sequelize.JSON,
        defaultValue: null
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Groups 테이블
    await queryInterface.createTable('Groups', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      color: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: '#000000'
      },
      config: {
        type: Sequelize.JSON,
        defaultValue: {}
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // GroupMembers 테이블
    await queryInterface.createTable('GroupMembers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Groups',
          key: 'id'
        }
      },
      clientId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Clients',
          key: 'id'
        }
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // 인덱스 생성
    await queryInterface.addIndex('Clients', ['uuid'], { unique: true });
    await queryInterface.addIndex('PresetCommands', ['presetId', 'clientId']);
    await queryInterface.addIndex('PresetCommands', ['order']);
    await queryInterface.addIndex('GroupMembers', ['groupId', 'clientId'], { unique: true });
    await queryInterface.addIndex('GroupMembers', ['order']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('GroupMembers');
    await queryInterface.dropTable('Groups');
    await queryInterface.dropTable('PresetCommands');
    await queryInterface.dropTable('Presets');
    await queryInterface.dropTable('Clients');
  }
}; 