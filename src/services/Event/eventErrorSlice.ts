import { createSlice } from '@reduxjs/toolkit';

const initialState: any = {
  eventTriggered: false,
};

const eventErrorSlice = createSlice({
  name: 'eventErrorSlice',
  initialState,
  reducers: {
    setEventTriggered: (state, action) => {      
      state.eventTriggered = action.payload;
    },
  },
});

export const { setEventTriggered } = eventErrorSlice.actions;

export default eventErrorSlice.reducer;
