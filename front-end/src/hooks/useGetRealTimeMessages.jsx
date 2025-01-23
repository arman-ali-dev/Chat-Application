import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../redux/chatSlice";

export default function useGetRealTimeMessages() {
  const { socket } = useSelector((state) => state.socket);
  const { selectedUser } = useSelector((state) => state.user);
  const { messages } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const fetchMesssage = () => {
    socket?.on("newMessage", (message) => {
      if (message.senderID == selectedUser?._id) {
        console.log("new message: ", message);
        dispatch(setMessages([...messages, message]));
      }
    });
  };

  useEffect(() => {
    if (selectedUser) {
      fetchMesssage();
    }
  }, [messages]);
}
