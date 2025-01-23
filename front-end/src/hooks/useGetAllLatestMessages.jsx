import axios from "axios";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLatestMessages } from "../redux/chatSlice";

export default function useGetAllLatestMessages() {
  const dispatch = useDispatch();

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/messages/latest/all",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      dispatch(setLatestMessages(data.latestMessages));
      console.log("latest messages: ", data.latestMessages);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);
}
