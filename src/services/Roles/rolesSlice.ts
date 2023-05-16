import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IRolesSliceInitialState } from './types';

const initialState: IRolesSliceInitialState = {
  name: '',
  description: '',
  permissions: [],
  id: 0,
};

const rolesSlice = createSlice({
  name: 'rolesSlice',
  initialState,
  reducers: {
    setId: (state, action: PayloadAction<number>) => {
      state.id = action.payload;
    },
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

export const { setName, setDescription, setPermissions, resetForm, setId } = rolesSlice.actions;
export default rolesSlice.reducer;
