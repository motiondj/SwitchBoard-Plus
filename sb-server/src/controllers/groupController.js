const { Group, Client, GroupMember } = require('../models');
const logger = require('../utils/logger');
const { AppError } = require('../middleware/errorHandler');

// 모든 그룹 조회
exports.getAllGroups = async (req, res) => {
  try {
    const groups = await Group.findAll({
      include: [{
        model: Client,
        as: 'Clients',
        through: { attributes: [] }
      }]
    });
    res.json(groups);
  } catch (error) {
    logger.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
};

// ID로 그룹 조회
exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id, {
      include: [{
        model: Client,
        as: 'Clients',
        through: { attributes: [] }
      }]
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    logger.error('Error fetching group:', error);
    res.status(500).json({ error: 'Failed to fetch group' });
  }
};

// 새 그룹 생성
exports.createGroup = async (req, res) => {
  try {
    const { name, description, color, clientIds } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const group = await Group.create({
      name,
      description,
      color
    });

    if (clientIds && clientIds.length > 0) {
      await group.setClients(clientIds);
    }

    const createdGroup = await Group.findByPk(group.id, {
      include: [{
        model: Client,
        as: 'Clients',
        through: { attributes: [] }
      }]
    });

    res.status(201).json(createdGroup);
  } catch (error) {
    logger.error('Error creating group:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
};

// 그룹 업데이트
exports.updateGroup = async (req, res) => {
  try {
    const { name, description, color, clientIds } = req.body;
    const group = await Group.findByPk(req.params.id);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    await group.update({
      name,
      description,
      color
    });

    if (clientIds) {
      await group.setClients(clientIds);
    }

    const updatedGroup = await Group.findByPk(group.id, {
      include: [{
        model: Client,
        as: 'Clients',
        through: { attributes: [] }
      }]
    });

    res.json(updatedGroup);
  } catch (error) {
    logger.error('Error updating group:', error);
    res.status(500).json({ error: 'Failed to update group' });
  }
};

// 그룹 삭제
exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    await group.destroy();
    res.status(204).send();
  } catch (error) {
    logger.error('Error deleting group:', error);
    res.status(500).json({ error: 'Failed to delete group' });
  }
};

// 그룹에 클라이언트 추가
exports.addClientToGroup = async (req, res) => {
  try {
    const { clientId } = req.body;
    const group = await Group.findByPk(req.params.id);
    const client = await Client.findByPk(clientId);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    await group.addClient(client);

    const updatedGroup = await Group.findByPk(group.id, {
      include: [{
        model: Client,
        as: 'Clients',
        through: { attributes: [] }
      }]
    });

    res.json(updatedGroup);
  } catch (error) {
    logger.error('Error adding client to group:', error);
    res.status(500).json({ error: 'Failed to add client to group' });
  }
};

// 그룹에서 클라이언트 제거
exports.removeClientFromGroup = async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id);
    const client = await Client.findByPk(req.params.clientId);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    await group.removeClient(client);

    const updatedGroup = await Group.findByPk(group.id, {
      include: [{
        model: Client,
        as: 'Clients',
        through: { attributes: [] }
      }]
    });

    res.json(updatedGroup);
  } catch (error) {
    logger.error('Error removing client from group:', error);
    res.status(500).json({ error: 'Failed to remove client from group' });
  }
};

exports.addMember = async (req, res, next) => {
  try {
    logger.info('[addMember] 입력값:', { params: req.params, body: req.body });
    const { groupId } = req.params;
    const { clientId } = req.body;

    // 그룹과 클라이언트 존재 여부 확인
    const [group, client] = await Promise.all([
      Group.findByPk(groupId),
      Client.findByPk(clientId)
    ]);

    if (!group) {
      throw new AppError('그룹을 찾을 수 없습니다.', 404);
    }

    if (!client) {
      throw new AppError('클라이언트를 찾을 수 없습니다.', 404);
    }

    // 이미 그룹에 속해있는지 확인
    const existingMember = await GroupMember.findOne({
      where: { groupId, clientId }
    });

    if (existingMember) {
      throw new AppError('이미 그룹에 속해있는 클라이언트입니다.', 400);
    }

    // 그룹 멤버 추가
    await GroupMember.create({
      groupId,
      clientId
    });

    // 업데이트된 그룹 정보 조회
    const updatedGroup = await Group.findByPk(groupId, {
      include: [{
        model: Client,
        through: { attributes: [] }
      }]
    });

    res.status(200).json(updatedGroup);
  } catch (error) {
    logger.error('[addMember] 에러:', error);
    next(error);
  }
}; 