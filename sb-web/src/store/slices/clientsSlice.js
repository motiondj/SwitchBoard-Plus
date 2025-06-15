import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import clientAPI from '../../services/clientAPI';

// 비동기 액션 생성
export const fetchClients = createAsyncThunk(
  'clients/fetchAll',
  async () => {
    const response = await clientAPI.getAll();
    return response;
  }
);

export const addClient = createAsyncThunk(
  'clients/add',
  async (clientData) => {
    const response = await clientAPI.create(clientData);
    return response.data;
  }
);

export const updateClient = createAsyncThunk(
  'clients/update',
  async ({ id, data }) => {
    const response = await clientAPI.update(id, data);
    return response.data;
  }
);

export const deleteClient = createAsyncThunk(
  'clients/delete',
  async (id) => {
    await clientAPI.delete(id);
    return id;
  }
);

export const executeCommand = createAsyncThunk(
  'clients/execute',
  async ({ clientIds, command }) => {
    const response = await clientAPI.executeCommand(clientIds, command);
    return response.data;
  }
);

export const stopClients = createAsyncThunk(
  'clients/stop',
  async (clientIds) => {
    const response = await clientAPI.stopClients(clientIds);
    return response.data;
  }
);

const initialState = {
  items: [],
  status: 'idle',
  error: null
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clientAdded: (state, action) => {
      const existingClient = state.items.find(item => item.uuid === action.payload.uuid);
      if (!existingClient) {
        state.items.push(action.payload);
      }
    },
    clientUpdated: (state, action) => {
      const { uuid, status, metrics } = action.payload;
      const client = state.items.find(item => item.uuid === uuid);
      if (client) {
        client.status = status;
        if (metrics) {
          client.metrics = metrics;
        }
      }
    },
    clientDisconnected: (state, action) => {
      const client = state.items.find(item => item.uuid === action.payload);
      if (client) {
        client.status = 'offline';
      }
    },
    metricsUpdated: (state, action) => {
      const { uuid, metrics } = action.payload;
      const client = state.items.find(item => item.uuid === uuid);
      if (client) {
        client.metrics = metrics;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.items = [];
      })
      .addCase(addClient.fulfilled, (state, action) => {
        const existingClient = state.items.find(item => item.uuid === action.payload.uuid);
        if (!existingClient) {
          state.items.push(action.payload);
        }
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.uuid === action.payload.uuid);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.uuid !== action.payload);
      })
      .addCase(executeCommand.fulfilled, (state, action) => {
        const { clientIds } = action.payload;
        clientIds.forEach(uuid => {
          const client = state.items.find(item => item.uuid === uuid);
          if (client) {
            client.status = 'running';
          }
        });
      })
      .addCase(stopClients.fulfilled, (state, action) => {
        const clientIds = action.payload;
        clientIds.forEach(uuid => {
          const client = state.items.find(item => item.uuid === uuid);
          if (client) {
            client.status = 'online';
          }
        });
      });
  }
});

// Actions
export const { clientAdded, clientUpdated, clientDisconnected, metricsUpdated } = clientsSlice.actions;

// Selectors
export const selectAllClients = state => state.clients.items;
export const selectClientById = (state, uuid) => 
  state.clients.items.find(client => client.uuid === uuid);

export const selectOnlineClients = createSelector(
  [selectAllClients],
  clients => clients.filter(client => client.status === 'online' || client.status === 'running')
);

export const selectRunningClients = createSelector(
  [selectAllClients],
  clients => clients.filter(client => client.status === 'running')
);

export const selectOfflineClients = createSelector(
  [selectAllClients],
  clients => clients.filter(client => client.status === 'offline')
);

export default clientsSlice.reducer; 