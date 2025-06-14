const request = require('supertest');
const app = require('../server');
const { Preset, PresetCommand, Client } = require('../models');

describe('Preset API', () => {
  let testClient;
  let testPreset;

  beforeEach(async () => {
    // 테스트용 클라이언트 생성
    testClient = await Client.create({
      uuid: 'test-uuid-' + Date.now(),
      name: 'Test Client',
      ip: '127.0.0.1',
      status: 'online'
    });

    // 테스트용 프리셋 데이터
    testPreset = {
      name: 'Test Preset',
      description: 'Test Description',
      commands: [{
        clientId: testClient.id,
        command: 'test command',
        order: 0
      }]
    };
  });

  afterEach(async () => {
    // 테스트 데이터 정리
    await PresetCommand.destroy({ where: {} });
    await Preset.destroy({ where: {} });
    await Client.destroy({ where: {} });
  });

  describe('POST /api/presets', () => {
    it('should create a new preset', async () => {
      const response = await request(app)
        .post('/api/presets')
        .send(testPreset);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(testPreset.name);
      expect(response.body.description).toBe(testPreset.description);
      expect(response.body.PresetCommands).toHaveLength(1);
      expect(response.body.PresetCommands[0].command).toBe(testPreset.commands[0].command);
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/api/presets')
        .send({ description: 'Test Description' });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/presets', () => {
    it('should return all presets', async () => {
      // 테스트용 프리셋 생성
      await Preset.create({
        name: 'Test Preset 1',
        description: 'Test Description 1',
        status: 'idle'
      });

      await Preset.create({
        name: 'Test Preset 2',
        description: 'Test Description 2',
        status: 'idle'
      });

      const response = await request(app)
        .get('/api/presets');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('GET /api/presets/:id', () => {
    it('should return preset by id', async () => {
      // 테스트용 프리셋 생성
      const preset = await Preset.create({
        name: 'Test Preset',
        description: 'Test Description',
        status: 'idle'
      });

      const response = await request(app)
        .get(`/api/presets/${preset.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(preset.id);
      expect(response.body.name).toBe(preset.name);
    });

    it('should return 404 for non-existent id', async () => {
      const response = await request(app)
        .get('/api/presets/99999');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/presets/:id', () => {
    it('should update preset', async () => {
      // 테스트용 프리셋 생성
      const preset = await Preset.create({
        name: 'Test Preset',
        description: 'Test Description',
        status: 'idle'
      });

      const updateData = {
        name: 'Updated Preset',
        description: 'Updated Description',
        commands: [{
          clientId: testClient.id,
          command: 'updated command',
          order: 0
        }]
      };

      const response = await request(app)
        .put(`/api/presets/${preset.id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.description).toBe(updateData.description);
      expect(response.body.PresetCommands).toHaveLength(1);
      expect(response.body.PresetCommands[0].command).toBe(updateData.commands[0].command);
    });

    it('should return 404 for non-existent id', async () => {
      const response = await request(app)
        .put('/api/presets/99999')
        .send({ name: 'Updated Preset' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/presets/:id', () => {
    it('should delete preset', async () => {
      // 테스트용 프리셋 생성
      const preset = await Preset.create({
        name: 'Test Preset',
        description: 'Test Description',
        status: 'idle'
      });

      const response = await request(app)
        .delete(`/api/presets/${preset.id}`);

      expect(response.status).toBe(204);

      // 삭제 확인
      const deletedPreset = await Preset.findByPk(preset.id);
      expect(deletedPreset).toBeNull();
    });

    it('should return 404 for non-existent id', async () => {
      const response = await request(app)
        .delete('/api/presets/99999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/presets/:id/execute', () => {
    it('should execute preset', async () => {
      // 테스트용 프리셋 생성
      const preset = await Preset.create({
        name: 'Test Preset',
        description: 'Test Description',
        status: 'idle'
      });

      const response = await request(app)
        .post(`/api/presets/${preset.id}/execute`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Preset execution started');

      // 상태 업데이트 확인
      const updatedPreset = await Preset.findByPk(preset.id);
      expect(updatedPreset.status).toBe('running');
    });

    it('should return 404 for non-existent id', async () => {
      const response = await request(app)
        .post('/api/presets/99999/execute');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/presets/:id/stop', () => {
    it('should stop preset', async () => {
      // 테스트용 프리셋 생성
      const preset = await Preset.create({
        name: 'Test Preset',
        description: 'Test Description',
        status: 'running'
      });

      const response = await request(app)
        .post(`/api/presets/${preset.id}/stop`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Preset execution stopped');

      // 상태 업데이트 확인
      const updatedPreset = await Preset.findByPk(preset.id);
      expect(updatedPreset.status).toBe('stopped');
    });

    it('should return 404 for non-existent id', async () => {
      const response = await request(app)
        .post('/api/presets/99999/stop');

      expect(response.status).toBe(404);
    });
  });
}); 