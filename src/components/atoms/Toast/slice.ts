import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"

interface IInitialValue {
  dataToast: {
    open: boolean
    type: string
    title: string
    message: string
  }
}

const initialState: IInitialValue = {
  dataToast: {
    open: false,
    type: "",
    title: "",
    message: ""
  }
}

export const toastSlice = createSlice({
  name: "ToastSlice",
  initialState,
  reducers: {
    openToast: (state, action: PayloadAction<any>) => {
      state.dataToast.open = true
      state.dataToast.type = action.payload.type
      state.dataToast.title = action.payload.title
      state.dataToast.message = action.payload.message
    },
    closeToast: (state, action: PayloadAction<any>) => {
      state.dataToast.open = false
      state.dataToast.type = action.payload.type
      state.dataToast.title = action.payload.title
      state.dataToast.message = action.payload.message
    }
  }
})

export const { openToast, closeToast } = toastSlice.actions
export default toastSlice.reducer
