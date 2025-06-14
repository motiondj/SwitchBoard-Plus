const express = require('express');
const router = express.Router();

router.use('/clients', require('./clientRoutes'));
router.use('/presets', require('./presetRoutes'));
router.use('/groups', require('./groupRoutes'));

// 기본 라우트
router.get('/', (req, res) => {
  res.json({
    message: 'Switchboard Plus API',
    version: '1.0.0'
  });
});

module.exports = router; 