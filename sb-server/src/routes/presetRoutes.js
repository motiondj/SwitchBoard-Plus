const express = require('express');
const router = express.Router();
const presetController = require('../controllers/presetController');

// 프리셋 목록 조회
router.get('/', presetController.getAllPresets);

// 특정 프리셋 조회
router.get('/:id', presetController.getPresetById);

// 프리셋 생성
router.post('/', presetController.createPreset);

// 프리셋 수정
router.put('/:id', presetController.updatePreset);

// 프리셋 삭제
router.delete('/:id', presetController.deletePreset);

// 프리셋 실행
router.post('/:id/execute', presetController.executePreset);

// 프리셋 중지
router.post('/:id/stop', presetController.stopPreset);

module.exports = router; 