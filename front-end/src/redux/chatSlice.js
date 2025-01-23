import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    latestMessages: [],
  },
  reducers: {
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setLatestMessages: (state, action) => {
      state.latestMessages = action.payload;
    },
    addLatestMessage: (state, action) => {
      state.latestMessages.push(action.payload);
    },
  },
});

export default chatSlice.reducer;
export const { setMessages, setLatestMessages, addLatestMessage } =
  chatSlice.actions;
