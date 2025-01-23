import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { setAuthUser } from "../redux/authSlice";

export default function EditProfile() {
  const { user } = useSelector((state) => state.auth);
  const [profileImage, setProfileImage] = useState(null);
  const dispatch = useDispatch();

  const [username, setUserName] = useState(user?.username || "");
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fileHandler = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfileImage(file);
      const fileReader = new FileReader();

      fileReader.onload = (e) => {
        setImagePreview(e.target.result);
      };

      fileReader.readAsDataURL(file);
    }
  };

  const editProfileHandler = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const formData = new FormData();

      if (profileImage) formData.append("profileImage", profileImage);
      if (username) formData.append("username", username);

      const { data } = await axios.patch(
        "https://chat-application-irut.onrender.com/api/users/edit",
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      dispatch(
        setAuthUser({
          ...user,
          username: data.user.username,
          profileImage: data.user.profileImage,
        })
      );

      return toast.success("Profile Updated!", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (error) {
      if (error.response) {
        return toast.error(error.response.data.msg, {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        console.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="edit-main mt-16">
        <form onSubmit={editProfileHandler}>
          <input
            onChange={fileHandler}
            type="file"
            className="hidden"
            id="profilePicture"
          />
          <label htmlFor="profilePicture">
            <div className="profile_image_main">
              <img
                src={imagePreview || user?.profileImage}
                alt="Profile"
                className="rounded-full"
              />
              <i className="fa-solid fa-camera absolute" id="camera"></i>
            </div>
          </label>

          <div className="mt-5">
            <input
              value={username}
              onChange={(e) => setUserName(e.target.value)}
              type="text"
              className="changeUsername"
            />
          </div>

          <div className="mt-5">
            <button
              type="submit"
              className="cursor-pointer"
              id="editBtn"
              disabled={isLoading}
            >
              {isLoading ? <span className="loader"></span> : "Edit"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
