import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../redux/userSlice";
import axios from "axios";
import Cookies from "js-cookie";
import { setLatestMessages } from "../redux/chatSlice";
import { useState } from "react";

export const Aside = () => {
  const { users, onlineUsers, selectedUser } = useSelector(
    (state) => state.user
  );
  const { latestMessages } = useSelector((state) => state.chat);

  const [searchedKeywords, setSearchKeywords] = useState("");
  const [searchedUsers, setSearchedUsers] = useState(users);

  const dispatch = useDispatch();

  const handleDropLatestMessages = async (id) => {
    try {
      await axios.delete(
        `https://chat-application-irut.onrender.com/api/messages/latest/drop/${id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      const filteredLatestMessages = latestMessages.filter(
        (elem) => elem?.senderID != id
      );

      console.log("Filtered: ", filteredLatestMessages);

      dispatch(setLatestMessages(filteredLatestMessages));
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchKeywords(value);
    const filteredUsers = users.filter((elem) =>
      elem?.username.toLowerCase().includes(value.toLowerCase())
    );

    setSearchedUsers(filteredUsers);
  };
  return (
    <>
      <aside className={selectedUser ? "hide-aside" : "show-aside"}>
        <div>
          <div className="search-bar mb-4">
            <form className="px-5">
              <div className="relative">
                <i className="text-[#e3e0e0] fa-solid fa-magnifying-glass absolute top-2 left-2 text-[15px]"></i>
                <input
                  value={searchedKeywords}
                  onChange={handleSearch}
                  type="search"
                  placeholder="search or start a new chat"
                  className="searchBar text-[#e3e0e0]"
                />
              </div>
            </form>
          </div>
          <ul>
            {searchedUsers?.map((elem) => {
              return (
                <li
                  key={elem?._id}
                  onClick={() => {
                    dispatch(setSelectedUser(elem));
                    handleDropLatestMessages(elem._id);
                  }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2 ">
                    <div className="relative ">
                      <img
                        src={elem?.profileImage}
                        alt=""
                        height="40px"
                        width="40px"
                        className="rounded-full object-cover"
                      />
                      <span
                        className={`status ${
                          onlineUsers?.includes(elem._id)
                            ? "bg-green-500"
                            : "bg-red-600"
                        } `}
                      ></span>
                    </div>
                    <span className="text-[#e3e0e0] text-[17px]">
                      {elem?.username}
                    </span>
                  </div>
                  {latestMessages?.length !== 0 &&
                    latestMessages?.filter((msg) => msg.senderID == elem?._id)
                      .length > 0 && (
                      <div className="notification">
                        {
                          latestMessages?.filter(
                            (msg) => msg.senderID == elem?._id
                          ).length
                        }
                      </div>
                    )}
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
};
