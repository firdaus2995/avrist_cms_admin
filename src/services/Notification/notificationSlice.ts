import { createSlice } from '@reduxjs/toolkit';

const initialState: any = {
  activatedNotificationPage: false,
};

const notificationSlice = createSlice({
  name: 'notificationSlice',
  initialState,
  reducers: {
    setActivatedNotificationPage: (state, action) => {      
      state.activatedNotificationPage = action.payload;
    },
  },
});

export const { setActivatedNotificationPage } = notificationSlice.actions;

export default notificationSlice.reducer;
