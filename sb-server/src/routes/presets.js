const express = require('express');
const router = express.Router();
const { executePreset, stopPreset } = require('../services/presetService');

// 프리셋 실행
router.post('/:id/execute', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await executePreset(id);
    res.json(result);
  } catch (error) {
    console.error('프리셋 실행 실패:', error);
    res.status(500).json({ error: error.message });
  }
});

// 프리셋 중지
router.post('/:id/stop', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await stopPreset(id);
    res.json(result);
  } catch (error) {
    console.error('프리셋 중지 실패:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 