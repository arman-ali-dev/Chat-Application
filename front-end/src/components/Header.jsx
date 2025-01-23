import { useDispatch, useSelector } from "react-redux";
import Modal from "../Modal";
import EditProfile from "./EditProfile";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { setAuthUser } from "../redux/authSlice";

export const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(
        "https://chat-application-irut.onrender.com/api/users/logout",
        {
          withCredentials: true,
        }
      );

      Cookies.remove("token");
      dispatch(setAuthUser(null));
      if (data.success) {
        return navigate("/login");
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <header>
        <div className="container-fluid mx-auto px-4">
          <nav className="py-2 flex justify-between items-center">
            <div
              className="flex items-center gap-2 "
              onClick={() => setShowModal(true)}
            >
              <button className="bg-transparent    border-0 outline-0 cursor-pointer">
                <div id="profileImage">
                  <img
                    height="50px"
                    width="50px"
                    style={{ objectFit: "cover" }}
                    className="rounded-full"
                    src={user?.profileImage}
                    alt=""
                  />
                  <i className="fa-solid fa-camera absolute camera_icon"></i>
                </div>
              </button>
              {/* User's Name */}
              <button className="dropDown bg-transparent border-0 outline-0 cursor-pointer dropDown">
                <div>
                  <span className="text-[17px] text-[#e3e0e0]">
                    {user?.username}
                  </span>
                </div>
              </button>
            </div>

            {showModal && (
              <Modal onClose={() => setShowModal(false)}>
                <EditProfile />
              </Modal>
            )}
            <div>
              <button
                onClick={handleLogout}
                className="border-0 outline-0 cursor-pointer"
                id="logoutBtn"
              >
                Logout
              </button>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
};
