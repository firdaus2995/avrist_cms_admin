import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
// import { IPageManagementInitialState } from './types';

const initialState: any = {
  id: 0,
  title: '',
  pageStatus: '',
  createdBy: '',
  createdAt: '',
  updatedAt: '',
};

const pageManagementSlice = createSlice({
  name: 'pageManagementSlice',
  initialState,
  reducers: {
    setId: (state, action: PayloadAction<number>) => {
      state.id = action.payload;
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    setPageStatus: (state, action: PayloadAction<number>) => {
      state.pageStatus = action.payload;
    },
    setCreatedBy: (state, action: PayloadAction<string>) => {
      state.createdBy = action.payload;
    },
    setCreatedAt: (state, action: PayloadAction<string>) => {
      state.createdAt = action.payload;
    },
    setUpdatedAt: (state, action: PayloadAction<string>) => {
      state.updatedAt = action.payload;
    },

    resetForm: state => {
      state.title = '';
      state.status = '';
      state.createdBy = '';
      state.createdAt = '';
      state.updatedAt = '';
    },
  },
});

export const { setId, setTitle, setPageStatus, setCreatedBy, setCreatedAt, setUpdatedAt, resetForm } =
  pageManagementSlice.actions;
export default pageManagementSlice.reducer;
