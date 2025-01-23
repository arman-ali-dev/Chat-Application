import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import { act, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setOnlineUsers } from "./redux/userSlice";
import { setSocket } from "./redux/socketSlice";
import { addLatestMessage } from "./redux/chatSlice";
import ProtectedRoute from "./components/ProtectRoute";

const App = () => {
  const { user } = useSelector((state) => state.auth);
  const { selectedUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    let socket;

    if (user) {
      socket = io("https://chat-application-irut.onrender.com", {
        query: {
          userID: user._id,
        },
        transports: ["websocket"],
      });

      dispatch(setSocket(socket));

      socket.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUsers(users));
      });

      socket.on("latestMessage", (message) => {
        if (!selectedUser || selectedUser._id != message.senderID) {
          dispatch(addLatestMessage(message));
        }
      });
    }

    return () => {
      if (socket) {
        dispatch(setSocket(null));
        socket?.close();
      }
    };
  }, [user, selectedUser]);
  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        ></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
      </Routes>
    </>
  );
};

export default App;
