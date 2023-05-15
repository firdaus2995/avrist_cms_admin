import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IRolesSliceInitialState } from './types';

const initialState: IRolesSliceInitialState = {
  name: '',
  description: '',
  permissions: [],
};

const rolesSlice = createSlice({
  name: 'rolesSlice',
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setDescription: (state, action: PayloadAction<string>) => {
      state.description = action.payload;
    },
    setPermissions: (state, action: PayloadAction<string[]>) => {
      state.permissions = action.payload;
    },
    resetForm: state => {
      state.name = '';
      state.description = '';
      state.permissions = [];
    },
  },
});

export const { setName, setDescription, setPermissions, resetForm } = rolesSlice.actions;
export default rolesSlice.reducer;
