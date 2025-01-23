import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/authSlice";
import Cookies from "js-cookie";

const Signup = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const inputHandler = (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    setUserInfo({
      ...userInfo,
      [fieldName]: fieldValue,
    });
  };

  const signupHandler = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "https://chat-application-irut.onrender.com/api/users/signup",
        userInfo
      );

      Cookies.set("token", data.token, { expires: 30 });
      dispatch(setAuthUser(data.user));

      navigate("/");
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
    <section className="py-[20px] md:py-[150px] xl:py-[30px]">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-2">
          <div className="main w-[100%] md:w-[70%] xl:w-full mx-auto xl:mx-0">
            <h2 className="formHeading">Sign Up</h2>

            <form className="mt-10" onSubmit={signupHandler}>
              <div className="mt-6">
                <label
                  htmlFor="username"
                  className="input-label text-xl text-white"
                >
                  Full Name
                </label>
                <input
                  value={userInfo.username}
                  onChange={inputHandler}
                  type="text"
                  className="form-input w-[100%] h-11 bg-transparent px-3 outline-none text-white rounded-md"
                  name="username"
                />
              </div>

              <div className="mt-6">
                <label
                  htmlFor="email"
                  className="input-label text-xl text-white"
                >
                  Email
                </label>
                <input
                  value={userInfo.email}
                  onChange={inputHandler}
                  type="text"
                  className="form-input w-[100%] h-11 bg-transparent px-3 outline-none text-white rounded-md"
                  name="email"
                  required
                />
              </div>

              <div className="mt-6">
                <label
                  htmlFor="password"
                  className="input-label text-xl text-white"
                >
                  Password
                </label>
                <input
                  value={userInfo.password}
                  onChange={inputHandler}
                  type="password"
                  className="form-input w-[100%] h-11 bg-transparent px-3 outline-none text-white rounded-md"
                  name="password"
                />
              </div>

              <div className="mt-6">
                <label
                  htmlFor="confirmPassword"
                  className="input-label text-xl text-white"
                >
                  Confirm Password
                </label>
                <input
                  value={userInfo.confirmPassword}
                  onChange={inputHandler}
                  type="password"
                  className="form-input w-[100%] h-11 bg-transparent px-3 outline-none text-white rounded-md"
                  name="confirmPassword"
                />
              </div>

              <div className="w-[100%] xl:w-[100%] mt-10 flex justify-between items-end">
                <button
                  type="submit"
                  className="bg-pink-950 text-lg text-white py-2 px-10 border-none outline-none cursor-pointer rounded-md form-btn"
                  disabled={isLoading}
                >
                  {isLoading ? <span className="loader"></span> : "Sign Up"}
                </button>

                <Link className="link text-md" to="/login">
                  I've already an account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
