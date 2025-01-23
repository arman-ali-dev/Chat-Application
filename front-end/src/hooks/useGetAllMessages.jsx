import Cookies from "js-cookie";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setMessages } from "../redux/chatSlice";

export default function useGetAllMessages() {
  const { selectedUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(
        `https://chat-application-irut.onrender.com/api/messages/all/${selectedUser._id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      dispatch(setMessages(data.messages));
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    if (selectedUser) {
      console.log("chlal fetch messages!");

      fetchMessages();
    }
  }, [selectedUser]);
}
