import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    selectedUser: null,
    onlineUsers: [],
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export default userSlice.reducer;
export const { setUsers, setSelectedUser, setOnlineUsers } = userSlice.actions;
