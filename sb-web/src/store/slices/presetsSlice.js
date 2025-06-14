import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// 비동기 액션 생성
export const fetchPresets = createAsyncThunk(
  'presets/fetchPresets',
  async () => {
    const response = await axios.get(`${API_URL}/presets`);
    return response.data;
  }
);

export const createPreset = createAsyncThunk(
  'presets/createPreset',
  async (presetData) => {
    const response = await axios.post(`${API_URL}/presets`, presetData);
    return response.data;
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
  'presets/executePreset',
  async (id) => {
    const response = await axios.post(`${API_URL}/presets/${id}/execute`);
    return response.data;
  }
);

export const stopPreset = createAsyncThunk(
  'presets/stopPreset',
  async (id) => {
    const response = await axios.post(`${API_URL}/presets/${id}/stop`);
    return response.data;
  }
);

const initialState = {
  items: [],
  activePresetId: null,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
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
          state.activePresetId = id;
        } else if (state.activePresetId === id) {
          state.activePresetId = null;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchPresets
      .addCase(fetchPresets.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPresets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPresets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // createPreset
      .addCase(createPreset.fulfilled, (state, action) => {
        state.items.push(action.payload);
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
        if (state.activePresetId === action.payload) {
          state.activePresetId = null;
        }
      })
      // executePreset
      .addCase(executePreset.fulfilled, (state, action) => {
        const preset = state.items.find((p) => p.id === action.payload.id);
        if (preset) {
          preset.status = 'running';
          state.activePresetId = preset.id;
        }
      })
      // stopPreset
      .addCase(stopPreset.fulfilled, (state, action) => {
        const preset = state.items.find((p) => p.id === action.payload.id);
        if (preset) {
          preset.status = 'stopped';
          if (state.activePresetId === preset.id) {
            state.activePresetId = null;
          }
        }
      });
  },
});

export const { updatePresetStatus } = presetsSlice.actions;

export default presetsSlice.reducer; 