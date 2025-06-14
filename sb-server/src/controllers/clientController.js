const { Client } = require('../models');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');

// 전체 클라이언트 목록 조회
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll({
      order: [['name', 'ASC']]
    });
    res.json(clients);
  } catch (error) {
    logger.error('클라이언트 목록 조회 실패:', error);
    res.status(500).json({ error: '클라이언트 목록을 가져오는데 실패했습니다.' });
  }
};

// UUID로 클라이언트 조회
exports.getClientByUuid = async (req, res) => {
  try {
    const client = await Client.findOne({
      where: { uuid: req.params.uuid }
    });
    
    if (!client) {
      return res.status(404).json({ error: '클라이언트를 찾을 수 없습니다.' });
    }
    
    res.json(client);
  } catch (error) {
    logger.error('클라이언트 조회 실패:', error);
    res.status(500).json({ error: '클라이언트를 가져오는데 실패했습니다.' });
  }
};

// 클라이언트 등록/업데이트
exports.upsertClient = async (req, res) => {
  try {
    const { uuid, name, ip, metrics, config } = req.body;

    if (!uuid || !name || !ip) {
      return res.status(400).json({ error: 'UUID, name, and IP are required' });
    }

    // 먼저 UUID로 클라이언트를 조회
    const existingClient = await Client.findOne({ where: { uuid } });

    if (!existingClient) {
      // 새 클라이언트 생성
      const newClient = await Client.create({
        uuid,
        name,
        ip,
        metrics: metrics || {},
        config: config || {},
        status: 'online'
      });
      return res.status(201).json(newClient);
    }

    // 기존 클라이언트 업데이트
    const updatedClient = await existingClient.update({
      name,
      ip,
      metrics: metrics || existingClient.metrics,
      config: config || existingClient.config,
      status: 'online'
    });
    return res.status(200).json(updatedClient);
  } catch (error) {
    logger.error('Error upserting client:', error);
    res.status(500).json({ error: 'Failed to upsert client' });
  }
};

// 클라이언트 정보 수정
exports.updateClient = async (req, res) => {
  try {
    const { name, ip, metrics, config, status } = req.body;
    const client = await Client.findByPk(req.params.id);
    
    if (!client) {
      return res.status(404).json({ error: '클라이언트를 찾을 수 없습니다.' });
    }

    await client.update({
      name: name || client.name,
      ip: ip || client.ip,
      metrics: metrics || client.metrics,
      config: config || client.config,
      status: status || client.status
    });

    res.json(client);
  } catch (error) {
    logger.error('클라이언트 수정 실패:', error);
    res.status(500).json({ error: '클라이언트를 수정하는데 실패했습니다.' });
  }
};

// 클라이언트 삭제
exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    
    if (!client) {
      return res.status(404).json({ error: '클라이언트를 찾을 수 없습니다.' });
    }

    await client.destroy();
    res.status(204).send();
  } catch (error) {
    logger.error('클라이언트 삭제 실패:', error);
    res.status(500).json({ error: '클라이언트를 삭제하는데 실패했습니다.' });
  }
};

// 클라이언트 상태 업데이트
exports.updateClientStatus = async (req, res) => {
  try {
    const { status, metrics } = req.body;
    const client = await Client.findByPk(req.params.id);
    
    if (!client) {
      return res.status(404).json({ error: '클라이언트를 찾을 수 없습니다.' });
    }

    await client.update({
      name: client.name,
      ip: client.ip,
      metrics: metrics || client.metrics,
      config: client.config,
      status: status || client.status
    });

    res.json(client);
  } catch (error) {
    logger.error('클라이언트 상태 업데이트 실패:', error);
    res.status(500).json({ error: '클라이언트 상태를 업데이트하는데 실패했습니다.' });
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, lastSeen } = req.body;

    const client = await Client.findByPk(id);
    if (!client) {
      throw new AppError('클라이언트를 찾을 수 없습니다.', 404);
    }

    await client.update({
      status,
      lastSeen: lastSeen || new Date()
    });

    res.status(200).json(client);
  } catch (error) {
    next(error);
  }
}; 