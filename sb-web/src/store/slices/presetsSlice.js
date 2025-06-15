import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

// 비동기 액션 생성
export const fetchPresets = createAsyncThunk(
  'presets/fetchPresets',
  async (_, { rejectWithValue }) => {
    try {
      console.log('프리셋 목록 가져오기 시작');
      const response = await axios.get(`${API_URL}/presets`);
      console.log('프리셋 목록 응답:', response.data);
      return response.data;
    } catch (error) {
      console.error('프리셋 목록 가져오기 실패:', error);
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        '프리셋 목록을 가져오는데 실패했습니다.'
      );
    }
  }
);

export const createPreset = createAsyncThunk(
  'presets/createPreset',
  async (presetData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/presets`, presetData);
      return response.data;
    } catch (error) {
      console.error('프리셋 생성 API 오류:', error);
      return rejectWithValue(error.response?.data?.message || '프리셋 생성에 실패했습니다.');
    }
  }
);

export const updatePreset = createAsyncThunk(
  'presets/updatePreset',
  async ({ id, data }) => {
    const response = await axios.put(`${API_URL}/presets/${id}`, data);
    return response.data;
  }
);

export const deletePreset = createAsyncThunk(
  'presets/deletePreset',
  async (id) => {
    await axios.delete(`${API_URL}/presets/${id}`);
    return id;
  }
);

export const executePreset = createAsyncThunk(
  'presets/execute',
  async (presetId) => {
    const response = await axios.post(`${API_URL}/presets/${presetId}/execute`);
    return response.data;
  }
);

export const stopPreset = createAsyncThunk(
  'presets/stop',
  async (presetId) => {
    const response = await axios.post(`${API_URL}/presets/${presetId}/stop`);
    return response.data;
  }
);

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  activePresets: new Set()
};

const presetsSlice = createSlice({
  name: 'presets',
  initialState,
  reducers: {
    updatePresetStatus: (state, action) => {
      const { id, status } = action.payload;
      const preset = state.items.find((p) => p.id === id);
      if (preset) {
        preset.status = status;
        if (status === 'running') {
          state.activePresets.add(id);
        } else if (state.activePresets.has(id)) {
          state.activePresets.delete(id);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPresets
      .addCase(fetchPresets.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPresets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchPresets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.error('프리셋 목록 로드 실패:', action.payload);
      })
      // createPreset
      .addCase(createPreset.fulfilled, (state, action) => {
        state.items.push(action.payload);
        state.status = 'succeeded';
      })
      .addCase(createPreset.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || '프리셋 생성에 실패했습니다.';
      })
      // updatePreset
      .addCase(updatePreset.fulfilled, (state, action) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // deletePreset
      .addCase(deletePreset.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
        if (state.activePresets.has(action.payload)) {
          state.activePresets.delete(action.payload);
        }
      })
      // executePreset
      .addCase(executePreset.pending, (state) => {
        state.error = null;
      })
      .addCase(executePreset.fulfilled, (state, action) => {
        const presetId = action.payload.id ?? action.meta.arg;
        console.log('executePreset.fulfilled payload:', action.payload, 'meta:', action.meta);
        state.status = 'succeeded';
        state.activePresets.add(presetId);
        state.items = state.items.map(preset =>
          String(preset.id) === String(presetId)
            ? { ...preset, status: 'running', active: true }
            : preset
        );
      })
      .addCase(executePreset.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // stopPreset
      .addCase(stopPreset.pending, (state) => {
        state.error = null;
      })
      .addCase(stopPreset.fulfilled, (state, action) => {
        const presetId = action.payload.id ?? action.meta.arg;
        console.log('stopPreset.fulfilled payload:', action.payload, 'meta:', action.meta);
        state.status = 'succeeded';
        state.activePresets.delete(presetId);
        state.items = state.items.map(preset =>
          String(preset.id) === String(presetId)
            ? { ...preset, status: 'stopped', active: false }
            : preset
        );
      })
      .addCase(stopPreset.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { updatePresetStatus } = presetsSlice.actions;

export default presetsSlice.reducer; 