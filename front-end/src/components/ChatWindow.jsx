import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import useGetAllMessages from "../hooks/useGetAllMessages";
import { setSelectedUser } from "../redux/userSlice";
import { setMessages } from "../redux/chatSlice";
import useGetRealTimeMessages from "../hooks/useGetRealTimeMessages";

export const ChatWindow = () => {
  useGetAllMessages();
  useGetRealTimeMessages();
  const { selectedUser } = useSelector((state) => state.user);
  const { messages } = useSelector((state) => state.chat);
  const { socket } = useSelector((state) => state.socket);
  const { user } = useSelector((state) => state.auth);
  const [isTyping, setIsTyping] = useState(false);

  const dispatch = useDispatch();

  const [text, setText] = useState("");

  const inputHandler = (e) => {
    setText(e.target.value);

    if (socket) {
      socket.emit("typing-feedback", {
        senderID: user?._id,
        receiverID: selectedUser?._id,
      });
    }
  };

  if (socket) {
    socket.on("typing-feedback", (data) => {
      if (selectedUser) {
        if (data.senderID == selectedUser._id) {
          setIsTyping(true);
        }
        setTimeout(() => {
          setIsTyping(false);
        }, 1000);
      }
    });
  }

  const sendMessageHandler = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        `http://localhost:8000/api/messages/send/${selectedUser?._id}`,
        { text },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      dispatch(setMessages([...messages, data.message]));
      setText("");
    } catch (error) {
      if (error.response) {
        console.warn(error.response.data.msg);
      } else {
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);

  useEffect(() => {
    const messageContainer = document.getElementById("message-container");

    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  }, [messages]);

  const time = (createdAt) => {
    const date = new Date();
    let time = (date - new Date(createdAt)) / 1000;

    let timeStr = "Just now";
    if (time >= 86400) {
      time = time / 24 / 60 / 60;
      timeStr = Math.floor(time) + " day";
    } else if (time >= 3600) {
      time = time / 60 / 60;
      timeStr = Math.floor(time) + " h";
    } else if (time >= 60) {
      time /= 60;
      timeStr = Math.floor(time) + " m";
    }
    return timeStr;
  };

  return (
    <>
      {selectedUser && (
        <div className="chatWindow relative">
          <div className="chat-header">
            <button
              onClick={() => dispatch(setSelectedUser(null))}
              id="backBtn"
              className="text-white cursor-pointer bg-transparent border-0 outline-none mr-1 text-[20px]"
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
            <img
              src={selectedUser.profileImage}
              alt=""
              height="40px"
              width="40px"
              style={{ objectFit: "cover" }}
              className="rounded-full"
            />
            <p className="text-[#e3e0e0]">{selectedUser.username}</p>
          </div>

          <div className="chat-main">
            <ul className="chat-container" id="message-container">
              {messages.length !== 0 &&
                messages.map((elem) => {
                  return (
                    <li
                      key={elem._id}
                      className={
                        elem.senderID == selectedUser?._id
                          ? "message-left"
                          : "message-right"
                      }
                    >
                      <p className="message">{elem.content}</p>
                      <span>{time(elem?.createdAt)}</span>
                    </li>
                  );
                })}

              <li className="message-feedback">
                {isTyping && (
                  <p className="feedback" id="feedback">
                    typing...
                  </p>
                )}
              </li>
            </ul>
          </div>

          <form
            onSubmit={sendMessageHandler}
            className="bottom-1 absolute w-full"
          >
            <div>
              <button className="right-3 absolute top-0 pl-4 py-2 bg-transparent border-0 outline-0">
                <img
                  src="/send.png"
                  className="sendIcon"
                  height="30px"
                  alt=""
                />
              </button>
              <input
                value={text}
                onChange={inputHandler}
                type="text"
                id="enteredText"
                placeholder="Type a message..."
                className="h-10 text-[#e3e0e0] w-full bg-transparent"
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
};
