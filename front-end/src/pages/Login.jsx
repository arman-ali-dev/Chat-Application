import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setAuthUser } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";

const Login = () => {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const inputHandler = (event) => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    setUserInfo({
      ...userInfo,
      [fieldName]: fieldValue,
    });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "https://chat-application-irut.onrender.com/api/users/login",
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
    <section className="xl:py-[150px] py-[140px]">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-2">
          <div className="main w-[100%] xl:w-full mx-auto xl:mx-0">
            <h2 className="formHeading">Log In</h2>

            <form className="mt-10" onSubmit={loginHandler}>
              <div className="mt-6">
                <label htmlFor="email" className="input-label text-white">
                  Email
                </label>
                <input
                  value={userInfo.email}
                  onChange={inputHandler}
                  type="text"
                  className="w-[100%] form-input h-11 bg-transparent px-3 outline-none text-white rounded-md"
                  name="email"
                  required
                />
              </div>

              <div className="mt-6">
                <label htmlFor="password" className="input-label text-white">
                  Password
                </label>
                <input
                  value={userInfo.password}
                  onChange={inputHandler}
                  type="password"
                  className="w-[100%] form-input h-11 bg-transparent px-3 outline-none text-white rounded-md"
                  name="password"
                />
              </div>

              <div className="mt-10 flex justify-between items-end">
                <button
                  type="submit"
                  className="bg-pink-950 text-xl text-white py-2 px-10 border-none outline-none cursor-pointer rounded-md form-btn"
                  disabled={isLoading}
                >
                  {isLoading ? <span className="loader"></span> : "Login"}
                </button>

                <Link className="link text-md" to="/signup">
                  Create a new account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
