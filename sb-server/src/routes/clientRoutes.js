const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// 클라이언트 관리 라우트
router.get('/', clientController.getAllClients);
router.get('/by-uuid/:uuid', clientController.getClientByUuid);
router.post('/', clientController.upsertClient);
router.put('/:id', clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

// 클라이언트 상태 업데이트
router.put('/:id/status', clientController.updateClientStatus);

module.exports = router; 