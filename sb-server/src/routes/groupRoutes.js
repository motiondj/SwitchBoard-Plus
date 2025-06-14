const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');

// 그룹 관리 라우트
router.get('/', groupController.getAllGroups);
router.get('/:id', groupController.getGroupById);
router.post('/', groupController.createGroup);
router.put('/:id', groupController.updateGroup);
router.delete('/:id', groupController.deleteGroup);

// 그룹 멤버 관리
router.post('/:id/members', groupController.addMember);
router.delete('/:groupId/members/:clientId', groupController.removeClientFromGroup);

module.exports = router; 