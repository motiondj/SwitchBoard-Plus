import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import clientAPI from '../../services/clientAPI';

// 비동기 액션 생성
export const fetchClients = createAsyncThunk(
  'clients/fetchClients',
  async () => {
    const response = await clientAPI.getAll();
    return response.data;
  }
);

export const addClient = createAsyncThunk(
  'clients/addClient',
  async (client) => {
    const response = await clientAPI.create(client);
    return response.data;
  }
);

export const updateClient = createAsyncThunk(
  'clients/updateClient',
  async ({ id, data }) => {
    const response = await clientAPI.update(id, data);
    return response.data;
  }
);

export const deleteClient = createAsyncThunk(
  'clients/deleteClient',
  async (id) => {
    await clientAPI.delete(id);
    return id;
  }
);

export const executeCommand = createAsyncThunk(
  'clients/executeCommand',
  async ({ clientId, command }) => {
    const response = await clientAPI.executeCommand(clientId, command);
    return response.data;
  }
);

export const stopClients = createAsyncThunk(
  'clients/stopClients',
  async (clientIds) => {
    const response = await clientAPI.stopClients(clientIds);
    return response.data;
  }
);

const initialState = {
  items: [
    { id: 1, name: 'Display 1', ip: '192.168.1.101', node: 'node_01', status: 'running' },
    { id: 2, name: 'Display 2', ip: '192.168.1.102', node: 'node_02', status: 'online' },
    { id: 3, name: 'Display 3', ip: '192.168.1.103', node: 'node_03', status: 'running' },
    { id: 4, name: 'Display 4', ip: '192.168.1.104', node: 'node_04', status: 'offline' },
    { id: 5, name: 'Display 5', ip: '192.168.1.105', node: 'node_05', status: 'online' },
    { id: 6, name: 'Display 6', ip: '192.168.1.106', node: 'node_06', status: 'offline' }
  ],
  status: 'idle',
  error: null,
  metrics: {}
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clientAdded: (state, action) => {
      state.items.push(action.payload);
    },
    clientUpdated: (state, action) => {
      const { id, ...changes } = action.payload;
      const index = state.items.findIndex(item => item.id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...changes };
      }
    },
    clientRemoved: (state, action) => {
      const id = action.payload;
      state.items = state.items.filter(item => item.id !== id);
      delete state.metrics[id];
    },
    metricsUpdated: (state, action) => {
      const { id, metrics } = action.payload;
      state.metrics[id] = metrics;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchClients
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // addClient
      .addCase(addClient.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // updateClient
      .addCase(updateClient.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // deleteClient
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  },
});

// Selectors
export const selectAllClients = state => state.clients.items;

export const selectClientById = createSelector(
  [state => state.clients.items, (state, id) => id],
  (items, id) => items[id]
);

export const selectClientMetrics = createSelector(
  [state => state.clients.metrics, (state, id) => id],
  (metrics, id) => metrics[id]
);

export const selectOnlineClients = createSelector(
  [selectAllClients],
  clients => clients.filter(client => client.status === 'online')
);

export const selectClientsByGroup = createSelector(
  [selectAllClients, (state, groupId) => groupId],
  (clients, groupId) => clients.filter(client => client.groupId === groupId)
);

export const {
  clientAdded,
  clientUpdated,
  clientRemoved,
  metricsUpdated,
  setStatus,
  setError
} = clientsSlice.actions;

export default clientsSlice.reducer; 