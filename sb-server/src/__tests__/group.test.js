const request = require('supertest');
const app = require('../server');
const { Group, Client, GroupMember } = require('../models');

describe('Group API', () => {
  let testClient;
  let testGroup;

  beforeEach(async () => {
    // 테스트용 클라이언트 생성
    testClient = await Client.create({
      uuid: 'test-uuid-' + Date.now(),
      name: 'Test Client',
      ip: '127.0.0.1',
      status: 'online'
    });

    // 테스트용 그룹 데이터
    testGroup = {
      name: 'Test Group',
      description: 'Test Description',
      color: '#FF0000',
      clientIds: [testClient.id]
    };
  });

  afterEach(async () => {
    // 테스트 데이터 정리
    await GroupMember.destroy({ where: {} });
    await Group.destroy({ where: {} });
    await Client.destroy({ where: {} });
  });

  describe('POST /api/groups', () => {
    it('should create a new group', async () => {
      const response = await request(app)
        .post('/api/groups')
        .send(testGroup);

      expect(response.status).toBe(201);
      expect(response.body.name).toBe(testGroup.name);
      expect(response.body.description).toBe(testGroup.description);
      expect(response.body.color).toBe(testGroup.color);
      expect(response.body.Clients).toHaveLength(1);
      expect(response.body.Clients[0].id).toBe(testClient.id);
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/api/groups')
        .send({ description: 'Test Description' });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/groups', () => {
    it('should return all groups', async () => {
      // 테스트용 그룹 생성
      await Group.create({
        name: 'Test Group 1',
        description: 'Test Description 1',
        color: '#FF0000'
      });

      await Group.create({
        name: 'Test Group 2',
        description: 'Test Description 2',
        color: '#00FF00'
      });

      const response = await request(app)
        .get('/api/groups');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('GET /api/groups/:id', () => {
    it('should return group by id', async () => {
      // 테스트용 그룹 생성
      const group = await Group.create({
        name: 'Test Group',
        description: 'Test Description',
        color: '#FF0000'
      });

      const response = await request(app)
        .get(`/api/groups/${group.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(group.id);
      expect(response.body.name).toBe(group.name);
    });

    it('should return 404 for non-existent id', async () => {
      const response = await request(app)
        .get('/api/groups/99999');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/groups/:id', () => {
    it('should update group', async () => {
      // 테스트용 그룹 생성
      const group = await Group.create({
        name: 'Test Group',
        description: 'Test Description',
        color: '#FF0000'
      });

      const updateData = {
        name: 'Updated Group',
        description: 'Updated Description',
        color: '#00FF00',
        clientIds: [testClient.id]
      };

      const response = await request(app)
        .put(`/api/groups/${group.id}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.description).toBe(updateData.description);
      expect(response.body.color).toBe(updateData.color);
      expect(response.body.Clients).toHaveLength(1);
      expect(response.body.Clients[0].id).toBe(testClient.id);
    });

    it('should return 404 for non-existent id', async () => {
      const response = await request(app)
        .put('/api/groups/99999')
        .send({ name: 'Updated Group' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/groups/:id', () => {
    it('should delete group', async () => {
      // 테스트용 그룹 생성
      const group = await Group.create({
        name: 'Test Group',
        description: 'Test Description',
        color: '#FF0000'
      });

      const response = await request(app)
        .delete(`/api/groups/${group.id}`);

      expect(response.status).toBe(204);

      // 삭제 확인
      const deletedGroup = await Group.findByPk(group.id);
      expect(deletedGroup).toBeNull();
    });

    it('should return 404 for non-existent id', async () => {
      const response = await request(app)
        .delete('/api/groups/99999');

      expect(response.status).toBe(404);
    });
  });

  describe('POST /api/groups/:id/members', () => {
    it('should add client to group', async () => {
      // 테스트용 그룹 생성
      const group = await Group.create({
        name: 'Test Group',
        description: 'Test Description',
        color: '#FF0000'
      });

      const response = await request(app)
        .post(`/api/groups/${group.id}/members`)
        .send({ clientId: testClient.id });

      expect(response.status).toBe(200);
      expect(response.body.Clients).toHaveLength(1);
      expect(response.body.Clients[0].id).toBe(testClient.id);
    });

    it('should return 404 for non-existent group', async () => {
      const response = await request(app)
        .post('/api/groups/99999/members')
        .send({ clientId: testClient.id });

      expect(response.status).toBe(404);
    });

    it('should return 404 for non-existent client', async () => {
      // 테스트용 그룹 생성
      const group = await Group.create({
        name: 'Test Group',
        description: 'Test Description',
        color: '#FF0000'
      });

      const response = await request(app)
        .post(`/api/groups/${group.id}/members`)
        .send({ clientId: 99999 });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/groups/:id/members/:clientId', () => {
    it('should remove client from group', async () => {
      // 테스트용 그룹 생성
      const group = await Group.create({
        name: 'Test Group',
        description: 'Test Description',
        color: '#FF0000'
      });

      // 클라이언트 추가
      await group.addClient(testClient);

      const response = await request(app)
        .delete(`/api/groups/${group.id}/members/${testClient.id}`);

      expect(response.status).toBe(200);
      expect(response.body.Clients).toHaveLength(0);
    });

    it('should return 404 for non-existent group', async () => {
      const response = await request(app)
        .delete('/api/groups/99999/members/1');

      expect(response.status).toBe(404);
    });

    it('should return 404 for non-existent client', async () => {
      // 테스트용 그룹 생성
      const group = await Group.create({
        name: 'Test Group',
        description: 'Test Description',
        color: '#FF0000'
      });

      const response = await request(app)
        .delete(`/api/groups/${group.id}/members/99999`);

      expect(response.status).toBe(404);
    });
  });
}); 