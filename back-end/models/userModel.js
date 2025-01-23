const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      requred: true,
    },
    password: {
      type: String,
      requred: true,
    },
    profileImage: {
      type: String,
      default:
        "https://static.vecteezy.com/system/resources/previews/009/734/564/non_2x/default-avatar-profile-icon-of-social-media-user-vector.jpg",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const SALT = await bcrypt.genSalt(16);
  const hashedPass = await bcrypt.hash(this.password, SALT);

  this.password = hashedPass;
  next();
});

userSchema.static("matchPassword", async function (email, password) {
  const user = await this.findOne({ email });

  if (!user) return null;

  const result = await bcrypt.compare(password, user.password);

  if (result) return user;
  else return { isInvalidPassword: true };
});

userSchema.methods.generateToken = function () {
  const token = JWT.sign(
    {
      _id: this._id,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "30d",
    }
  );

  return token;
};

const User = mongoose.model("user", userSchema);

module.exports = User;
