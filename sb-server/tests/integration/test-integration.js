const request = require('supertest');
const { app } = require('../../src/app');
const { sequelize } = require('../../src/models');
const { Client, Preset, Group } = require('../../src/models');

describe('통합 테스트', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('클라이언트 자동 등록 테스트', () => {
    it('새로운 클라이언트가 자동으로 등록되어야 함', async () => {
      const clientData = {
        uuid: 'test-uuid-1',
        name: 'Test Client 1',
        ip: '192.168.1.100',
        status: 'online'
      };

      const response = await request(app)
        .post('/api/clients')
        .send(clientData);

      expect(response.status).toBe(200);
      expect(response.body.uuid).toBe(clientData.uuid);
    });
  });

  describe('프리셋 실행 테스트', () => {
    let presetId;

    beforeAll(async () => {
      const preset = await Preset.create({
        name: 'Test Preset',
        description: 'Test Description'
      });
      presetId = preset.id;
    });

    it('프리셋이 성공적으로 실행되어야 함', async () => {
      const response = await request(app)
        .post(`/api/presets/${presetId}/execute`)
        .send();

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('executing');
    });
  });

  describe('그룹 기반 제어 테스트', () => {
    let groupId;

    beforeAll(async () => {
      const group = await Group.create({
        name: 'Test Group',
        description: 'Test Group Description'
      });
      groupId = group.id;
    });

    it('그룹에 클라이언트를 추가할 수 있어야 함', async () => {
      const client = await Client.create({
        uuid: 'test-uuid-2',
        name: 'Test Client 2',
        ip: '192.168.1.101',
        status: 'online'
      });

      const response = await request(app)
        .post(`/api/groups/${groupId}/members`)
        .send({ clientId: client.id });

      expect(response.status).toBe(200);
    });
  });

  describe('실시간 상태 업데이트 테스트', () => {
    it('클라이언트 상태가 실시간으로 업데이트되어야 함', async () => {
      const client = await Client.create({
        uuid: 'test-uuid-3',
        name: 'Test Client 3',
        ip: '192.168.1.102',
        status: 'online'
      });

      const response = await request(app)
        .put(`/api/clients/${client.id}`)
        .send({ status: 'offline' });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('offline');
    });
  });
}); 