import axios from "axios";
import { useEffect } from "react";
import { setUsers } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";

export default function useGetAllUsers() {
  const dispatch = useDispatch();

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(
        "https://chat-application-irut.onrender.com/api/users/all",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      dispatch(setUsers(data.users));
    } catch (error) {
      if (error.response) {
        console.warn(error.response.data.msg);
      } else {
        {
          console.error(error.message);
        }
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
}
