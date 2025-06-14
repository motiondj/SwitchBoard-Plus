const request = require('supertest');
const app = require('../server');
const { Client } = require('../models');

describe('Client API', () => {
  const testClient = {
    uuid: 'test-uuid-123',
    name: 'Test Client',
    ip: '127.0.0.1',
    port: 8080,
    status: 'online'
  };

  beforeEach(async () => {
    await Client.destroy({ where: {} });
  });

  describe('POST /api/clients', () => {
    it('should create a new client', async () => {
      const response = await request(app)
        .post('/api/clients')
        .send(testClient);

      expect(response.status).toBe(201);
      expect(response.body.uuid).toBe(testClient.uuid);
      expect(response.body.name).toBe(testClient.name);
    });

    it('should update existing client', async () => {
      await Client.create(testClient);
      
      const updatedClient = {
        ...testClient,
        name: 'Updated Client'
      };

      const response = await request(app)
        .post('/api/clients')
        .send(updatedClient);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Client');
    });
  });

  describe('GET /api/clients', () => {
    it('should return all clients', async () => {
      await Client.create(testClient);

      const response = await request(app)
        .get('/api/clients');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].uuid).toBe(testClient.uuid);
    });
  });

  describe('GET /api/clients/by-uuid/:uuid', () => {
    it('should return client by UUID', async () => {
      await Client.create(testClient);

      const response = await request(app)
        .get(`/api/clients/by-uuid/${testClient.uuid}`);

      expect(response.status).toBe(200);
      expect(response.body.uuid).toBe(testClient.uuid);
    });

    it('should return 404 for non-existent UUID', async () => {
      const response = await request(app)
        .get('/api/clients/by-uuid/non-existent');

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/clients/:id', () => {
    it('should update client by ID', async () => {
      const client = await Client.create(testClient);

      const updatedData = {
        name: 'Updated Name',
        status: 'offline'
      };

      const response = await request(app)
        .put(`/api/clients/${client.id}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updatedData.name);
      expect(response.body.status).toBe(updatedData.status);
    });
  });

  describe('DELETE /api/clients/:id', () => {
    it('should delete client by ID', async () => {
      const client = await Client.create(testClient);

      const response = await request(app)
        .delete(`/api/clients/${client.id}`);

      expect(response.status).toBe(204);

      const deletedClient = await Client.findByPk(client.id);
      expect(deletedClient).toBeNull();
    });
  });
}); 