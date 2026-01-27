import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoginModalState {
  isOpen: boolean;
}

const initialState: LoginModalState = {
  isOpen: false,
};

const loginModalSlice = createSlice({
  name: "loginModal",
  initialState,
  reducers: {
    openLoginModal: (state) => {
      state.isOpen = true;
    },
    closeLoginModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openLoginModal, closeLoginModal } = loginModalSlice.actions;
export default loginModalSlice.reducer;
