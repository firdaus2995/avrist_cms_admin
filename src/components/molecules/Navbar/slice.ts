import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

export interface INavbar {
  title: string
}

const initialState: INavbar = {
  title: ""
}

const navbarSlice = createSlice({
  name: "navbarSlice",
  initialState,
  reducers: {
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload
    }
  }
})

export const { setTitle } = navbarSlice.actions
export default navbarSlice.reducer
