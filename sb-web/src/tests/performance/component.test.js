import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { PresetList } from '../../components/presets/PresetList';
import { GroupList } from '../../components/groups/GroupList';
import { ClientMonitor } from '../../components/clients/ClientMonitor';
import presetsReducer from '../../store/slices/presetsSlice';
import groupsReducer from '../../store/slices/groupsSlice';
import clientsReducer from '../../store/slices/clientsSlice';

// 성능 측정을 위한 유틸리티 함수
const measurePerformance = (callback) => {
    const start = performance.now();
    callback();
    const end = performance.now();
    return end - start;
};

describe('컴포넌트 성능 테스트', () => {
    let store;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                presets: presetsReducer,
                groups: groupsReducer,
                clients: clientsReducer
            }
        });
    });

    describe('PresetList 성능', () => {
        it('대량의 프리셋을 렌더링할 때 성능이 유지되어야 함', () => {
            // 100개의 테스트 프리셋 데이터 생성
            const testPresets = Array.from({ length: 100 }, (_, i) => ({
                id: i + 1,
                name: `Test Preset ${i + 1}`,
                description: `Description ${i + 1}`,
                status: 'idle'
            }));

            const renderTime = measurePerformance(() => {
                render(
                    <Provider store={store}>
                        <PresetList presets={testPresets} />
                    </Provider>
                );
            });

            // 렌더링 시간이 100ms 이하여야 함
            expect(renderTime).toBeLessThan(100);
        });

        it('프리셋 상태 변경 시 리렌더링이 최적화되어야 함', () => {
            const testPreset = {
                id: 1,
                name: 'Test Preset',
                status: 'idle'
            };

            const { rerender } = render(
                <Provider store={store}>
                    <PresetList presets={[testPreset]} />
                </Provider>
            );

            const updateTime = measurePerformance(() => {
                rerender(
                    <Provider store={store}>
                        <PresetList presets={[{ ...testPreset, status: 'running' }]} />
                    </Provider>
                );
            });

            // 상태 업데이트 시간이 50ms 이하여야 함
            expect(updateTime).toBeLessThan(50);
        });
    });

    describe('GroupList 성능', () => {
        it('대량의 그룹을 렌더링할 때 성능이 유지되어야 함', () => {
            // 50개의 테스트 그룹 데이터 생성
            const testGroups = Array.from({ length: 50 }, (_, i) => ({
                id: i + 1,
                name: `Test Group ${i + 1}`,
                description: `Description ${i + 1}`,
                members: []
            }));

            const renderTime = measurePerformance(() => {
                render(
                    <Provider store={store}>
                        <GroupList groups={testGroups} />
                    </Provider>
                );
            });

            // 렌더링 시간이 100ms 이하여야 함
            expect(renderTime).toBeLessThan(100);
        });
    });

    describe('ClientMonitor 성능', () => {
        it('실시간 상태 업데이트 시 성능이 유지되어야 함', () => {
            const testClients = [
                { id: 1, name: 'Client 1', status: 'idle' },
                { id: 2, name: 'Client 2', status: 'running' }
            ];

            const { rerender } = render(
                <Provider store={store}>
                    <ClientMonitor clients={testClients} />
                </Provider>
            );

            // 상태 업데이트 시뮬레이션
            const updateTime = measurePerformance(() => {
                rerender(
                    <Provider store={store}>
                        <ClientMonitor clients={testClients.map(client => ({
                            ...client,
                            status: client.status === 'idle' ? 'running' : 'idle'
                        }))} />
                    </Provider>
                );
            });

            // 상태 업데이트 시간이 50ms 이하여야 함
            expect(updateTime).toBeLessThan(50);
 