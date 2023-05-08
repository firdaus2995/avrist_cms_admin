import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { isDesktop } from "react-device-detect"

export interface ILayout {
  open: boolean
}

const initialState: ILayout = {
  open: isDesktop
}

const layoutSlice = createSlice({
  name: "layoutSlice",
  initialState,
  reducers: {
    setOpen: (state, action: PayloadAction<boolean>) => {
      state.open = action.payload
    }
  }
})

export const { setOpen } = layoutSlice.actions
export default layoutSlice.reducer
