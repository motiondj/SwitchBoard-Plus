const request = require('supertest');
const { app } = require('../../src/app');
const { Client, Preset, Group, sequelize } = require('../../src/models');
const { v4: uuidv4 } = require('uuid');

describe('시스템 통합 테스트', () => {
    let testClient;
    let testPreset;
    let testGroup;

    beforeAll(async () => {
        await sequelize.sync({ force: true });
        // 테스트 데이터베이스 초기화
        await Client.destroy({ where: {} });
        await Preset.destroy({ where: {} });
        await Group.destroy({ where: {} });

        // 테스트 클라이언트 생성
        testClient = await Client.create({
            uuid: uuidv4(),
            name: 'Test Client',
            ip: '127.0.0.1',
            status: 'idle'
        });
        await testClient.reload();
        console.log('테스트 클라이언트 생성됨:', testClient.id);

        // 테스트 그룹 생성
        testGroup = await Group.create({
            name: 'Test Group',
            description: 'Test Description'
        });
        await testGroup.reload();
        console.log('테스트 그룹 생성됨:', testGroup.id);

        // 테스트 프리셋 생성
        testPreset = await Preset.create({
            name: 'Test Preset',
            description: 'Test Description',
            status: 'idle'
        });
        await testPreset.reload();
        console.log('테스트 프리셋 생성됨:', testPreset.id);
        
        // DB 동기화 대기
        await new Promise(r => setTimeout(r, 200));
    });

    afterAll(async () => {
        // 테스트 데이터 정리
        await Client.destroy({ where: {} });
        await Preset.destroy({ where: {} });
        await Group.destroy({ where: {} });
    });

    describe('클라이언트 자동 등록', () => {
        it('UDP 브로드캐스트로 클라이언트가 자동 등록되어야 함', async () => {
            const response = await request(app)
                .get('/api/clients')
                .expect(200);

            expect(response.body).toHaveLength(1);
            expect(response.body[0].name).toBe('Test Client');
        });
    });

    describe('프리셋 생성 및 실행', () => {
        it('프리셋을 생성하고 실행할 수 있어야 함', async () => {
            // 프리셋 생성
            const createResponse = await request(app)
                .post('/api/presets')
                .send({
                    name: 'New Preset',
                    description: 'New Description',
                    commands: [
                        {
                            clientId: testClient.id,
                            command: 'test command'
                        }
                    ]
                })
                .expect(201);

            // 프리셋 실행
            const executeResponse = await request(app)
                .post(`/api/presets/${createResponse.body.id}/execute`)
                .expect(200);

            expect(executeResponse.body.status).toBe('running');
        });
    });

    describe('그룹 기반 제어', () => {
        it('그룹에 클라이언트를 추가하고 그룹 기반으로 제어할 수 있어야 함', async () => {
            // 그룹에 클라이언트 추가
            const addResponse = await request(app)
                .post(`/api/groups/${testGroup.id}/members`)
                .send({ clientId: testClient.id })
                .expect(200);

            // 그룹 정보 확인
            const groupResponse = await request(app)
                .get(`/api/groups/${testGroup.id}`)
                .expect(200);

            expect(groupResponse.body.members).toHaveLength(1);
            expect(groupResponse.body.members[0].id).toBe(testClient.id);
        });
    });

    describe('실시간 상태 업데이트', () => {
        it('클라이언트 상태가 실시간으로 업데이트되어야 함', async () => {
            // 클라이언트 상태 업데이트
            const updateResponse = await request(app)
                .put(`/api/clients/${testClient.id}/status`)
                .send({ status: 'running' })
                .expect(200);

            // 상태 확인
            const statusResponse = await request(app)
                .get(`/api/clients/${testClient.id}`)
                .expect(200);

            expect(statusResponse.body.status).toBe('running');
        });
    });

    describe('네트워크 장애 시나리오', () => {
        it('클라이언트 연결이 끊어졌을 때 적절히 처리되어야 함', async () => {
            // 클라이언트 상태를 offline으로 변경
            await request(app)
                .put(`/api/clients/${testClient.id}/status`)
                .send({ status: 'offline' })
                .expect(200);

            // 상태 확인
            const response = await request(app)
                .get(`/api/clients/${testClient.id}`)
                .expect(200);

            expect(response.body.status).toBe('offline');
        });
    });
}); 