import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
  },

  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
  },
});

export default authSlice.reducer;
export const { setAuthUser } = authSlice.actions;
