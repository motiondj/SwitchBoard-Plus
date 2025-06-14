import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// 비동기 액션 생성
export const fetchGroups = createAsyncThunk(
  'groups/fetchGroups',
  async () => {
    const response = await axios.get(`${API_URL}/groups`);
    return response.data;
  }
);

export const createGroup = createAsyncThunk(
  'groups/createGroup',
  async (groupData) => {
    const response = await axios.post(`${API_URL}/groups`, groupData);
    return response.data;
  }
);

export const updateGroup = createAsyncThunk(
  'groups/updateGroup',
  async ({ id, data }) => {
    const response = await axios.put(`${API_URL}/groups/${id}`, data);
    return response.data;
  }
);

export const deleteGroup = createAsyncThunk(
  'groups/deleteGroup',
  async (id) => {
    await axios.delete(`${API_URL}/groups/${id}`);
    return id;
  }
);

export const addClientToGroup = createAsyncThunk(
  'groups/addClientToGroup',
  async ({ groupId, clientId }) => {
    const response = await axios.post(`${API_URL}/groups/${groupId}/clients`, { clientId });
    return response.data;
  }
);

export const removeClientFromGroup = createAsyncThunk(
  'groups/removeClientFromGroup',
  async ({ groupId, clientId }) => {
    await axios.delete(`${API_URL}/groups/${groupId}/clients/${clientId}`);
    return { groupId, clientId };
  }
);

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchGroups
      .addCase(fetchGroups.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // createGroup
      .addCase(createGroup.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // updateGroup
      .addCase(updateGroup.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // deleteGroup
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      })
      // addClientToGroup
      .addCase(addClientToGroup.fulfilled, (state, action) => {
        const group = state.items.find((item) => item.id === action.payload.id);
        if (group) {
          group.clients = action.payload.clients;
        }
      })
      // removeClientFromGroup
      .addCase(removeClientFromGroup.fulfilled, (state, action) => {
        const group = state.items.find((item) => item.id === action.payload.groupId);
        if (group) {
          group.clients = group.clients.filter(
            (client) => client.id !== action.payload.clientId
          );
        }
      });
  },
});

export default groupsSlice.reducer; 