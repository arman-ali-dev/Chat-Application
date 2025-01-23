const User = require("../models/userModel");
const cloudinary = require("../configuration/cloudinary");
const getDataURI = require("../utils/datauri");

const handleUserRegisteration = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (!username || !email || !password || !confirmPassword) {
      return res.status(400).json({ msg: "all fields are required" });
    }

    if (password.length < 5) {
      return res
        .status(400)
        .json({ msg: "password must be atleast 5 character!" });
    }

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ msg: "password and confirm password must be same!" });
    }

    const existsUser = await User.findOne({ email });

    if (existsUser) {
      return res.status(400).json({ msg: "user is already exists!" });
    }

    const newUser = await User.create({
      username,
      email,
      password,
    });

    const token = newUser.generateToken();

    return res
      .cookie("token", token, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })
      .status(201)
      .json({
        user: {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          profileImage: newUser.profileImage,
        },
        token,
      });
  } catch (error) {
    return res.status(500).json({ msg: "intrenal server error!" });
  }
};

const handleUserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "all fields are required" });
    }

    const user = await User.matchPassword(email, password);

    if (!user) {
      return res.status(401).json({ msg: "user doesn't exists!" });
    }

    if (user.isInvalidPassword) {
      return res.status(401).json({ msg: "invalid password!" });
    }

    const token = user.generateToken();

    return res
      .cookie("token", token, {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json({
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          profileImage: user.profileImage,
        },
        token,
      });
  } catch (error) {
    return res.status(500).json({ msg: "internal server error!" });
  }
};

const handleLogoutUser = async (_, res) => {
  try {
    return res.clearCookie("token").status(200).json({
      success: true,
      msg: "logout!",
    });
  } catch (error) {
    return res.status(500).json({ msg: "internal server error" });
  }
};

const handleGetAllUser = async (req, res) => {
  try {
    const userID = req._id;

    const allUsers = await User.find({ _id: { $ne: userID } });

    if (allUsers.length === 0) {
      return res.status(204).json({ msg: "no users!" });
    }

    return res.status(200).json({ users: allUsers });
  } catch (error) {
    return res.status(500).json({ msg: "internal server error" });
  }
};

const handleEditProfile = async (req, res) => {
  try {
    const userID = req._id;

    const { username } = req.body;
    const profileImage = req.file;

    let cloudResponse;
    if (profileImage) {
      const fileuri = getDataURI(profileImage);
      cloudResponse = await cloudinary.uploader.upload(fileuri);
    }

    const user = await User.findById(userID).select("-password");

    if (username) user.username = username;
    if (profileImage) user.profileImage = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({ msg: "internal server error!" });
  }
};

module.exports = {
  handleUserRegisteration,
  handleUserLogin,
  handleGetAllUser,
  handleEditProfile,
  handleLogoutUser,
};
