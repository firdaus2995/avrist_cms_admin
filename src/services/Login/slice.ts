import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { getCredential } from '../../utils/Credential';
interface IAuth {
  accessToken: string;
  refreshToken: string;
  roles: string[];
}
const initialState: IAuth = {
  accessToken: getCredential().accessToken,
  refreshToken: getCredential().refreshToken,
  roles: getCredential().roles,
};
const loginSlice = createSlice({
  name: 'loginSlice',
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
    setRefreshToken: (state, action: PayloadAction<string>) => {
      state.refreshToken = action.payload;
    },
    setRoles: (state, action: PayloadAction<string[]>) => {
      state.roles = action.payload;
    },
  },
});

export const { setAccessToken, setRefreshToken, setRoles } = loginSlice.actions;
export default loginSlice.reducer;
