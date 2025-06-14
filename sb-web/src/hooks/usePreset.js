import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchPresets,
  createPreset,
  updatePreset,
  deletePreset,
  executePreset,
  stopPreset,
} from '../store/slices/presetsSlice';
import { showToast } from '../store/slices/uiSlice';

export const usePreset = () => {
  const dispatch = useDispatch();
  const { items: presets, status, error, activePresetId } = useSelector((state) => state.presets);

  const loadPresets = useCallback(() => {
    dispatch(fetchPresets());
  }, [dispatch]);

  const handleCreatePreset = useCallback(async (presetData) => {
    try {
      await dispatch(createPreset(presetData)).unwrap();
      dispatch(showToast({ message: '프리셋이 생성되었습니다.', severity: 'success' }));
    } catch (error) {
      dispatch(showToast({ message: '프리셋 생성에 실패했습니다.', severity: 'error' }));
      throw error;
    }
  }, [dispatch]);

  const handleUpdatePreset = useCallback(async (id, presetData) => {
    try {
      await dispatch(updatePreset({ id, presetData })).unwrap();
      dispatch(showToast({ message: '프리셋이 수정되었습니다.', severity: 'success' }));
    } catch (error) {
      dispatch(showToast({ message: '프리셋 수정에 실패했습니다.', severity: 'error' }));
      throw error;
    }
  }, [dispatch]);

  const handleDeletePreset = useCallback(async (id) => {
    try {
      await dispatch(deletePreset(id)).unwrap();
      dispatch(showToast({ message: '프리셋이 삭제되었습니다.', severity: 'success' }));
    } catch (error) {
      dispatch(showToast({ message: '프리셋 삭제에 실패했습니다.', severity: 'error' }));
      throw error;
    }
  }, [dispatch]);

  const handleExecutePreset = useCallback(async (id) => {
    try {
      await dispatch(executePreset(id)).unwrap();
      dispatch(showToast({ message: '프리셋이 실행되었습니다.', severity: 'success' }));
    } catch (error) {
      dispatch(showToast({ message: '프리셋 실행에 실패했습니다.', severity: 'error' }));
      throw error;
    }
  }, [dispatch]);

  const handleStopPreset = useCallback(async (id) => {
    try {
      await dispatch(stopPreset(id)).unwrap();
      dispatch(showToast({ message: '프리셋이 중지되었습니다.', severity: 'success' }));
    } catch (error) {
      dispatch(showToast({ message: '프리셋 중지에 실패했습니다.', severity: 'error' }));
      throw error;
    }
  }, [dispatch]);

  return {
    presets,
    status,
    error,
    activePresetId,
    loadPresets,
    createPreset: handleCreatePreset,
    updatePreset: handleUpdatePreset,
    deletePreset: handleDeletePreset,
    executePreset: handleExecutePreset,
    stopPreset: handleStopPreset,
  };
}; 