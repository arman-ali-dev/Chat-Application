const mongoose = require("mongoose");
const User = require("./userModel");

const messageSchema = new mongoose.Schema(
  {
    senderID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    receiverID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Message = mongoose.model("message", messageSchema);

module.exports = Message;
